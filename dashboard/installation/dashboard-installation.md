[home](../../README.md) | [dashboard](../dashboard.md)

# Dashboard Installation

This document will guide you through the setup of your build and release pipeline using Azure DevOps. The dashboard resources are stored on Azure blob storage, so the first thing you will need is access to that storage.

## Azure Storage

In order to have access to the resources stored on Azure blob storage you have to request an SAS-token to [coditproducts@codit.eu](mailto:coditproducts@codit.eu).

Once you receive the SAS-token, you will use it in the next step: Creating the build pipeline.

## Build Pipeline

Follow [this guide](dashboard-buildpipeline.md) to setup your build in Azure DevOps.

## Release Pipeline

Follow [this guide](dashboard-releasepipeline.md) to setup your release in Azure DevOps.
