[home](../README.md) | [framework](framework.md)

# LogicApps Diagnostics

To enable diagnostics and automatically stream all WorkFlowRuntime events from your Logic Apps to event hub use the template below.

The Logic App is just to demonstrate where the DiagnosticSetting resource needs to be placed. It is important to also target the EventHubNamespace and EventHubName created by the Invictus Resources ARM Template, since the Import Job is set to listen on the mentioned Namespace and Hub.

After the below code is executed you should be able to see the setup as displayed in the image in your Logic App Diagnostic Settings section.

> ![diagnostics](../images/ladiagnostics.png)

## Sample ARM Template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "logicAppName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Logic App that will be created."
      }
    },
    "testUri": {
      "type": "string",
      "defaultValue": "http://azure.microsoft.com/status/feed/"
    },
    "settingName": {
      "type": "string",
      "defaultValue": "MonitorWorkFlowRuntime"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string",
      "defaultValue": "[resourceId('Microsoft.EventHub/namespaces/authorizationRules', 'invictus-stg-we-sft-evhb', 'RootManageSharedAccessKey')]"
    },
    "eventHubNamespace": {
      "type": "string",
      "defaultValue": "The EventHub Namespace you wish to target"
    },
    "eventHubName": {
      "type": "string",
      "defaultValue": "The EventHub name you wish to target(not the namespace)"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Logic/workflows",
      "name": "[parameters('logicAppName')]",
      "apiVersion": "2016-06-01",
      "location": "[resourceGroup().location]",
      "properties": {
        "definition": {
          "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "testURI": {
              "type": "string",
              "defaultValue": "[parameters('testUri')]"
            }
          },
          "triggers": {
            "recurrence": {
              "type": "recurrence",
              "recurrence": {
                "frequency": "Hour",
                "interval": 1
              }
            }
          },
          "actions": {
            "http": {
              "type": "Http",
              "inputs": {
                "method": "GET",
                "uri": "@parameters('testUri')"
              },
              "runAfter": {}
            }
          },
          "outputs": {}
        },
        "parameters": {}
      },
      "resources": [
      {
          "type": "providers/diagnosticSettings",
          "name": "[concat('Microsoft.Insights/', parameters('settingName'))]",
          "dependsOn": [
            "[resourceId('Microsoft.Logic/workflows', parameters('logicAppName'))]"
          ],
          "apiVersion": "2017-05-01-preview",
        "properties": {
          "name": "[parameters('settingName')]",
          "eventHubAuthorizationRuleId": "[resourceId('Microsoft.EventHub/namespaces/authorizationRules', parameters('eventHubNamespace'), 'RootManageSharedAccessKey')]",
          "eventHubName": "[parameters('eventHubName')]",
          "logs": [
            {
              "category": "WorkflowRuntime",
              "enabled": true,
              "retentionPolicy": {
                "days": 0,
                "enabled": false
              }
            }
          ]
        }
        }
      ],
      "dependsOn": []
    }
  ]
}
```

Note if the templates are stored in a different resources use the below code to reference the EventHubNamespace in another resource:

```json
{
    ...
    "eventHubAuthorizationRuleId": "[resourceId(parameters('targetResourceGroup'),'Microsoft.EventHub/namespaces/authorizationRules', parameters('eventHubNamespace'), 'RootManageSharedAccessKey')]"
    ...
}
```
