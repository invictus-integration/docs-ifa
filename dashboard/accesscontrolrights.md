# Access Control Rights

Some role assignments need to be added to a few Invictus components so that certain features function correctly.
   
### Setting "Logic App Contributor" rights for DashboardGateway and FlowHandlerJob functions on the resource group where the logic apps are located.

To do this, follow these steps:

1. Go to the DashboardGateway Function App and select Identity.
2. Click on "Azure role assignments" and then "Add role assignment".
3. Assign the scope (subscription or resource group where logic apps are located) and set the role to **Logic App Contributor**.
4. Repeat this step for the FlowHandler function.

Alternatively, the following ARM template can be used:

```json
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2020-04-01-preview",
  // Fixed GUID to make it idempotent
  "name": "[guid(subscription().subscriptionId, 'DashboardGatewayContribute')]",
  "properties": {
    "description": "The Invictus DashboardGateway needs Logic App Contributor permissions on the Logic App resource group to display the contents of the message.",
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '87a39d53-fc1b-424a-814c-f7e04687dc9e')]",
    "principalId": "[reference(resourceId(concat(parameters('infra').environment.customerShortName, '-', parameters('infra').environment.shortName, '-invictus'), 'Microsoft.Web/sites', concat('invictus-', parameters('infra').environment.resourcePrefix, '-dashboardgateway')), '2021-01-15', 'full').identity.principalId]"
  },
  "dependsOn": []
},
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2020-04-01-preview",
  // Fixed GUID to make it idempotent
  "name": "[guid(subscription().subscriptionId, 'FlowHandlerJobContribute')]",
  "properties": {
    "description": "The Invictus FlowHandler needs Logic App Contributor permissions on the Logic App resource group to display the contents of the message.",
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '87a39d53-fc1b-424a-814c-f7e04687dc9e')]",
    "principalId": "[reference(resourceId(concat(parameters('infra').environment.customerShortName, '-', parameters('infra').environment.shortName, '-invictus'), 'Microsoft.Web/sites', concat('invictus-', parameters('infra').environment.resourcePrefix, '-flowhandlerjob')), '2021-01-15', 'full').identity.principalId]"
  },
  "dependsOn": []
}
```
