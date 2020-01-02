[home](../../README.md) | [dashboard](../dashboard.md)

# Framework Migration Guide

This document will guide you through the process of migrating the build & release pipelines to the new procedure associated with version 2.4.0 or greater.

## Build Pipeline

Nothing changes for the build pipeline.

The difference lies in the artifacts that the build produces, everything needed for the release in now included in the build (powershells, resources, etc..), which greatly simplyfies the release pipeline.

## Release Pipeline

