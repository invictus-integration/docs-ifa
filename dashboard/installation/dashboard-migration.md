[home](../../README.md) | [dashboard](../dashboard.md) | [dashboard installation](dashboard-installation.md)

# Invictus Dashboard Data Migration Guide

Invictus V2 includes functionality to migrate the SQL data from your previous installation into the Cosmos DB of the new version. Data relating to users, groups and the folder and flow structure will be migrated. Flow data will **not** be migrated.

## Release Pipeline Changes

The data migration process forms part of the release pipeline. Please refer to [release pipeline](dashboard-releasepipeline.md) for more information. The deploy script parameter `PerformSqlDataMigration` must be set to `1`. The deploy script also accepts a few optional parameters to be able to connect to your SQL database:

- -sqlToMigrateServerName : Server name hosting the SQL DB you wish to migrate. Defaults to `invictus-{ResourcePrefix}-sqlsvr`
- -sqlToMigrateDBName : Name of the SQL DB you wish to migrate. Defaults to `coditcip`
- -sqlToMigrateUserName : The login username used to connect to the SQL Server. Defaults to `InvictusFrameworkAdmin`

In addition to these values, the SQL server password **must** be stored as a secret in your Invictus Azure Key Vault with the name `invictussqlserverpassword`. **You will also need to assign the role `Key Vault Secrets User` to your AzureDevops pipeline service principal for the same Key Vault.**

Thats it! The data migration will now run as part of your release pipeline. The resultant data in Cosmos DB will be validated against the original SQL data, with the validation results printed in the release logs. However it is still important to manually verify the migrated data. When complete, you will be able to login to the new Invictus V2 Dashboard with the same credentials as before.

Once you are satisfied with the migrated data, it is advised to change the `PerformSqlDataMigration` script paramter to `0` so that the migration process is entirely skipped in subsequent releases.

## Dashboard URL
The Invictus V2 release pipeline will create a new App Service dashboard resource with a -v2 suffix e.g invictus-dev-invictusdashboard-v2. This means that the URL of this resource will be used to access the new dashboard. If instead you wish to maintain your current URLs for the dashboard, the old dashboard App Service resource must be deleted from your resource group. Then, pass `invictusDashboardWebAppName` as a parameter to the release script, passing the name of the app service as a value.


