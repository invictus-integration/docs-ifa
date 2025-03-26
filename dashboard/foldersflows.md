[home](../README.md) | [dashboard](dashboard.md)

# Dashboard Folders and Flows

## Structure

The functional structure of the dashboard is like a directory structure containing folders & flows

### Folder

A folder is a collection/hierarchy of flows. Each folder can contain an unlimited number of flows.

### Subfolder

Inside each folder, the user can create multiple subfolders which can can contain an unlimited number of flows. A subfolder may also host other subfolders to further subdivide your directory structure.

### Flows

Flows (= message chain) are an aggregation of all the messages that can be linked to the same incoming message. Flows are the functional representation of the message with an optional context property name and / or optional context property value. Flows have a number of predefined properties which you are interested in that are shown in the results grid.

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

Depending on their rights, a user can edit the following information:

* Folder name
* Subfolder name
* Subfolder parent folder

### Delete Folder

Depending on their rights, a user can delete the following:

* Folders
* Subfolders