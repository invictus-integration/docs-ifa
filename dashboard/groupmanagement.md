[Home](../README.md) | [Dashboard](dashboard.md) | [Group Management](groupmanagement.md)

# Group Permission Management

To set up permissions for Azure Active Directory groups on Invictus, follow these steps:

## Step 1: Setup App Registration on Microsoft Azure

1. Go to **Azure Active Directory** and select **App Registrations** from the left side menu. Click the **New Registration** button at the top of the page.
   
   ![Register AAD](../images/dashboard/azureAD/aad1.JPG)

2. Provide a name for your app registration.
3. Choose **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**.
4. For the "Redirect URI", enter the links from where you will be logging in, such as `https://invictus-dev-we-sft-invictusdashboard.azurewebsites.net/login`. This ensures that the login is legitimate and prevents unauthorized use of your tenant ID from another domain.
5. Click the **Register** button.

## Step 1: Grant Access Token Permissions

1. Go to the **Authentication** page from the left side menu.
2. Check the checkbox for **Access Tokens**.
3. Click the **Save** button at the top.

   ![Grant Access Token](../images/dashboard/azureAD/aad12.png)

## Step 2: Certificates & Secrets

1. Go to **Certificates & Secrets** from the side menu.
2. Create a secret by clicking the **New client secret** button and copy the value. This secret should be used during the release along with the tenant ID and client ID.

   ![Certificates and Secrets](../images/dashboard/azureAD/aad4.JPG)

## Step 3: Expose an API

1. Go to **Expose an API**.
2. Add the application ID URI as `api://{client-id}` (also known as the application ID), which can be found in the **Overview** section.
3. Click **Add a scope**.

   ![Expose an API](../images/dashboard/azureAD/aad9.png)

### Step 3.1: Add Scopes

Fill in the form with the information shown in the image, using **access_as_user** for each of the textboxes. Once finished, click **Add scope**.

   ![Add Scope](../images/dashboard/azureAD/aad10.png)

## Step 4: API Permissions

1. Go to **API Permissions** from the side menu and add the required permissions. Then, click the "Grant admin consent" button.

   ![API Permissions](../images/dashboard/aad_3.JPG)

### Step 4.1: API Permissions - Add Scope

Click **Add a permission** again.
1. Select **My APIs**.
2. Click on the app registration name you created.
3. Choose **access_as_user** from the permissions list.
4. Click **Add permissions**.

   ![Add Scope to API Permissions](../images/dashboard/azureAD/aad11.png)

## Step 5: Enterprise Application Setup

1. Go back to **Azure Active Directory** and select **Enterprise Application** from the left side menu.
2. Search for the application you just created and click on it.
3. Click on **Owners** from the left hand side.
4. Add yourself or the desired owner of the application.

   ![Add Ownership to enterprise application](../images/dashboard/azureAD/aad5.JPG)

Go to **Users and groups** and click on **Add user/group** to add all the users who have access to login to the dashboard.

# Group Management

   ![Group Management](../images/dashboard/aad_10.JPG)

Now, go to **Permissions** from the side menu and click on the **Grant admin consent** button. You should log in using an account with full access permissions.

   ![Grant Consent](../images/dashboard/aad_11.JPG)

If you want to create a group, go to **Groups** and click the **New group** button. Enter a group name and assign owners and members to the group for the AAD you just created.

   ![Create Group](../images/dashboard/aad_12.JPG)

If you want to add a new user, go to **Users** and click the **New user** button. Enter all the required information and assign the desired groups to the user.

   ![Add User](../images/dashboard/aad_13.JPG)

## Step 2: Add Secret Key to Invictus' Configuration

Copy the secret key created and pass the credentials as arguments to the `Deploy.ps1` script during the release.

```markdown
-AzureActiveDirectoryTenantId "$(Invictus.Dashboard.AAD.TenantId)" -AzureActiveDirectoryClientId "$(Invictus.Dashboard.AAD.ClientId)" -AzureActiveDirectoryClientSecret "$(Invictus.Dashboard.AAD.ClientSecret)"
```

## Step 3: Sync Groups on Invictus

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