[home](../README.md) | [dashboard](dashboard.md)

# Dashboard Folders and Flows

## Structure

The functional structure of the dashboard is like a directory structure containing folders & flows

### Folder

A folder is a collection/hierarchy of flows. Each folder can exist of unlimited flows.

### Subfolder

Inside each folder, the user can create multiple subfolders which can exist of unlimited flows. **Each subfolder must have the folder as a parent, you cannot create a subfolder of a subfolder!**

### Flows

Flows (= message chain) are an aggregation of all the messages that can be linked to the same incoming message. Flows are the functional representation of the message with an optional context property name and / or optional context property value. Flows have a number of predefined properties where you are interested in that are shown in the results grid.

### Tree Structure

The following structures are possible:

Folder - Flow:

> ![folder-flow](../images/dsb-folderflow.png)

Folder - Subfolder - Flow:

> ![folder-subfolder-flow](../images/dsb-foldersubfolderflow.png)

## Folder Management

Folder names or subfolder names should be minimum 3 characters!

### Create Folder

When creating a new folder the user will have to specify the following information:

* Folder name

When creating a subfolder the user will have to specify the following information

* Folder name
* Parent folder (refers to the directory above another directory)

### Update Folder

Depending on its rights, a user can edit the following information:

* Folder name
* Subfolder name
* Subfolder parent folder

### Delete Folder

Depending on its rights, a user can delete the following:

* Folders
* Subfolders

## Flow Management

### Create Flow

When creating a new flow the user will have to specify the following information:

* **Flow name**: case insensitive name of the flow (example: ex. invoice request, invoice approval, …)
* **Mapping**: define how a flow, and the messages it contains, are stored and indexed, using the following properties:
  * Workflow Name - The workflow name of the flow.
  * Domain - The domain of the flow.
  * Service - The service of the flow.
  * Action - The action of the flow.
  * Version - The version of the flow.
* **Business properties**: each mapping type contains a list of fields or properties pertinent to that type.
* **Settings**
  * Connected Dashboard: if the flow has multiple dashboards and it needs to connect to another dashboard then this needs to be checked.  For this setting to apply, the Connected Dashboard needs to be enabled by your Admin through the settings page of the dashboard in order to switch on this feature.
* **Folder**: attach a flow to a specific folder

> ![create flow](../images/dsb-createflow.png)

### Update Flow

Depending on its rights, a user can edit the following information:

* Flow name
* Flow settings: mappings, properties, folder, connected dashboard

### Delete Flow

Depending on its rights, a user can delete the following:

* Folders
* Subfolders
* Flows

### Move Flow

Depending on its rights, a user can move the following:

* Flows

### Moving a Flow to another Folder

If you need to move a flow from one folder to another one, you need to enter in the edit flow screen. At the bottom of tab 1 (Details), you have a drop down list of all the Folders and Sub Folders that you have rights to access. You just need to choose a folder which you want to move the current flow to and just click submit.