# Sequence Controller

## Overview

The Sequence controller wil lbe mainly used to process LogicApp runs in order. The Sequence Controller exposes 3 actions

- GetSequenceNumber
- WaitForExecution
- CompleteExecution

### GetSequenceNumber

This call is not required but we do request that it is used if possible. This call will basically check with the Database what sequence number is next in line. So assuming the process is going upwards starting from 1, if the sequence has reached number 6, then as expected the number 7 will be returned as the next sequence number. This call eliminates the need for the user to track the sequence.

|Name|Required|Sample Value|Description|
| --- | :---: | --- | --- |
|sequenceName|Yes|SampleSequence1|This is the name given to a sequence, this has to be unique per sequence when processing a chain of requests|
|sequenceStart|Yes|1|This is the starting value of the sequence, this in reality is only required on the very first call to GetSequenceNumber but has no effect and should still be passed on subsequent calls|

