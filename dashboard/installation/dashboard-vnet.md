# Invictus Dashboard VNET Support

Invictus includes functionality which allows all its resources to run within an Azure Virtual Network (VNET). This document will guide you through this process.

## Prerequisites

- An Azure Virtual Network
  - Including two subnets, one each for:
    - Private Endpoints
    - Container Apps (with a CIDR range of /23 or larger)
  - The subnets must have the following services enabled
    - Microsoft.AzureCosmosDB
    - Microsoft.EventHub
    - Microsoft.KeyVault
    - Microsoft.ServiceBus
    - Microsoft.Storage
  - The container app subnet must also have the delegation `Microsoft.App/environments`
        
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
    
  A Bicep template for these DNS Zones can be found [here](scripts/invictusVnetDNSZones.bicep)

- To be able to deploy the app code from an Azure DevOps pipeline you will need:
  - A self hosted agent running on the same VNET with the following software intalled:
    - Powershell
    - Azure Powershell
    - Bicep CLI

## Role Assignment

If the Invictus resources and the VNET are on different resource groups, then the Invictus resource group will need to be assigned the role of `Network Contributor` onto the VNET resource group.

## Release Pipeline Changes

The release pipeline remains the same as explained [here](dashboard-releasepipeline.md), but with a set of VNET specific parameters. The `enableVnetSupport` parameter must be set to `$true` to enable the functionality. The name of the resource group containing the VNET, as well as the VNET name itself must be passed to the `vnetResourceGroupName` and `vnetName` parameters. An array containing the names of the desired subnets must be passed to the `keyVaultSubnets`, `storageAccountSubnets`, `serviceBusSubnets`, `cosmosDbSubnets`, `eventHubSubnets` parameters. You will also need to pass the subnet names to connect the dashboard, Azure functions and private endpoints. These parameters are `dashboardSubnetName`, `functionsSubnetName`, `privateEndpointSubnetName`.

A full list of VNET parameters can be found [here](dashboard-releasepipeline.md#vnet-specific-parameters).

### Full Deploy Script Parameters Example

  `-ArtifactsPath "$(ArtifactsPath)" -ArtifactsPathScripts "$(ArtifactsPathScripts)" -ResourcePrefix "$(Infra.Environment.ResourcePrefix)" -ResourceGroupName "$(Infra.Environment.ResourceGroup)" -VariableGroupName "Software.Infra.$(Infra.Environment.ShortName)" -ResourceGroupLocation "$(Infra.Environment.Region.Primary)" -devOpsObjectId $(Infra.DevOps.Object.Id) -AzureActiveDirectoryClientId "********-****-****-****-********" -AzureActiveDirectoryTenantId "********-****-****-****-********" -use32BitWorkerProcess $false -AzureActiveDirectoryClientSecret "*************************" -AzureActiveDirectoryAudience "api://********-****-****-****-********" -PerformSqlDataMigration 0 -enableVnetSupport $true -vnetName "invictus-vnet" -vnetResourceGroupName "invictus-vnet" -keyVaultSubnets @("snet-privateendpoints", "snet-invictus", "snet-invictusdashboard") -storageAccountSubnets @("snet-privateendpoints", "snet-invictus", "snet-invictusdashboard") -serviceBusSubnets @("snet-privateendpoints", "snet-invictus", "snet-invictusdashboard") -cosmosDbSubnets @("snet-privateendpoints", "snet-invictus", "snet-invictusdashboard") -eventHubSubnets @("snet-privateendpoints", "snet-invictus", "snet-invictusdashboard") -dashboardSubnetName "snet-invictusdashboard" -functionsSubnetName "snet-invictus" -privateEndpointSubnetName "snet-privateendpoints" -isPrivateDashboardVnet $true`
