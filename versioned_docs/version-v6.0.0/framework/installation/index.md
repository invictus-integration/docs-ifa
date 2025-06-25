# Framework Installation

This document lists the steps required to perform an installation of the Invictus Framework in your Azure environment.

## 1. Obtain Access

In order to have access to the resources stored on Azure Storage and Azure Container Registry you have to request an SAS-token and ACR Password from [coditproducts@codit.eu](mailto:coditproducts@codit.eu).

Once you receive these, you will use them in the next step: Creating the build pipeline.

## 2. Build Pipeline

Follow [this guide](framework-buildpipeline.md) to setup your build in Azure DevOps.

## 3. Release Pipeline

Follow [this guide](framework-releasepipeline.mdx) to setup your release in Azure DevOps.

## 4. VNET Support

Enabling Azure Virtual Network support for the Invictus Framework is an identical process as for the Invictus Dashboard. Therefore you can follow the same guide found [here](../../dashboard/installation/dashboard-vnet.md).

A full list of VNET specific parameters which can be passed to Framework release pipeline can be found [here](./framework-releasepipeline.mdx).

## Migrating pipelines
Migrating the build & release pipelines to the new procedure associated with version 2.4.0 or greater can be found [here](./framework-migration.md)