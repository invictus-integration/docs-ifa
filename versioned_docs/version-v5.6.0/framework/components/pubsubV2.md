# PubSub V2

PubSub has been redeveloped to modernise it and implement the latest Microsoft SDKs. This function is used to send messages to a Service Bus Topic. The Subscribe function can then be used to receive the appropriate messages based on a filter. Finally, messages may then be settled (acknowledged) once processing is complete.

## Publish

The publish request content is sent as a message to the Service Bus topic. Any values in the request context will also be added to the Service Bus message application properties. If the request headers contain the `x-ms-client-tracking-id` or `x-ms-workflow-run-id` keys, their values will also be added to the application properties. A MessageID may also be passed for duplicate detection purposes, or left empty to generate a new one.

If the request content length exceeds a certain size (default is 200000 bytes), then the claim check pattern will be applied. The service bus message will be sent with an empty body, and the content saved as a blob in Azure Storage instead. Specific properties are set within the message so that the content may be retrieved when subscribing.

### Request Body Example

```
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

## Subscribe

The subscribe function is used to receive messages from the specified Service Bus subscription. If the subscription does not yet exist, it will be automatically created with the specified SQL filter rule. If a message contains the claim check properties then the content is retrieved from Azure Storage.

Once a message has been received, it is then deferred so that the deferred message can be picked up for use within the Acknowledge function.*

### Query Params

- Subscription: The name of the subscription to receive messages from (Required).
- Filter: The SQL filter rule to be created in the subscription. Default = No filter
- TimeoutMilliseconds: The maximum amount of time the receiver should wait before it receives any messages. Default = 60000
- BatchSize: The maximum amount of messages to receive at once. Default = 10
- ShouldDeleteOnReceive: If true, messages will be deleted upon retrieval. Default = false
- SkipSubscriptionUpsert: If true, the function will not run the subscription and filter rule upsert logic.

### Subscribe Response Example

```
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

- Complete
- Abandon
- Defer
- DeadLetter

### Request Body Example

```
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

## General Info

- Default topic name: `pubsubv2router`.
- Default claim-checked messages blob container name: `invictuspubsubv2router`.
- Subscription filter rules are assigned the same name as the subscription.
- Default message time to live: 30 days
- Default subscription lock timeout: 1 minute

## Migrating PubSub v1 to v2

We need to change the authentication, endpoint and remove the metadata links.

Also we need to use a POST on the subscribe endpoint instead of a GET.

### Publish

v1 example:
``` json
"Publish_Message": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v1.publishUrl]",
        "body": {
            "Content": "@{decodeBase64(body('Extract_Message_Context')['Content'])}",
            "Context": "@body('Extract_Message_Context')?['Context']"
        },
        "authentication": {
            "type": "Basic",
            "username": "Invictus",
            "password": "@parameters('invictusPassword')"
        }
    },
    "runAfter": {
        "Extract_Message_Context": [
            "Succeeded"
        ]
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    }
}
```

v2 example:
``` json
"Publish_Message": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v2.publishUrl]",
        "body": {
            "Content": "@{base64ToString(body('Extract_Message_Context')['Content'])}",
            "Context": "@body('Extract_Message_Context')?['Context']"
        },
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        }
    },
    "runAfter": {
        "Extract_Message_Context": [
            "Succeeded"
        ]
    }
}
```

### Subscribe

v1 example:
``` json
"SubscribeMessage": {
    "inputs": {
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "basic",
            "username": "Invictus"
        },
        "method": "get",
        "queries": {
            "deleteOnReceive": false,
            "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
            "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
        },
        "uri": "[parameters('invictus').framework.pubSub.v1.subscribeUrl]"
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    },
    "recurrence": {
        "frequency": "Second",
        "interval": 1
    },
    "splitOn": "@triggerBody()",
    "splitOnConfiguration": {
        "correlation": {
            "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
        }
    },
    "type": "Http"
}
```

v2 example:
``` json
"SubscribeMessage": {
    "inputs": {
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        },
        "method": "post",
        "queries": {
            "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
            "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
        },
        "uri": "[parameters('invictus').framework.pubSub.v2.subscribeUrl]"
    },
    "recurrence": {
        "frequency": "Second",
        "interval": 1
    },
    "splitOn": "@triggerBody()",
    "splitOnConfiguration": {
        "correlation": {
            "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
        }
    },
    "type": "Http"
}
```

### Acknowledge

v1 example:
``` json
"AcknowledgeMessage": {
    "inputs": {
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "Basic",
            "username": "Invictus"
        },
        "body": {
            "AcknowledgementType": "Complete",
            "IgnoreLockLostException": true,
            "LockToken": "@triggerBody()?['LockToken']",
            "MessageReadTime": "@trigger()['startTime']",
            "Subscription": "@triggerBody()?['Subscription']"
        },
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v1.acknowledgeUrl]"
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    },
    "runAfter": {},
    "type": "Http"
}
```

v2 example:
``` json
"AcknowledgeMessage": {
    "inputs": {
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        },
        "body": {
            "AcknowledgementType": "Complete",
            "Subscription": "@triggerBody()?['subscription']",
            "SequenceNumber": "@triggerBody()?['sequenceNumber']",
            "IgnoreNotFoundException": true
        },
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v2.acknowledgeUrl]"
    },
    "runAfter": {},
    "type": "Http"
}
```