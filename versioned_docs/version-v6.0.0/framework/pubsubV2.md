---
sidebar_label: Publish and subscribe
---

# PubSub V2

:::note[motivation]
Asynchronous messaging helps with decoupling publishers from consumers, as it avoids the blocking during publishing. Especially in Azure Logic Apps workflows, where the publisher and consumer is not always synchronous.

Invictus provides a solution called the PubSub, that allows Azure Service Bus to act as a message broker and interact in a publish/subscribe-approach via HTTP endpoints; plus having Azure Blob Storage act as a claim-check provider for when messages are to big to be published directly.

*🔗 See also the [Publisher-Subscriber integration pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber).*
:::

## Available endpoints
* [`/api/Publish`](#️-publish-single-message): by sending a HTTP request with a custom content, it places a message on an Azure Service Bus topic.
* [`/api/Subscribe`](#️-subscribe-for-messages): by sending a HTTP request with a specified Azure Service Bus topic subscription name, it response available messages.
* [`/api/Acknowledge`](#️-acknowledge-message): by sending a HTTP request with a specified message sequence number, it settles the Azure Service Bus message.

![PubSub pseudo Logic App diagram](/images/framework/pseudo-logic-app-w-pubsub.png)

## ➡️ Publish single message
The `/api/Publish` endpoint allows users to send a single message to the configured Azure Service Bus topic (default: `pubsubv2router`) where subscribers are listening to.

The following request properties must/can be supplied:

[`Body`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusmessage.body?view=azure-dotnet#azure-messaging-servicebus-servicebusmessage-body
[`ApplicationProperties`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusmessage.applicationproperties?view=azure-dotnet#azure-messaging-servicebus-servicebusmessage-applicationproperties
[`MessageId`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusmessage.messageid?view=azure-dotnet#azure-messaging-servicebus-servicebusmessage-messageid

| JSON property    | Required (default)     | Translates to `ServiceBusMessage`           | Description |
| ---------------- | :--------------------: | ------------------------------------------- | ----------- |
| `Content`        | yes                    | [`Body`]                  | Raw binary content for the message. If exceeds certain size (default `20 000 bytes`), then the claim-check pattern will be applied: The message gets send with an empty body, and the content gets saved in Azure Blob Storage. The *Subscribe* action automatically loads the content based on specific application properties from either the message itself or from Blob Storage. |
| `Context`        | yes                    | [`ApplicationProperties`] | User-provided properties, will be appended with the HTTP request headers `x-ms-client-tracking-id` and `x-ms-workflow-run-id` if present |
| `MessageId`      | no (new GUID) | [`MessageId`]             | Optional message ID for duplicate detection purposes. |

<details>
<summary>**Full request example**</summary>

```json
// POST /api/Publish
{
  "Content": "ew0KICAiQ291bnRyeUNvZGUiOiAiQkUiLA0KICAiTW9uZXkiOiAgeyAiQW1vdW50IjogIDUwLCAiQ3VycmVuY3kiOiAgIkdCUCIgIH0NCn0NCg==",
  "MessageId": "b0f11049-7f4d-4bae-90b2-91d93e69367d",
  "Context": {
    "x-applicationName": "InvoiceApp",
    "x-batchId": "975f7ea4-6247-431b-afb6-6d27fb47516f",
    "x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0",
    "x-correlationId": "fc13d345-ebd7-44f2-89a9-4371258c0a08"
  }
}
```
</details>

The endpoint will respond with `202 Accepted`, if the message got published successfully.

## ⬅️ Subscribe for messages
The `/api/Subscribe` endpoint allows users to periodically ask for any available published messages on the configured Azure Service Bus topic (default: `pubsubv2router`).

The following request properties must/can be supplied:

[`SubscriptionName`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.administration.createsubscriptionoptions.subscriptionname?view=azure-dotnet#azure-messaging-servicebus-administration-createsubscriptionoptions-subscriptionname
[`SqlExpression`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.administration.sqlrulefilter.sqlexpression?view=azure-dotnet#azure-messaging-servicebus-administration-sqlrulefilter-sqlexpression
[`Rule`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.administration.ruleproperties.name?view=azure-dotnet#azure-messaging-servicebus-administration-ruleproperties-name
[`BatchSize`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusreceiver.receivemessagesasync?view=azure-dotnet#azure-messaging-servicebus-servicebusreceiver-receivemessagesasync(system-int32-system-nullable((system-timespan))-system-threading-cancellationtoken)
[`MaxWaitTime`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusreceiver.receivemessagesasync?view=azure-dotnet#azure-messaging-servicebus-servicebusreceiver-receivemessagesasync(system-int32-system-nullable((system-timespan))-system-threading-cancellationtoken)
[`ReceiveAndDelete`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusreceivemode?view=azure-dotnet
[`PeekLock`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusreceivemode?view=azure-dotnet

| JSON property    | Required (default) | Translates to Service Bus | Description |
| ---------------- | :----------------: | ------------------------- | ----------- |
| `Subscription`   | yes           | [`SubscriptionName`]      | Name of Azure Service Bus topic subscription, gets created if not exists. (Name is also used as name of the [`Rule`].) |
| `Filter`         | no (subscribe on all messages) | [`SqlExpression`] | Optional SQL expression that acts as a filter rule for which messages to subscribe on. |
| `BatchSize`      | no (10) | [`BatchSize`] | Maximum messages to receive during this single call. |
| `TimeoutMilliseconds` | no (1min) | [`MaxWaitTime`] | Maximum time to wait for a message before responding with an empty set of messages. |
| `ShouldDeleteOnReceive` | no (`false`) | [`ReceiveAndDelete`] | `false` (default) means [`PeekLock`], `true` means receiving messages with [`ReceiveAndDelete`]. <br/><br/> **⚠️ In some rare cases, the use of `ShouldDeleteOnReceive=true` could cause messages to be lost, for example when an error occurs on the client-side and the sequence number is lost or when cancelled/scaled-down happens at the exact moment the message was received (and deleted) from the topic subscription.** |
| `SkipSubscriptionUpsert` | no (`false`) | create/update subscription and rule | `true` means there should already be a topic subscription available, `false` (default) means that a subscription will be created with the provided `Filter`. |

:::tip
One can also use the HTTP request query parameters instead of the request body to `POST` to the `/api/Subscribe` endpoint: `/api/Subscribe?Subscription=orderProcessor`.
:::

<details>
<summary>**Full request example**</summary>

```json
// POST -> /api/Subscribe
{
    "Subscription": "orderProcessor",
    "Filter": "sys.label = 'OrderCreated'",
    "BatchSize": 11,
    "TimeoutMilliseconds": 30000,
    "ShouldDeleteOnReceive": false,
    "SkipSubscriptionUpsert": false
}
```
</details>

<details>
<summary>**Full response example**</summary>

```json
// 200 OK <- /api/Subscribe
[
    {
        "subscription": "orderProcessor",
        "content": "ew0KICAiQ291bnRyeUNvZGUiOiAiQkUiLA0KICAiTW9uZXkiOiAgeyAiQW1vdW50IjogIDUwLCAiQ3VycmVuY3kiOiAgIkdCUCIgIH0NCn0NCg==",
        "context": {
            "x-applicationName": "InvoiceApp",
            "x-batchId": "975f7ea4-6247-431b-afb6-6d27fb47516f",
            "x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0",
            "x-correlationId": "fc13d345-ebd7-44f2-89a9-4371258c0a08",
            "x-ms-client-tracking-id": "test",
            "Diagnostic-Id": "00-0cc7ed09eeaa51b0e835d90890aefb60-b0a02deac9f6fe6d-00"
        },
        "sequenceNumber": 99
    },
    ...
]
```
</details>

:::warning[internal workaround]
Because messages can be 'acknowledged' separately from the location where it is received by 'subscription', the message is internally [deferred](https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-deferral). This is due to restrictions in the Azure SDK which impose that a message can only be settled by the same receiver instance which received the message. Deferring a message allows it to be picked up by any receiver.
:::

## ✔️ Acknowledge message
The `/api/Acknowledge` endpoint allows users to 'settle' a previously received message via the [`/api/Subscribe` endpoint](#️-subscribe-for-messages). The **sequence number** of the message is required to run this operation.

The following request properties must/can be supplied:

[`CreateReceiver`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusclient.createreceiver?view=azure-dotnet#azure-messaging-servicebus-servicebusclient-createreceiver(system-string-system-string)
[Message settlement]: https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-transfers-locks-settlement
[`ReceiveDeferredMessage`]: https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusreceiver.receivedeferredmessageasync?view=azure-dotnet
[`MessageNotFound`]: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-exceptions-latest

| JSON Property  | Required (default)      | Translates to Service Bus |  Description    |
| -------------- | :---------------------: | -------------------- | --------------- |
| `Subscription` | yes                     | [`CreateReceiver`]   | Name of Azure Service Bus topic subscription to receive the deferred message on (See **internal workaround** on [`/api/Subscribe`](#️-subscribe-for-messages)) |
| `SequenceNumber` | yes                   | [`ReceiveDeferredMessage`] | Unique number assigned by Service Bus, received by the [`/api/Subscribe`](#️-subscribe-for-messages) response. |
| `AcknowledgementType` | no (`Complete`) | [Message settlement] | Type of acknowledge action to take on the message: <ul><li>`Complete`</li><li>`Abandon`</li><li>`Defer`</li><li>`DeadLetter`</li></ul> |
| `IgnoreNotFoundException` | no (`false`) | [`MessageNotFound`] | `true` means that `MessageNotFound` Service Bus failures during lookup of the message by its `SequenceNumber` will result in `202 Accepted`; `false` means a `400 BadRequest` will be responded. |  

<details>
<summary>**Full request example**</summary>

```json
// POST /api/Acknowledge
{
    "Subscription": "subscriptionName",
    "AcknowledgementType":"Complete",
    "SequenceNumber": 99,
    "IgnoreNotFoundException": false,
}
```
</details>

## Customization
<details>
<summary>**Available Bicep parameters**</summary>

| Bicep parameter              | Default             | Description |
| ---------------------------- | ------------------- | ----------- |
| `pubSubV2TopicName`          | `pubsubv2router`    | Name of Azure Service Bus topic that acts as message broker for the PubSub V2 component. |.
| `approvedMessageSizeInBytes` | `200000` (`200 KB`) | Threshold when Azure Service Bus messages' contents should be saved to Blob Storage, a.k.a. claim-checked. |
| `blobContainerPrefix`        | `invictus` (final container name: `{blobContainerPrefix}{pubSubV2TopicName}`) | Prefix of the Azure Blob Storage container that gets created when messages are to big to be routed via Service Bus and gets saved in a container instead, a.k.a. claim-checked. |
| `serviceBusMessageTimeToLiveMinutes` | `30 days` | Period the published message should be active on the Azure Service Bus topic (translates to [`TimeToLive`](https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.servicebusmessage.timetolive?view=azure-dotnet)).
| `pubSubSubscriptionLockTimeoutInMinutes` | `1 min` | Duration of the peek lock receive, see [`LockDuration`](https://learn.microsoft.com/en-us/dotnet/api/azure.messaging.servicebus.administration.createsubscriptionoptions.lockduration?view=azure-dotnet). |
</details>

## Migrating PubSub v1 to v2
Migrating to v2 includes changes in the authentication, endpoint and removal the metadata links.

> 👉 *The `/api/Subscribe` endpoint also needs to use a `POST` instead of a `GET` HTTP method.*

<details>
<summary>**Publish message example**</summary>

```diff
{
    "PublishMessage": {
        "type": "Http",
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
            "method": "post",
-           "uri": "[parameters('invictus').framework.pubSub.v1.publishUrl]",
+           "uri": "[parameters('invictus').framework.pubSub.v2.publishUrl]",
            "body": {
                "Content": "@{decodeBase64(body('Extract_Message_Context')['Content'])}",
                "Context": "@body('Extract_Message_Context')?['Context']"
            },
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "runAfter": {
            "Extract_Message_Context": [
                "Succeeded"
            ]
        }
    }
}
```
</details>

<details>
<summary>**Subscribe message example**</summary>

```diff
{
    "SubscribeMessage": {
        "type": "Http"
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
-           "method": "get",
+           "method": "post",
            "queries": {
                "deleteOnReceive": false,
                "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
                "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
            },
-           "uri": "[parameters('invictus').framework.pubSub.v1.subscribeUrl]",
+           "uri": "[parameters('invictus').framework.pubSub.v2.subscribeUrl]", 
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "recurrence": {
            "frequency": "Second",
            "interval": 1
        },
        "splitOn": "@triggerBody()",
        "splitOnConfiguration": {
            "correlation": {
                "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
            }
        }
    }
}
```
</details>

<details>
<summary>**Acknowledge message example**</summary>

```diff
{
    "AcknowledgeMessage": {
        "type": "Http",
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
            "body": {
                "AcknowledgementType": "Complete",
                "IgnoreNotFoundException": true,
                "Subscription": "@triggerBody()?['subscription']",
-               "LockToken": "@triggerBody()?['LockToken']",
-               "MessageReadTime": "@trigger()['startTime']"
            },
            "method": "post",
-           "uri": "[parameters('invictus').framework.pubSub.v1.acknowledgeUrl]",
+           "uri": "[parameters('invictus').framework.pubSub.v2.acknowledgeUrl]",
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "runAfter": {}
    }
}
```
</details>
