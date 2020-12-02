[home](../README.md) | [dashboard](dashboard.md) | [Folder Management](foldermanagement.md)

# Group Permission Management

To setup permissions for Azure Active Directory groups on Invictus, there are three steps to follow:
- Step 1: Setup App Registration on Microsoft Azure
- Step 2: Add Secret Key to Invictus' Configuration
- Step 3: Sync Groups on Invictus
- Step 4: Assign Groups to Folders

<br>

## Step 1: Setup App Registration on Microsoft Azure

Create a new App Registration:

![folder1](../images/dashboard/groupman_1.png)


<br>

Register a new Application:

![folder1](../images/dashboard/groupman_2.png)

<br>

Once registered, an overview of the application with all keys and ids will be displayed.
These keys are required to be added in the configuration for Invictus later on:

![folder1](../images/dashboard/groupman_3.png)

<br>

Setup the Redirect URIs according to the application address by adding:
```
-	{url-to-app}/login?returnUrl=%2Fdashboard%2Fsettings
-	{url-to-app}/login?returnUrl=%2Fdashboard%2Foverview
```

Setup Redirect URIs in the Authentication tab:

![folder1](../images/dashboard/groupman_4.png)

<br>

Create a New Secret Key:

![folder1](../images/dashboard/groupman_5.png)


<br>

Add API Permissions:

![folder1](../images/dashboard/groupman_6.png)


<br>

Grant Consent:

![folder1](../images/dashboard/groupman_7.png)

<br>

Open the Manifest link from the side menu and update the following properties:

```
    "groupMembershipClaims": "All",
    "oauth2AllowIdTokenImplicitFlow": true,
    "oauth2AllowImplicitFlow": true,
```

Once user is logged in, agree to the permissions request:

![folder1](../images/dashboard/groupman_8.png)



<br>


## Step 2: Add Secret Key to Invictus' Configuration

Copy the secret key created and add it to the 

```
    <!-- InvictusAAD -->
    <add key="aad:tenantId" value="xxxxxx-6b41-445f-xxxx-ddc3420307dd" />
    <add key="aad:clientId" value="xxxxxx-7595-4e28-xxxx-ae5jkuild682" />
    <add key="aad:clientSecret" value="xxxxxxxxxxxxxxxxxx-IFr804U" />
```


<br>

## Step 3: Sync Groups on Invictus

**Note that an app registration should be created before assigning group permissions**

Click on the Groups Icon on the top left:

![folder1](../images/dashboard/groupman_9.png)
 
<br>

Click the Sync Groups Icon on the Global Groups page:

![folder1](../images/dashboard/groupman_10.png)
 
<br>

Once Synced, set the required groups as enabled to be used for permissions, and click the Save Enabled button:

![folder1](../images/dashboard/groupman_11.png)

<br>
 
To add global roles to the groups, click the edit buttons and set the required role:

![folder1](../images/dashboard/groupman_12.png)



<br>


## Step 4: Assign Groups to Folders

**Note that an app registration should be created before assigning group permissions**


Click on the 3 dots next to the folder name:

![folder1](../images/dashboard/groupman_13.png)

<br>
Several options will pop-up. Click on the 'Manage permissions' link:

![folder1](../images/dashboard/groupman_14.png)

<br>
Click on the "Add Groups" button.

![folder1](../images/dashboard/groupman_15.png)

<br>
An Assign Group Popup will show up:
![folder1](../images/dashboard/groupman_16.png)

<br>
Choose the group from the first drop down menu. And choose the role you want the group users to have for that specific folder. You can see that you have 3 options:
- Folder Admin
- Operator
- Reader

**Folder Admin** can assign users to specific folder, remove users from specific folder, create flows in specific folder, delete flows in specific folder, see messages from flows in specific folder, see flows from specific folder, resume/resubmit/ignore messages from specific folders, see flow statistics, edit flow in specific folder.

**Operator** can see messages from flows in specific folder, see flows from specific folder, resume/resubmit/ignore messages from specific folders, see flow statistics.

**Reader** can see messages from flows in specific folder, see flows from specific folder, see flow statistics.

![folder1](../images/dashboard/groupman_17.png)
