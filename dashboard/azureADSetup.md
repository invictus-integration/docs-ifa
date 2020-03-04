[home](../README.md) | [dashboard](dashboard.md) | [Azure AD Setup](azureADSetup.md)

# Azure Active Directory Setup

## Setting up the Azure Active Directory setup from the Azure Portal Dashboard 

First, go to "Azure Active Directory" and from the left side menu click on the "App Registrations" and click on the "New Registration" button on top of the page. 

![Create new app registration](../images/dashboard/azuread1.JPG)

1. Enter a name for your app registration.
2. Choose the "Accounts in any organizational directory (Any Azure AD directory - Multitenant)".
3. Now for the "Redirect URI" enter links that you are going to use from where you are going to login from. Such as "https://invictus-dev-we-sft-invictusdashboard.azurewebsites.net/login". This will ensure that from where you are loging is legit and no one can use your tenant id from another domain or so.
4. Click on Register button.

![Access Tokens and ID Tokens ](../images/dashboard/azuread2.JPG)

Now go to the "Manifest" link from the left side menu and in the replyUrlsWithType node, insert the your url from which you are going to login plus * (wildcard), like the picture underneath.

![Reply Url Wildcard ](../images/dashboard/azuread6.JPG)

Now go to "Authentication" page from the left side menu and check the 2 check boxes which are "Access Tokens" and "ID Tokens" and click on Save button from the top.

![Create owner](../images/dashboard/azuread3.JPG)

Now go back to "Azure Active Directory" and from the left side menu click on the "Enterprise Application" and search for the one you just created and click on it. Now from the left hand side, click on "Owners" and Add yourself or whoever you want to be the owner of the application.

![Grant permissions to users logging in](../images/dashboard/azuread4.JPG)

Now go to the "Permissions" page from the left side menu and click on the "User Consent" tab and click on the "Grant admin consent for Codit" button and continue with what it's telling you.

![Client ID and Tenant ID](../images/dashboard/azuread5.JPG)

Once you are done from this, you are able to login from Invictus Dashboard. Obviously you need to provide the Tenant ID and Client ID to the dashboard to connect your dashboard with the AAD.