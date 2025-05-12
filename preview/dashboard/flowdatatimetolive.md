# Flow Data Time to Live

Invictus V2 now includes functionality to set a time-to-live value (TTL) on the flow and workflow event data stored in Cosmos DB. This means that once the age of the data exceeds the TTL value, that data is automatically deleted. 

This is based on the Cosmos DB API for MongoDB `_ts` property. This is a system property which contains the timestamp of the document's last modification.

## Setting the Time to Live value

The TTL value must be set by passing a positive integer value to the `FlowDataTTLInDays` parameter in your release pipeline. 

Example:
`-FlowDataTTLInDays 90`

This integer represents the amount of days the data will be allowed to live in the database. This is a **required** value 
which the pipeline will not execute without, therefore you will have to choose an appropriate value for your scenario. 

The TTL value can later be updated by passing a different integer to the `FlowDataTTLInDays` parameter. The previous TTL index will be automatically dropped and recreated with the new value.

## First time run

The first time Invictus V2 is updated to include the TTL functionality, there may be a large accumulation of outdated records which will require deletion (depending on your scenario). This could cause a high load on the CosmosDB. Therefore, we recommend that such an upgrade takes place during the best off-peak hours for your system.
