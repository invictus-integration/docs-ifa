---
sidebar_class_name: hidden
---

# Invictus Dashboard V2 Migration Guide

Below is some useful information for when users are upgrading their Invictus installation from V1 to V2. To update your build and release pipelines, please refer to the [build pipeline](dashboard-buildpipeline.md) and [release pipeline](dashboard-releasepipeline.mdx) guides.

## Build pipeline
The Azure Blob Storage container for Dashboard V2 is `dashboard-v2`, so update the `StorageContainerName` parameter you use in the build pipeline.

## Release pipeline
Make sure that the PowerShell script in the release pipeline which runs Deploy.ps1 has the following parameters:
```
    azurePowerShellVersion: LatestVersion
    pwsh: false
```

## Object ID Update

When upgrading to Invictus V2, the `devOpsObjectId` parameter which is passed to the release pipeline should be updated. This must be changed to the **Enterprise Application** Object ID of the service principal thats connected to the DevOps service connection (not of the App Registration). This change is required for both Dashboard and Framework pipelines.

## Remove Existing Role Assignments

Invictus V2 includes functionality to automatically deploy role assignments which were previously set manually. However, if these role assignments are already present, they will cause a conflict. In your Invictus resource group, remove any roles which are assigned to the Azure functions. Typically, this is just 1 role assignment: 

- "Monitoring Contributor" rights for the FlowHandlerJob function for the Invictus resource group.

## Azure AD Setup

If your Invictus installation integrates with Azure AD, please follow the [Azure AD setup guide](./01_give_ad_access.md) to update your app registration, or set up a new one with the appropriate settings required for Invictus V2.

## SQL Data Migration

Invictus V2 includes functionality to migrate the SQL data from your previous installation into the Cosmos DB of the new version. Data relating to users, groups and the folder and flow structure will be migrated. Flow data will **not** be migrated.

### Data Migration Release Pipeline Changes

The data migration process forms part of the release pipeline. Please refer to [release pipeline](dashboard-releasepipeline.mdx) for more information. The deploy script parameter `PerformSqlDataMigration` must be set to `1`. The deploy script also accepts a few optional parameters to be able to connect to your SQL database:

- -sqlToMigrateServerName : Server name hosting the SQL DB you wish to migrate. Defaults to `invictus-{ResourcePrefix}-sqlsvr`
- -sqlToMigrateDBName : Name of the SQL DB you wish to migrate. Defaults to `coditcip`
- -sqlToMigrateUserName : The login username used to connect to the SQL Server. Defaults to `InvictusFrameworkAdmin`

In addition to these values, the SQL server password **must** be stored as a secret in your Invictus Azure Key Vault with the name `invictussqlserverpassword`.

Thats it! The data migration will now run as part of your release pipeline. The resultant data in Cosmos DB will be validated against the original SQL data, with the validation results printed in the release logs. However it is still important to manually verify the migrated data. When complete, you will be able to login to the new Invictus V2 Dashboard with the same credentials as before.

Once you are satisfied with the migrated data, it is advised to change the `PerformSqlDataMigration` script parameter to `0` so that the migration process is entirely skipped in subsequent releases.

## Dashboard URL
The Invictus V2 release pipeline will create a new App Service Dashboard resource with a -v2 suffix e.g invictus-dev-invictusdashboard-v2. This means that the URL of this resource will be used to access the new Dashboard. If instead you wish to maintain your current URLs for the Dashboard, the old Dashboard App Service resource must be deleted from your resource group. Then, pass `invictusDashboardWebAppName` as a parameter to the release script, passing the name of the app service as a value.

**NOTE: By doing this you will lose access to the old Dashboard and the ability to view and query its historic data.**

## Add Role Assignments

In addition to the flowhandlerjob function, in V2 also the dashboardgateway must have Logic App Contribute access on the resource group or subscription which contains the Logic Apps.
See also [Access Control Rights](../accesscontrolrights.md)

## Common Issues When Migrating
- `You cannot change the OS hosting your app at this time. Please recreate your app with the desired OS.`

  If you are passing the `servicePlanName` or `autoscaleForPlanName` (or both) parameters to the Dashboard release pipeline, these must be updated by adding `-linux` to the end of their values (feel free to maintain your own naming conventions). *This change is required for the Dashboard pipeline only*.

- `The role assignment already exists`

  If you have role assignments conflicts during deployment, you might have multiple role assignments defined at the Invictus resource group. This case, remove all role assignments defined at the Invictus resource group level.
 
## Invictus Configure Dashboard Script Update
If you are using the PowerShell script Invictus-ConfigureDashboard.ps1 to deploy flows, etc, you must replace this script with the V2 version.
This version can be found [here](https://github.com/Codit/integration-practice/blob/main/src/invictus/scripts/Invictus-ConfigureDashboard-v2.ps1)
