
# Json/Xml Converter

## Introduction

This framework component can be used to transform either XML to JSON or JSON to XML. The following functions will be exposed by this components:

- JsonToXml
- XmlToJson

### Parameters

|Name|Required|Description|
|--- |--- |--- |
|Content|Yes|A base64 string with either xml or json|
|Context|No|A dictionary of key,object collection|
|ConfigName|Yes|The name of the config which wil be used during the transform|
|XPath|No|Used to focus on part of the content/result|
|JPath|No|Used to focus on part of the content/result|

### Sample Request Schema

{
"configName":"IDD038-inbound.xsl",
"content": "eyJFbnZlbG9wZSI6IHsiU2FsZXNPcmRlckluIjp7ICAgICAgICAg...." 
"context": {"x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0"},
"xpath": "",
"jpath" "$.Envelope"
}

### Config

The Config file should be an XSLT file which will handle the transformation. This should be uploaded to storage to the xmltojsonconfigstore blob container which is automatically created on Startup of the application. Please note that the above functions execute the conversion/transform steps in the following order:

**JsonToXml:**
* The JPath is executed **before** the convert
* Json is converted to XML
* The XSLT Transform is executed after the JSON is converted to XML
* The XPath is executed **after** the Transform

**XmlToJson:**
* The XPath is executed **before** the Transform
* The XSLT is executed before the XML is converted to JSON
* XML is converted to JSON
* The JPath is executed **after** the convert
