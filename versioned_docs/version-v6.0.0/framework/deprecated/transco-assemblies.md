---
sidebar_class_name: hidden
---

# Transco - Custom Assemblies

> ## ⚠️ Attention
> This is the V1 version of the Transco, which is deprecated and will thus no longer be extended.
> 
> Maximum supported .NET version is .NET Framework 4.7.1
> 
> For the supported version, please see [Transco V2](../transcoV2.mdx)

## Introduction

This documentation will give you an overview of the Transco custom assemblies and how to trigger a basic call. To use this feature you will need to have the below files, these will be explained in detail individually. It is suggested to go through the [Transco Extraction](transco-extraction.md) section first to get a better understanding of how to use and call the Transco API/Function.

## Extensions

The extension file is used to link the XSLT with the Assembly(dll), this is then used by the Transco component to know which DLLs to download before executing the Transco.

Create an xml file with the xml below and upload it to the **extensions** subfolder within the Transco configs **transcoconfigsstore** container.

```xml
<ExtensionObjects> 
    <ExtensionObject Namespace="http://tvh.demos.sharedFunctions" AssemblyName="TVH.Sample, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" ClassName="TVH.Sample.Common" /> 
</ExtensionObjects>
```
If your assembly has **Dependencies** which are required during execution then add them to the ExtensionObject ex:
```xml
<ExtensionObjects> 
	<ExtensionObject Namespace="http://tvd.dependency.sharedFunctions" AssemblyName="TVH.Dependency, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" ClassName="TVH.Dependency.Common">
		<DependenciesObject>
			<DependencyObject AssemblyFileName="Dependency.dll" />
			<DependencyObject AssemblyFileName="DataDependency.dll" />
		</DependenciesObject>
	</ExtensionObject>
</ExtensionObjects>
```
Notice the **DependenciesObject** and the **DependencyObject**. Ensure that the Assemblies are uploaded to storage inside the assemblies folder and that the exact name for the dll matches the one in storage. Note: Only add the required dependencies as adding all dependencies can greatly reduce the execution speed since each dll has to be downloaded from storage.

## Assemblies

To execute functions within your Transco function you will need to include the dll/assembly which contains the function, the assemblies need to be uploaded to the same container as the Transco configs **transcoconfigsstore** but need to be in a subfolder called **assemblies** example: "assemblies/[dllname].dll"

Sample code to be used later in the sample call:

> ![sample code](/images/transco-samplecode.png)

## XSLT File

The XSLT file must reference the extension namespace used in the extensions file using the `xmlns:extensions` attribute. After this has been set, the developer can then execute the functions within the DLL.

XSLT Example:

```xml
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ns0="http://tvh.demos"  
   xmlns:extension="http://tvh.demos.sharedFunctions" version="1.0" >
   <xsl:template match="/ns0:SampleInput">
      <SampleOutput xmlns="http://tvh.demos">
         <Field1><xsl:value-of select="ns0:Field1"/></Field1>
         <Field2><xsl:value-of select="extension:GenerateGuid()"/></Field2>
      </SampleOutput>
   </xsl:template>
</xsl:stylesheet>
```

## Transco Config XML

As stated earlier you will need to set the Assembly and the BTM to be able to execute custom functions:

```xml
<?xml version="1.0"?>
<TranscoConfig xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.codit.be/Schemas/Transco">
  <BeforeMapping/>
  <AfterMapping />
  <Mapping Assembly="extensions.xml" XSLT="transcoAssemblies.xslt" />
  <Options>
    <Caching CachingType="Default" CachingDuration="0" />
   </Options>
</TranscoConfig>
```

## Example

1. Create an extensions.xml file using the above XML in the Extensions section and upload it to the extensions subfolder mentioned.
2. Create a project TVH.Sample and add a class named "Common". Within the class add the code found in the **Assemblies** section. Upload the dll for this project to the assemblies subfolder.
3. Create a Transco config **transcoAssemblies.xml** and set the Assembly and BTM/XSLT ex: `<Mapping Assembly="extensions.xml" XSLT="transcoAssemblies.xslt" />`
4. Create an XSLT file **transcoAssemblies.xslt** using the XML in the XSLT section and upload it to the **transcoconfigsstore** container.

The following files need to be present in storage before triggering the request:

* transcoconfigsstore/transcoAssemblies.xslt
* transcoconfigsstore/transcoAssemblies.xml
* transcoconfigsstore/assemblies/TVH.Sample.dll
* transcoconfigsstore/extensions/extensions.xml

## HTTP Request Test

Target the transco Web App on your resource group, example: `https://invictus-dev-we-sft-transcoapp.azurewebsites.net/api/v1/transco`

Request:

```json
{
      "Content": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPFNhbXBsZUlucHV0IHhtbG5zPSJodHRwOi8vdHZoLmRlbW9zIj4gCiAgIDxGaWVsZDE+VGVzdDE8L0ZpZWxkMT4gCiAgIDxGaWVsZDI+VGVzdDI8L0ZpZWxkMj4KPC9TYW1wbGVJbnB1dD4=",
       "Context": {
        "x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0",
        "x-correlationId": "fc13d345-ebd7-44f2-89a9-4371258c0a08",
        "x-batchId": "975f7ea4-6247-431b-afb6-6d27fb47516f",
        "x-applicationName": "InvoiceApp",
        "filter": "1"
    },
  "TranscoConfig": "transcoAssemblies.xml"
}
```

Expected Response:

```json
{
    "Content": "77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U2FtcGxlT3V0cHV0IHhtbG5zPSJodHRwOi8vdHZoLmRlbW9zIiB4bWxuczptc3hzbD0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4c2x0IiB4bWxuczpuczA9Imh0dHA6Ly90dmguZGVtb3MiIHhtbG5zOmV4dGVuc2lvbj0iaHR0cDovL3R2aC5kZW1vcy5zaGFyZWRGdW5jdGlvbnMiPjxGaWVsZDE+VGVzdDE8L0ZpZWxkMT48RmllbGQyPmUxMWY4NTIzLTcyMDUtNGUxYS04M2YwLTI5MGZjM2U3YjAzZjwvRmllbGQyPjwvU2FtcGxlT3V0cHV0Pg==",
    "Context": {
        "x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0",
        "x-correlationId": "fc13d345-ebd7-44f2-89a9-4371258c0a08",
        "x-batchId": "975f7ea4-6247-431b-afb6-6d27fb47516f",
        "x-applicationName": "InvoiceApp",
        "filter": "1"
    },
    "ConversationId": null,
    "CorrelationId": null,
    "BatchId": null
}
```

### Decoded Content

Before:

```xml
<?xml version="1.0" encoding="utf-8"?>
<SampleInput xmlns="http://tvh.demos"> 
   <Field1>Test1</Field1> 
   <Field2>Test2</Field2>
</SampleInput>
```
 
After:

```xml
<?xml version="1.0" encoding="utf-8"?>
<SampleOutput xmlns="http://tvh.demos" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ns0="http://tvh.demos" xmlns:extension="http://tvh.demos.sharedFunctions">
    <Field1>Test1</Field1>
    <Field2>e11f8523-7205-4e1a-83f0-290fc3e7b03f</Field2>
</SampleOutput>
```
