---
sidebar_label: Architecture
sidebar_position: 2
hide_table_of_contents: true
---

# Invictus for Azure architecture
An Invictus installation consists of two major parts: the **Dashboard** and the **Framework**.

## Dashboard
The Invictus **Dashboard** provides a business user friendly UI for interacting with client integrations (commonly Azure Logic Apps), without requiring direct access to Azure. The Dashboard displays integrations as 'flows', supported by diagnostic data (here called 'flow traces') loaded via Invictus' backend infrastructure.
:::note[used terms]
* *Flow:* in Invictus, a 'flow' represents a definition of a logical 'message chain'. Business users create these flows via the **Dashboard**. Invictus' backend infrastructure imports diagnostic traces of their integrations and maps them to these flows.  
* *Flow trace:* in Invictus, a 'flow trace' represents a set of diagnostic traces that Invictus' backend infrastructure maps to a user-defined 'flow'. These can come from Azure Logic Apps diagnostic traces, or other places, like Azure Data Factory pipeline triggers. We even provide a **HTTP import job** to POST custom flow traces.
:::

<br/>
![Architecture diagram](/images/InvictusV2Diagram_Dashboard.png "Invictus Dashboard architecture diagram")
<br/>

* <u class="flow-text">**Flows**</u>
  * <u>**Dashboard App:**</u> the business user interacts with the **Dashboard** via a deployed web application. Here, users manage their 'flows'.
  * <u>**Dashboard Gateway:**</u> serves as the backend API for the **Dashboard App**. It shows the stored 'flows' (*Cosmos DB for MongoDB*) and triggers 'flow' operations (*Azure Service Bus*).  
  * <u>**Flow Handler:**</u> based on the required 'flow' action triggered by the business user (*Ignore*, *Resubmit*, *Resume*) in the **Dashboard App**, it interacts with the deployed Azure Logic Apps on the client environment (See [import flow traces via Logic App workflows](./dashboard/flows/04_import-flow-traces/import-flows-via-la.mdx) for more info).
* <u class="flow-trace-text">**Flow traces**</u>
  * <u>**[type] import job:**</u> the Invictus installation provides 'import jobs' which are interaction endpoints to push 'flow traces' into the **Dashboard**. These come from external client resources (Azure Logic Apps, Azure Data Factory, Azure Event Hubs...). Once received, they push a canonical message into the system (*Azure Service Bus*).
  * <u>**Cache job:**</u> listens for new canonical messages (*Azure Service Bus*) and caches them as batches (*Azure Blob Storage*).
  * <u>**Merge job:**</u> listens for new/updated batches (*Azure Event Hubs*) and synchronizes the storage (*Cosmos DB for MongoDB*) with 'message content view' information (input/output of Azure Logic Apps, see [import flow traces via Azure Logic App workflows](./dashboard/flows/04_import-flow-traces/import-flows-via-la.mdx) for more info).
  * <u>**Store job:**</u> listens for new batches (*Azure Event Hubs*), loads referenced canonical message (*Azure Blob Storage*), and combines as 'flow trace' models (*Cosmos DB for MongoDB*). These 'flow traces' gets available via the **Dashboard App** to the business user.

## Framework
<br/>
![Architecture diagram](/images/InvictusV2Diagram_Framework.png "Invictus Framework architecture diagram")
<br/>

Common integration patterns are not always built into tasks within the Azure Logic App workflow editor. The Invictus **Framework** provides these patterns as HTTP endpoints that client workflows can interact with.

* [**Publish and subscribe:**](./framework/pubsubV2.md) uses Azure Service Bus as a message broker to publish/subscribe on messages across Azure Logic Apps. 
* [**Time-controlled sequences:**](./framework/timesequencer.md) control the order in which Azure Logic App workflows can run based on a custom timestamp.
* [**Index-controlled sequences:**](./framework/sequencecontroller.md) control the order in which Azure Logic App workflow can run based on a custom sequence order.
* [**Convert between XML/JSON:**](./framework/xmljsonconverter.mdx) convert XML-JSON based on a custom XSLT transformation.
* [**Validate XML with XSD schema:**](./framework/xsd-validator.md) validate XML based on a custom XSD schema.
* [**Regular expression replacements:**](./framework/regextranslation.md) translate user content based on custom regular expression patterns.
* [**Transco promotion:**](./framework/transcoV2.mdx) promote properties in an user content based on database records.