# Sequence Controller

## Motivation

Some dependent external systems can't handle parallel message processing or requires a certain order of messages. Sending messages serially (for example, by setting the concurrency on a Logic App to `1`) can be a solution, at the cost of a big performance impact.

> 🌍 **A customer story from the trenches**
> 
> *A downstream application cannot handle multiple calls at the same time for the same order ID, by using the **Sequence Controller** we are able to make sure that a single call per order ID is done (by using the order ID in the `sequenceName`) and we do not have the use the concurrency option for the Logic App which would dramatically slow down the processing for all messages.*

The Invictus Framework provides a **Sequence Controller** component that allows you to process Logic App workflow runs in a specified order. This way, even though workflows might be triggered in parallel, the dependent external system is not overblown with messages.

> 🔗 See also the [Message Sequence](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageSequence.html) integration pattern.

## Usage

The **Sequence Controller** component is available as a HTTP endpoint in your Logic App workflow. To include sequence processing to your workflow, these three HTTP interaction tasks should normally be added:

* [Get sequence number](#_1-get-sequence-number): allows the workflow to determine what current position it has in the sequence;
* [Wait for sequence](#_2-wait-for-sequence): allows the workflow to wait its turn, doing the actual work in a **Control** task;
* [Complete sequence](#_3-complete-sequence): allows the workflow to signal that the next workflow in the sequence is up.

> ⚡ There also exists a [Reset sequence](#_4-reset-sequence) action that allows admins to externally remove references to old sequences or possibly reuse sequence names.

The idea is that workflows are processed in sequence after the **Wait**. The place between the **Wait** and **Complete** task allows you to place your own logic that needs to run in order. If workflow 1 gets triggered before workflow 2, the second workflow will wait for the first workflow.

![Pseudo Logic App workflow with Sequence Controller](/images/framework/pseudo-logic-app-w-sequence-controller.png)

### 1. Get sequence number

First step for the Logic App workflow to run in sequence, is to take a number in the line. Doing this requires you to send a HTTP POST request to the `/api/GetSequenceNumber` endpoint of the deployed **Sequence Controller**.

> 💡 This step can be circumvented in some advanced scenarios where you keep track of the order numbers and pass it yourself during the [Wait for sequence](#_2-wait-for-sequence).

The most simple request body only contains the name of the sequence. This name can be seen as the transactional group that chain all related workflows. Assuming this is the first workflow, it will receive number 1 in the response body; the second workflow will receive number 2, and so forth.

```json
// POST /api/GetSequenceNumber
{
  "sequenceName": "<my-sequence-name>",
}
```

The response body containing this counter is required for the next step: [Wait for sequence](#_2-wait-for-sequence)

#### Customization

If you want to start the sequence at a later point, you can also pass the `sequenceStart` with your own start number. Only make sure that you pass this along subsequent calls.
```json
// POST /api/GetSequenceNumber
{
  "sequenceName": "<my-sequence-name>",
  "sequenceStart": 10
}
```

#### Logic App workflow example

The following image shows a screenshot of how this HTTP call can be made in a Logic App workflow.

> ![sequencecontroller-get-number-execution](/images/seqcont-getseqnum.jpg)

### 2. Wait for sequence

The next step for the Logic App workflow to run in sequence, is to wait its turn. To facilitate this, the counter collected from the previous [Get sequence number](#_1-get-sequence-number) step is required.

To make the workflow wait, a HTTP-callback task is required in the workflow. This allows you to pass in a webhook that the deployed **Sequence Controller** can call when its the workflow's turn to proceed.

The following request needs to be send in this HTTP callback task:

```json
// POST /api/WaitForExecution
{
  "sequenceName": "<my-sequence-name>",
  "counter": @sequenceCounter, // Collected via /api/GetSequenceNumber.
  "callbackUri": @listCallbackUrl() // Available through the HTTP-callback task.
}
```

#### Logic App workflow example

The following image shows a screenshot of how this HTTP-callback task can be made in the Logic App workflow.

> ![sequencecontroller-wait-execution](/images/seqcont-waitforexec.jpg)

### 3. Complete sequence

The final step for the Logic App workflow to run in sequence, is to signal the completion of the item in the sequence. This will allow the next workflow to proceed. To facilitate this, the counter collected from the previous [Get sequence number](#_1-get-sequence-number) step is required.

To complete the in-sequence work of the workflow, a HTTP task is required that sends this request.

```json
// POST /api/ConfirmExecutionCompleted
{
  "sequenceName": "<my-sequence-name>",
  "currentCounter": @sequenceCounter, // Collected via /api/GetSequenceNumber
}
```

#### Logic App workflow example

The following image shows a screenshot of how this HTTP call can be made in a Logic App workflow.

> ![sequencecontroller-complete-execution](/images/seqcont-compexec.jpg)

### (4.) Reset sequence

The deployed **Sequence Controller** allows admins to reset previously stored sequences. This could be useful if certain sequence names should be reused for other purposes, or for cleaning references.

> ⚠️ This action **SHOULD NOT** be part of any Logic App workflow as resetting sequences in the middle of processing will result in indefinitely 'hanging' workflow runs.

Resetting can be done with sending the following request:

```json
// POST /api/ResetSequence
{
  "sequenceName": "<my-sequence-name>"
}
```