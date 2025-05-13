[home](../../README.md) | [framework](../framework.md)

# Framework Installation

This document will guide you through the setup of your build and release pipeline using Azure DevOps. The dashboard resources are stored on Azure blob storage, so the first thing you will need is access to that storage.

## Azure Storage

In order to have access to the resources stored on Azure blob storage you have to request an SAS-token from Codit Software by emailing to  [coditproducts@codit.eu](mailto:coditproducts@codit.eu).

Once you receive the SAS-token, you will use it in the next step: creating the build pipeline.

## Build Pipeline

Follow [this guide](framework-buildpipeline.md) to setup your build in Azure DevOps.

## Release Pipeline

Follow [this guide](framework-releasepipeline.md) to setup your release in Azure DevOps.

## Migration Guide

If you're migrating from a version previous to version 2.4.0 you might find our [migration guide](framework-migration.md) helpful.
