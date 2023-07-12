[home](../README.md) | [dashboard](dashboard.md) | [Azure AD Setup](azureADSetup.md)

# Azure Active Directory Setup

## Setting up the Azure Active Directory setup from the Azure Portal Dashboard 

First, go to "Azure Active Directory" and from the left side menu click on the "App Registrations" and click on the "New Registration" button on top of the page. 

1. Enter a name for your app registration.
2. Choose the "Accounts in any organizational directory (Any Azure AD directory - Multitenant)".
3. Now for the "Redirect URI" enter links that you are going to use from where you are going to login from. Such as "https://invictus-dev-we-sft-invictusdashboard.azurewebsites.net/login". This will ensure that from where you are loging is legit and no one can use your tenant id from another domain or so.
4. Click on Register button.

![Allowing permissions for access and ID Tokens](../images/dashboard/azureAD/aad1.JPG)

Step 1. Go to "Authentication" page from the left side menu and check the 2 check boxes which are "Access Tokens" and "ID Tokens" and click on Save button from the top.

![Certifcates and secrets](../images/dashboard/azureAD/aad2.JPG)

Step 2. Go to Certificates & secrets from the side menu and create a secret. Click on the New client secret button and copy the value. This must be pass when you do a release along with the tenant id and client id.

![API Permissions](../images/dashboard/azureAD/aad4.JPG)

Step 3. Go to "API Permissions" from the left side menu and click on "Add a permission" button. Click on "Microsoft Graph" and click on "Delegated permissions" and search for Directory. Choose the Directory.Read.All and click on Add permissions button. Now click the "Grant admin consent for Codit" and it must turn as Granted the status of the new permission you added. 

![Expose an API](../images/dashboard/azureAD/aad9.png)

Step 4. Go To "Expose an API", Add the application ID URI: as the api://{client-id or also known as the application-id}, this can be found in the "Overview" section. Click on "Add a scope"

![Add Scope](../images/dashboard/azureAD/aad10.png)

Step 5. Fill in the form with the above image infromation. "access_as_user" for each of the textboxes, once finished click on "Add scope"

![Frant consent to delegated / admin permissions ](../images/dashboard/azureAD/aad8.JPG)

Step 6. Back to "Azure Active Directory" and from the left side menu click on the "Enterprise Application" and search for the one you just created and click on it. Now from the left hand side, click on "Owners" and Add yourself or whoever you want to be the owner of the application.

![Add Ownership to enterprise application](../images/dashboard/azureAD/aad5.JPG)

Step 7. Go to the "Permissions" page from the left side menu and click on the "Admin consent" "User consent" tab and click on the "Grant admin consent for Codit" button and continue with what it's telling you.

![Grant consent permissions for enterprise applications](../images/dashboard/azureAD/aad6.JPG)

Step 8. Once you are done from this, you are able to login from Invictus Dashboard. Obviously you need to provide the Tenant ID, Client ID and the client secret to the dashboard to connect your dashboard with the AAD.

![Tenant and client information](../images/dashboard/azureAD/aad7.JPG)