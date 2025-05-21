# Dashboard Installation

This document lists the steps required to perform an installation of the Invictus Dashboard in you Azure environment.

## 1. Obtain Access

In order to have access to the resources stored on Azure Storage and Azure Container Registry you have to request an SAS-token and ACR Password from [coditproducts@codit.eu](mailto:coditproducts@codit.eu).

Once you receive these, you will use them in the next step: Creating the build pipeline.

## 2. Build Pipeline

Follow [this guide](./dashboard-buildpipeline.md) to setup your build in Azure DevOps.

## 3. Release Pipeline

Follow [this guide](./dashboard-releasepipeline.md) to setup your release in Azure DevOps.

## 4. Setup

### V1 to V2 Migration Guide

If you're migrating from Invictus V1 to Invictus V2, please follow the [migration guide](./dashboard-migration.md).

### First Time Setup

If you are not migrating from Invictus V1 and installing for the first time, please follow the [setup guide](./first-time-login.md)

## 5. Access Control

Some Invictus components require various role assignments to function properly. Follow [this guide](../accesscontrolrights.md) for more info.
