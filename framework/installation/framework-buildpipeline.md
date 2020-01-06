[home](../../README.md) | [framework](../framework.md) | [framework installation](framework-installation.md)

# Framework Build Pipeline

The build pipeline uses a powershell script to pull the resources needed for the release. This script can be downloaded [here](https://invictusreleases.blob.core.windows.net/devops/prod/Invictus-GetSources.ps1?st=2019-07-04T04%3A23%3A07Z&se=2050-07-05T04%3A23%3A00Z&sp=rl&sv=2017-07-29&sr=b&sig=QBgU4yCVEXeV4CHWlaA9fgTYO6y88hnFlYhsmEJVM1c%3D). Make sure to include it in your Git repository (e.g. in the deploy folder).

The pipeline will use variables stored in a variable group, so before creating the build pipeline open the DevOps Library page and create a new variable group.

## Variable Group

Create a variable group named {prefix}.Invictus.Installation and add these variables:

- **Invictus.Installation.StorageAccount&#46;Name**: invictusreleases
- **Invictus.Installation.StorageAccount.Dashboard.SasToken**: value provided by Codit Software
- **Invictus.Installation.StorageAccount.Framework.SasToken**: value provided by Codit Software

Once you have the variable group, we can now proceed to creating the build pipeline.

## Create the build pipeline

Create a new build pipeline, starting with an empty template with this naming: {prefix}.Invictus.Framework.

Select 'Azure Pipelines' as the agent pool and 'vs2017-win2016' as the agent specification.

Link the previously created variable group with the build.

Configure a build number, using semantic versioning (eg: `1.0$(rev:.r)`)

The build will have only 2 tasks:

- A powershell task to pull the resources from blob
- A publish artifacts task

### Powershell task

Add a PowerShell task to the pipeline and name it **Pull Framework**, then point the script path to the powershell you downloaded at the beginning of this guide.

Copy/paste the following arguments for the script:

```powershell
-StorageAccountName "$(Invictus.Installation.StorageAccount.Name)" -StorageSasToken  "$(Invictus.Installation.StorageAccount.Framework.SasToken)" -StorageContainerName "framework" -SaveLocation "$(Build.ArtifactStagingDirectory)" -UseBeta $False
```

or configure it with these:

- **StorageAccountName** (mandatory): `$(Invictus.Installation.StorageAccount.Name)`.
- **StorageSasToken** (mandatory): `$(Invictus.Installation.StorageAccount.Framework.SasToken)`.
- **StorageContainerName** (mandatory): framework
- **Version** (optional): by default this will get the latest version of the resources, but you can override this by specifying the version nr here.
- **SaveLocation** (mandatory): `$(build.artifactstagingdirectory)`
- **UseBeta** (optional): by default this is false and will look for the resources in the prod folder, when set to true it will use the resources from the staging folder.

### Publish Artifacts task

Add a Publish build artifacts task to the pipeline and name it **Publish Framework**, use `$(Build.ArtifactStagingDirectory)` as the path to publish (or the SaveLocation argument you specified in the previous task).

Use **Framework** as the artifact name.

Once you've saved the build pipeline you can create the [release pipeline](framework-releasepipeline.md).
