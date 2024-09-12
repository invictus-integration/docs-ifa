# Exception Handler

The Exception Handler function is intended to translate Logic App action errors into more readable and client-friendly messages. The function can be plugged in to your logic apps to capture errors and translate them with known translations. If there is no known translation, it will still attempt to interpret the error by drilling into its properties to try obtain something more meaningful.

## ResolveException Endpoint

The function contains a single `ResolveException` endpoint. This accepts a body with the following format.

```
{
  "WorkflowRunId": "08584773878007282344320782622CU00",
  "WorkflowName": "ProcessInvoice",
  "SubscriptionId": "b5e153e0-ae7f-4cab-99a1-1faf3709a782",
  "ResourceGroupName": "invictus-tst-sft-invictusframework",
  "Type": "Standard",
  "SiteName": "exception-handler-la"
}
```

:point_right: If the Type is set to `Consumption`, then the `SiteName` value can be left empty.

The function will respond with a list of translations for all the failed actions in the logic app. A primary translation code will also be set based on the first translation. 

```
{
    "status": "Failed",
    "code": "InvalidURL",
    "description": "Http request failed with status code 'HostNotFound' and status message: 'No such host is known.'.",
    "errors": [
        {
            "code": "InvalidURL",
            "description": "Http request failed with status code 'HostNotFound' and status message: 'No such host is known.'."
        }
    ]
}
```

## Access Rights

The ExceptionHandler function requires the roles `Logic App Contributor` (for LA Consumption) and `Website Contributor` (for LA Standard) to operate correctly. These must be assigned on the ExceptionHandler function to the resource group where the logic apps are located.

## Translation Setup

The ExceptionHandler function makes use of the [RegexTranslator](https://github.com/invictus-integration/docs-ifa/blob/master/framework/components/regextranslation.md) Invictus function in order to interpret the LA error against a known collection of translations.

These translations must be set up in the `RegexTranslator` table in your Invictus storage account. Each translation will be a row with the below format:

####  For Consumption LAs

| PartitionKey        | RowKey | MatchPattern                           | OutputPattern                                           |
|---------------------|--------|----------------------------------------|---------------------------------------------------------|
| logicappname.actionname | Any RowKey       | The pattern to be matched in the error | code(YourTranslationCode)The output translation pattern |


#### For Standard LAs

| PartitionKey        | RowKey | MatchPattern                           | OutputPattern                                           |
|---------------------|--------|----------------------------------------|---------------------------------------------------------|
| sitename.workflowname.actionname |  Any RowKey      | The pattern to be matched in the error | code(YourTranslationCode)The output translation pattern |

A collection of translation examples for commonly experienced errors can be found [here]().

:point_right: If the translation code is not specified, a default `NoCodeSpecified` value will be set.

## Logic App Setup
