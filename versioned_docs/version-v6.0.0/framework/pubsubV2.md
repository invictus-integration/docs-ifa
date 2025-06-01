---
sidebar_label: Publish and subscribe
---

# PubSub V2

## Motivation
Asynchronous messaging helps with decoupling publishers from consumers, as it avoids the blocking during publishing. Especially in LogicApps workflows, where the publisher and consumer is not always synchronous.

Invictus provides a solution called the PubSub, that allows Azure Service Bus to act as a message broker and interact in a publish/subscribe-approach via HTTP endpoints.

## Usage
The PubSub is available as a HTTP endpoint in your LogicApp workflow.

- Default topic name: `pubsubv2router`.
- Default claim-checked messages blob container name: `invictuspubsubv2router`.
- Subscription filter rules are assigned the same name as the subscription.
- Default message time to live: `30 days`
- Default subscription lock timeout: `1 minute`

## Publish single message
The publish request content is sent as a message to the Service Bus topic. Any values in the request context will also be added to the Service Bus message application properties. If the request headers contain the `x-ms-client-tracking-id` or `x-ms-workflow-run-id` keys, their values will also be added to the application properties. A MessageID may also be passed for duplicate detection purposes, or left empty to generate a new one.

If the request content length exceeds a certain size (default is `20 0000 bytes`), then the claim check pattern will be applied. The Service Bus message will be sent with an empty body, and the content saved as a blob in Azure Storage instead. Specific properties are set within the message so that the content may be retrieved when subscribing.

### Request Body Example

```json
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

## Subscribe on multiple messages
The subscribe function is used to receive messages from the specified Service Bus subscription. If the subscription does not yet exist, it will be automatically created with the specified SQL filter rule. If a message contains the claim check properties then the content is retrieved from Azure Storage.

Once a message has been received, it is then deferred so that the deferred message can be picked up for use within the Acknowledge function.*

### Query Params

- `Subscription`: The name of the subscription to receive messages from (Required).
- `Filter`: The SQL filter rule to be created in the subscription. Default = No filter
- `TimeoutMilliseconds`: The maximum amount of time the receiver should wait before it receives any messages. Default = 60000
- `BatchSize`: The maximum amount of messages to receive at once. Default = 10
- `ShouldDeleteOnReceive`: If true, messages will be deleted upon retrieval. Default = false
- `SkipSubscriptionUpsert`: If true, the function will not run the subscription and filter rule upsert logic.

### Subscribe Response Example

```json
[
    {
        "subscription": "AllMessages",
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


## Acknowledge

The acknowledge function is used to pick up a message via its sequence number (returned by the subscribe). The message is then settled via one of the available settle methods:

- **Complete**
- **Abandon**
- **Defer**
- **DeadLetter**

### Request Body Example

```json
{
    "Subscription": "subscriptionName",
    "AcknowledgementType":"Complete",
    "SequenceNumber": 99,
    "IgnoreNotFoundException": false,
}
```
The acknowledge function will fail if the deferred message could not be found. If this is normal and expected for your scenario, the error can be ignored by setting the `IgnoreNotFoundException` property to `true`.

---

*This was done due to restrictions within the modern Azure Service Bus SDK's which impose that a message can only be settled by the same receiver instance which received the message. Deferring a message allows it to be picked up by any receiver.

## Migrating PubSub v1 to v2
Migrating to v2 includes changes in the authentication, endpoint and removal the metadata links.

The `Subscribe` endpoint also needs to use a POST instead of a GET HTTP method.

## PubSub v1-v2 migration samples

**Publish message**
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

**Subscribe message**
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

**Acknowledge message**
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