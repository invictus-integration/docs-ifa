---
sidebar_label: Architecture
sidebar_position: 2
---

# Invictus for Azure Architecture Diagrams

## Invictus Dashboard Architecture

<img src="/images/InvictusV2Diagram_Dashboard.jpg" alt="Invictus Dashboard architecture diagram" class="img-zoom" />

### Dashboard Components

- **Frontend:** Consists of the web application which is used to monitor all flows in the system.
- **Dashboard Gateway:** Serves as the backend for the web application, handles all interactions with the database and other dependencies.
- **Flow Handler:** Handles interactions with the Azure management api for the flow actions (Ignore, Resubmit, Resume), flow alerts and message content view features.
- **Import Functions:** Consist of ImportJob, CacheImportJob and StoreImportJob. The ImportJob functions are used to listen on EventHub for all LogicApp executions, all data is then merged and finally pushed to the Database.
- **CosmosDB:** Stores all the data necessary for the frontend to function such as users, folders, settings. Flow data and workflowevents are also saved to the CosmosDB by the *DatabaseManager* function.
- **Event Hub:** Logic App diagnostic messages are sent to event hub where they are picked up and processed by the Invictus import functions.

## Invictus Framework Architecture

![Architecture diagram](/images/InvictusV2Diagram_Framework.jpg "Invictus framework architecture diagram")

### Framework Components

Various useful APIs and Functions which can be used within your Logic App integration processes. For more information see the [Invictus framework documentation](./framework/index.md).

- **PubSub API**
- **Transco API**
- **Matrix API**
- **TimeSequencer Function**
- **Sequence Controller Function**
- **XML/JSON Convertor Function**
- **XSD Validator Function**
- **Regex Translator Function**
- **TranscoV2 Function**

## Shared Components

### Azure Service Bus

- Used by PubSub API to push messages to subscriptions.
- Used by ImportJob function to push data to CacheImportJob function after splitting data by ClientTrackingId.
- Used by the dashboard to queue requests for Ignore/Resume/Resubmit which are then picked up by the Flow Handler.

### Azure Storage

- Used by PubSub API to create Blobs for ClaimCheck pattern
- Used by CacheImportJob to save all events received from EventHub as a temporary cache
- Used by Transco API and Transco V2 function to store configs, XSLT files and assembly files.
- Used by XML/JSON Convertor function to store configs.
- Used by XSD Validator function to store configs.
 
### Azure Application Insights

- All APIs, WebApps, and Functions point to a Application Insights resource which contains all traces and logs that were created.
 
### Azure Key Vault

- Used to store secrets such as function keys, API keys, connection strings, etc.
