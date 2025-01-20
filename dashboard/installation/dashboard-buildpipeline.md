# Add Invictus Dashboard to build pipeline
To deploy the Invictus Dashboard together with your customer solution, the first step is to include the Dashboard in your release package.

## 1. Save `Invictus-GetSources.ps1` script to your repository
The `Invictus-GetSources.ps1` script will pull the latest Invictus resources needed to deploy the Dashboard.

> [⬇️ Download `Invictus-GetSources.ps1`](https://invictusreleases.blob.core.windows.net/devops/prod/Invictus-GetSources.ps1?sp=r&st=2023-07-31T05:31:04Z&se=2060-07-31T13:31:04Z&spr=https&sv=2022-11-02&sr=b&sig=9xVYMoiiPjTgGXHfuA0UQcBo0g028U0fs1Wf0DCtsX4%3D)

## 2. Add SAS storage token as pipeline variable
When pulling the Invictus resources, the SAS storage token is used to authenticate the request. This token should be provided to you by **Codit Software**.

## 3. Add YAML tasks
The following YAML tasks show how the `Invictus-GetSources.ps1` script is used to pull the Invictus resources and save the result as a pipeline artifact for later use upon releasing your solution.

```yaml
- task: PowerShell@2
  displayName: 'Pull Sources'
  inputs:
    targetType: filePath
    filePath: './Invictus-GetSources.ps1'
    arguments: >
      -StorageAccountName 'invictusreleases'
      -StorageSasToken "$(Your.Personal.SasToken)"
      -StorageContainerName 'dashboard-v2'
      -SaveLocation '$(Build.ArtifactStagingDirectory)'
      -UseBeta false

- task: PublishPipelineArtifact@1
  inputs:
    TargetPath: $(Build.ArtifactStagingDirectory)
    ArtifactName: 'invictus-dashboard'
    publishLocation: 'pipeline'

- task: PublishPipelineArtifact@1
  inputs:
    TargetPath: deploy
    ArtifactName: scripts
```