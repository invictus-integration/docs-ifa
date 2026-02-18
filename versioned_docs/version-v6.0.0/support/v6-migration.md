---
sidebar_label: Migrating to v6
pagination_prev: null
pagination_next: null
---

# Migrating to Invictus for Azure v6
:::warning[change of endpoints]
In v6 we uses containerized API's instead of Web API's and Azure Functions. This means that the endpoints for the Dashboard and API's such as the PubSub and Transco components changes.
:::
:::danger[removal of v1 Framework components]
The PubSub v1, Transco v1 and Matrix v1 components are not available anymore in v6.
* [Migrating PubSub v1 to v2](../framework/pubsubV2.md#migrating-pubsub-v1-to-v2)
* [Migrating Transco v1 to v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)
* [Migrating Matrix v1 to Transco v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)

:::
## Preparing Environment
<details>
<summary><h3 style={{ margin:0 }}>Create new Azure DevOps variable libraries for Invictus for Azure v6</h3></summary>

Create new/independent [Azure DevOps variable libraries](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/?view=azure-devops) to support the coexistence of both old and new versions in the same environment and to ease the migration from one to the other.

:::note[example]
If you have a library with the name `invictus.{environment}` create a new one with the name `invictus.containerized.{environment}` and change your Invictus for Azure pipelines to use the new libraries. 
:::

</details>

<details>
<summary><h3 style={{ margin:0 }}>Create an application registration in Azure Active Directory/Entra ID</h3></summary>

Go to Azure Active Directory/Entra ID and [create a new application registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for the Invictus for Azure API's. [Authentication with the Invictus for Azure API's](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad) happens via this application.

Create a new client secret for this application (and save it, as you will need it later).
</details>

## Deploying New Version
[<h3 style={{ margin:0 }}>⬇️ Download latest version of `Invictus-GetSources.ps1`</h3>](../scripts/Invictus-GetSources.ps1)

Pipeline/Bicep parameters changes, please follow the installation guides to see the current supported parameters:
* [Dashboard installation guide](../dashboard/installation/index.mdx)
* [Framework installation guide](../framework/installation/index.mdx)

:::warning[considerations]
* Pipelines now requires Ubuntu agent.
* Components are using Azure Container Apps:
  * [App Scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=container-apps-bicep): verify if our default app scaling parameters match your need.
  * [Multiple Revision mode](https://learn.microsoft.com/en-us/azure/container-apps/revisions): older revisions could clutter environment. Consider using our [revisions clean-up script](../scripts/Invictus-RemoveOldRevisions.ps1) in an Azure DevOps pipeline. 
:::

## After Deployment
* [🛡️ Give Invictus access to client's Azure Logic Apps](../dashboard/installation/03_give_la_access.md)
* [🔀 Update redirect URLs of the app registration](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri) (Azure Active Directory/Entra ID login into the Dashboard needs the new Dashboard Gateway URL.)

<details>
<summary><h3 style={{ margin: 0 }}>Update your Azure Logic Apps parameters files</h3></summary>

Make sure to update your Logic App parameters files to represent the new components.

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

The Invictus for Azure API's now requires an access token in the `Authorization` header of the HTTP request instead of a function key. Implement this on the HTTP action in your Logic App as follows:
``` json
"authentication": {
    "audience": "[parameters('invictus').authentication.audience]",
    "identity": "[parameters('infra').managedIdentity.id]",
    "type": "ManagedServiceIdentity"
}
```

In this example we are using a user assigned managed identity (of which we have specified the application ID in the `customApplicationIds` in the Invictus for Azure pipelines) and using the application id from the newly created app registration as the audience. 

:::tip
Invictus for Azure user assigned managed identity can be auto-created, but keep in mind that Logic Apps only supports a single user assigned managed identity. If you already have one in your environment make sure to keep using that one.
:::
</details>

<details>
    <summary><h3 style={{ margin:0 }}>Remove old/unused Azure resources</h3></summary>

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
  
    After migrating your Azure Logic Apps to Invictus for Azure v6, you can also remove the following resources:
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

    The v6 installation will result in many lingering role assignments named `Unknown`. You can delete them.
</details>


## Common Migration Issues
:::danger[pipeline error: `Operating system not supported`]
Your release pipeline agent must be a linux agent, for example `vmImage: 'ubuntu-latest'`
:::  

:::danger[Pipeline Error: `Invalid ContainerApp name....The length must be between 2 and 32 characters inclusive.`]
If you are overriding the default app names, the provided name might be too long, as the Azure Container App name limit is lower than for function apps.
:::
