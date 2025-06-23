---
sidebar_label: XSD validation
---

# XSD Validator
:::note[motivation]
When processing XML files in Logic App workflows, XSD validation is a necessary pre-processing step to catch errors beforehand. [Microsoft currently only supports XSD validation within Logic App workflows on top of **Azure Integration Accounts**](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-schemas?tabs=consumption). This kind of resource is rather expensive and therefore not always available within the cost boundaries of client projects.

The Invictus Framework provides a **XSD Validator** component that allows you to validate XML files within your Logic App workflow by storing the XSD schemas in an Azure Blob Storage container. The interaction with the component happens via a HTTP endpoint; circumventing the need of an expensive **Azure Integration Account**.
:::

## XSD validate user XML
The **XSD Validator** has a single endpoint available: `/api/ValidateXmlAgainstXsd`. Given an user XML and referenced XSD schema (stored in Azure Blob Storage), the endpoint response with the result of the validation, possibly with violation failures.

The following request body properties should be supplied:

| JSON property | Required | Description                                                       |
| ------------- | :------: | ----------------------------------------------------------------- |
| `Content`     | yes      | The **BASE64**-encoded XML user input that needs to be validated. |
| `XsdName`     | yes      | The name of the XSD schema, stored in Azure Blob Storage.         |

<details>
<summary>**Full request example**</summary>

```json
// POST -> /api/ValidateXmlAgainstXsd
{
    "Content": "PHBlcnNvbj48Zmlyc3ROYW1lPkpvaG48L2ZpcnN0TmFtZT48L2xhc3ROYW1lPkRvZTwvbGFzdE5hbWU+PHByb2R1Y3RUeXBlPjEwPC9wcm9kdWN0VHlwZT48L3BlcnNvbj4=",
    "XsdName": "person.xsd"
}
```
</details>

<details>
<summary>**Full response example**</summary>

```json
// 200 OK <- /api/ValidateXmlAgainstXsd
{
    "isValid": false,
    "exceptions": [
        {
            "message": "The element 'person' has invalid child element 'productType'. List of possible elements expected: 'firstName', 'lastName'." 
        }
    ]
}
```
</details>

## Stored XSD schemas
Referenced XSD schema files should be uploaded to the Azure Blob Storage container `xsdvalidatorstore` (available upon installation), within the Invictus Azure Storage Account that's part of the installation.

## Customization

<details>
<summary>**Affected Bicep parameters**</summary>

The following Bicep parameters control the inner workings of the **XSD Validator** component. See the [deployment of the Invictus Framework](./installation/framework-releasepipeline.mdx) to learn more.

| Bicep parameter | Default | Description |
| --------------- | ------- | ----------- |
| `storageAccountName` | `invictus{resourcePrefix}store` | The name of the Azure Storage Account (used by other Framework components as well) where the `xsdvalidatorstore` Azure Blob Storage container will be located. |
| `xsdValidatorScaling` | `{ cpuResources: '0.5', memoryResources: '1.0Gi', scaleMaxReplicas: 1, scaleMinReplicas: 0, concurrentRequests: 10 }` | The Container App options to control scaling. See [scaling rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=container-apps-bicep#custom). |
| `xsdValidatorFunctionName` | `inv-${resourcePrefix}-xsdvalidator` | The name of the Azure Container App to be created for the **XSD Validator** component. |
</details>
