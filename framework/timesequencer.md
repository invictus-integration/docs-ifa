# *Timesequencer*

## Introduction



### Functions

The Timesequencer Azure Function exposes four functions:

The below two are used by the developers when setting up their flows:

* WaitForExecution
* CompleteExecution

The below two are used internally the Azure Function and should be ignore:

* PerformCallbackAction
* PerformCallbackOrchestrator


### WaitForExecution

WaitForExecution is used by the Webhook action in a LogicApp. This function will determine if processing should continue, stop or wait. This is determined by checking if a current request with the SameSequence name is already being processed.

Request Object:

```
{
  "callbackUri": "@{listCallbackUrl()}", //This is a property exposed by the Webhook action which should be supplied to the Timesequencer
  "instanceId": "[STRING]", //The ID assosited to the request. SequenceName and InstanceId form the PrimaryKey for the request
  "sequenceName": "[STRING]", //The ID used to group requests togheter, //SequenceName and InstanceId form the PrimaryKey for the request
  "timestamp": "[DATETIME]" //The time the request was generated ex: file last update time
}
```

### CompleteExecution

CompleteExecution is used to complete a process and to trigger any pending webhook callbacks.

```
{
 "instanceId": "[STRING]", //The ID assosited to the request. SequenceName and InstanceId form the PrimaryKey for the request
  "sequenceName": "[STRING]"The ID used to group requests togheter, //SequenceName and InstanceId form the PrimaryKey for the request
}
```

### Logic App Timesequencer Sample Diagram


> ![ifa-timesequencer-la](../images/ifa-timesequencer-la.PNG)

As can be seen in the image above, the Webhook executes WaitForExecution to register the request and also check if it should proceed with the execution, wait for the callback to be called or if the process should terminate. If a Stop command is returned then the Terminate case will be executed. If the result is Start then the LA will proceed to executing CompleteExecution which will mark the request as Processed and also trigger any callbacks related to the current SequenceName.

