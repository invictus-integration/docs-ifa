# Import flow traces from external sources
Invictus allows 'flow traces' to be imported from various different sources (Azure Logic App workflows, Azure Data Factory, HTTP...). Via diagnostic information, these traces are collected in Invictus' backend storage and so that the current status of the 'flow' can be shown in the Dashboard.

## Automatic deletion of flow traces
To keep the backend storage clean, there exists a possibility to automatic delete diagnostic traces. This can be done by setting the time-to-live (TTL).

The TTL value must be set by passing a positive integer value to the `FlowDataTTLInDays` parameter in your release pipeline. 

Example:
`-FlowDataTTLInDays 90`

This integer represents the amount of days the data will be allowed to live in the database. This is a **required** value 
which the pipeline will not execute without, therefore you will have to choose an appropriate value for your scenario. 

The TTL value can later be updated by passing a different integer to the `FlowDataTTLInDays` parameter. The previous TTL index will be automatically dropped and recreated with the new value.

:::warning[first time run]
The first time Invictus V2 is updated to include the TTL functionality, there may be a large accumulation of outdated records which will require deletion (depending on your scenario). This could cause a high load on the CosmosDB. Therefore, we recommend that such an upgrade takes place during the best off-peak hours for your system.
:::