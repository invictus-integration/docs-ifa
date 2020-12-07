# Regex Transalation

## Introduction

This documentation will give you an overview of the Regex Translation component and will help you use it. The following functions will be exposed by this components:


### Overview

The scope of the Regex Translator is to translate a given message using regex and based on the MacthKey supplied an entity will be retrieved from an Azure Table Storage with the associated translation of the message.

### Parameters

|Name|Required|Description|
|--- |--- |--- |
|Content|Yes|A base64 string that will be used in the translation|
|MatchKey|Yes|An string array|

### Sample Request Schema

{
  "Content": "The provided host name 'asdfasdfaasdfasdfasdfasdfasdfasdfsdf.com' could not be resolved",
  "MatchKey": ["OrderService", "InvoiceService"]
}

### Config

Upon startup of the application an Azure Table with a dedicated Storage Account called RegexTranslator will be created if it doesn't already exist. 
By default the table will consist of 3 properties.

- PartitionKey
- RowKey
- Timetamp

Within the table 2 properties of type string have to be added when creating a new entity:

- MatchPattern
- OutputPattern
