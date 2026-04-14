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

### Common migrating issues
{/* vale write-good.TooWordy = NO */}
:::danger[You cannot change the OS hosting your app at this time. Please recreate your app with the desired OS]
{/* vale write-good.TooWordy = YES */}
If you pass the `servicePlanName` or `autoscaleForPlanName` (or both) parameters to the Dashboard release pipeline, update these by adding `-linux` to the end of their values (feel free to maintain your own naming conventions). *This change is required for the Dashboard pipeline only*.
:::

:::danger[The role assignment already exists]
If you have role assignments conflicts during deployment, remove all role assignments defined at the Invictus resource group level.
:::

### Framework component migrations
Some Framework components need special attention when upgrading to v5.

<details>
<summary><h4 id="migrating-pubsub-v1-to-v2">**Migrate PubSub to v5.**</h4></summary>

Migrating to v5 includes changes in the authentication, endpoint and removal the metadata links.

> 👉 *The `/api/Subscribe` endpoint also needs to use a `POST` instead of a `GET` HTTP method.*

<details>
<summary>**Publish message example**</summary>

```diff
{
    "PublishMessage": {
        "type": "Http",
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
            "method": "post",
-           "uri": "[parameters('invictus').framework.pubSub.v1.publishUrl]",
+           "uri": "[parameters('invictus').framework.pubSub.v2.publishUrl]",
            "body": {
                "Content": "@{decodeBase64(body('Extract_Message_Context')['Content'])}",
                "Context": "@body('Extract_Message_Context')?['Context']"
            },
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "runAfter": {
            "Extract_Message_Context": [
                "Succeeded"
            ]
        }
    }
}
```
</details>

<details>
<summary>**Subscribe message example**</summary>

```diff
{
    "SubscribeMessage": {
        "type": "Http"
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
-           "method": "get",
+           "method": "post",
            "queries": {
                "deleteOnReceive": false,
                "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
                "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
            },
-           "uri": "[parameters('invictus').framework.pubSub.v1.subscribeUrl]"
+           "uri": "[parameters('invictus').framework.pubSub.v2.subscribeUrl]"
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "recurrence": {
            "frequency": "Second",
            "interval": 1
        },
        "splitOn": "@triggerBody()",
        "splitOnConfiguration": {
            "correlation": {
                "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
            }
        }
    }
}
```
</details>

<details>
<summary>**Acknowledge message example**</summary>

```diff
{
    "AcknowledgeMessage": {
        "type": "Http",
        "inputs": {
            "authentication": {
-               "password": "@parameters('invictusPassword')",
-               "type": "Basic",
-               "username": "Invictus"
+               "audience": "[parameters('invictus').authentication.audience]",
+               "identity": "[parameters('infra').managedIdentity.id]",
+               "type": "ManagedServiceIdentity"
            },
            "body": {
                "AcknowledgementType": "Complete",
                "IgnoreNotFoundException": true,
                "Subscription": "@triggerBody()?['subscription']",
+               "SequenceNumber": "@triggerBody()?['sequenceNumber']"
-               "LockToken": "@triggerBody()?['LockToken']",
-               "MessageReadTime": "@trigger()['startTime']"
            },
            "method": "post",
-           "uri": "[parameters('invictus').framework.pubSub.v1.acknowledgeUrl]"
+           "uri": "[parameters('invictus').framework.pubSub.v2.acknowledgeUrl]"
        },
-       "metadata": {
-           "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
-           "swaggerSource": "custom"
-       },
        "runAfter": {}
    }
}
```
</details>
</details>

<details>
<summary><h4 id="migrate-transco" style={{ margin:0 }}>Migrating Transco to v5</h4></summary>

The following things change:
* Authentication,
* Endpoints,
* Metadata links.

:::info[migrate Transco configuration files]
Use the [migration tool from Codit's Integration Practice](https://github.com/Codit/integration-practice/tree/main/src/Tools/Invictus/Transco-Matrix-Migration#invictus-Transco--matrix-migration-tools) to migrate your existing Transco configuration files to the new format.
:::

```diff
"Transform_XML": {
  "type": "Http",
  "inputs": {
    "method": "POST",
-   "uri": "[parameters('invictus').Framework.Transco.v1.TranscoXmlUrl]",
+   "uri": "[parameters('invictus').Framework.Transco.v2.TranscoXmlUrl]",
    "authentication": {
-     "username": "Invictus",
-     "password": "@parameters('invictusPassword')",
-     "type": "Basic",
+     "identity": "[parameters('infra').managedIdentity.id]",
+     "audience": "[parameters('invictus').authentication.audience]",
+     "type": "ManagedServiceIdentity"
    },
    "body": {
      "Content": "@triggerBody()?['Content']",
      "Context": "",
      "TranscoConfig": "EFACT_D96A_ORDERS-to-Generic_Order.json"
    }
  },
  "runAfter": {}
}
```
</details>

<details>
<summary><h4 id="migrate-matrix" style={{ margin:0 }}>Migrating Matrix to Transco v5</h4></summary>

The new Transco now embeds the Matrix functionality, only authentication and endpoints requires changing.

```diff
"Extract_Message_Context": {
  "type": "Http",
  "inputs": {
    "method": "POST",
-   "uri": "[parameters('invictus').framework.matrix.v1.basicMatrixUrl]",
+   "uri": "[parameters('invictus').framework.Transco.v2.basicMatrixUrl]",
    "body": {
      "Domain": "B2B-Gateway",
      "Service": "@{concat('AS2-Receive-', body('Decode_AS2_message')?.aS2Message?.aS2To)}",
      "Action": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PayloadFormat}",
      "Version": "1.0",
      "Sender": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PartyName}",
      "Content": "@{base64(body('Decode_AS2_message')?.AS2Message?.Content)}",
      "KeyValueCollection": {
        "ReceiveFileName": "@{body('Decode_AS2_message')?['AS2Message']?['FileName']}",
        "ReceiveProtocol": "AS2",
        "ReceiveProtocolDetails": "@{body('Decode_AS2_message')?['AS2Message']?['AS2From']} > @{body('Decode_AS2_message')?['AS2Message']?['AS2To']}",
        "ReceiveReference": "@{body('Decode_AS2_message')?['AS2Message']?['OriginalMessageId']}",
        "ReceiveTimeUtc": "@{utcNow()}"
      }
	},
	"authentication": {
-     "username": "Invictus",
-     "password": "@parameters('invictusPassword')"
-     "type": "Basic",
+     "identity": "[parameters('infra').managedIdentity.id]",
+     "audience": "[parameters('invictus').authentication.audience]",     
+     "type": "ManagedServiceIdentity"
	}
  },
  "runAfter": {},
- "metadata": {
-   "apiDefinitionUrl": "[parameters('invictus').framework.matrix.v1.definitionUrl]",
-   "swaggerSource": "custom"
- }
}
```
</details>