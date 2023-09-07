# Access Control Rights

Some role assignments need to be added to a few Invictus components so that certain features function correctly.

## Flow Handler & Dashboard Gateway Functions

### 1. Add FlowHandlerJob with **Contributor** rights to Dashboard Gateway.

To do this, follow these steps:

1. Go to the DashboardGateway Function App and select Access control (IAM).
2. Click on "+Add" and then "Add role assignment".
3. Search for the **Contributor** role in the **Privileged administrator roles** section and click next.
4. Assign access to **Managed Identity**. Select the FlowHandlerJob Function App when choosing the member.
5. Save your changes
   
### 2. Setting "Logic App Contributor" rights for DashboardGateway and FlowHandlerJob functions on the resource group where the logic apps are located.

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
    "description": "The Invictus DashboardGateway needs Contribute permissions on the Logic App resource group to display the contents of the message.",
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
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
    "description": "The Invictus FlowHandler needs Contribute permissions on the Logic App resource group to display the contents of the message.",
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
    "principalId": "[reference(resourceId(concat(parameters('infra').environment.customerShortName, '-', parameters('infra').environment.shortName, '-invictus'), 'Microsoft.Web/sites', concat('invictus-', parameters('infra').environment.resourcePrefix, '-flowhandlerjob')), '2021-01-15', 'full').identity.principalId]"
  },
  "dependsOn": []
}
```
### 3. Setting "Monitoring Contributor" rights for the FlowHandlerJob function for the Invictus resource group.

To do this, follow these steps:

1. Go to the FlowHandlerJob Function App and select Identity.
2. Click on "Azure role assignments" and then "Add role assignment".
3. Assign the scope (subscription or resource group for the Invictus resource group) and set the role to **Monitoring Contributor**.

Alternatively, the following ARM template can be used:

```json
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2020-04-01-preview",
  // Fixed GUID to make it idempotent
  "name": "[guid(subscription().subscriptionId, 'FlowHandlerJobMonitoringContribute')]",
  "properties": {
    "description": "The Invictus FlowHandlerJob needs Monitoring Contribute permissions on the VMI invictus resource group to allow alert rules.",
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '749f88d5-cbae-40b8-bcfc-e573ddc772fa')]",
    "principalId": "[reference(resourceId(concat(parameters('infra').environment.customerShortName, '-', parameters('infra').environment.shortName, '-invictus'), 'Microsoft.Web/sites', concat('invictus-', parameters('infra').environment.resourcePrefix, '-flowhandlerjob')), '2021-01-15', 'full').identity.principalId]"
  },
  "dependsOn": []
}
```
