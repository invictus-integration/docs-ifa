# Add Invictus Dashboard to release package
To deploy the Invictus Dashboard together with your customer solution, the first step is to include the Dashboard in your release package.

## 1. Save `Invictus-GetSources.ps1` script to your repository
The `Invictus-GetSources.ps1` script will pull the latest Invictus resources needed to deploy the Dashboard.

> [⬇️ Download `Invictus-GetSources.ps1`](https://invictusreleases.blob.core.windows.net/devops/prod/Invictus-GetSources.ps1?sp=r&st=2023-07-31T05:31:04Z&se=2060-07-31T13:31:04Z&spr=https&sv=2022-11-02&sr=b&sig=9xVYMoiiPjTgGXHfuA0UQcBo0g028U0fs1Wf0DCtsX4%3D)

## 2. Add variables to variable group.
To deploy Invictus, you will need some secrets for authentication. These secrets should be provided to you by **Codit Software**.

Once you have obtained these values, create a variable group named {prefix}.Invictus.Installation and add the below variables.

- **Invictus.Installation.StorageAccount.Name**: invictusreleases
- **Invictus.Installation.StorageAccount.Dashboard.SasToken**: value provided by Codit Software
- **Invictus.Installation.StorageAccount.Framework.SasToken**: value provided by Codit Software
- **Infra.Environment.ACRUsername**: value provided by Codit Software
- **Infra.Environment.ACRPassword**: value provided by Codit Software

## 3. Add YAML build pipeline
Add the files and folders from [this](./pipelines) location to your DevOps repo. 
This contains an example YAML pipelines to build the Invictus for Azure Dashboard, change the [dashboard.build.yaml](./pipelines/dashboard.build.yaml) file according to your needs, for example change the trigger path:
``` yaml
  paths:
    include:
    - /src/customer.azure.invictus
```

Afterwards add it in your DevOps environment as a pipeline. You may now proceed to the [release pipeline](dashboard-releasepipeline.md).
