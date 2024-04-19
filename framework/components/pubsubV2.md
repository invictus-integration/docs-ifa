# PubSub V2

PubSub has been rewritten in .Net 6.0 to modernise it and implement the latest Microsoft SDKs. This function is used to send messages to a Service Bus Topic. The Subscribe function can then be used to receive the appropriate messages based on a filter. Finally, messages may then be settled (acknowledged) once processing is complete.

## Publish

The publish request content is sent as a message to the Service Bus topic. Any values in the request context will also be added to the Service Bus message application properties. If the request headers contain the `x-ms-client-tracking-id` or `x-ms-workflow-run-id` keys, their values will also be added to the application properties.

If the request content length exceeds a certain size (default is 200000 bytes), then the claim check pattern will be applied. The service bus message will be sent with an empty body, and the content saved as a blob in Azure Storage instead. Specific properties are set within the message so that the content may be retrieved when subscribing.

## Subscribe

The subscribe function is used to receive messages from the specified Service Bus subscription. If the subscription does not yet exist, it will be automatically created with the specified SQL filter rule. If a message contains the claim check properties then the content is retrieved from Azure Storage.

Once a message has been received, it is then deferred so that the deferred message can be picked up for use within the Acknowledge function.*

## Acknowledge

The acknowledge function is used to pick up a message via its sequence number (returned by the subscribe). The message is then settled via one of the available settle methods:

- Complete
- Abandon
- Defer
- DeadLetter

---


*This was done due to restrictions within the modern Azure Service Bus SDK's which impose that a message can only be settled by the same receiver instance which received the message. Deferring a message allows it to be picked up by any receiver.
