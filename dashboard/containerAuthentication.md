[Home](../README.md) | [Dashboard](dashboard.md) | [Container Authentication](containerAuthentication.md)

# Azure Active Directory App Registration Setup

## Purpose

This guide provides a quick setup for registering an Azure Active Directory (AAD) application. It includes creating a client secret, setting up API permissions, and preparing variables for pipeline use. This will allow for containers to authenticate the requests tht are being received.

### 1. **Create an App Registration**
1. In the [Azure portal](https://portal.azure.com), navigate to **Azure Active Directory** > **App registrations**.
2. Click on **New registration**.
3. Fill in:
   - **Name**: Enter a meaningful name for your app.
   - **Supported account types**: Choose **Accounts in this organizational directory only** (Single-tenant).
4. Click **Register** to create the app.

![Create an App Registration](../images/AAD-AppRegistration.png)

### 2. **Generate a Client Secret**
1. In your new App Registration, go to **Certificates & secrets**.
2. Under **Client secrets**, click **New client secret**.
3. Add a **Description** and set an **Expiration** period.
4. Click **Add**. 

> **Important**: Copy the **Client Secret Value** now, as you won't be able to see it again.

- **Save the following details in Notepad**:
  - **Application (client) ID** (found on the Overview page)
  - **Client Secret Value**

These values will be used as environment variables in your pipeline.

![Generate a Client Secret](../images/AAD-clientSecret.png)

### 3. **Set up API Permissions**
1. Go to the **Expose an API** tab.
2. Click **Add a scope**.
3. For **Scope name**, enter `user_impersonation`.
4. Set **Who can consent** to **Admins and Users**.
5. Provide a **Description** (e.g., "Allows the app to impersonate the user").
6. Click **Add scope** to save.

![Generate a Client Secret](../images/AAD-addScope.png)

---

### 4. **Next Steps**
Make sure to securely store the Application ID and Client Secret to apply to the parameters required in [dashboard release pipeline](../dashboard/installation/dashboard-releasepipeline.md)

