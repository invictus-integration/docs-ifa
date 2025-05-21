---
sidebar_class_name: hidden
---

# Add Invictus Dashboard to release package
To deploy the Invictus Dashboard together with your customer solution, the first step is to include the Dashboard in your release package.

## 1. Save `Invictus-GetSources.ps1` script to your repository
The `Invictus-GetSources.ps1` script will pull the latest Invictus resources needed to deploy the Dashboard.

> [⬇️`Invictus-GetSources.ps1`](https://github.com/invictus-integration/docs-ifa/blob/master/dashboard/installation/scripts/Invictus-GetSources.ps1)

## 2. Add variables to variable group.
To deploy Invictus, you will need some secrets for authentication. These secrets should be provided to you by **Codit Software**.

Once you have obtained these values, create a variable group named `{prefix}.Invictus.Installation` and add the below variables.

- **Invictus.Installation.StorageAccount.Name**: invictusreleases
- **Invictus.Installation.StorageAccount.Dashboard.SasToken**: value provided by Codit Software
- **Invictus.Installation.StorageAccount.Framework.SasToken**: value provided by Codit Software
- **Infra.Environment.ACRUsername**: value provided by Codit Software
- **Infra.Environment.ACRPassword**: value provided by Codit Software

## 3. Add YAML build pipeline
Next step is to add a YAML pipeline to build the Invictus for Azure Dashboard. Change the [dashboard.build.yaml](./pipelines/dashboard.build.yaml) file according to your needs, for example change the trigger path:
``` yaml
  paths:
    include:
    - /src/customer.azure.invictus
```

Afterwards add it in your DevOps environment as a pipeline. You may now proceed to the [release pipeline](dashboard-releasepipeline.md).
