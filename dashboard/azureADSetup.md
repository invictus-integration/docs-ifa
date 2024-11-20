[Home](../README.md) | [Dashboard](dashboard.md) | [Azure AD Setup](azureADSetup.md)

# Microsoft Entra ID for Invictus

To set up Microsoft Entra ID from the Azure Portal, follow these steps:

1. Go to **Microsoft Entra ID** and select **App Registrations** from the left side menu. Click the **New Registration** button at the top of the page.

   ![Register AAD](../images/dashboard/azureAD/aad1.JPG)

2. Provide a name for your app registration.
3. Choose **Accounts in any organizational directory (Any Microsoft Entra ID directory - Multitenant)**.
4. The **Redirect URI** is the link to the front-end website of the dashboard (e.g., `https://invictus-dev-we-sft-invictusdashboard.azurewebsites.net/login`). This is required for the Single Sign-On process on the login page.
5. Click the **Register** button.

## Step 1: App Registration Authentication

### Step 1.1: Add Redirect URI

1. Go to the **Authentication** page from the left side menu.
2. In the Redirect URI section, click on **Add URI**.
3. Enter the link to your dashboard with the `/api/auth/callback/azure-ad` route (e.g. `https://invictus-dev-we-sft-invictusdashboard-v2.azurewebsites.net/api/auth/callback/azure-ad`)

### Step 1.2: Grant Access Token Permissions

To grant Access Token Permissions, follow these steps:

1. Check the checkbox for **Access Tokens**.

   ![Grant Access Token](../images/dashboard/azureAD/aad12.png)


2. Click the **Save** button at the bottom.

## Step 2: Expose an API

To expose an API, follow these steps:

1. Go to **Expose an API**.
2. Add the Application ID URI as `api://{client-id}` (also known as the application ID). You can find this in the **Overview** section.
3. Click **Add a scope**.

   ![Expose an API](../images/dashboard/azureAD/aad9.png)

### Step 2.1: Add Scopes

Fill in the form with the information shown in the above image, using **access_as_user** for each of the textboxes. Once finished, click **Add scope**.

   ![Add Scope](../images/dashboard/azureAD/aad10.png)

## Step 3: API Permissions

To manage API permissions, follow these steps:

1. Go to **API Permissions** from the left side menu.
2. Click the **Add a permission** button.
3. Select **Microsoft Graph** and choose **Delegated permissions**.
4. Search for **Directory** and choose **Directory.Read.All**.
5. Click **Add permissions**.
6. Click **Grant admin consent for Codit**. The status of the new permission should change to **Granted**.

![Grant consent to delegated / admin permissions](../images/dashboard/azureAD/aad8.JPG)

### Step 4: API Permissions - Group Management 

To Add Group Management APi Permissions follow these steps:

1. Go to **API Permissions** from the left side menu.
2. Click the **Add a permission** button.
3. For each of the permissions listed, insert the name in search box and the permission will be displayed. Click on the permission to add.
4. Click **Add permissions**.
5. Click **Grant admin consent for Codit**. The status of the new permission should change to **Granted**.

N.B - Some of the permissions requires Admin consent, this requires an admin privileged user to grant permissions.

![API Permissions](../images/dashboard/aad_3.JPG)

### API Permissions - Sending Mail Notifications for forgot password

1. Go to **API Permissions** from the left side menu.
2. Click the **Add a permission** button.
3. Select **Microsoft Graph** and choose **Application permissions**.
4. Search for **Mail** and choose **Mail.Send**.
5. Click **Add permissions**.
6. Click **Grant admin consent for Codit**. The status of the new permission should change to **Granted**.

N.B - This permission requires Admin consent, this requires an admin privileged user to grant permissions.

![API Permissions](../images/dashboard/azureAD/aad13.jpg)

### API Permissions - Add Scope

Click **Add a permission** again.
1. Select **My APIs**.
2. Click on the app registration name you created.
3. Choose **access_as_user** from the permissions list.
4. Click **Add permissions**.

The image below shows the result of the above actions.

![Add Scope to API Permissions](../images/dashboard/azureAD/aad11.png)

## Step 5: Enterprise Application Setup

To set up the enterprise application, follow these steps:

1. Go back to **Microsoft Entra ID** and select **Enterprise Application** from the left side menu.
2. Search for the application you just created and click on it.
3. Click on **Owners** from the left hand side.
4. Add yourself or the desired owner of the application.

   ![Add Ownership to enterprise application](../images/dashboard/azureAD/aad5.JPG)

## Step 6: Enterprise Application Permissions

To manage enterprise application permissions, follow these steps:

1. Go to the **Permissions** page from the left side menu.
2. Click on the **Admin consent** or **User consent** tab.
3. Click the **Grant admin consent for Codit** button and follow the instructions.

   ![Grant consent permissions for enterprise applications](../images/dashboard/azureAD/aad6.JPG)

## Step 7: Deploy Script Setup

Once you have completed the steps above, you will need to provide some values to your release pipeline deploy script as parameters. These required values are: 

- AzureActiveDirectoryClientId
- AzureActiveDirectoryTenantId
- AzureActiveDirectoryClientSecret
- AzureActiveDirectoryAudience
  
The Client ID and Tenant ID can be copied from the App Registration Overview page.
   ![Tenant and client information](../images/dashboard/azureAD/aad7.JPG)

To obtain the Client Secret: 

1. Go to **Certificates & Secrets** from the side menu.
2. Create a new secret by clicking the **New client secret** button, and copy the generated value.

   ![Certificates and Secrets](../images/dashboard/azureAD/aad4.JPG)

To obtain the Audience:

1. Go to **Expose an API** from the side menu.
2. Copy the `Application ID URI` value. This is the Audience value.
   
![Audience Value](../images/dashboard/azureAD/aad15.jpg)
   
