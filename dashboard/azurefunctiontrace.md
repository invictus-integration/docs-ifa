---

filename: logging_extensions.md

---

# Logging Extensions and Middleware Documentation

## Overview

This documentation provides guidance to developers on how to use the `LoggerExtensions` and `LoggingTracingMiddleware` classes for logging within Azure Functions. These extensions serve as examples of how to extend `Microsoft.Extensions.Logging` and can be adapted to other logging frameworks.

### Enabling Diagnostic Data in Azure Functions

To ensure that logs are properly captured and routed, diagnostic data must be enabled for your Azure Function. Follow these steps:

1. Navigate to your **Azure Function App** in the Azure portal.
2. Under **Monitoring**, select **Diagnostic settings**.
3. Click **Add diagnostic setting**.
4. Check only **Function App Logs** from the available options.
5. Under **Destination details**, select **Stream to an event hub**.
6. Choose the event hub that ends with `-functions-evhb` to capture function-related logs.

This setup ensures that function logs are sent to an Event Hub, making them available for further processing and analysis.

---

## Logger Extensions (`LoggerExtensions`)

The `LoggerExtensions` class provides additional logging capabilities by extending the `ILogger` interface. It defines several methods to log structured events with specific `EventId` values.

### EventId Definitions

The following table lists the `EventId` values defined in the `LoggerExtensions` class:

| Event Name                 | EventId | Description                            |
| -------------------------- | ------- | -------------------------------------- |
| InvictusMessage            | 9001    | Logs general Invictus-related messages |
| InvictusProperties         | 9002    | Logs Invictus-specific properties      |
| InvictusInitializeFunction | 9002    | Logs function initialization events    |

### Logging Methods

#### `LogInvictusEvent(ILogger logger, string message, params object[] args)`

Logs a warning-level message using `InvictusMessage` as the `EventId`.

```csharp
public static void LogInvictusEvent(this ILogger logger, string message, params object[] args)
{
    logger.Log(LogLevel.Warning, new EventId(9001, "InvictusMessage"), message, args);
}
```

#### `LogInvictusEvent(ILogger logger, Exception exception, string message, params object[] args)`

Logs an exception along with a warning-level message using `InvictusMessage`.

```csharp
public static void LogInvictusEvent(this ILogger logger, Exception exception, string message, params object[] args)
{
    logger.Log(LogLevel.Warning, new EventId(9001, "InvictusMessage"), exception, message, args);
}
```

#### `InitializeFunctionExecutionTracing(ILogger logger, Dictionary<string, string> properties)`

Ensures a unique `x-ms-client-tracking-id` is present and logs properties using `InvictusInitializeFunction`.

```csharp
public static void InitializeFunctionExecutionTracing(this ILogger logger, Dictionary<string, string> properties)
{
    if (!properties.ContainsKey("x-ms-client-tracking-id"))
    {
        properties["x-ms-client-tracking-id"] = Guid.NewGuid().ToString();
    }
    logger.Log(LogLevel.Warning, new EventId(9002, "InvictusInitializeFunction"), "{@properties}", properties);
}
```

#### `AddOrUpdateInvictusProperty(ILogger logger, string key, string value)`

Logs a dictionary with a single key-value pair using `InvictusProperties`.

```csharp
public static void AddOrUpdateInvictusProperty(this ILogger logger, string key, string value)
{
    var properties = new Dictionary<string, string>
    {
        { key, value }
    };
    logger.Log(LogLevel.Warning, new EventId(9002, "InvictusProperties"), "{@properties}", properties);
}
```

#### `AddOrUpdateInvictusProperties(ILogger logger, Dictionary<string, string> properties)`

Logs multiple key-value pairs using `InvictusProperties`.

```csharp
public static void AddOrUpdateInvictusProperties(this ILogger logger, Dictionary<string, string> properties)
{
    logger.Log(LogLevel.Warning, new EventId(9002, "InvictusProperties"), "{@properties}", properties);
}
```

---

## Logging Middleware (`LoggingTracingMiddleware`)

The `LoggingTracingMiddleware` class is an Azure Functions middleware component that intercepts incoming HTTP requests and extracts request headers for logging.

### Implementation Steps

1. **Register the Middleware** Ensure that the middleware is registered in your Azure Function startup configuration.

2. **Extract Headers and Log** The middleware reads incoming request headers and logs them using the `InitializeFunctionExecutionTracing` method.

### Middleware Implementation

#### `LoggingTracingMiddleware`

```csharp
public class LoggingTracingMiddleware : IFunctionsWorkerMiddleware
{
    private readonly ILogger<LoggingTracingMiddleware> _logger;

    public LoggingTracingMiddleware(ILogger<LoggingTracingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var req = await context.GetHttpRequestDataAsync();
        GetFunctionRequestHeaders(req);
        await next(context);
    }

    private void GetFunctionRequestHeaders(HttpRequestData request)
    {
        if (request != null)
        {
            IDictionary<string, IEnumerable<string>> headersDictionary = new Dictionary<string, IEnumerable<string>>();
            foreach (var header in request.Headers)
            {
                headersDictionary[header.Key] = header.Value;
            }
            var headers = HeaderProcessor.ExtractPrefixedHeaders(headersDictionary);
            _logger.InitializeFunctionExecutionTracing(headers);
        }
    }
}
```
#### `HeaderProcessor`

```csharp
    /// <summary>
    /// Provides methods to extract and process specific headers from HTTP requests
    /// </summary>
    public static class HeaderProcessor
    {
        /// <summary>
        /// Extracts headers that start with specific prefixes from a dictionary of headers
        /// </summary>
        /// <param name="headers">Dictionary containing header key-value pairs</param>
        /// <param name="prefixes">Optional array of prefixes to filter headers by. Defaults to ["x-invictus", "x-ms"]</param>
        /// <returns>Dictionary containing the matched headers as key-value pairs</returns>
        /// 

        private static readonly string[] prefixes = ["x-invictus", "x-ms"];

        public static Dictionary<string, string> ExtractPrefixedHeaders(IDictionary<string, IEnumerable<string>> headers)
        {

            if (headers == null || headers.Count == 0) 
            {
                return new Dictionary<string, string>();
            }

            var headersDictionary = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var header in headers)
            {
                foreach (var prefix in prefixes)
                {
                    if (header.Key.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                    {
                        headersDictionary[header.Key] = string.Join(", ", header.Value);
                        break;
                    }
                }
            }

            return headersDictionary;
        }
    }
```
---

## Conclusion

The `LoggerExtensions` and `LoggingTracingMiddleware` classes provide reusable logging functionalities for Azure Functions.

