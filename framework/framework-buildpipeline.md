# Build Pipeline

The build pipeline uses a powershell script  will use variables stored in a variable group, so before creating the build pipeline open the DevOps Library page and create a new variable group.

## Variable Group

Create a variable group named {prefix}.Invictus.Installation and add these variables:

- **Invictus.Installation.StorageAccount.Name**: invictusreleases
- **Invictus.Installation.StorageAccount.Dashboard.SasToken**: value provided by Codit Software
- **Invictus.Installation.StorageAccount.Framework.SasToken**: value provided by Codit Software

Once you have the variable group, we can now proceed to creating the build pipeline.

## Create the build pipeline

Create a new build pipeline, starting with an empty template with this naming: {prefix}.Invictus.Framework.

Select 'Azure Pipelines' as the agent pool and 'vs2017-win2016' as the agent specification.

Link the previously created variable group with the build.

Configure a build number, using semantic versioning (eg: 1.0$(rev:.r))

