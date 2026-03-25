---
sidebar_label: Regex replacements
---

# Replace user content in Logic App workflows with the <u>Regex Translator</u>
:::note[motivation]
At the time of writing, there is no built-in Logic App functionality available to run regular expression replacements without using `inline code`. The Invictus **Regex Translation** Framework component fills this missing link. It provides a HTTP-endpoint to run regular expression replacements. All available translations are available in an Azure Table Storage.
:::

## Regex translate user content
The **Regex Translation** component has a single endpoint available: `/api/RegexTranslation`. Given an user content and matched stored (Azure Table Storage, default: `RegexTranslator` table) regex translation, the endpoint responds with the translated content.

| JSON property | Required | Description                                                                                                                                                                                           |
| ------------- | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content`     |   yes    | User content that should translated.                                                                                                                                                                  |
| `MatchKey`    |   yes    | Set of 'keys' that translates to [Azure Table Storage partition keys](https://learn.microsoft.com/en-us/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage). |

<details>
<summary>**Full request example**</summary>

```json
// POST /api/RegexTranslation
{
  "Content": "The provided host name 'website.com' could not be resolved",
  "MatchKey": ["OrderService", "InvoiceService"]
}
```
</details>

<details>
<summary>**Full response example**</summary>

```json
// Found stored translation:
// 200 OK <- /api/RegexTranslation
{
  "Content": "System could not reach endpoint 'website.com' as it is not available, please contact John to follow-up.",
  "IsTranslated": true,
  "RowKey": "2f71ec69-1fff-4b80-9ae1-947a58e4a039"
}

// Did not found stored translation:
// 200 OK <- /api/RegexTranslation
{
  "Content": "The provided host name 'website.com' could not be resolved",
  "IsTranslated": false,
  "RowKey": ""
}
```

</details>

## Stored regex translations
Store available Regex translations in the Azure Table Storage table called `RegexTranslator` (Invictus creates this table automatically). Each stored entity should have following custom properties:

[named groups]: https://learn.microsoft.com/en-us/dotnet/standard/base-types/grouping-constructs-in-regular-expressions#named-matched-subexpressions

| Custom entity property name | Description                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `MatchPattern`              | The regular expression to match the incoming user `Content`. It uses [named groups] to cut certain information from the content. |
| `OutputPattern`             | The outgoing text, containing possible `{group-name}` occurrences to paste the subtracted information.                           |

<details>
<summary>**Full translation example**</summary>

| Entity property name | Value                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `RowKey`             | `2f71ec69-1fff-4b80-9ae1-947a58e4a039`                                                                |
| `PartitionKey`       | `OrderService`                                                                                        |
| `MatchPattern`       | `"The provided host name '(?<url>[^]*)' could not be resolved."`                                      |
| `OutputPattern`      | `"System could not reach endpoint '{url}' as it is not available, please contact John to follow-up."` |

</details>

* **Many pastes**: the component pastes the subtracted information from named groups more than once.
* **Single match**: the user `Content` can only match a single stored translation - the component picks the first match.
* **No pastes**: the `OutputPattern` doesn't necessarily *have* to contain `{group-name}` occurrences, it can only contain text.

## Customization
<details>
<summary>**Related Bicep parameters**</summary>

The following Bicep parameters control the inner workings of the **Regex Translator** component. See the [release pipeline step of the deployment of the Invictus Framework](./installation/index.mdx) to learn more.

| Bicep parameter               | Default                                                                                                               | Description                                                                                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storageAccountName`          | `invictus{resourcePrefix}store`                                                                                       | The name of the Azure Storage Account (used by other Framework components as well) that has the `RegexTranslator` Azure Table Storage table.                                                    |
| `regexTranslatorScaling`      | `{ cpuResources: '0.5', memoryResources: '1.0Gi', scaleMaxReplicas: 1, scaleMinReplicas: 0, concurrentRequests: 10 }` | The Container App options to control scaling. See [scaling rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=container-apps-bicep#custom). |
| `regexTranslatorFunctionName` | `inv-${resourcePrefix}-regextranslator`                                                                               | The name of the Azure Container App for the **Regex Translator** component.                                                                                                                     |
</details>