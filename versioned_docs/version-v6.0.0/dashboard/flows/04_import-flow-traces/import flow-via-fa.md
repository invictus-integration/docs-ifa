# Import flow traces via Azure Function App logs
Invictus allows developers to import flow traces via application logs coming from Azure Function Apps. These logs translate to the startup of the Function App, but can also contain developer-custom logging. Combined, they result in an execution tree in the Dashboard that represents.

## Send diagnostic traces from Function App
Configure the [diagnostic settings](https://learn.microsoft.com/en-us/azure/azure-monitor/platform/diagnostic-settings) on the target Function App to monitor, to send the [`Function Application Logs`](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/functionapplogs) to the Invictus Event Hub that can import these logs:

| Event Hub property | Value                                      |
| ------------------ | ------------------------------------------ |
| Namespace          | `invictus-{resourcePrefix}-we-sft-evnm`    |
| Hub name           | `invictus-{resourcePrefix}-functions-evhb` |

:::tip[automate configuration]
Take a look at [Bicep AVM](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/insights/diagnostic-setting) to automate this diagnostic setting configuration in your deployment.
:::

## Log custom information from Function App
Besides the default application logs, Invictus can extract custom information from custom logs. These logs are indicated with the `EventName=InvictusLog`. Invictus assumes that the log message is a JSON object. The following JSON properties can be used to set customer information on all (including default) application logs, which can be used to map the entire set of application logs to pre-defined flows in the Dashboard.

```csharp
var properties = new Dictionary<string, string>
{
    ["x-iv-domain"] = "<domain>",
    ["x-iv-service"] = "<service>",
    ["x-iv-action"] = "<action>",
    ["x-iv-version"] = "<version>",
    ["x-iv-milestone"] = "<milestone>",
    ["x-iv-eventtext"] = "<event-text>",
    ["x-iv-operation-name"] = "<workflow-name>",
    ["x-iv-chain-id"] = "<transaction-id>",
    ["x-iv-parent-id"] = "<operation-parent-id>"
};

logger.LogInformation(new EventId(0, "InvictusLog"), JsonSerializer.Serialize(properties));
```

