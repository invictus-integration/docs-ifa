[home](../../README.md) | [dashboard](../dashboard.md) | [dashboard installation](dashboard-installation.md)

# Dashboard Release Pipeline

The release pipeline will use the artifacts created from the build pipeline and publish this to the stage(s) you define. Each stage will deploy the resources to the Azure subscription and resource group you specify in the deployment tasks.

The release uses variable groups and edits/adds variables to the groups, we will begin by creating a new variable group.

## Variable Group

Create a variable group named {prefix}.Invictus.{stage} for all the stages (environments) and add at least one variable (eg: Invictus.Secrets.ApiKey1.Name = apikey1).

Make sure the Project Collection Build Service has Administrator access to these variable groups (Pipelines > Library > Security)

> ![Library Security](../../images/ifa-library-security.png)

## YAML Pipeline
Add the files and folders from [this](pipelines) location to your DevOps repo. 
This contains an example YAML pipeline to release the Invictus for Azure Dashboard, change the [dashboard.release.yaml](./pipelines/dashboard.release.yaml) file according to your needs, for example change the needed environments and change the name of the build pipeline trigger:
``` yaml
resources:
  pipelines:
    # Name of the pipeline resource inside this workflow. Used to reference the pipeline resources later on (e.g. download artifacts).
  - pipeline: _build
    # Name of the pipeline in Azure Pipelines
    source: 'customer.azure.invictus.dashboard.build' 
    trigger: true
```

**Make sure to replace the `azureSubscription` value with the name of your serviceconnection as this value cannot be parameterized**

Also make sure to change the ARM template parameters. In these example files we are deploying to DEV, TST and ACC using a `B1` service plan SKU and a `P1V2` service plan SKU to PRD. Make sure to change and parameterize this according to your needs.

If you need to overwrite more ARM Template parameters make sure to add this to the `deployScriptParameters`. A complete list of ARM Template parameters can be found [here](#ARM-Template-Parameters). 

Afterwards add the [dashboard.release.yaml](./pipelines/dashboard.release.yaml) in your DevOps environment as a pipeline.

## Classic Pipeline
### Release

Create a new release pipeline, starting with an empty template, with this naming: `{prefix}.Invictus.Dashboard`.

Configure the release name format (Options) as `{prefix}.Invictus.Dashboard $(Build.BuildNumber)_$(rev:r)`.

Use the Artifacts from the build pipeline as a source for the release. Name the Source alias: "InvictusDashboard".

Add a variable **ArtifactsPath** to the release with scope 'Release' and a value of `$(System.DefaultWorkingDirectory)/InvictusDashboard/Dashboard`.

Please Note that a current bug in the Az library might cause the release to fail for new installation. Simply re-deploy the failed release to resolve the issue.

#### Stages

Add a stage for each environment you wish to release to.

- Link the above variable groups to the stages you create.
- Don't forget to link the Infra variable group as well.
- Allow the agent to access the OAuth token

> ![Agent OAuth](../../images/ifa-agent-oauth.png)

Add an Azure PowerShell task to each stage. This task will take care of the following:

- Get the keyvault access policies, so they are preserved in consequent deployments.
- Stop any datafactory triggers related to the framework.
- ARM deployment.
- Start any datafactory triggers.
- Deployment of the dashboard.
- Deployment of the import job.

Use the following arguments for the fields of the azure powershell task:

- **Task version**: 4
- **Display name**: Deploy
- **Azure Subscription**: the subscription to deploy to
- **Script Path**: `$(ArtifactsPath)/Deploy.ps1`
- **Script Arguments**
  - ArtifactsPath (mandatory): `$(ArtifactsPath)`
  - ArtifactsPathScripts (optional): uses ArtifactsPath when not specified.
  - ResourcePrefix (mandatory): `$(Infra.Environment.ShortName)-$(Infra.Environment.Region.Primary.ShortName)-$(Infra.Environment.Customer.ShortName)`
  - ResourceGroupName (mandatory): name of the Azure Resource Group. Include the variable `$(Infra.Environment.ShortName)` to make this environment specific.
  - VariableGroupName (mandatory): The name of the variable group. Include the variable `$(Infra.Environment.ShortName)` to make this environment specific.
  - ResourceGroupLocation (optional): `$(Infra.Environment.Region.Primary)` or 'West Europe' when not specified.
  - KeyVaultName (optional): uses `invictus-$ResourcePrefix-vlt` when not specified.
  - KeyVaultAccessPoliciesVariableName (optional): uses _Infra.KeyVault.AccessPolicies_ when not specified.
  - AdditionalTemplateParameters (optional): Additional named parameters for the arm template you wish to override. More on this below.
  - Pass the following argument if you wish to enable statistics in the dashboard: **-enableStatisticsFunction "true"**
- **Azure PowerShell Version**: Specify other version : **2.6.0**
- Under the Advanced section enable: **Use Powershell Core**. Without this option the deployment will fail.

**NOTE:** When passing the ApiKey1 and ApiKey2 to the Deploy.ps as arguments, please remember to enclose them in single quotes ''. This prevents any operator characters from breaking the ps script.

The AdditionalTemplateParameters argument are named arguments you can use to override the default values used by the ARM template. You simply name the argument as the parameter. For example if you want to use a different servicePlanSku you would add `-servicePlanSkuName "S1"` to the arguments of the powershell script.

> Note that **resourcePrefix** and **accessPolicies** are overridden by the script, so no need to include that in the arguments.

Complete example of the arguments (note the use of -devOpsObjectId as an additional parameter):

```powershell
-ArtifactsPath "$(ArtifactsPath)" -ResourcePrefix "$(Infra.Environment.ResourcePrefix)" -ResourceGroupName "$(Infra.Environment.ResourceGroup)" -VariableGroupName "Software.Infra.$(Infra.Environment.ShortName)" -ResourceGroupLocation "$(Infra.Environment.Region.Primary)" -devOpsObjectId $(Infra.DevOps.Object.Id)
```

A complete list of ARM Template parameters can be found [here](#ARM-Template-Parameters). 

## Azure Active Directory

If you are planning to enable AAD for the dashboard you will need to set the following parameters as **arguments**:

* AzureActiveDirectoryClientId
* AzureActiveDirectoryTenantId
* AzureActiveDirectoryClientSecret

The option to login with AAD in the dashboard will only be possible if the above values are supplied.

## Enable Sql Serverless

To deploy the Dashboard database(coditcip) as Sql Servleress simply pass the value for the following parameter `isDashboardDatabaseServerless` as 1. The following parameters can be passed to the deployment but have default values set.

* dashboardServerlessDatabaseMaxVCores
* dashboardServerlessDatabaseSize
* dashboardServerlessDatabaseaAutoPauseDelay

## ARM Template Parameters

The below table lists the parameters accepted by the ARM template.

|Parameter Name|Required|Default Value|Description|
| --- | :---: | --- | --- |
|resourcePrefix|Yes||used as part of the default names for most resources.|
|apiKey1|No|Generated value|The value used for basic authentication for the APIs|
|apiKey2|No|Generated value|The value used for basic authentication for the APIs|
|sqlServerName|No|invictus-{resourcePrefix}-sqlsvr|The name for the SQL Server that will host the databases|
|sqlServerLogin|No|InvictusFrameworkAdmin|The default username set for SQL Server|
|sqlServerLoginPassword|No|Generated value|The password that will be set to login into SQL Server|
|dashboardDatabaseName|No|coditcip|The name of the Database used by the Dashboard|
|invictusDashboardWebAppName|No|invictus-{resourcePrefix}-invictusdashboard|Name for the dashboard web application|
|appInsightsName|No|invictus-{resourcePrefix}-appins|Name for the Application Insights resource|
|serviceBusNamespaceName|No|invictus-{resourcePrefix}-sbs|Name for the Service Bus Namespace resource|
|keyVaultName|No|invictus-{resourcePrefix}-vlt|Name for the Key Vault Service Namespace resource|
|servicePlanName|No|invictus-{resourcePrefix}-appplan|Name for the service plan which will host the APIs|
|storageAccountName|No|invictus{resourcePrefix}store|Name for the Azure Storage resource. Any dashes (-) will be removed from {resourcePrefix}|
|storageAccountType|No|Standard_LRS|The Storage account StorageAccountSkuType|
|servicePlanSkuName|No|S1|Size for the App Plan, the value of "I1" needs to be passed to install an isolated plan.|
|servicePlanSkuCapacity|No|1|The SKU capacity setting  for the App Plan|
|eventHubNamespaceName|No|invictus-{resourcePrefix}-evnm|Name for the Event Hub Namespace resource|
|eventHubName|No|invictus-{resourcePrefix}-evhb|Name for the Event Hub created on the Namespace|
|autoscaleForPlanName|No|invictus-{resourcePrefix}-CPU-RAM-Autoscale|Name for the autoscale function|
|minPlanInstanceAutoScale|No|1|The minimum number of instances for the AutoScale function|
|maxPlanInstanceAutoScale|No|5|The maximum number of instances for the AutoScale function|
|consumptionPlanName|No|invictus-{resourcePrefix}-consumptionplan|Name of consumption app plan used for ImportJob|
|dashboardDbSkuName|No|S1|The SKU name of the CoditCip DB|
|dashboardDbSkuTier|No|Standard|The Tier name for the CoditCip DB|
|dashboardDbMaxSizeBytes|No|268435456000|Default size of CoditCip DB when created|
|eventHubSkuName|No|Basic|The SKU name of the EventHub Namespace|
|eventHubSkuTier|No|Basic|The Tier name for the EventHub Namespace|
|eventHubSkuCapacity|No|1|The SKU capacity for the EventHub Namespace|
|eventHubAutoInflate|No|false|The EventHub setting to enable auto-inflate|
|eventHubMaxThroughputUnits|No|0|Max throughput setting for EventHub|
|mTriggerCpuTimeGrainAutoScaleIncrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|mTriggerCpuTimeGrainAutoScaleDecrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|mTriggerRamTimeGrainAutoScaleIncrease|No|PT5M|Time evaluated when factoring enabling autoscale for RAM|
|mTriggerRamTimeGrainAutoScaleDecrease|No|50|Percentage when rule is triggered|
|mTriggerCpuTimeWindowAutoScaleIncrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|mTriggerCpuTimeWindowAutoScaleDecrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|mTriggerCpuThresholdAutoScaleIncrease|No|70|Percentage when rule is triggered|
|mTriggerCpuThresholdAutoScaleDecrease|No|50|Percentage when rule is triggered|
|mTriggerRamTimeWindowAutoScaleIncrease|No|PT5M|Time evaluated when rule is triggered|
|mTriggerRamTimeWindowAutoScaleDecrease|No|PT5M|Time evaluated when rule is triggered|
|mTriggerRamThresholdAutoScaleIncrease|No|70|Percentage when rule is triggered|
|mTriggerRamThresholdAutoScaleDecrease|No|50|Percentage when rule is triggered|
|scaleActionCpuCooldownTimeAutoScaleIncrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|scaleActionCpuCooldownTimeAutoScaleDecrease|No|PT5M|Time evaluated when factoring enabling autoscale for CPU|
|scaleActionRamCooldownTimeAutoScaleIncrease|No|PT5M|Time evaluated when factoring enabling autoscale for RAM|
|scaleActionRamCooldownTimeAutoScaleDecrease|No|PT5M|Time evaluated when factoring enabling autoscale for RAM|
|invictusImportJobFunctionName|No|invictus-{resourcePrefix}-invictusimportjob|Name for Azure Function|
|invictusCacheImportJobFunctionName|No|invictus-{resourcePrefix}-cacheimportjob|Name for Azure Function|
|invictusStoreImportJobFunctionName|No|invictus-{resourcePrefix}-storeimportjob|Name for Azure Function|
|importjobAppInsightsName|No|invictus-{resourcePrefix}-importjobappins|Name for Application Insights used by importjob|
|invictusFlowHandlerFunctionName|No|invictus-{resourcePrefix}-flowhandlerjob|Name for Azure Function|
|invictusGenericReceiverFunctionName|No|invictus-{resourcePrefix}-genericreceiver|Name for Azure Function|
|invictusHttpReceiverFunctionName|No|invictus-{resourcePrefix}-httpreceiver|Name for Azure Function|
|workflowEventHubName|No|invictus-{resourcePrefix}-workflow-evhb|EventHub name for the import job|
|genericEventHubName|No|invictus-{resourcePrefix}-genericreceiver-evhb|EventHub name for the import job|
|workFlowCleanupJobIntervalInMinutes|No|180|Interval in minutes for the workflowevent cleanup job|
|dataWorkFlowCleanupMaxRetentionDays|No|90|Max number of days the WorkFlowEvent data is stored|
|cleanupJobIntervalInMinutes|No|1440|Interval in minutes for the cleanup job|
|reIndexIntervalInHours|No|24|Interval in hours for the re-indexing|
|reIndexStartTime|No|2019-05-30T02:00:00.000Z|Start time for the re-indexing|
|invictusDataFactoryName|No|invictus-{resourcePrefix}-datafactory|The name of the Data factory service.|
|dataCleanupMaxRetentionDays|No|90|Nr of days to keep the data|
|dataCleanupMaxProcessingRows|No|5000|Maximum nr of rows to cleanup|
|accessPolicies|No|[]|A list of Azure Key vault access policies|
|devOpsObjectId|Yes||The object-id associated with the service principal that's connected to the service connection on DevOps|
|logicAppsImportJobErrorFilters|No|actionfailed|error filter for the import job|
|enableVnetSupport|No|0|this value is used for conditions within the ARM template to switch between non VNET and VNET installation. The parameters below are ignored if this value is set to 0|
|vnetName|No|&nbsp;|The name of the VNET on Azure|
|vnetResourceGroupName|No|&nbsp;|The name of the resource group on Azure where the VNET is located|
|aseName|No|&nbsp;|The name of the ASE on Azure|
|aseResourceGroupName|No|&nbsp;|The name of the resource group on Azure where the ASE is located|
|keyVaultSubnets|No|[]|An array of string. The values need to match the subnet names on the VNET|
|storageAccountSubnets|No|[]|An array of string. The values need to match the subnet names on the VNET|
|serviceBusSubnets|No|[]|An array of string. The values need to match the subnet names on the VNET|
|sqlServerSubnets|No|[]|An array of string. The values need to match the subnet names on the VNET|
|azureActiveDirectoryClientId|No|&nbsp;|Client AAD ID required to enable AAD for dashboard|
|azureActiveDirectoryTenantId|No|&nbsp;|Tenant AAD ID required to enable AAD for dashboard|
|isDashboardDatabaseServerless|No|0|If set to 1 the dashboard database, coditcip is deployed as serverless|
|dashboardServerlessDatabaseSize|No|21474836480|Size in bytes for Dashboard Serverless database|
|dashboardServerlessDatabaseMaxVCores|No|1|Number of max cores allowed for the Dashboard Serverless database|
|dashboardServerlessDatabaseaAutoPauseDelay|No|1440|The timeout before the database goes dormant in minutes|
|invictusDataFactoryReceiverFunctionName|No|invictus-{resourcePrefix}-datafactoryreceiver|Name for Azure Function|
|use32BitWorkerProcess |No|false|If set to true, webapps are deployed as 32bit|
|azureActiveDirectoryClientSecret|No|false|Required for AD Login|
