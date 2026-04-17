---
sidebar_label: Migrate from v5.x to v6
pagination_prev: null
pagination_next: null
---

# Migrate from v5.x to Invictus v6
:::warning[change of endpoints]
Invictus v6 uses containerized API instead of Web API or Azure Functions. This means that the endpoints for the Dashboard and the Framework components changes.
:::
:::danger[removal of v1 Framework components]
Invictus v6 no longer supports the PubSub v1, Transco v1 and Matrix v1 components.
* [Migrate PubSub v1 to v2](../framework/pubsubV2.mdx#migrating-pubsub-v1-to-v2)
* [Migrate Transco v1 to v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)
* [Migrate Matrix v1 to Transco v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)
:::

## Preparing Environment
<details>
<summary><h3 style={{ margin:0 }}>Create a new Azure DevOps variable libraries for Invictus for Azure v6</h3></summary>

Create a new [Azure DevOps variable libraries](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/?view=azure-devops). This supports the coexistence of both old and new versions in the same environment. It eases the migration from one to the other.

:::note[example]
If you have a library with the name `invictus.{environment}`, create a new one with the name `invictus.containerized.{environment}`. Your pipelines should use these new libraries. 
:::

</details>

<details>
<summary><h3 style={{ margin:0 }}>Create an application registration in Microsoft Entra ID</h3></summary>

Go to Microsoft Entra ID and [create a new application registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for the Invictus API's. [Authentication with the Invictus API's](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad) happens via this application.

Also, create a new client secret for this application (you will need it later).
</details>

## Deploying New Version
[<h3 style={{ margin:0 }}>⬇️ Download latest version of `Invictus-GetSources.ps1`</h3>](../scripts/Invictus-GetSources.ps1)

Pipeline/Bicep parameters changes. Please follow the installation guides to see the current supported parameters:
* [Dashboard installation guide](../dashboard/installation/index.mdx)
* [Framework installation guide](../framework/installation/index.mdx)

:::warning[considerations]
* Pipelines now requires Ubuntu agent.
* Components now use Azure Container Apps:
  * [App Scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=container-apps-bicep): verify if our default app scaling parameters match your need.
  * [Multiple Revision mode](https://learn.microsoft.com/en-us/azure/container-apps/revisions): older revisions could clutter the environment. Consider using our [revisions clean-up script](../scripts/Invictus-RemoveOldRevisions.ps1). 
:::

## After Deployment
* [🛡️ Give Invictus access to the client's Azure Logic Apps](../dashboard/installation/03_give_la_access.md)
* [🔀 Update redirect URLs of the app registration](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri). Signing in via Microsoft Entra ID requires the new Dashboard Gateway URL.

:::danger[Import before September 2026]
If you're running a version below v6, ensure your [Azure Service Bus connection string includes `TransportType=AMQP;`](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-dotnet#configure-connection-string-to-use-amqp-10). This affects the following running apps/components:
* PubSub
:::

<details>
<summary><h3 style={{ margin: 0 }}>Update your Azure Logic Apps parameters files</h3></summary>

```diff
"invictus": {
    "value": {
        "monitoring": {
            "eventHub": {
                "name": "#{Invictus.Monitoring.EventHub.Name}#",
                "accessRuleId": "#{Invictus.Monitoring.EventHub.AccessRuleId}#"
            }
        },
        "framework": {
            "pubSub": {
-               "v1": {
-                   "definitionUrl": "#{Invictus.Framework.PubSub.V1.DefinitionUrl}#",
-                   "publishUrl": "#{Invictus.Framework.PubSub.V1.PublishUrl}#",
-                   "subscribeUrl": "#{Invictus.Framework.PubSub.V1.SubscribeUrl}#",
-                   "acknowledgeUrl": "#{Invictus.Framework.PubSub.V1.AcknowledgeUrl}#"
-                }
+               "v2": {
+                   "publishUrl": "#{Invictus.Framework.PubSub.V2.Publish.Url}#",
+                   "subscribeUrl": "#{Invictus.Framework.PubSub.V2.Subscribe.Url}#",
+                   "acknowledgeUrl": "#{Invictus.Framework.PubSub.V2.Acknowledge.Url}#"
+			    }   
            },
-           "matrix": {
-               "v1": {
-                   "definitionUrl": "#{Invictus.Framework.Matrix.V1.DefinitionUrl}#",
-                   "matrixUrl": "#{Invictus.Framework.Matrix.V1.MatrixUrl}#",
-                   "basicMatrixUrl": "#{Invictus.Framework.Matrix.V1.BasicMatrixUrl}#"
-               }
-           },
            "transco": {
-               "v1": {
-                   "definitionUrl": "#{Invictus.Framework.Transco.V1.DefinitionUrl}#",
-                   "transcoUrl": "#{Invictus.Framework.Transco.V1.TranscoUrl}#"
-               }
+               "v2": {
+                   "transcoJsonUrl": "#{Invictus.Framework.Transco.V2.TranscoJson.Url}#",
+                   "transcoXmlUrl": "#{Invictus.Framework.Transco.V2.TranscoXml.Url}#",
+                   "basicMatrixUrl": "#{Invictus.Framework.Transco.V2.MatrixBasicPromote.Url}#"
+			    }
            }
        },
+       "authentication": {
+   		"audience": "api://#{Invictus.Containers.Client.Id}#"
+	    }
    }
}
```
</details>


<details>
<summary><h3 style={{ margin:0 }}>Update your Azure Logic Apps Invictus API authentication</h3></summary>

The Invictus API's now requires an access token in the HTTP `Authorization` header instead of a function key. Add this on the HTTP action in your Logic App:
``` json
"authentication": {
    "audience": "[parameters('invictus').authentication.audience]",
    "identity": "[parameters('infra').managedIdentity.id]",
    "type": "ManagedServiceIdentity"
}
```

This example uses a user assigned managed identity. It uses the application ID from the newly created app registration as the audience.

:::warning[don't forget]
Include the application ID in the `customApplicationIds` Bicep parameter. 
:::
:::tip
Invictus can auto-create its user assigned managed identity. Keep in mind that Logic Apps only supports a single user assigned managed identity. If you already have one in your environment, keep using that one.
:::
</details>

<details>
<summary><h3 style={{ margin:0 }}>Remove outdated Azure resources</h3></summary>

* `invictus-{prefix}-dashboard`
* `invictus-{prefix}-dashboardgateway`
* `invictus-{prefix}-cacheimportjob`
* `invictus-{prefix}-database-storeimportjob`
* `invictus-{prefix}-datafactoryreceiver`
* `invictus-{prefix}-flowhandlerjob`
* `invictus-{prefix}-invictusimportjob`
* `invictus-{prefix}-storeimportjob`
* `invictus-{prefix}-appplan-linux`
* `invictus-{prefix}-importjobappins`

After migrating your Azure Logic Apps to Invictus v6, remove the following resources:
* `invictus-{prefix}-matrixapp`
* `invictus-{prefix}-pubsubapp`
* `invictus-{prefix}-transcoapp`
* `invictus-{prefix}-exceptionhandler`
* `invictus-{prefix}-genericreceiver`
* `invictus-{prefix}-httpreceiver`
* `invictus-{prefix}-pubsub-v2`
* `invictus-{prefix}-timesequencer`
* `invictus-{prefix}-regextranslator`
* `invictus-{prefix}-sequencecontroller`
* `invictus-{prefix}-transco-v2`
* `invictus-{prefix}-xmljsonconverter`
* `invictus-{prefix}-xsdvalidator`
* `invictus-{prefix}-appplan`
* `invictus-{prefix}-consumptionplan`
</details>

<details>
<summary><h3 style={{ margin:0 }}>Remove lingering role assignments</h3></summary>

The v6 installation results in lingering `Unknown` role assignments. You can delete them.
</details>


## Common Migration Issues
:::danger[pipeline error: `Operating system not supported`]
You should use a linux agent in your release pipeline, for example `vmImage: 'ubuntu-latest'`
:::  

{/* vale write-good.E-Prime = NO */}
:::danger[Pipeline Error: `Invalid ContainerApp name....The length must be between 2 and 32 characters inclusive.`]
{/* vale write-good.E-Prime = YES */}
If you override the default app names, you've might have made it too long. Azure Container Apps has a name limit lower than for Function Apps.
:::
