[home](../../README.md) | [framework](../framework.md)

# Matrix

## Introduction

The Matrix connector will be mainly used to promote properties from the content to the context using a promote config. The Matrix now also support JSON content and will promote any property to the context using JPath. All configs are to be stored in the storage container setup by the Resources ARM Template. The container which will house all configs is named: matrixconfigsstore.

This container will be made available on Startup of the Matrix API. All Logic apps using this connector will have a dropdown available which loads all configs located in the storage blob container. A config blob is also cached for a configurable amount of time to reduce reads from blob since this will be triggered on each execution. This also increases speed and will only hinder the call which finds the cache expired.

All technical logs are pushed to Application Insights, the setting for this can be found in the AppSettings of the API and can be switched to any other AppInsights. Authentication between the API and Key Vault will be handled using Managed Service Identity. This is all setup through the ARM template release.

For more information about the matrix functionality, follow the guides in the below pages:

* [Basic Promotion](matrix-basic.md)
* [Matrix Promotion](matrix-promote.md)
