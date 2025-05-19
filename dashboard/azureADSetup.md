# Give Invictus access to your Azure Active Directory
To use your Azure Active Directory groups as a way of authentication and flow authorization, you need to follow these steps.

1. [**Register an application Invictus redirects**](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api)
   * Choose the <u>multi-tenant</u> account type option to let Invictus be able to use the app registration.
   * Add <u>Redirect URI`s</u> to **your** Invictus pages, i.e.:
<!-- md-dead-link-check: off -->
     * <a href="/">https://your-invictusdashboard.azurewebsites.net/login</a> 
     * <a href="/">https://your-invictusdashboard.azurewebsites.net/api/auth/callback/azure-ad</a>
<!-- md-dead-link-check: on -->
     * 👉 Make sure to check the **☑️ Access tokens** checkbox to issue tokens ([more info](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-implicit-grant-flow?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps))
   * Add new <u>client secret</u> (copy value for later use)
   * Linked Enterprise application:
     * Assign <u>Owners</u> ([more info](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-app-owners?pivots=portal))
     * Grant <u>Admin consent</u> ([more info](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal))

2. [**Let app expose an API with scoped permissions**](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope)
   * Use default <u>Application ID URI</u> (copy value for later use).
   * Add scope with <u>Admin and users</u> consent.

3. [**Add API permissions**](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-access-web-apis)
   * <u>Microsoft.Graph/</u>
     * <u>Directory.Read.All</u> **Delegated** (looking up directory objects)
     * <u>User.Read</u> **Delegated** (looking up users)
     * <u>User.Read.All</u> **Delegated** + **Application** (looking up user's info)
     * <u>Group.Read.All</u> **Application** (looking up available groups)
     * <u>Mail.Send</u> **Application** (sending 'forgot password' mails)
   * <u>My API's</u> **Delegated** (the scoped API permission you've created in the previous step)

4. **Pass app registration values to Invictus deployment**
   * `azureActiveDirectoryClientId` (**App registration > overview**)
   * `azureActiveDirectoryTenantId` (**App registration > overview**)
   * `azureActiveDirectoryClientSecret` (paste from previous generation)
   * `azureActiveDirectoryAudience` (default <u>Application ID URI</u>)

