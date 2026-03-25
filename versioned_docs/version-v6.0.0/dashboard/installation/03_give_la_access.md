---
sidebar_label: Give access to your Logic Apps
---

# Give Invictus access to your Azure Logic Apps
When running Workflow operations like resubmit, resume; Invictus needs access to your Azure Logic Apps resources. Please set the `Logic App Contributor`, `Logic Apps Standard Contributor` and `Website Contributor` rights for the Azure Container Apps Managed Identity and Flow Handler Azure Container App on the resource group where your Azure Logic Apps are located.

:::note
The [`Website Contributor`](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/web-and-mobile#website-contributor) and [`Logic Apps Standard Contributor`](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/integration#logic-apps-standard-contributor-preview) role assignments are only necessary when using Logic Apps Standard.
:::

* [Add role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal) to the User Assigned Managed Identity `invictus-prefix-we-sft-aca-identity` (default name), with
  * **scope:** (subscription/resource group where your Azure Logic Apps are located)
  * **role:** [`Logic App Contributor`](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor)

* Repeat this for the Flow Handler Container App
* (If necessary) Repeat this for the `Website Contributor` and `Logic Apps Standard Contributor` roles.
