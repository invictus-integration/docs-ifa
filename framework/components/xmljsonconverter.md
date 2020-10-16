
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

"configName":"IDD038-inbound.xsl",
"content": "eyJFbnZlbG9wZSI6IHsiU2FsZXNPcmRlckluIjp7ICAgICAgICAgICAgICAgICJDb21wYW55QjJCSGVhZGVyIjogICAgeyAgICAgICAgICAgICAgICAgICAgIkN1c3RBY2NvdW50IjoiQVggQ3VzdG9tZXIgaWQiLCAgICAgICAgIkludm9pY2VBY2NvdW50SWQiOiJQcm92aWRlZCBieSBBWCBGaW5hbmNlIiAgICB9LCAgICAiREZPcmRlckhlYWRlcnMiOiAgICAgICAgWyAgICAgICAgeyJERk9yZGVySGVhZGVyIjogICAgICAgICAgICB7ICAgICAgICAgICAgICAgICJtZXNzYWdlSWQiOiIyMTkwNGI3Zi0yMWQ0LTQ1MzEtYmQzYi03YjY3OGVmYjYxOTciLCAgICAgICAgICAgICAgICAiT3JkZXJUeXBlIjoiMDIzIiwgICAgICAgICAgICAgICAgIkNvbnRyYWN0UmVmZXJlbmNlIjoiQnV5ZXJzIG9yZGVyIG51bWJlciIsICAgICAgICAgICAgICAgICJEZWxpdmVyeU5hbWUiOiIwMDIiLCAgICAgICAgICAgICAgICAiRGVsaXZlcnlNZXRob2QiOiIwMTAiLCAgICAgICAgICAgICAgICAiU3RyZWV0IjoiMDA1IiwgICAgICAgICAgICAgICAgIlRvd24iOiIwMTQiICAgICAgICAgICAgfX0gICAgICAgIF0gICAgfX19" 
"context": {"x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0"},
"xpath": "",
"jpath" "$.Envelope",

