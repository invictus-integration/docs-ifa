# PubSub V2

PubSub has been rewritten in .Net 6.0 to modernise it and implement the latest Microsoft SDKs. This function is used to send messages to a Service Bus Topic. The Subscribe function can then be used to receive the appropriate messages based on a filter. Finally, messages may then be settled (acknowledged) once processing is complete.

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
    "SequenceNumber": 99
}
```

---


*This was done due to restrictions within the modern Azure Service Bus SDK's which impose that a message can only be settled by the same receiver instance which received the message. Deferring a message allows it to be picked up by any receiver.

## General Info

- Default topic name: `pubsubv2router`.
- Default claim-checked messages blob container name: `invictuspubsubv2router`.
- Subscription filter rules are assigned the same name as the subscription.
- Default message time to live: 30 days
- Default subscription lock timeout: 1 minute
