# Administrator Account Setup Guide

Welcome, administrators! This guide is intended for those who are logging in for the first time on a new fresh installation of the system using this version.

> 👉 Please note that this guide is not applicable to administrators who are migrating from Invictus V1 to Invictus V2 as you will be able to log in with you old credentials.

## Administrator Account Credentials

During the deployment of the system, an administrator account has been generated for your initial login to the dashboard.

> 🎖️ It is recommended to create a new `System Admin` user with your own email address after logging in for the first time. This will help during the [Forgot Password](./forgotpassword.md) procedure.

Follow the steps below to log in to the dashboard:

1. Navigate to the dashboard by visiting `https://{yourdashboardurl}` in your web browser.

2. Enter the following credentials:
   - **Username**: `admin`
   - **Password**: (the `tempAdminPassword` available as an [Azure Key vault secret](https://learn.microsoft.com/en-us/azure/key-vault/secrets/quick-create-portal) in the accompanied deployed vault)

   ![dashboard login page](../images/dashboard/AdminAccount/adminAccount-4.jpg)

3. After successfully logging in, you will be prompted to reset your password to one of your choice.

   ![dashboard reset password](../images/dashboard/AdminAccount/adminAccount-5.png)

4. 🎉 Congratulations! You have logged into the Invictus Dashboard for the first time.

