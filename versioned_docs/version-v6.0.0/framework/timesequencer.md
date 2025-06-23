---
sidebar_label: Time-controlled sequence
---

# Time Sequencer

:::note[motivation]
At the time of writing, there is no built-in way in Azure Logic Apps to 'control' the sequence in which multiple workflow runs are executing. In certain scenarios, even though a  workflow was triggered before another, you want the first one to wait for the second. A common example is entity updates, where you don't want older updates to override newer ones - even though the workflow with the older updates 'happened after' the newer ones.

**Time Sequencer** is a Framework component that allows you by interacting with HTTP endpoints to set up sequences, controlled by custom timestamps, to ensure that workflows are run in a time-controlled fashion. Sequence information is stored in an Azure Blob Storage container, called `invictustimesequencer`.
:::

## Available endpoints
* [`/api/WaitForExecution`](#wait-for-execution): by sending a request, it allows the currently running Azure Logic App workflow to possibly 'halt' its execution until it is their time to run actions.
* `/api/CompleteExecution`: by sending a request, it flags the currently running Azure Logic App workflow as 'completed', so that the next workflow run can continue to run.

![Pseudo Azure Logic App setup with Time Sequencer component](/images/framework/pseudo-logic-app-w-time-sequencer.png)

## Wait for execution
By using an Azure Logic Apps [HTTP webhook](https://learn.microsoft.com/en-us/azure/connectors/connectors-native-webhook?tabs=standard#add-an-http-webhook-trigger), the **Time Sequencer** component can queue a workflow run signal the run when it can continue. Determining the order of workflow runs can be achieved by passing a custom `Timestamp` with the request body.

The following request parameters need to be supplied in the request body:

| JSON property  | Required | Description                                                                                                                              |
| -------------- | :------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `SequenceName` | yes      | Transactional name of 'sequence' to group all Azure Logic App workflow runs that need to be run in sequence (same across workflow runs). | 
| `InstanceId`   | yes      | Unique operational ID within the 'sequence' of a single Azure Logic App workflow run (unique for each workflow run).                     |
| `Timestamp`    | yes      | Date time to control the order of the Azure Logic App workflows in the 'sequence'.                                                       |
| `CallbackUri`  | yes      | Should be supplied by the HTTP WebHook Azure Logic App action: `@{listCallbackUrl()}`.                                                   |

## Complete execution
When the [*Wait for exec.* operation](#wait-for-execution) responds with `Start`, then any custom user actions in the Azure Logic App workflow can be executed. Once those are done, the workflow should signal the **Time Sequencer** component, so that any waiting workflows can continue their execution.

Signaling completion happens with a HTTP POST request to the `/api/CompleteExecution` endpoint, using following required request parameters in the request body:

| JSON property  | Required | Description                                                                                                                              |
| -------------- | :------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `SequenceName` | yes      | Transactional name of 'sequence' to group all Azure Logic App workflow runs that need to be run in sequence (same across workflow runs). | 
| `InstanceId`   | yes      | Unique operational ID within the 'sequence' of a single Azure Logic App workflow run (unique for each workflow run).                     |

## Customization

:::info[sequence cleanup]
The **Time Sequencer** component stores the Azure Logic App workflow 'sequences' in an Azure Blob Storage container, called `invictustimesequencer`. The following policy rules are currently hardcoded on the Azure Storage Account in regards of cleaning these sequences:
* **Move to cool storage**: greater than `10 days` after modification.
* **Delete the blob**: greater than `60 days` after modification.
* **Delete blob snapshot**: greater than `90 days` after creation.

🔗 [More info on Azure Storage Account policies](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-configure?tabs=azure-portal)
:::

<details>
<summary>**Related Bicep parameters**</summary>

The following Bicep parameters control the inner workings of the **Time Sequencer** component. See the [deployment of the Invictus Framework](./installation/framework-releasepipeline.mdx) to learn more.

| Bicep parameter | Default | Description |
| --------------- | ------- | ----------- |
| `storageAccountName` | `invictus{resourcePrefix}store` | The name of the Azure Storage Account (used by other Framework components as well) where the `invictustimesequencer` Azure Blob Storage container will be located where Azure Logic App workflow sequences are stored. |
| `timeSequencerScaling` | `{ cpuResources: '0.5', memoryResources: '1.0Gi', scaleMaxReplicas: 1, scaleMinReplicas: 0, concurrentRequests: 10 }` | The Container App options to control scaling. See [scaling rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=container-apps-bicep#custom). |
| `timesequencerFunctionName` | `inv-${resourcePrefix}-timesequencer` | The name of the Azure Container App to be created for the **Time Sequencer** component. |

</details>