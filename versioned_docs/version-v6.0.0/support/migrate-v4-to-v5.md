---
sidebar_label: Migrate from v5.x to v6
pagination_prev: null
pagination_next: null
---

# Migrate from v4.x to Invictus v5

## Preparing environment
* ➖ Remove existing role assignments to Azure Functions. The Bicep deployments now assigns these (normally only *Monitoring Contributor* on the Flow Handler).

## Deploying new version
* ➡️ Update to `-StorageContainerName dashboard-v2` in the `Invictus-GetSources.ps1` script.
* ➡️ Use `azurePowerShellVersion: LatestVersion` and `pwsh: false` when running the `Deploy.ps1` script.
* ➡️ Update `-devOpsObjectId` parameter to **Enterprise Application** Object ID of the DevOps service connection when running the `Deploy.ps1` script.
* ❌ Remove possible Azure Key Vault task retrieving access policies, now done automatically by passing `-keyVaultName <name>` to `Deploy.ps1` script.

### Migrate SQL to Cosmos DB
Invictus v5 can migrate your current Dashboard structure stored in SQL to the new Cosmos DB storage system. Consider following parameters in the `Deploy.ps1` script:
* ➕ Add `-PerformSqlDataMigration 1` parameter to activate the migration.
* ➕ Add `-sqlToMigrateServerName <name>` parameter to target the SQL server to migrate (defaults to `invictus-{ResourcePrefix}-sqlsvr`).
* ➕ Add `-sqlToMigrateDBName <name>` parameter to target the SQL database to migrate (defaults to `coditcip`).
* ➕ Add `-sqlToMigrateUserName <name>` parameter for the SQL credentials (defaults to `InvictusFrameworkAdmin`).
* ➕ Add `invictussqlserverpassword` as an Azure Key Vault secret in the accompanied vault.

When complete, you can sign in to the new Invictus Dashboard with the same credentials as before.

:::warning[trust but verify]
The deployment will validate the result data in Azure Cosmos DB against the original SQL data. Manually verify this migrated data. 
Once satisfied with the migrated data, change the `-PerformSqlDataMigration 1` script parameter to `0`. This skips the migration process from future deployments.
:::

### New Dashboard endpoint
The deployment creates a new Dashboard Azure App Service with the `-v2` prefix (ex: `invictus-dev-invictusdashboard-v2`). This means a new endpoint. If you want to keep the original URL endpoint:
* ❌ Delete the old Dashboard App Service (without the prefix) from the resource group.
* ➕ Add `-invictusDashboardWebAppName <name>` parameter to the `Deploy.ps1` script to control the App Service's name.

:::warning[Losing historic data]
By doing this you will lose access to the old Dashboard and the ability to view and query its historic data.
:::

## After deployment
* ➕ Same as the Flow Handler, the Dashboard Gateway App Service now needs [Logic App Contribute access](../dashboard/installation/03_give_la_access.md).
* ➕ (if applicable) Update your app registration with the new [Microsoft Entra ID setup guide](../dashboard/installation/01_give_ad_access.mdx).
* ➡️ Use updated [`Invictus-ConfigureDashboard.ps1`](https://github.com/Codit/integration-practice/blob/main/src/invictus/scripts/Invictus-ConfigureDashboard-v2.ps1) script to deploy flows and other Dashboard runtime configurations.

:::danger[Import before September 2026]
If you're running a version below v6, ensure your [Azure Service Bus connection string includes `TransportType=AMQP;`](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-dotnet#configure-connection-string-to-use-amqp-10).This affects the following running apps/components:
* PubSub
:::

### Common migrating issues
{/* vale write-good.TooWordy = NO */}
:::danger[You cannot change the OS hosting your app at this time. Please recreate your app with the desired OS]
{/* vale write-good.TooWordy = YES */}
If you pass the `servicePlanName` or `autoscaleForPlanName` (or both) parameters to the Dashboard release pipeline, update these by adding `-linux` to the end of their values (feel free to maintain your own naming conventions). *This change is required for the Dashboard pipeline only*.
:::

:::danger[The role assignment already exists]
If you have role assignments conflicts during deployment, remove all role assignments defined at the Invictus resource group level.
:::