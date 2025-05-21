# Framework Installation

This document lists the steps required to perform an installation of the Invictus Framework in your Azure environment.

## 1. Obtain Access

In order to have access to the resources stored on Azure Storage and Azure Container Registry you have to request an SAS-token and ACR Password from [coditproducts@codit.eu](mailto:coditproducts@codit.eu).

Once you receive these, you will use them in the next step: Creating the build pipeline.

## 2. Build Pipeline

Follow [this guide](framework-buildpipeline.md) to setup your build in Azure DevOps.

## 3. Release Pipeline

Follow [this guide](framework-releasepipeline.md) to setup your release in Azure DevOps.
