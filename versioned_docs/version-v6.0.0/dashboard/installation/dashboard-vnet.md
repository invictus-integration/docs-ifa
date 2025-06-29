---
sidebar_class_name: hidden
---

# Invictus Dashboard VNET Support

Invictus includes functionality which allows all its resources to run within an Azure Virtual Network (VNET). This document will guide you through this process.

## Prerequisites

- An Azure Virtual Network
  - Including two subnets, one each for:
    - Private Endpoints
    - Container App Environment
  - The subnets must have the following services enabled
    - Microsoft.AzureCosmosDB
    - Microsoft.EventHub
    - Microsoft.KeyVault
    - Microsoft.ServiceBus
    - Microsoft.Storage
  - The container app subnet must also have the delegation `Microsoft.App/environments` ([more info](https://learn.microsoft.com/en-us/azure/virtual-network/manage-subnet-delegation))
        
- 10 Private DNS Zones
  - `privatelink.azurecr.io`
  - `privatelink.blob.core.windows.net`
  - `privatelink.file.core.windows.net`
  - `privatelink.mongo.cosmos.azure.com`
  - `privatelink.queue.core.windows.net`
  - `privatelink.servicebus.windows.net`
  - `privatelink.table.core.windows.net`
  - `privatelink.table.cosmos.azure.com`
  - `privatelink.vaultcore.azure.net`
  - `privatelink.{regionName}.azurecontainerapps.io`
    
  A Bicep template for these DNS Zones can be found [here](scripts/invictusVnetDNSZones.bicep)

- To be able to deploy the app code from an Azure DevOps pipeline you will need:
  - A self hosted agent running on the same VNET with the following software installed:
    - Powershell
    - Azure Powershell
    - Bicep CLI

## Role Assignment

If the Invictus resources and the VNET are on different resource groups, then the Invictus resource group will need to be assigned the role of `Network Contributor` onto the VNET resource group.

## Release Pipeline Changes

The release pipeline remains the same as explained [here](dashboard-releasepipeline.mdx), but with a set of VNET specific parameters. The `enableVnetSupport` parameter must be set to `$true` to enable the functionality. The name of the resource group containing the VNET, as well as the VNET name itself must be passed to the `vnetResourceGroupName` and `vnetName` parameters. An array containing the names of the desired subnets must be passed to the `keyVaultSubnets`, `storageAccountSubnets`, `serviceBusSubnets`, `cosmosDbSubnets`, `eventHubSubnets` parameters. You will also need to pass the subnet names to connect the Container App Environment and private endpoints. These parameters are `containerAppEnvironmentSubnetName`, `privateEndpointSubnetName`.

A full list of VNET parameters can be found [here](dashboard-releasepipeline.mdx).

### Full Deploy Script Parameters Example

```powershell
PS> $(ArtifactsPath)/Deploy.ps1 `
-artifactsPath "$(ArtifactsPath)" `
-artifactsPathScripts "$(ArtifactsPathScripts)" `
-resourcePrefix "$(Infra.Environment.ResourcePrefix)" `
-resourceGroupName "$(Infra.Environment.ResourceGroup)" `
-variableGroupName "Software.Infra.$(Infra.Environment.ShortName)" `
-resourceGroupLocation "$(Infra.Environment.Region.Primary)" `
-devOpsObjectId $(Infra.DevOps.Object.Id) `
-azureActiveDirectoryClientId "********-****-****-****-********" `
-azureActiveDirectoryTenantId "********-****-****-****-********" `
-use32BitWorkerProcess $false `
-azureActiveDirectoryClientSecret "*************************" `
-azureActiveDirectoryAudience "api://********-****-****-****-********" `
-performSqlDataMigration 0 `
-enableVnetSupport $true `
-vnetName "invictus-vnet" `
-vnetResourceGroupName "invictus-vnet" `
-keyVaultSubnets @("snet-privateendpoints", "snet-cae") `
-storageAccountSubnets @("snet-privateendpoints", "snet-cae") `
-serviceBusSubnets @("snet-privateendpoints", "snet-cae") `
-cosmosDbSubnets @("snet-privateendpoints", "snet-cae") `
-eventHubSubnets @("snet-privateendpoints", "snet-cae") `
-containerAppEnvironmentSubnetName "snet-cae" `
-privateEndpointSubnetName "snet-privateendpoints"
```
