---
sidebar_label: Migrating to v6
---

# Migrating to Invictus v6
This document will guide you through the process of migrating to version 6 of Invictus for Azure.

## Preparing Your Environment
In version 6 we are using containerized API's instead of Web API's and Azure Functions, this means that the endpoints for the Invictus for Azure Dashboard and API's such as the PubSub and Transco components will change.

Furthermore, the PubSub v1, Transco v1 and Matrix v1 components have been deprecated and will not be available in version 6 anymore.

To prepare your environment for the migration, follow these steps.

<details>
<summary><h3 style={{ margin:0 }}>Set up new Azure Devops libraries for Invictus for Azure version 6</h3></summary>

This is necessary to ensure that both the new and old versions of Invictus for Azure can coexist in the same environment.

For example, if you have a library with the name `invictus.{environment}` create a new one with the name `invictus.containerized.{environment}` and change your Invictus for Azure pipelines to use the new libraries. 

This approach makes sure that your current interfaces can still use the old version of Invictus for Azure during the migration, while new and migrated interfaces can use version 6.

Once all interfaces have been migrated you can rename the libraries back to `invictus.{environment}` and change the pipelines accordingly.
</details>

<details>
<summary><h3 style={{ margin:0 }}>Identify all the locations where the PubSub v1, Transco v1 and Matrix v1 components are used</h3></summary>

Create a list of locations where the PubSub v1, Transco v1 and Matrix v1 components are used in your interfaces. This will help you to identify which interfaces need to be migrated.
</details>

<details>
<summary><h3 style={{ margin:0 }}>Create an Application Registration in Active Directory</h3></summary>

Go to Active Directory and create a new application registration for the Invictus for Azure API's. This application registration will be used to authenticate calls to the Invictus for Azure API's.

> 🔗 A detailed description for this can be found [here](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad). 

Create a client secret and make sure to save the application id and client secret as you will need them later.
</details>

## Deploying version 6 of Invictus for Azure

<details>
<summary><h3 style={{ margin:0 }}>Update Invictus-GetSources.ps1</h3></summary>

Update the [`Invictus-GetSources.ps1`](../scripts/Invictus-GetSources.ps1) file with the latest version.
</details>

<details>
<summary><h3 style={{ margin: 0}}>Update Your Invictus for Azure Pipelines</h3></summary>

The Azure build and release pipelines have been overhauled and you will need to update your pipelines to match these changes. 

The changes include:
- Updated pipeline parameters
- Updated script parameters
- Different pipeline tasks
- Release pipeline agent must be Ubuntu

The newly updated pipelines and template can be found here in the [Dashboard installation guide](../dashboard/installation/index.mdx) and [Framework installation guide](../framework/installation/index.mdx).

</details>

<details>
<summary><h3 style={{ margin: 0 }}>Deploy Invictus for Azure v6</h3></summary>

Now comes the time to deploy Invictus for Azure v6. Run your Invictus for Azure pipelines 🚀

After deployment the following components can be removed:
- `invictus-{prefix}-dashboard`
- `invictus-{prefix}-dashboardgateway`
- `invictus-{prefix}-cacheimportjob`
- `invictus-{prefix}-database-storeimportjob`
- `invictus-{prefix}-datafactoryreceiver`
- `invictus-{prefix}-flowhandlerjob`
- `invictus-{prefix}-invictusimportjob`
- `invictus-{prefix}-storeimportjob`
- `invictus-{prefix}-appplan-linux`
- `invictus-{prefix}-importjobappins`

:::warning
Only after migrating all of your interfaces to version 6 of Invictus for Azure you can remove the following components:
- `invictus-{prefix}-matrixapp`
- `invictus-{prefix}-pubsubapp`
- `invictus-{prefix}-transcoapp`
- `invictus-{prefix}-exceptionhandler`
- `invictus-{prefix}-genericreceiver`
- `invictus-{prefix}-httpreceiver`
- `invictus-{prefix}-pubsub-v2`
- `invictus-{prefix}-timesequencer`
- `invictus-{prefix}-regextranslator`
- `invictus-{prefix}-sequencecontroller`
- `invictus-{prefix}-transco-v2`
- `invictus-{prefix}-xmljsonconverter`
- `invictus-{prefix}-xsdvalidator`
- `invictus-{prefix}-appplan`
- `invictus-{prefix}-consumptionplan`

If you are not using certain components you can remove these already since no migration is necessary.
:::
</details>

### Additional steps
- Assign the role assignments as shown in this [guide](../dashboard/installation/03_give_la_access.md) for the new DashboardGateway and FlowHandler Container Apps.
- Update the AD app registration redirect URLs used for the AD login with the URL of the new dashboard. This is done from the `Authentication` page of your app registration.
- Review the Container App scaling requirements for your scenario. See the [Dashboard installation](../dashboard/installation/index.mdx#bicep-template-parameters) and [Framework installation](../framework/installation/index.mdx#bicep-template-parameters) for more information.
- Role assignment clean-up: The deployment of Invictus v6.0 will result in many lingering role assignments named `Unknown`. These can be deleted.

## Migrating Your Interfaces

<details>
<summary><h3 style={{ margin: 0 }}>Update Logic Apps Parameters Files</h3></summary>

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
<summary><h3 style={{ margin:0 }}>Invictus API Authentication</h3></summary>

The Invictus for Azure API's now require an access token to be passed in the Authorization header of the request instead of a function key. This can be implemented on the HTTP action in your Logic App as follows:
``` json
"authentication": {
    "audience": "[parameters('invictus').authentication.audience]",
    "identity": "[parameters('infra').managedIdentity.id]",
    "type": "ManagedServiceIdentity"
}
```

In this example we are using a user assigned managed identity (of which we have specified the application id in the `customApplicationIds` in the Invictus for Azure pipelines) and using the application id from the newly created App Registration as the audience. 

:::tip
It is also possible to use the auto created Invictus for Azure user assigned managed identity, but keep in mind that Logic Apps only supports a single user assigned managed identity so if you already have one in your environment make sure to keep using that one.
:::
</details>

### Deprecated Components
We need to replace the following components with the new containerized API's. 

* [Migrating PubSub v1 to v2](../framework/pubsubV2.md#migrating-pubsub-v1-to-v2)
* [Migrating Transco v1 to v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)
* [Migrating Matrix v1 to Transco v2](../framework/transcoV2.mdx#migrating-transco-v1-to-v2)

## Common Migration Issues
:::danger[pipeline error: `Operating system not supported`]
Your release pipeline agent must be a linux agent, for example `vmImage: 'ubuntu-latest'`
:::  

:::danger[Pipeline Error: `Invalid ContainerApp name....The length must be between 2 and 32 characters inclusive.`]
If you are overriding the default app names, the provided name might be too long, as the Container App name limit is lower than for function apps.
:::
