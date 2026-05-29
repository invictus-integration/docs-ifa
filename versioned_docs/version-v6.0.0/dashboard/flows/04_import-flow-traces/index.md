# Import flow traces from external sources
Invictus allows you to import 'flow traces' from different sources (Azure Logic App workflows, Azure Data Factory, HTTP…). 'Importers' collects these traces via diagnostic information and stores them. The Dashboard then shows the current status of the business user-defined 'flow'.

## Automatic deletion of flow traces
To keep the flow trace storage clean, there exists a time-to-live (TTL) setting to automatic delete diagnostic traces.

You must set the TTL value by passing a positive integer value to the `-FlowDataTTLInDays` parameter in your release pipeline. 

Example:
`-FlowDataTTLInDays 90`

This integer represents the amount of days the storage retains the data. This is a **required** value which the pipeline won't execute without. Choose an appropriate value for your scenario.

You can update the TTL value later by passing a different integer to the `-FlowDataTTLInDays` parameter. The previous TTL index drops and recreates automatically with the new value.

:::warning[first time run]
The first installation including the TTL capabilities, there may be a large accumulation of outdated records which require deletion (depending on your scenario). This could cause a high load on the Azure Cosmos DB. Best plan this cleaning during the best off-peak hours for your system.
:::