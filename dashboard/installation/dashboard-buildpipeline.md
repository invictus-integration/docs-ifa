[home](../../README.md) | [dashboard](../dashboard.md) | [dashboard installation](dashboard-installation.md)

# Dashboard Build Pipeline

The build pipeline uses a powershell script to pull the resources needed for the release. This script can be downloaded from [here](https://invictusreleases.blob.core.windows.net/devops/prod/Invictus-GetSources.ps1?sp=r&st=2023-07-31T05:31:04Z&se=2060-07-31T13:31:04Z&spr=https&sv=2022-11-02&sr=b&sig=9xVYMoiiPjTgGXHfuA0UQcBo0g028U0fs1Wf0DCtsX4%3D). Make sure to include it in your Git repository (e.g. in the deploy folder).

The pipeline will use variables stored in a variable group, so before creating the build pipeline open the DevOps Library page and create a new variable group.

## Variable Group

Create a variable group named {prefix}.Invictus.Installation and add these variables:

- **Invictus.Installation.StorageAccount.Name**: invictusreleases
- **Invictus.Installation.StorageAccount.Dashboard.SasToken**: value provided by Codit Software
- **Invictus.Installation.StorageAccount.Framework.SasToken**: value provided by Codit Software
- **Infra.Environment.ACRUsername**: value provided by Codit Software
- **Infra.Environment.ACRPassword**: value provided by Codit Software

Once you have the variable group, we can now proceed to creating the build pipeline.

## YAML Pipeline
Add the files and folders from [this](https://github.com/invictus-integration/docs-ifa/tree/master/dashboard/installation/pipelines) location to your DevOps repo. 
This contains an example YAML pipelines to build the Invictus for Azure Dashboard, change the [dashboard.build.yaml](https://github.com/invictus-integration/docs-ifa/blob/master/dashboard/installation/pipelines/dashboard.build.yaml) file according to your needs, for example change the trigger path:
``` yaml
  paths:
    include:
    - /src/customer.azure.invictus
```

Afterwards add the [dashboard.build.yaml](https://github.com/invictus-integration/docs-ifa/blob/master/dashboard/installation/pipelines/dashboard.build.yaml) in your DevOps environment as a pipeline, once you've saved the build pipeline you can create the [release pipeline](dashboard-releasepipeline.md).
