[home](../README.md) | [dashboard](dashboard.md) | [Folder Management](foldermanagement.md)

# Group Permission Management

## Setup App Registration on Microsoft Azure

Create a new App Registration:

![folder1](../images/dashboard/groupman_1.png)

Register a new Application:

![folder1](../images/dashboard/groupman_2.png)

Register a new Application:

![folder1](../images/dashboard/groupman_3.png)

Setup the Redirect URIs according to the URL set by adding:
-	{url-to-app}/ login?returnUrl=%2Fdashboard%2Fsettings
-	{url-to-app}/ login?returnUrl=%2Fdashboard%2Foverview

Setup Redirect URIs in the Authentication tab:

![folder1](../images/dashboard/groupman_4.png)

Create a New Secret Key:

![folder1](../images/dashboard/groupman_5.png)

Add API Permissions:

![folder1](../images/dashboard/groupman_6.png)

Grant Consent:

![folder1](../images/dashboard/groupman_7.png)

Update Manifest:
    "groupMembershipClaims": "All",
    "oauth2AllowIdTokenImplicitFlow": true,
    "oauth2AllowImplicitFlow": true,

![folder1](../images/dashboard/groupman_8.png)

Once user is logged in, agree to the permissions request:

![folder1](../images/dashboard/groupman_9.png)



## Sync Groups

**Note that an app registration should be created before assigning group permissions**


Click on the Groups Icon on the top left:

![folder1](../images/dashboard/groupman_10.png)
 

Click the Sync Groups Icon on the Global Groups page:

![folder1](../images/dashboard/groupman_11.png)
 

Once Synced, set the required groups as enabled to be used for permissions, and click the Save Enabled button:

![folder1](../images/dashboard/groupman_12.png)

 
To add global roles to the groups, click the edit buttons and set the required role:

![folder1](../images/dashboard/groupman_13.png)



## Assign Groups to Folders

**Note that an app registration should be created before assigning group permissions**


Click on the 3 dots next to the folder name.

![folder1](../images/dashboard/groupman_14.png)

Several option will pop-up. Choose 'Manage permissions'.

![folder1](../images/dashboard/groupman_15.png)

Click on the "Add Groups" button.

![folder1](../images/dashboard/groupman_16.png)

Choose the group from the first drop down menu. And choose the role you want the group users to have for that specific folder. You can see that you have 3 options. Folder Admin, Operator, Reader. The difference between these three are.

Folder Admin can assign users to specific folder, remove users from specific folder, create flows in specific folder, delete flows in specific folder, see messages from flows in specific folder, see flows from specific folder, resume/resubmit/ignore messages from specific folders, see flow statistics, edit flow in specific folder.

Operator can see messages from flows in specific folder, see flows from specific folder, resume/resubmit/ignore messages from specific folders, see flow statistics.

Reader can see messages from flows in specific folder, see flows from specific folder, see flow statistics.

![folder1](../images/dashboard/groupman_17.png)