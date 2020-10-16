
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

	"xpath": "",
	"jpath" "",
	"configName":"IDD038-inbound.xsl",
	"content": 
