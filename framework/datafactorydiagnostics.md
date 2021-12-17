[home](../README.md) | [framework](framework.md)

# LogicApps Diagnostics

To enable diagnostics and automatically stream all PipelineRuns, TriggerRuns and ActivityRuns events from your Data Factory to event hub use the template below.

It is important to also target the EventHubNamespace and EventHubName created by the Invictus Resources ARM Template, since the Import Job is set to listen on the mentioned Namespace and Hub.
Note that there is a separate EventHub for Data Factory. This is the EventHub which ends with `-df-evhb`.
After the below code is executed you should be able to see the setup as displayed in the image in your Data Factory Diagnostic Settings section.

> ![diagnostics](../images/dfdiagnostics.png)

## Sample ARM Template (extension of the Invictus template for Data Factory)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "infra": {
      "type": "object",
      "metadata": {
        "description": "Provide the object that contains all info about the common infrastructure."
      }
    },
    "invictus": {
      "type": "object",
      "metadata": {
        "description": "Provide the object that contains all info about the invictus for azure framework."
      }
    },
    "releaseInfo": {
      "type": "object",
      "metadata": {
        "description": "Provide info about the release that deployed this resource."
      }
    },
    "location": {
      "defaultValue": "[resourceGroup().location]",
      "type": "string",
      "metadata": {
        "description": "Provide the location for the Azure resource.  Stick to the default value, which is the same location as the Resource Group, unless you have a specific reason."
      }
    },
    "dataFactoryNameSuffix": {
      "type": "string",
      "defaultValue": "datafactory",
      "metadata": {
        "description": "Set the suffix to be used when assigning a name to the data lake."
      }
    }
  },
  "variables": {
    "dataFactoryName": "[concat(parameters('infra').environment.resourcePrefix, '-', parameters('dataFactoryNameSuffix'))]",
    "dataFactoryResourceId": "[resourceId('Microsoft.DataFactory/factories', variables('dataFactoryName'))]",
    "storageBlobDataReaderRoleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')]"
  },
  "resources": [
    {
      "name": "[variables('dataFactoryName')]",
      "apiVersion": "2018-06-01",
      "type": "Microsoft.DataFactory/factories",
      "location": "[parameters('location')]",
      "tags": {
        "displayName": "[variables('dataFactoryName')]",
        "releaseName": "[parameters('releaseInfo').release.name]",
        "createdBy": "[parameters('releaseInfo').release.url]",
        "triggeredBy": "[parameters('releaseInfo').deployment.requestedFor]",
        "triggerType": "[parameters('releaseInfo').deployment.triggerType]"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {}
    },
    {
      "type": "microsoft.datafactory/factories/providers/diagnosticsettings",
      "name": "[concat(variables('dataFactoryName'),'/Microsoft.Insights/SendDataFactoryDataToInvictus')]",
      "location": "[parameters('location')]",
      "apiVersion": "2017-05-01-preview",
      "dependsOn": [
        "[concat('Microsoft.DataFactory/factories/', variables('dataFactoryName'))]"
      ],
      "properties": {
        "name": "SendDataFactoryDataToInvictus",
        "storageAccountId": null,
        "eventHubAuthorizationRuleId": "[parameters('invictus').monitoring.eventhub.accessRuleId]",
        "eventHubName": "[replace(parameters('invictus').monitoring.eventhub.name, '-evhb', '-df-evhb')]",
        "workspaceId": null,
        "logs": [
          {
            "category": "PipelineRuns",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "TriggerRuns",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "ActivityRuns",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.KeyVault/vaults/accessPolicies",
      "name": "[concat(parameters('infra').secrets.keyVaultName, '/add')]",
      "apiVersion": "2018-02-14",
      "comments": "Data Factory requires an access policy to read secrets for the managed identity",
      "properties": {
        "accessPolicies": [
          {
            "tenantId": "[subscription().tenantId]",
            "objectId": "[reference(resourceId('Microsoft.DataFactory/factories',  variables('dataFactoryName')), '2018-06-01', 'Full').identity.principalId]",
            "permissions": {
              "secrets": [ "list", "get" ]
            }
          }
        ]
      },
      "tags": {
        "displayName": "Access for Azure DevOps",
        "releaseName": "[parameters('releaseInfo').release.name]",
        "createdBy": "[parameters('releaseInfo').release.url]",
        "triggeredBy": "[parameters('releaseInfo').deployment.requestedFor]",
        "triggerType": "[parameters('releaseInfo').deployment.triggerType]"
      },
      "dependsOn": [
        "[concat('Microsoft.DataFactory/factories/', variables('dataFactoryName'))]"
      ]
    }
  ],
  "outputs": {
    "Infra.DataFactory.Id": {
      "type": "string",
      "value": "[variables('dataFactoryResourceId')]"
    },
    "Infra.DataFactory.PrincipalId": {
      "type": "string",
      "value": "[reference(concat(variables('dataFactoryResourceId'), '/providers/Microsoft.ManagedIdentity/Identities/default'), '2015-08-31-PREVIEW').principalId]"
    },
    "Infra.DataFactory.Name": {
      "type": "string",
      "value": "[variables('dataFactoryName')]"
    }
  }
}
```
