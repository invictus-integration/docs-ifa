# Access Control Rights

Some role assignments need to be added to a few Invictus for Azure components so that certain features function correctly.
   
### Setting `Logic App Contributor` and `Website Contributor` rights for DashboardGateway and FlowHandlerJob functions on the resource group where the Logic Apps are located.

:point_right: The `Website Contributor` role assignment is only necessary when using Logic Apps Standard.

To do this, follow these steps:

1. Go to the DashboardGateway Function App and select `Identity`.
2. Click on `Azure role assignments` and then `Add role assignment`.
3. Assign the scope (subscription or resource group where Logic Apps are located) and set the role to `Logic App Contributor`.
4. Repeat this step for the FlowHandler function and if necessary the `Website Contributor` role.

Alternatively, the following Bicep template can be used:

```bicep
param resourcePrefix string
param invictusResourceGroup string
 
resource logicAppContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: '87a39d53-fc1b-424a-814c-f7e04687dc9e'
}
 
resource websiteContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: 'de139f84-1756-47ae-9be6-808fbbe84772'
}
 
resource dashboardGatewayFunction 'Microsoft.Web/sites@2022-09-01' existing = {
  name: 'invictus-${resourcePrefix}-dashboardgateway'
  scope: resourceGroup(invictusResourceGroup)
}

resource flowhandlerjobFunction 'Microsoft.Web/sites@2022-09-01' existing = {
  name: 'invictus-${resourcePrefix}-flowhandlerjob'
  scope: resourceGroup(invictusResourceGroup)
}
 
resource dashboardGateWayLogicAppContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(concat(dashboardGatewayFunction.name), '-logicAppContributor')
  properties: {
    roleDefinitionId: logicAppContributorRoleDefinition.id
    principalId: dashboardGatewayFunction.identity.principalId
  }
}
 
resource dashboardGateWayWebsiteContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(concat(dashboardGatewayFunction.name), '-websiteContributor')
  properties: {
    roleDefinitionId: websiteContributorRoleDefinition.id
    principalId: dashboardGatewayFunction.identity.principalId
  }
}

resource flowhandlerjobLogicAppContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(concat(flowhandlerjobFunction.name), '-logicAppContributor')
  properties: {
    roleDefinitionId: logicAppContributorRoleDefinition.id
    principalId: flowhandlerjobFunction.identity.principalId
  }
}
 
resource flowhandlerjobWebsiteContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(concat(flowhandlerjobFunction.name), '-websiteContributor')
  properties: {
    roleDefinitionId: websiteContributorRoleDefinition.id
    principalId: flowhandlerjobFunction.identity.principalId
  }
}
```
