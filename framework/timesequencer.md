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

### CompleteExecution

CompleteExecution is used to complete a process and to trigger any pending requests.


