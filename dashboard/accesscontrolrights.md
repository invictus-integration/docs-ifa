# Access Control Rights

Some role assignments need to be added to a few Invictus for Azure components so that certain features function correctly.
   
### Setting `Logic App Contributor` and `Website Contributor` rights for the Container Apps Managed Identity on the resource group where the Logic Apps are located.

:point_right: The `Website Contributor` role assignment is only necessary when using Logic Apps Standard.

To do this, follow these steps:

1. Go to the User Assigned Managed Identity (named `invictus-prefix-we-sft-aca-identity` by default) and select `Azure role assignments`.
2. Click on `Add role assignment`.
3. Assign the scope (subscription or resource group where Logic Apps are located) and set the role to `Logic App Contributor`.
4. Repeat this step for the `Website Contributor` role if necessary.
