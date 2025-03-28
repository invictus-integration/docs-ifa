﻿# v6 Migration Guide

This document will guide you through the process of migrating to version 6 of Invictus for Azure.

## Preparing Your Environment

In version 6 we are using containerized API's instead of Web API's and Azure Functions, this means that the endpoints for the Invictus for Azure Dashboard and API's such as the PubSub and Transco components will change.

Furthermore, the PubSub v1, Transco v1 and Matrix v1 components have been deprecated and will not be available in version 6 anymore.

To prepare your environment for the migration, follow these steps.

### Set up new Azure Devops libraries for Invictus for Azure version 6

This is necessary to ensure that both the new and old versions of Invictus for Azure can coexist in the same environment.

For example, if you have a library with the name `invictus.{environment}` create a new one with the name `invictus.containerized.{environment}` and change your Invictus for Azure pipelines to use the new libraries. 

This approach makes sure that your current interfaces can still use the old version of Invictus for Azure during the migration, while new and migrated interfaces can use version 6.

Once all interfaces have been migrated you can rename the libraries back to `invictus.{environment}` and change the pipelines accordingly.

### Identify all the locations where the PubSub v1, Transco v1 and Matrix v1 components are used

Create a list of locations where the PubSub v1, Transco v1 and Matrix v1 components are used in your interfaces. This will help you to identify which interfaces need to be migrated.

### Create an Application Registration in Entra ID

Go to Entra ID and create a new application registration for the Invictus for Azure API's. This application registration will be used to authenticate calls to the Invictus for Azure API's. 👉🏼 A detailed description for this can be found [here](https://github.com/invictus-integration/docs-ifa/blob/containerization/dashboard/containerAuthentication.md). 

Create a client secret and make sure to save the application id and client secret as you will need them later.

## Deploying version 6 of Invictus for Azure

### Update Invictus-GetSources.ps1

Update the `Invictus-GetSources.ps1` file with the latest version.

### Update Your Invictus for Azure Pipelines

Update your Invictus for Azure pipelines as follows:
* Remove the following parameters (if present)
  * `servicePlanSkuName`
  * `servicePlanName`
  * `consumptionPlanName`
  * `transcoWebAppName`
  * `pubSubWebAppAlwaysOn`
  * `matrixWebAppAlwaysOn`
  * `transcoWebAppAlwaysOn`

* Add the following parameters
  * `acrPath` - this should be set to `invictusreleases.azurecr.io`
  * `acrUsername` - contact Codit Products for the username
  * `acrPassword` - contact Codit Products for the password
  * `identityProviderApplicationId` - this should contain the application id of the app registration created in Entra ID [here](#Create-an-Application-Registration-in-Entra-ID), it will be used as an allowed audience on the Invictus for Azure API's
  * `identityProviderClientSecret` - this should contain the client secret of the app registration created in Entra ID [here](#Create-an-Application-Registration-in-Entra-ID)
  * `containerAppsEnvironmentLocation` - typically this should be set to `West Europe` or `North Europe`
  * `customApplicationIds` - here you can optionally specify a list of application id's that are allowed to call the Invictus for Azure API's, for example the application id of a managed identity used by your Logic Apps

### Deploy Invictus for Azure v6

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

⚠️ Only after migrating all of your interfaces to version 6 of Invictus for Azure you can remove the following components:
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

Ofcourse, if you are not using certain components you can remove these already since no migration is necessary.

### Additional steps
- Assign the role assignments as shown in this [guide](../dashboard/accesscontrolrights.md) for the new DashboardGateway and FlowHandler container apps.
- Update the AD app registration redirect URLs used for the AD login with the URL of the new dashboard. This is done from the `Authentication` page of your app registration.

## Migrating Your Interfaces

### Update Devops Library References

Make sure that your Devops pipelines are using the new libraries that you created in [this](#Set-up-new-Azure-Devops-libraries-for-Invictus-for-Azure-version-6) section.

### Update Parameters Files

Make sure to update your Logic App parameters files to represent the new components.

Old parameters file example:
``` json
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
                "v1": {
                    "definitionUrl": "#{Invictus.Framework.PubSub.V1.DefinitionUrl}#",
                    "publishUrl": "#{Invictus.Framework.PubSub.V1.PublishUrl}#",
                    "subscribeUrl": "#{Invictus.Framework.PubSub.V1.SubscribeUrl}#",
                    "acknowledgeUrl": "#{Invictus.Framework.PubSub.V1.AcknowledgeUrl}#"
                }
            },
            "matrix": {
                "v1": {
                    "definitionUrl": "#{Invictus.Framework.Matrix.V1.DefinitionUrl}#",
                    "matrixUrl": "#{Invictus.Framework.Matrix.V1.MatrixUrl}#",
                    "basicMatrixUrl": "#{Invictus.Framework.Matrix.V1.BasicMatrixUrl}#"
                }
            },
            "transco": {
                "v1": {
                    "definitionUrl": "#{Invictus.Framework.Transco.V1.DefinitionUrl}#",
                    "transcoUrl": "#{Invictus.Framework.Transco.V1.TranscoUrl}#"
                }
            }
        }
    }
}
```

New parameters file example:
``` json
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
				"v2": {
					"publishUrl": "#{Invictus.Framework.PubSub.V2.Publish.Url}#",
					"subscribeUrl": "#{Invictus.Framework.PubSub.V2.Subscribe.Url}#",
					"acknowledgeUrl": "#{Invictus.Framework.PubSub.V2.Acknowledge.Url}#"
				}
			},
			"transco": {
				"v2": {
					"transcoJsonUrl": "#{Invictus.Framework.Transco.V2.TranscoJson.Url}#",
					"transcoXmlUrl": "#{Invictus.Framework.Transco.V2.TranscoXml.Url}#",
					"basicMatrixUrl": "#{Invictus.Framework.Transco.V2.MatrixBasicPromote.Url}#"
				}
			}
		},
		"authentication": {
			"audience": "api://#{Invictus.Containers.Client.Id}#"
		}
	}
}
```


### Invictus API Authentication

The Invictus for Azure API's now require an access token to be passed in the Authorization header of the request instead of a function key. This can be implemented on the HTTP action in your Logic App as follows:
``` json
"authentication": {
    "audience": "[parameters('invictus').authentication.audience]",
    "identity": "[parameters('infra').managedIdentity.id]",
    "type": "ManagedServiceIdentity"
}
```

In this example we are using a user assigned managed identity (of which we have specified the application id in the `customApplicationIds` in the Invictus for Azure pipelines) and using the application id from the [newly created App Registration](#Create-an-Application-Registration-in-Entra-ID) as the audience. 

💡 It is also possible to use the auto created Invictus for Azure user assigned managed identity, but keep in mind that Logic Apps only supports a single user assigned managed identity so if you already have one in your environment make sure to keep using that one.

### Deprecated Components

We need to replace the PubSub v1, Transco v1 and Matrix v1 components with the new containerized API's. 

#### Migrating PubSub v1 to v2

See the documentation [here](../framework/components/pubsubV2.md#Migrating-PubSub-v1-to-v2).

#### Migrating Transco v1 to v2

See the documentation [here](../framework/components/transcoV2.md#Migrating-Transco-v1-to-v2).

#### Migrating Matrix v1 to Transco v2

See the documentation [here](../framework/components/transcoV2.md#Migrating-Matrix-v1-to-Transco-v2).
