# XSD Validator

## Motivation

When processing XML files in Logic App workflows, XSD validation is a necessary pre-processing step to catch errors beforehand. [Microsoft currently only supports XSD validation within Logic App workflows on top of **Azure Integration Accounts**](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-schemas?tabs=consumption). This kind of resource is rather expensive and therefore not always available within the cost boundaries of client projects.

The Invictus Framework provides a **XSD Validator** component that allows you to validate XML files within your Logic App workflow by storing the XSD schemas in an Azure storage account. Circumventing the need of an expensive **Azure Integration Account**.

## Usage

The **XSD Validator** is available as a HTTP endpoint in your Logic App workflow. XML input files should be supplied in a `BASE64` format, XSD schema files should be stored in the Azure Blob storage container.

### Prerequisites

* XSD schema file(s), stored in the Azure Blob container `xsdvalidatorstore` (available upon installation).

### Input

The request to the HTTP endpoint should contain both the `BASE64` formatted XML input file, as the name of the XSD schema file, stored in the Azure Blob storage container.

```json
// POST -> /api/ValidateXmlAgainstXsd
{
    "content": "<base64-encoded-input-xml>",
    "xsdName": "<name-of-stored-schema-file>.xsd"
}
```

### Output

A successful HTTP response includes whether the schema validation was successful and any additional validation failures that were encountered.

```json
// 200 OK <- /api/ValidateXmlAgainstXsd
{
    "isValid": false,
    "exceptions": [
        {
            "message": "ex. The element 'student' has invalid child element 'lastname'. List of possible elements expected: 'firstname'." 
        }
    ]
}
```