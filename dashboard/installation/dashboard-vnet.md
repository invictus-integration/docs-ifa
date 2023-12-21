# Invictus Dashboard VNET Support

Invictus includes functionality which allows all its resources to run within an Azure Virtual Network (VNET). This document will guide you through this process.

## Prerequisites

- An Azure Virtual Network
  - Including one or more subnets with the following services enabled
    - Microsoft.AzureCosmosDB
    - Microsoft.EventHub
    - Microsoft.KeyVault
    - Microsoft.ServiceBus
    - Microsoft.Storage
    - Microsoft.Web
- 10 Private DNS Zones
  - privatelink.azurecr.io
  - privatelink.azurewebsites.net
  - privatelink.blob.core.windows.net
  - privatelink.file.core.windows.net
  - privatelink.mongo.cosmos.azure.com
  - privatelink.queue.core.windows.net
  - privatelink.servicebus.windows.net
  - privatelink.table.core.windows.net
  - privatelink.table.cosmos.azure.com
  - privatelink.vaultcore.azure.net
    
  An ARM template for these DNS Zones can be found [here](scripts/invictusVnetDNSZones.json)

- To be able to deploy the app code from an Azure DevOps pipeline you will need:
  - A self hosted agent running on the same VNET with the following software intalled:
    - Powershell
    - Azure Powershell
    - Bicep CLI
   
