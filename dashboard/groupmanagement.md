[Home](../README.md) | [Dashboard](dashboard.md) | [Group Management](groupmanagement.md)

# Group Permission Management

To set up permissions for Azure Active Directory groups on Invictus, kindly follow the link [here](azureADSetup.md)

# Group Management

If you want to create a group, go to **Groups** and click the **New group** button. Enter a group name and assign owners and members to the group for the AAD you just created.

   ![Create Group](../images/dashboard/aad_12.JPG)

If you want to add a new user, go to **Users** and click the **New user** button. Enter all the required information and assign the desired groups to the user.

   ![Add User](../images/dashboard/aad_13.JPG)

## Step 3: Sync Groups on Invictus

The Sync Groups function operates by retrieving the group memberships of users who have logged in at least once via Active Directory login. This process gathers all the groups that users are members of. In case a specific group is not found, a member of that group needs to log in via Active Directory login. Afterward, the Sync Groups process must be run again to obtain the groups of that particular member and the groups of other members who have previously logged in.

**Note: An app registration should be created before assigning group permissions**

Click on the **Groups** icon located in the top-middle menu:

   ![Sync Groups](../images/dashboard/Groups/groupman_1.jpg)

Click **Sync All Groups** on the **Global Groups** page:

   ![Sync All Groups](../images/dashboard/Groups/groupman_2.jpg)

Once synced, enable the required groups to be used for permissions:

   ![Enable Groups](../images/dashboard/Groups/groupman_3.jpg)
 
To add global roles to the groups, click the **Edit** buttons and set the required role:

   ![Add Global Roles](../images/dashboard/Groups/groupman_4.jpg)

## Step 4: Assign Groups to Folders

**Note: An app registration should be created before assigning group permissions**

Click on the three dots next to the folder name:

   ![Folder Options](../images/dashboard/Groups/groupman_5.jpg)

Several options will appear. Click on the **Edit Folder Permissions** link:

   ![Edit Folder Permissions](../images/dashboard/Groups/groupman_6.jpg)

Click on the **Assign a group** button.

   ![Assign a Group](../images/dashboard/Groups/groupman_7.jpg)

An **Assign Group** popup will appear:

   ![Assign Group Popup](../images/dashboard/Groups/groupman_8.jpg)

Choose the group from the first dropdown menu and select the role you want the group users to have for that specific folder. You have three options:

- **Folder Admin**
- **Operator**
- **Reader**

**Folder Admin** has the following permissions:
- Assign users to a specific folder
- Remove users from a specific folder
- Create flows in a specific folder
- Delete flows in a specific folder
- View messages from flows in a specific folder
- View flows from a specific folder
- Resume, resubmit, and ignore messages from specific folders
- View flow statistics
- Edit flow in a specific folder

**Operator** has the following permissions:
- View messages from flows in a specific folder
- View flows from a specific folder
- Resume, resubmit, and ignore messages from specific folders
- View flow statistics

**Reader** has the following permissions:
- View messages from flows in a specific folder
- View flows from a specific folder
- View flow statistics

   ![Assign Group](../images/dashboard/Groups/groupman_9.jpg)
```