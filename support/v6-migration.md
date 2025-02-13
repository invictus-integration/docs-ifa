# v6 Migration Guide

This document will guide you through the process of migrating to version 6 of Invictus for Azure.

## Preparing Your Environment

In version 6 we are using containerized API's instead of Web API's and Azure Functions, this means that the endpoints for the Invictus for Azure API's such as the PubSub and Transco components will change.

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

Go to Entra ID and create a new application registration for the Invictus for Azure API's. This application registration will be used to authenticate calls to the Invictus for Azure API's. 

Create a client secret and make sure to save the application id and client secret as you will need them later.

## Deploying version 6 of Invictus for Azure

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

## Migrating Your Interfaces

## Update Devops Library References

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

### Deprecated Components

We need to replace the PubSub v1, Transco v1 and Matrix v1 components with the new containerized API's. 

#### Migrating PubSub v1 to v2

Basically all we need to do is change the authentication and endpoint and remove the metadata links.

##### Publish

v1 example:
``` json
"Publish_Message": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v1.publishUrl]",
        "body": {
            "Content": "@{decodeBase64(body('Extract_Message_Context')['Content'])}",
            "Context": "@body('Extract_Message_Context')?['Context']"
        },
        "authentication": {
            "type": "Basic",
            "username": "Invictus",
            "password": "@parameters('invictusPassword')"
        }
    },
    "runAfter": {
        "Extract_Message_Context": [
            "Succeeded"
        ]
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    }
}
```

v2 example:
``` json
"Publish_Message": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v2.publishUrl]",
        "body": {
            "Content": "@{base64ToString(body('Extract_Message_Context')['Content'])}",
            "Context": "@body('Extract_Message_Context')?['Context']"
        },
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        }
    },
    "runAfter": {
        "Extract_Message_Context": [
            "Succeeded"
        ]
    }
}
```

##### Subscribe

v1 example:
``` json
"SubscribeMessage": {
    "inputs": {
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "basic",
            "username": "Invictus"
        },
        "method": "get",
        "queries": {
            "deleteOnReceive": false,
            "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
            "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
        },
        "uri": "[parameters('invictus').framework.pubSub.v1.subscribeUrl]"
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    },
    "recurrence": {
        "frequency": "Second",
        "interval": 1
    },
    "splitOn": "@triggerBody()",
    "splitOnConfiguration": {
        "correlation": {
            "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
        }
    },
    "type": "Http"
}
```

v2 example:
``` json
"SubscribeMessage": {
    "inputs": {
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        },
        "method": "post",
        "queries": {
            "filter": "Domain = 'B2B-Gateway' AND Action = 'EDI' AND Version = '1.0'",
            "subscription": "[concat(substring(variables('logicAppName'), max(createarray(0, sub(length(variables('logicAppName')), 36)))), '-', uniquestring(variables('logicAppName')))]"
        },
        "uri": "[parameters('invictus').framework.pubSub.v2.subscribeUrl]"
    },
    "recurrence": {
        "frequency": "Second",
        "interval": 1
    },
    "splitOn": "@triggerBody()",
    "splitOnConfiguration": {
        "correlation": {
            "clientTrackingId": "@triggerBody()['Context']['x-ms-client-tracking-id']"
        }
    },
    "type": "Http"
}
```

##### Acknowledge

v1 example:
``` json
"AcknowledgeMessage": {
    "inputs": {
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "Basic",
            "username": "Invictus"
        },
        "body": {
            "AcknowledgementType": "Complete",
            "IgnoreLockLostException": true,
            "LockToken": "@triggerBody()?['LockToken']",
            "MessageReadTime": "@trigger()['startTime']",
            "Subscription": "@triggerBody()?['Subscription']"
        },
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v1.acknowledgeUrl]"
    },
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.pubSub.v1.definitionUrl]",
        "swaggerSource": "custom"
    },
    "runAfter": {},
    "type": "Http"
}
```

v2 example:
``` json
"AcknowledgeMessage": {
    "inputs": {
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        },
        "body": {
            "AcknowledgementType": "Complete",
            "Subscription": "@triggerBody()?['subscription']",
            "SequenceNumber": "@triggerBody()?['sequenceNumber']",
            "IgnoreNotFoundException": true
        },
        "method": "post",
        "uri": "[parameters('invictus').framework.pubSub.v2.acknowledgeUrl]"
    },
    "runAfter": {},
    "type": "Http"
}
```

#### Migrating Transco v1 to v2

We need to change the authentication and endpoint and remove the metadata links.

Transco v1 example:
``` json
"Transform_XML": {
    "type": "Http",
    "inputs": {
        "method": "POST",
        "uri": "[parameters('invictus').Framework.Transco.v1.transcoXmlUrl]",
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "Basic",
            "username": "Invictus"
        },
        "body": {
            "Content": "@triggerBody()?['Content']",
            "Context": "",
            "TranscoConfig": "EFACT_D96A_ORDERS-to-Generic_Order.xml"
        }
    },
    "runAfter": {}
}
```

Transco v2 example:
``` json
"Transform_XML": {
    "type": "Http",
    "inputs": {
        "method": "POST",
        "uri": "[parameters('invictus').Framework.Transco.v2.transcoXmlUrl]",
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
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

Also we need to change the transco configuration files, for this you can use the migration tool from Codit's integration practice that can be found [here](https://github.com/Codit/integration-practice/tree/main/src/Tools/Invictus/Transco-Matrix-Migration#invictus-transco--matrix-migration-tools).

#### Migrating Matrix v1 to Transco v2

The Matrix component's functionality has been placed in the Transco v2 API. 

Basically all we need to do is change the authentication and endpoint and remove the metadata links.

Matrix v1 example:
``` json
"Extract_Message_Context": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.matrix.v1.basicMatrixUrl]",
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
            "type": "Basic",
            "username": "Invictus",
            "password": "@parameters('invictusPassword')"
        }
    },
    "runAfter": {},
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.matrix.v1.definitionUrl]",
        "swaggerSource": "custom"
    }
}
```

Transco v2 example:
``` json
"Extract_Message_Context": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.transco.v2.basicMatrixUrl]",
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
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        }
    },
    "runAfter": {}
}
```