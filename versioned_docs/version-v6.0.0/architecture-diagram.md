---
sidebar_label: Architecture
sidebar_position: 2
---

# Invictus for Azure architecture
The following sections describe the general overview of what's 'under the hood' of an Invictus installation. Invictus by itself can be split up into two major parts: the **Dashboard** and the **Framework**.

:::note[used terms]
* *Flow:* Invictus uses 'flow' throughout to identify a logical 'message chain'. Flows are created by business users in the **Dashboard** so that all diagnostic traces can be aggregated and linked to the same incoming message. 
* *Flow trace:* Invictus uses 'flow trace' throughout to identify a diagnostic trace that can be linked to a user-defined 'flow'. These can come directly from Azure Logic Apps diagnostic traces, or other places, like Azure Data Factory pipeline triggers. We even provide a **HTTP import job** to POST custom flow traces.
:::

<br/>
![Architecture diagram](/images/InvictusV2Diagram_Dashboard.png "Invictus Dashboard architecture diagram")
<br/>

The Invictus **Dashboard** provides a business user-friendly UI to interact with client set up integrations (usually Azure Logic Apps), instead of directly manipulating those integrations via Azure. It does this by showing integrations as 'flows', backed with diagnostic information (here called 'flow traces') loaded via an internal job-chain. The following containerized components are deployed upon installing the Dashboard, based on their purpose:

* <u class="flow-text">**Flows**</u>
  * <u>**Dashboard App:**</u> the business user interacts with the **Dashboard** via a deployed web application which is used to monitor all 'flows'.
  * <u>**Dashboard Gateway:**</u> serves as the backend API for the **Dashboard App**. It shows the stored 'flows' (*Cosmos DB for MongoDB*) and triggers 'flow' operations (*Service Bus*).  
  * <u>**Flow Handler:**</u> based on the required 'flow' action triggered by the business user (*Ignore*, *Resubmit*, *Resume*) in the **Dashboard App**, it interacts with the deployed Azure Logic Apps on the client environment (See [import flow traces via Logic App workflows](./dashboard/flows/04_import-flow-traces/import-flows-via-la.md) for more info).
* <u class="flow-trace-text">**Flow traces**</u>
  * <u>**[type] import job:**</u> the Invictus installation provides several 'import jobs' which are interaction endpoints to push 'flow traces' into the **Dashboard**. These can come from various sources (Logic Apps, Data Factory, Event Hubs...). Once received, they push a canonical message into the system (*Service Bus*).
  * <u>**Cache job:**</u> listens for new canonical messages (*Service Bus*) and caches them as batches (*Blob Storage*).
  * <u>**Merge job:**</u> listens for new batches (*Event Hubs*) and already upserts the system (*Cosmos DB for MongoDB*) with 'message content view' information (input/output of Azure Logic Apps, see [import flow traces via Logic App workflows](./dashboard/flows/04_import-flow-traces/import-flows-via-la.md) for more info).
  * <u>**Store job:**</u> listens for new batches (*Event Hubs*), loads referenced canonical message (*Blob Storage*), and combines that information to store 'flow trace' models (*Cosmos DB for MongoDB*) which gets available via the **Dashboard App** to the business user.

<br/>
![Architecture diagram](/images/InvictusV2Diagram_Framework.png "Invictus Framework architecture diagram")
<br/>

Within the client integrations (here always Azure Logic Apps), several common integration patterns are not built into Azure Logic App workflows by default. The Invictus **Framework** provides several of these patterns as HTTP available endpoints that can be interacted with within your workflows.

* [**PubSub v2:**](./framework/pubsubV2.md) uses Azure Service Bus as a message broker to publish/subscribe on messages across Azure Logic Apps. 
* [**TimeSequencer:**](./framework/timesequencer.md) control the order in which Azure Logic App workflows can run based on a custom timestamp.
* [**Sequence Controller:**](./framework/sequencecontroller.md) control the order in which Azure Logic App workflow can run based on a custom sequence order.
* [**XML/JSON Convertor:**](./framework/xmljsonconverter.md) convert XML-JSON based on a custom XSLT transformation.
* [**XSD Validator:**](./framework/xsd-validator.md) validate XML based on a custom XSD schema.
* [**Regex Translator**](./framework/regextranslation.md) translate user content based on custom regular expression patterns.
* [**Transco v2:**](./framework/transcoV2.mdx) promote properties in an user content based on database records.