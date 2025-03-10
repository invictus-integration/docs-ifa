# Azure Container App Scaling

Azure Container Apps allow for flexible scaling customization. In Invictus we have provided default scaling values which can be customized according to your scenario.

Container Apps have the ability to scale down to zero replicas. This is a great cost-saving option especially for components which are not used at all. A container app scaled to zero will automatically scale out when triggered, however this may take up to a few minutes to complete. This could prove to be an issue in scenarios with limited timeout e.g. logic apps with 120 seconds timeout. In such cases there is no option but to set a minimum replica count of 1.

## Dashboard Scaling Parameters

- `dashboardScaling`
- `dashboardGatewayScaling`
- `cacheImportJobScaling`
- `dbImportJobScaling`
- `datafactoryReceiverScaling`
- `flowhandlerScaling`
- `genericReceiverScaling`
- `httpReceiverScaling`
- `importJobScaling`
- `storeImportJobScaling`

## Framework Scaling Parameters
- `timeSequencerScaling`
- `exceptionHandlerScaling`
- `pubSubV2Scaling`
- `regexTranslatorScaling`
- `sequenceControllerScaling`
- `transcoV2Scaling`
- `xmlJsonConverterScaling`
- `xsdValidatorScaling`

## Custom Scaling Properties

Each of the above parameters accepts an object:

```
{
  scaleMinReplicas: int
  scaleMaxReplicas: int
  cpuResources: string
  memoryResources: string
}
```

- `scaleMinReplicas`: The lowest number of replicas the Container App will scale in to.
- `scaleMaxReplicas`: The highest number of replicas the Container App will scale out to.
- `cpuResources`: The amount of cpu resources to dedicate for the container resource. See [here](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations) for allowed values.
- `memoryResources`: The amount of cpu resources to dedicate for the container resource. See [here](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations) for allowed values.

These values can be overriden in your release pipeline by passing the updated object to the respective parameter. 

Example:

`-exceptionHandlerScaling @{cpuResources="0.5";memoryResources="1.0Gi";scaleMaxReplicas=1;scaleMinReplicas=1}`
