---
sidebar_label: Access to flows
---

# Control the access to your flows

## Available flow permissions
The following table describes what flow-related functionality is permitted for users, based on the set role they receive on a folder: *Reader*, *Operator* or *Folder admin*. Both single **local users** as well as **groups** can be assigned to folders.

|            |                            | Reader | Operator | Folder admin | Description                                                                                                                                                               |
| ---------- | -------------------------- | :----: | :------: | :----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flow       | View **flow** statuses     |   🟢    |    🟢     |      🟢       | [Accessing the homepage](../flows/index.md) and viewing the status summary of flows the user is assigned to                                                               |
|            | Resubmit/Resume **flow**   |   🔴    |    🟢     |      🟢       | [Flows mapped to an Azure Logic App workflow](../flows/04_import-flow-traces/import-flows-via-la.mdx) can be resubmitted, resumed and ignored directly from the Dashboard |
|            | Add **flow**               |   🔴    |    🔴     |      🟢       | [Adding a new flow to a folder](../flows/01_add.mdx), possibly with alerts                                                                                                |
|            | Edit **flow**              |   🔴    |    🔴     |      🟢       | [Changing the flow](../flows/01_add.mdx) mapping, properties, alerts                                                                                                      |
|            | Delete **flow**            |   🔴    |    🔴     |      🟢       | Removing a flow from a folder                                                                                                                                             |
| Flow trace | View **flow traces**       |   🟢    |    🟢     |      🟢       | [Searching for flow traces](../flows/02_search.mdx) for a selected flow the user is assigned to                                                                           |
| Folder     | View **folders**           |   🟢    |    🟢     |      🟢       | Viewing folder hierarchy structure with available flows the user is assigned to                                                                                           |
|            | Edit **folder**            |   🔴    |    🔴     |      🔴       | Renaming the folder and changing hierarchy structure                                                                                                                      |
|            | Grant **flow** permissions |   🔴    |    🔴     |      🔴       | [Assigning permissions on folders](../flows/01_add.mdx#flow-permissions) for users and groups to access the flows                                                         |
|            | Delete **folder**          |   🔴    |    🔴     |      🔴       | Removing a folder from the hierarchy, removing all flows and sub-folders under it as well                                                                                 |

:::info[System admins]
Users with the *System admin* user role (either as a local user or via a member of a group with such role) benefit from the same permissions as the *Folder admin* permission on <u>all</u> flows in the Dashboard -- regardless whether the *System admin* user was assigned to the folder or not.
:::

## Available user roles
The following table describes what non-flow related parts of the Dashboard are available for users, based on their assigned roles: *Non-admin* and *System admin*. Microsoft Entra ID users receive their role based on the role of the group that they are a member of. Local users receive personalized roles for each one separately. 

|          |                                 | Non-admin | System admin | Description                                                                                                                                                                                     |
| -------- | ------------------------------- | :-------: | :----------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Users    | View **users**                  |     🔴     |      🟢       | Accessing the `[Users]` page and viewing all **local** and **Entra ID** users                                                                                                                   |
|          | Add **local user**              |     🔴     |      🟢       | Adding a new **local** user with credentials to the Dashboard                                                                                                                                   |
|          | Add **Microsoft Entra ID user** |     🟠     |      🟠       | 'Sign in with...' on the sign in page automatically creates an user, when that user is a member of a [synced group](../installation/01_give_ad_access.mdx)                                      |
|          | Edit **local user** role        |     🔴     |      🟢       | Changing the user role of **local** users (**Entra ID** users receive their role via their **group**)                                                                                           |
|          | Delete **user**                 |     🔴     |      🟢       | Removing a **local** or **Entra ID** user from accessing the Dashboard permanently (**Entra ID** users will need to removed from synced groups as well, if they are not allowed to log back in) |
| Groups   | View **groups**                 |     🔴     |      🟢       | Accessing the `[Groups]` page and viewing all synced groups                                                                                                                                     |
|          | Sync **groups**                 |     🔴     |      🟢       | Running the [`[Sync all groups]`](../installation/01_give_ad_access.mdx) operation                                                                                                              |
|          | Disable **group**               |     🔴     |      🟢       | [Temporary pause the group's authority](../installation/01_give_ad_access.mdx) from accessing flows                                                                                             |
|          | Edit **group** role             |     🔴     |      🟢       | [Changing the user role](../installation/01_give_ad_access.mdx) of a single group                                                                                                               |
|          | Delete **group**                |     🔴     |      🟢       | Removing a group's authority from accessing flows (if a Microsoft Entra ID user is still a member of the group, the group will still be synced)                                                 |
| Settings | View **settings**               |     🟢     |      🟢       | Accessing the [`[Settings]`](../settings.md) page and viewing all Dashboard settings                                                                                                            |
|          | Edit **settings**               |     🔴     |      🟢       | [Changing the Dashboard settings](../settings.md)                                                                                                                                               |
| Audits   | View **audits**                 |     🔴     |      🟢       | Accessing the [`[Audits]`](../security/04_auditing.mdx) page and viewing all security audits                                                                                                    |
