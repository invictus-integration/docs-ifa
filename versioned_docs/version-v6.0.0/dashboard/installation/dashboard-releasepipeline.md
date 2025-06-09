---
sidebar_class_name: hidden
---

# Dashboard Release Pipeline

The release pipeline will use the artifacts created from the build pipeline and publish this to the stage(s) you define. Each stage will deploy the resources to the Azure subscription and resource group you specify in the deployment tasks.

The release uses variable groups and edits/adds variables to the groups, we will begin by creating a new variable group.

## Variable Group

Create a variable group named `{prefix}.Invictus.{stage}` for all the stages (environments) and add at least one variable (eg: Invictus.Secrets.ApiKey1.Name = apikey1).

Make sure the Project Collection Build Service has Administrator access to these variable groups (Pipelines > Library > Security)

> ![Library Security](/images/ifa-library-security.png)

## YAML Release Pipeline
Add the files and folders from [this](https://github.com/invictus-integration/docs-ifa/tree/master/dashboard/installation/pipelines) location to your DevOps repo. 
This contains an example YAML pipeline to release the Invictus for Azure Dashboard, change the [dashboard.release.yaml](https://github.com/invictus-integration/docs-ifa/blob/master/dashboard/installation/pipelines/dashboard.release.yaml) file according to your needs, for example change the needed environments and change the name of the build pipeline trigger:
``` yaml
resources:
  pipelines:
    # Name of the pipeline resource inside this workflow. Used to reference the pipeline resources later on (e.g. download artifacts).
  - pipeline: _build
    # Name of the pipeline in Azure Pipelines
    source: 'customer.azure.invictus.dashboard.build' 
    trigger: true
```

Also make sure to change the bicep template parameters according to your needs.

If you need to overwrite more bicep Template parameters make sure to add this to the `deployScriptParameters`. A complete list of Bicep Template parameters can be found [here](#Bicep-Template-Parameters). 

Afterwards add the [dashboard.release.yaml](./pipelines/dashboard.release.yaml) in your DevOps environment as a pipeline.

## Deploy Script Arguments
The following script arguments are used in the deploy script:

### Mandatory Arguments

[publish and download build artifacts]: https://learn.microsoft.com/en-us/azure/devops/pipelines/artifacts/build-artifacts?view=azure-devops&tabs=yaml
[Azure CLI task]: https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-cli-v2?view=azure-pipelines
[Azure AD setup]: ./01_give_ad_access.md
[build pipeline]: ./dashboard-buildpipeline.md
[Container authentication]: https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad

| Argument name       | Description |
| ------------------- | ----------- |
| `artifactsPath`     | Path on the DevOps agent where the downloaded Invictus artifacts are stored <br/> ([publish and download build artifacts]) |
| `devOpsObjectId`    | Object ID of the service principal that's connected to the DevOps service connection, which will get the necessary role definitions to interact with Invictus' deployed resources (i.e. Key vault, Container registry) ([Azure CLI task]) |
| `acrUsername`       | ACR credentials provided by Codit to pull Invictus images <br/> See [build pipeline] |
| `acrPassword`       | ACR credentials provided by Codit to pull Invictus images <br/> See [build pipeline] |
| `resourcePrefix`    | Prefix used for deployed Azure resources (i.e. `invictus-{prefix}-vlt`) |
| `resourceGroupName` | Name of Azure resource group where Invictus should be deployed |
| `variableGroupName` | DevOps variable group to write the Bicep outputs to (i.e. `Invictus_CosmosDb_DbName`) |
| `azureActiveDirectoryClientId` | See [Azure AD Setup] if AD enabled  |
| `azureActiveDirectoryTenantId` | See [Azure AD Setup] if AD enabled |
| `azureActiveDirectoryClientSecret` | See [Azure AD Setup] if AD enabled |
| `azureActiveDirectoryAudience` | See [Azure AD Setup] if AD enabled |
| `performSqlDataMigration` | If value is 1 the data migration process will run, migrating SQL data to Cosmos DB. If the value is 0, the process will be skipped. See the [migration guide](./dashboard-migration.md) for more details. Once data migration has been performed and verified, it is recommended to then set this value to 0 so that the migration process is skipped for all subsequent releases. |
| `flowDataTTLInDays` | Amount of days flow data can live in the database <br/> See [import flow traces](../flows/04_import-flow-traces/index.md). |
| `isProvisionedCosmos` | If the value is 1, a Cosmos DB with provisioned throughput will be deployed. If the value is 0, a serverless Cosmos DB will be deployed instead. See the [relevant section](#provisioned-throughput-vs-serverless-cosmos-db) below for more details. |
| `identityProviderClientSecret` | See [Container Authentication]. |
| `identityProviderApplicationId` | See [Container Authentication]. |

### Optional Arguments
| Argument name                  | Default value | Description  |
| ------------------------------ | --------------| ------------ |
| `resourceGroupLocation`        | 'West Europe' | Azure location where resources should be deployed |
| `isAdDisabled`                 | `False`       | Boolean flag to indicate whether the Dashboard should use AD for authentication |
| `additionalTemplateParameters` | []            | Additional named parameters for the Bicep template you wish to override. More on this below. |

:::info[override bicep parameters]
The `AdditionalTemplateParameters` argument are named arguments you can use to override the default values used by the Bicep template. You simply name the argument as the parameter. For example if you want to use a different `servicePlanSku` you would add `-eventHubSkuName 'Standard'` to the arguments of the `./Deploy.ps1` script.
:::

```yaml
- task: AzureCLI@2
  displayName: 'Azure CLI'
  env:
    SYSTEM_ACCESSTOKEN: $(System.AccessToken)
  inputs:
    azureSubscription: '[YOUR_SERVICE_CONNECTION]'
    addSpnToEnvironment: true
    scriptType: 'pscore'
    scriptLocation: 'inlineScript'
    inlineScript: |
    
      # Determine where the the provided Invictus 'Deploy.ps1' script is located
      $artifactsPath = ${{ variables['Pipeline.Workspace'] }} + '/_build/dashboard' 
      $scriptPath = $artifactsPath + '/Deploy.ps1'

      # Use your service connection's service principal Object ID
      $objectId = (az ad sp show --id $env:servicePrincipalId | ConvertFrom-Json).id

      & $scriptPath `
        -artifactsPath $artifactsPath `
        -acrPath 'invictusreleases.azurecr.io' `
        -acrUsername 'admin' `
        -acrPassword '<pass>' `
        -resourcePrefix 'dev' `
        -resourceGroupName 'my-client-dev-rg' `
        -variableGroupName 'My.Client.Dev' `
        -devOpsObjectId $objectId `
        -performSqlDataMigration 0 `
        -isProvisionedCosmos 0 `
        -azureActiveDirectoryClientId '4b559bfb-871a-4013-bce9-829e3aeb6bdd' `
        -azureActiveDirectoryTenantId '97a944a1-04a0-45d2-b2f3-c424755c4167' `
        -azureActiveDirectoryClientSecret '<pass>' `
        -azureActiveDirectoryAudience 'https://contoso.com' `
        -identityProviderApplicationId 'c84d34ea-f169-4787-a4af-81750debda0b' `
        -identityProviderClientSecret '<pass>' `
        -isProvisionedCosmos 1 `
        -flowDataTTLInDays 90
```

### Provisioned Throughput vs Serverless Cosmos DB

**Provisioned Throughput**: You specify a fixed amount of resources (RU/s) for your database, ensuring predictable performance. Best for steady workloads.

**Serverless**: Capacity scales automatically based on actual usage, paying only for resources used per request. Cost-effective for variable traffic (high / low usage) and infrequently accessed data.

### When to use Provisioned Throughput vs Serverless Cosmos DB


### Serverless in Production

- Cost-Efficiency for Variable Workloads: Suitable for scenarios with varying input volume loads, automatically scaling down during periods of low activity to optimize cost.
- Sporadic Traffic: Ideal for situations where the volume fluctuates or experiences occasional bursts of traffic, such as higher volume during specific hours and lower volume at other times.
- Agile and Scalable: Collections are auto-scaled, with FlowData and WorkFlowEvents being the most affected collections when data is inserted.

### Provisioned Throughput in Production

- Fixed RU/s Allocation: Collections are allocated a defined RU/s, requiring consistent usage to make the most of the provisioned capacity.
- Adjustable RU/s for High Volume Processing: RU/s can be increased to accommodate very high volume processing requirements, ensuring optimal performance.
- Predictable Costs: Costs are fixed based on the allocated RU/s. However, for FlowData and WorkFlowEvents, since they are set to autoscale, there is a minimum and maximum price based on usage.


Always evaluate your application's needs and monitor performance to ensure the chosen capacity model meets expectations in the production environment.

**Default Settings for Provisioned Throughput**

| Collection    | RU/s          | Autoscale  |
| ------------- | ------------- | ---------- |
|Audits|500|No|
|DashboardSettings|500|No|
|Users|500|No|
|Groups|500|No|
|Statistics|500|No|
|FolderFlows|500|No|
|FlowData|2000|Yes|
|WorkflowEvent|2000|Yes|
|MessageContent|2000|Yes|

## Bicep Template Parameters

The below tables lists the parameters accepted by the Bicep template.

## Top-level parameters
Resource-independent parameters that affect all resources in the deployed resource group.

| Parameter                              | Required | Default             | Description                       |
| -------------------------------------- | :------: | ------------------- | --------------------------------- |
| `resourcePrefix`                       | Yes      |                     | used as part of the default names for most resources |
| `devOpsObjectId`                       | Yes      |                     | The object-id associated with the service principal of the enterprise application that's connected to the service connection on DevOps |

| Parameter                              | Required | Default                        | Description                                                              |
| -------------------------------------- | :------: | ------------------------------ | ------------------------------------------------------------------------ |
| **`enableVnetSupport` (VNET)**         | **Yes**  | **`false`**                   | **Used to toggle VNET functionality on or off** |
| **`vnetResourceGroupName` (VNET)**     | **Yes**  |                               | **The name of the resource group on Azure where the VNET is located** |
| **`vnetName` (VNET)**                  | **Yes**  |                               | **The name of the VNET resource** |
| **`privateEndpointSubnetName` (VNET)** | **Yes**  |                               | **The name of the subnet to be used to connect the private endpoint resources** |
| **`containerAppEnvironmentSubnetName` (VNET)** | **Yes**  |                               | **The name of the subnet to be used to connect the container app environment** |
| **`caeVnetInfraRgName` (VNET)** | **No**  |**Auto-Generated by Azure**| **Overrides the name of the Azure auto-generated RG for Container App Environment infra** |
| **`dnsZoneSubscriptionId` (VNET)**     | **No**   | **Subscription ID of scope**  | **The subscription ID of the private DNS zones.** |
| **`dnsZoneResourceGroupName` (VNET)**  | **No**   | **VNET RG name**              | **The resource group name of where the private DNS zones are located.** |

### Active Directory parameters
Parameters related to the Azure Active Directory where the groups are synced from.

| Parameter                              | Required | Default | Description                                           |
| -------------------------------------- | :------: | ------- | ----------------------------------------------------- |
| `azureActiveDirectoryClientId`         | Yes      |         | Client AAD ID required to enable AAD for dashboard    |
| `azureActiveDirectoryTenantId`         | Yes      |         | Tenant AAD ID required to enable AAD for dashboard    |
| `azureActiveDirectoryClientSecret`     | Yes      |         | Required for AD Login                                 |
| `AzureActiveDirectoryAudience`         | Yes      |         | Required for AD Login                                 | 
| `isAdDisabled`                         | No       | `0`     | isAdDisabled true or false                            |

## App service parameters
Parameters related to the applications that are deployed, mostly Azure Functions.

| Parameter                                 | Required | Default                                             | Description                                     |
| ----------------------------------------- | :------: | --------------------------------------------------- | ----------------------------------------------- |
| `invictusDashboardWebAppName`             | No       | `invictus-{resourcePrefix}-invictusdashboard-v2`    | Name for the dashboard web application          |
| `invictusDashboardGatewayFunctionName`    | No       | `invictus-{resourcePrefix}-dashboardgateway`        | Name for Azure Function                         |
| `invictusImportJobFunctionName`           | No       | `invictus-{resourcePrefix}-invictusimportjob`       | Name for Azure Function                         |
| `invictusCacheImportJobFunctionName`      | No       | `invictus-{resourcePrefix}-cacheimportjob`          | Name for Azure Function                         |
| `invictusStoreImportJobFunctionName`      | No       | `invictus-{resourcePrefix}-storeimportjob`          | Name for Azure Function                         |
| `invictusFlowHandlerFunctionName`         | No       | `invictus-{resourcePrefix}-flowhandlerjob`          | Name for Azure Function                         |
| `invictusGenericReceiverFunctionName`     | No       | `invictus-{resourcePrefix}-genericreceiver`         | Name for Azure Function                         |
| `invictusHttpReceiverFunctionName`        | No       | `invictus-{resourcePrefix}-httpreceiver`            | Name for Azure Function                         |
| `invictusDatabaseManagerFunctionName`     | No       | `invictus-{resourcePrefix}-database-storeimportjob` | Name for Azure Function                         |
| `invictusDataFactoryReceiverFunctionName` | No       | `invictus-{resourcePrefix}-datafactoryreceiver`     | Name for Azure Function                         |

| Parameter                                  | Required | Default | Description                                                              |
| ------------------------------------------ | :------: | ------- | ------------------------------------------------------------------------ |
| `statisticsCutOffDays`                     | No       | `-3`    | The number of days in the past that homepage statistics will recalculate |

| Parameter                           | Required | Default                        | Description                                                   |
| ----------------------------------- | :------: | ------------------------------ | ------------------------------------------------------------- |
| `servicePlanName`                   | No       | `invictus-{resourcePrefix}-appplan-linux` | Name for the service plan which will host the APIs |
| `servicePlanSkuName`                | No       | S1                              | Size for the App Plan, the value of "I1" needs to be passed to install an isolated plan.|
| `servicePlanSkuCapacity`            | No       | `1`                             | The SKU capacity setting for the App Plan   |

## Storage parameters
Parameters related to the data that is stored throughout Invictus.

| Parameter                                              | Required | Default                                                  | Description                                                                |
| ------------------------------------------------------ | :------: | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `cosmosAccountName`                                    | No       | `invictus-{resourcePrefix}-cosmos-serverless/provisoned` | Name for Cosmos account                                                    |
| `cosmosDatabaseName`                                   | No       | `InvictusDashboard`                                      | Name for Cosmos database                                                   |
| `isProvisionedCosmos`                                  | Yes      | `0` (: `true`)                                             | isProvisionedCosmos true or false                                          |
| **`cosmosDbSubnets` (VNET)**                           | **Yes**  | **`[]`**                                                | **An array of string. The values need to match the subnet names on the VNET.** |

| Parameter                                              | Required | Default                         | Description
| ------------------------------------------------------ | :------: | ------------------------------- | --------------------------------------------------------------------------------------- |
| `storageAccountName`                                   | No       | `invictus{resourcePrefix}store` | Name for the Azure Storage resource. Dashes (-) will be removed from `{resourcePrefix}` |
| `storageAccountType`                                   | No       | Standard_LRS                    | The Storage account StorageAccountSkuType                                                   |
| `messageStatusCacheDeleteAfterDays`                    | No       | `30`                            | The number of days without modification for the message status cache to be deleted          |
| **`storageAccountSubnets` (VNET)**                     | **Yes**  | **`[]`**                        | **An array of string. The values need to match the subnet names on the VNET**               |
| **`disableStorageAccountPublicNetworkAccess` (VNET)**  | **No**   | **`false`**   | **If true, the Invictus storage account will not be accessible from a public network.**     |
| **`storageAccountMinimumTLSVersion` (VNET)** | **No**  | **TLS1_2** | **Set the required TLS value for the storage account. Accepted values: TLS1_0, TLS1_1, TLS1_2**         |

| Parameter                                              | Required | Default | Description                                            |
| ------------------------------------------------------ | :------: | ------- | ------------------------------------------------------ |
| `flowDataTTLInDays`                                    | Yes      |         | A positive integer value which represents the amount of days flow data can live in the database |
| `cleanupJobIntervalInMinutes`                          | No       |  `1440` | Interval in minutes for the cleanup job                |
| `workFlowCleanupJobIntervalInMinutes`                  | No       |  `180`  | Interval in minutes for the workflowevent cleanup job  |
| `dataWorkFlowCleanupMaxRetentionDays`                  | No       |  `90`   | Max number of days the WorkFlowEvent data is stored    |

## Messaging parameters
Parameters related to the messaging resources that import the flow information into storage.

| Parameter                           | Required | Default                         | Description                                              |
| ----------------------------------- | :------: | ------------------------------- | -------------------------------------------------------- |
| `serviceBusNamespaceName`           | No       | `invictus-{resourcePrefix}-sbs` | Name for the Service Bus Namespace resource |
| `serviceBusSkuName`                 | No       | Standard or Premium if VNET enabled | Name for the Service Bus SKU |
| **`serviceBusSubnets` (VNET)**      | **Yes**  | **`[]`**                       | **An array of string. The values need to match the subnet names on the VNET** |

| Parameter                           | Required | Default                             | Description                               |
| ----------------------------------- | :------: | ----------------------------------- | ----------------------------------------- |
| `eventHubNamespaceName`             | No       | `invictus-{resourcePrefix}-evnm`    | Name for the Event Hub Namespace resource |
| `eventHubSkuName`                   | No       | Basic                               | The SKU name of the EventHub Namespace    |
| `eventHubSkuTier`                   | No       | Basic                               | The Tier name for the EventHub Namespace  |
| `eventHubSkuCapacity`               | No       | `1`                                 | The SKU capacity for the EventHub Namespace |
| `eventHubAutoInflate`               | No       | `false`                             | The EventHub setting to enable auto-inflate |
| `eventHubMaxThroughputUnits`        | No       | `0`                                 | Max throughput setting for EventHub         |
| `eventHubMessageRetentionInDays`    | No       | `1`                                 | The number of days EventHub will retain messages. Note: `eventHubSkuName` and `eventHubSkuTier` must be set to `Standard` to exceed 1 day of retention. |
| **`eventHubSubnets` (VNET)**        | **Yes** | `[]`                               | **An array of string. The values need to match the subnet names on the VNET** |

| Parameter                           | Required | Default                                          | Description                                             |
| ----------------------------------- | :------: | ------------------------------------------------ | ------------------------------------------------------- |
| `eventHubName`                      | No       | `invictus-{resourcePrefix}-evhb`                 | Name for the Event Hub created on the Namespace |
| `eventHubNameV2`                    | No       | `invictus-{resourcePrefix}-evhb-v2`              | Name for the Event Hub for standard LA's created on the Namespace |
| `workflowEventHubName`              | No       | `invictus-{resourcePrefix}-workflow-evhb`        | EventHub name for the import job |
| `dataMergeWorkflowEventHubName`     | No       | `invictus-{resourcePrefix}-mergeddata-evhb`      | EventHub name for the data merge import job |
| `sideTasksWorkflowEventHubName`     | No       | `invictus-{resourcePrefix}-sidetasks-evhb`       | EventHub name for the side tasks |
| `dataFactoryEventHubName`           | No       | `invictus-{resourcePrefix}-df-evhb`              | EventHub name for the data factory import job |
| `genericEventHubName`               | No       | `invictus-{resourcePrefix}-genericreceiver-evhb` | EventHub name for the import job |

## Secret parameters
Parameters related to the security of the deployed applications. 

| Parameter                           | Required | Default                         | Description                                |
| ----------------------------------- | :------: | ------------------------------- | ------------------------------------------ |
| `keyVaultName`                      | No       | `invictus-{resourcePrefix}-vlt` | Name for the Key Vault Service Namespace resource |
| `keyVaultEnablePurgeProtection`     | No       | `null`                          | If true, enables key vault purge protection. Once enabled, this property can never be disabled.|
| `jwtSecretToken`                    | No       | Generated on first use          | JWT Secret used for login                  |
| **`keyVaultSubnets` (VNET)**        | **Yes**  | **`[]`**                       | **An array of string. The values need to match the subnet names on the VNET** |

## Observability parameters
Parameters related to the observability of the deployed applications.

| Parameter                                     | Required | Default                                     | Description                                                  |
| -------------------------------------------   | :------: | ------------------------------------------- | ------------------------------------------------------------ |
| `appInsightsName`                             | No       | `invictus-{resourcePrefix}-appins`          | Name for the Application Insights resource                   |
| `alertingAppInsightsName`                     | No       | `invictus-{resourcePrefix}-alertingappins`  | Name for the Application Insights resource used for alerting |
| `importjobAppInsightsName`                    | No       | `invictus-{resourcePrefix}-importjobappins` | Name for Application Insights used by importjob              |
| `appInsightsSamplingPercentage`               | No       | `1`                                         | The sampling percentage for the Application Insights resource |
| `importJobAppInsightsSamplingPercentage`      | No       | `1`                                         | The sampling percentage for the import job Application Insights resource |

## Scaling parameters
Azure Container Apps allow for flexible scaling customization. In Invictus we have provided default scaling values which can be customized according to your scenario.

Container Apps have the ability to scale down to zero replicas. This is a great cost-saving option especially for components which are not used at all. A container app scaled to zero will automatically scale out when triggered, however this may take up to a few minutes to complete. This could prove to be an issue in scenarios with limited timeout e.g. logic apps with 120 seconds timeout. In such cases there is no option but to set a minimum replica count of 1.

| Parameter                      | Required |
| ------------------------------ | :------: | 
| `dashboardScaling`             | No       | 
| `dashboardGatewayScaling`      | No       | 
| `cacheImportJobScaling`        | No       | 
| `dbImportJobScaling`           | No       | 
| `datafactoryReceiverScaling`   | No       | 
| `flowhandlerScaling`           | No       | 
| `genericReceiverScaling`       | No       | 
| `httpReceiverScaling`          | No       | 
| `importJobScaling`             | No       | 
| `storeImportJobScaling`        | No       |

Each of the above parameters accepts an object:
```json
{
  scaleMinReplicas: int
  scaleMaxReplicas: int
  cpuResources: string
  memoryResources: string
}
```

| Parameter value    | Description                                                                                            |
| -------------------| ------------------------------------------------------------------------------------------------------ |
| `scaleMinReplicas` | The lowest number of replicas the Container App will scale in to.                                      |
| `scaleMaxReplicas` | The highest number of replicas the Container App will scale out to.                                    |
| `cpuResources`     | The amount of cpu resources to dedicate for the container resource. [See here for allowed values](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations).       |
| `memoryResources`  | The amount of memory resources to dedicate for the container resource. [See here for allowed values](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations).    |