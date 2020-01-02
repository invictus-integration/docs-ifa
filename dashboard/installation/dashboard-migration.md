[home](../../README.md) | [dashboard](../dashboard.md)

# Dashboard Migration Guide

This document will guide you through the process of migrating the build & release pipelines to the new procedure associated with version 4.7.0 or greater.

## Build Pipeline

### Remove Backend

Backend and Dashboard have now merged in one build, this means that Backend will no longer be used so this build pipeline can be safely deleted.

### New Storage container

The storage container has been renamed from **dashboardfrontend** to **dashboard**, which means that you need to request a new SAS token and update the variable accordingly.

Next, navigate to the powershell task that pulls the resources from blob and change the StorageContainerName parameter value from **dashboardfrontend** to **dashboard**.

Apart from this new storage container, nothing changes for the build pipeline.

The difference lies in the artifacts that the build produces, everything needed for the release in now included in the build (powershells, resources, etc..), which greatly simplyfies the release pipeline.

## Release Pipeline


