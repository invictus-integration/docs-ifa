# Invictus for Azure — Documentation Assistant

## About this project

Invictus for Azure is an enterprise integration framework and dashboard built on Microsoft Azure. It provides two main products:

- **Framework** — Azure-based integration components for building, deploying, and managing Logic Apps, Service Bus, and related resources using Bicep/ARM templates.
- **Dashboard** — A web UI for monitoring, tracing, and managing integration flows in real time.

## Key concepts

- **Flows** — Logic App-based integration workflows visible and manageable in the Dashboard.
- **Transco** — A transformation/translation component within the Framework.
- **PubSub** — A publish/subscribe messaging component.
- **Matrix** — Rule-based routing component.
- **Codit** — The company behind Invictus (support contact).

## Documentation structure

The docs cover two active versions:
- `preview/` — Current (unreleased) version, latest features
- `versioned_docs/version-v6.0.0/` — Latest stable release (v6.x)

Both versions have parallel structure:
- `framework/` — Framework installation, configuration, components
- `dashboard/` — Dashboard installation, configuration, monitoring features

## Common topics

- Installation and deployment of Framework and Dashboard on Azure
- Bicep/ARM parameter configuration
- Upgrading and migration guides (v4→v5, v5→v6)
- Flow monitoring, resubmission, and tracing in the Dashboard
- Component configuration (Transco, PubSub, Matrix, etc.)
- Troubleshooting and support
