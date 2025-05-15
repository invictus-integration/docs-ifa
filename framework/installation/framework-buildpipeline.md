# Framework Build Pipeline

The build pipeline uses a powershell script to pull the resources needed for the release. This script can be downloaded from [here](https://github.com/invictus-integration/docs-ifa/blob/containerization/dashboard/installation/scripts/Invictus-GetSources.ps1). Make sure to include it in your Git repository (e.g. in the deploy folder).

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
Add the files and folders from [this](./pipelines) location to your DevOps repo. 
This contains an example YAML pipelines to build the Invictus for Azure Framework, change the [framework.build.yaml](./pipelines/framework.build.yaml) file according to your needs, for example change the trigger path:
``` yaml
  paths:
    include:
    - /src/customer.azure.invictus
```

Afterwards add the [framework.build.yaml](./pipelines/framework.build.yaml) in your DevOps environment as a pipeline, once you've saved the build pipeline you can create the [release pipeline](framework-releasepipeline.md)
