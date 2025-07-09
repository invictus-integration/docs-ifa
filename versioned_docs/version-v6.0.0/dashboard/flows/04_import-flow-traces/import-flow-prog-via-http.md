# Import flow traces programmatically via HTTP
Invictus allows developers to programmatically import flow traces via a HTTP endpoint. This resource can be located by the following name format:

* `https://inv-{env}-we-sft-httpreceiver.*.northeurope.azurecontainerapps.io`

## Sending flow traces to Invictus
The HTTP flow import accepts a series of `event` models in a JSON array, each representing a status of the flow:
```powershell
curl -X POST --data '[
   {
      // Flow started event.
   },
   {
      // Flow completed event.
   }
]' https://inv-{env}-we-sft-httpreceiver.*
```

The minimal `event` values are defined as follows:

```json
// event
{
   // When event was executed, recommended UTC datetime.
   // (used to determine the order of events)
   "Time":"2019-07-23 08:55:04.0500000 +00:00",

   // Transactional ID to link events together.
   // (like 'client tracking ID')
   "ChainId": "edbd5ddb-b206-4437-8ac3-5401b148c8cb",

   // Represents a single 'step' taken in the transaction of events.
   // (like workflow 'Started')
   "Step": {
      // Operation ID within the transaction of events.
      // (like 'workflow run ID')
      "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299",

      // Human-readable name for the operation/step ID.
      "Name": "Invoice",

      // Available values are:
      // - Started
      // - Active
      // - Cancelled
      // - Completed
      // -Failed
      "Status": "Started"
   }
}
```

:::warning
A `Started` event is always required to create at least a single event in Invictus' backend storage. A `Completed`/`Failed` event then indicates the end of a given operation.
:::

## Map Dashboard flows to HTTP receive events
Make sure that any of the `event` mappings match the the values in the [flow created via the Dashboard](../01_add.mdx)

```json
// event
{
   // [omitted]
   "Mappings": {
      "Domain": "Invoicing",
      "Action": "New invoice",
      "Service": "Invoice system",
      "Version": "v1.2.3"
   }
}
```

## Execution tree of sequentially events
To create parent-child relationships, the `Step.Id`/`Step.ParentId` combination
is used. This link is similar as how the `x-iv-parent-workflow-run-id` is set when importing flows via Azure Logic App workflows.

```json
[
   // event
   {
      // [omitted]
      "Step": {
         "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299"
         // [omitted]
      }
   },
   // event
   {
      // [omitted]
      "Step": {
         "Id": "3e8e3fa4-b85a-4ee6-aaea-e0fd82008f8c",
         "ParentId": "8ecd1ea4-de94-4741-9c4a-a18477398299"
         // [omitted]
      }
   }
]
```

## Tracked properties of events
Besides the `Milestone` and `EventText`, there also exists a set of custom `Data` properties that can be linked to the flow.

```json
// event
{
   // [omitted]
   "Properties": {
      "Milestone": "LA-A-Reached",
      "EventText": "Line1-A",
      "Data": {
         "MyKey1": "MyValue1",
         "MyKey2": "MyValue2"
      }
   }
}
```

### Errors on events
If an event represents an error, it can provide additional information in the form of a `code` and a `description`:

```json
// event
{
   // [omitted]
   "Error": {
      "Code": "123",
      "Description": "there was a failure during this operation"
   }
}
```

### Azure link on events
If an event can be traced back to an Azure resource, this information can be added to the event so that it can be provided as details in the Dashboard.

```json
// event
{
   "Azure": {
      "ResourceId": "/subscriptions/.../resourceGroups/...",
      "PortalLink": "https://portal.azure.com/to-your-resource"
   }
}
```