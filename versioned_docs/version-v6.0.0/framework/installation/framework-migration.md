---
sidebar_class_name: hidden
---

# Framework Migration Guide

This document will guide you through the process of migrating the build & release pipelines to the new procedure associated with version 2.4.0 or greater.

## Build Pipeline

Nothing changes for the build pipeline.

The difference lies in the artifacts that the build produces, everything needed for the release is now included in the build (scripts, resources, etc..), which greatly simplifies the release pipeline.

## Release Pipeline

The task group is now replaced by a single Azure Powershell task included in the build artifacts. Please refer to the [release pipeline](framework-releasepipeline.mdx) for more information.

The following task group parameters should be used as the powershell's arguments:

- ArtifactsPath: -ArtifactsPath
- ResourcePrefix: -ResourcePrefix
- AzureResourceGroup: -ResourceGroupName
- Location: -ResourceGroupLocation

The AdditionalTemplateParameters can simply be copied and added to the Script Arguments.

If you are using the Azure PowerShell task to retrieve the access policies from key vault, then this task should also be removed from the release pipeline as it is now also included in the deployment script.

You can copy the **-keyvaultName** argument to the new powershell arguments.
