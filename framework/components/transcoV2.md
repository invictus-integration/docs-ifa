# Transco V2

Transco has been rewritten from scratch in .NET 6.0 to modernize and broaden its capabilities while offering a friendlier and convenient experience.

The Transco function is used to promote properties from the database, by using the content or context to create the SQL query which will be executed against the specified table. Transco can also perform transformations on XML content by simply specifying the XSLT file from storage.

## Transco Capabilities

**SQL Commands**

Transco can execute SQL commands to promote properties from a specified database and table. The connection to the database can be achieved via either a raw connection string or the name of an Azure Key Vault secret.

The parameters of the SQL query can be populated from 3 sources:

 - XML or JSON request content via XPath or JPath
 - Request context
 - Fixed value

The SQL query result will inserted at the specified `destination` XPath or JPath. For XPaths ending at an attribute, e.g. `/persons/person/@name`, the value will be inserted in that attribute. Otherwise, it will be inserted in the inner text.

**XML Transformation**

Transformations can be performed on XML content. The name of the XSLT file in the storage account is required for this operation.  Any required assemblies and dependencies used by the transformation can also be specified, while the respective DLL files are to be in the storage account.

Transco supports XSLT 1.0 syntax.

## Transco V2 Endpoints

Transco V2 provides two endpoints:

*/api/TranscoXML* 

This endpoint is to be used with XML content. A transco config file is used to list the instructions necessary to promote values from an SQL database or to transform the content via an XSLT file. 

*/api/TranscoJson*

This endpoint is to be used with JSON content. A transco config file is used to list the instructions necessary to promote values from an SQL database. Transformations cannot be performed on JSON content.

*/api/MatrixBasicPromote*

This endpoint does not accept any config. It accepts a simple list of parameters and promotes them to the Context.

See [Transco V2 - Matrix Functionality](https://github.com/invictus-integration/docs-ifa/blob/master/framework/components/transcoV2-Matrix.md) for more details.

## Transco Config File

A JSON Transco config file is required to specify details about the instruction which will be performed. Instructions are executed in the order in which they appear. The name of the config file should be specified in the request so that it can be retrieved from the storage account.

**Config File Full Specification:**

    {
    	"instructions": [
    		{
    			"scopePath": [XPath/JPath of content scope],
    			"namespaces": [
					{
						"namespace": [XML Namespace],
						"prefix": [XML Namespace prefix]
					}
				],
    			"destination": [XPath/JPath of the results destination, or Context key if promoteToContext = true],
			"promoteToContext":[If true query result is saved to Context at key destination],
    			"command": {
	    			"databaseConnectionString":[Raw connection string to DB],
    				"databaseKeyVaultName": [Name of DB connection string secret in Key Vault],
    				"commandValue": [SQL query to be executed],
    				"isMandatory": [If true, will throw error when result is null],
    				"defaultValue": [Default value of result],
    				"parameters": [
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. XPath or JPath if valueType = "path"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					},
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. Any string value if valueType = "fixedValue"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					},
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. Key to value in context if valueType = "context"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					}
    				],
    				"cache": {
    					"useCaching": [If true, query result is cached],
    					"cachingTimeout": [Cache timeout timespan]
    				}
    			}
    		},
    		{
    			"xsltTransform": [Name of XSLT file],
    			"extensions": [
    				{
    					"namespace": [Assembly namespace],
    					"assemblyName": [Assembly name],
    					"className": [Assembly class name],
    					"dependencies": [
    						[DLL dependency file name],
    						[DLL dependency file name]
    					]
    				}
    			]
    		}
    	],
    	"options": {
    		"configCache": {
    			"useCaching": [If true, config file is cached],
    			"cachingTimeout": [Cache timeout timespan]
    		},
                     "indentResult": [If true, transco results will be formatted and indented]
    	}
    }

**SQL Command Instruction**

This instruction can be added to the Transco config to promote values from the database into XML or JSON content, or into the request Context. Scope path can be defined so that the command affects only nodes within that path. In the command section, a connection to the DB must be provided either via a connection string or via the Key Vault secret name. The SQL query itself is also defined in this section. Parameters in the SQL query must be denoted with an '@' symbol. Parameters may be given a name or indexed with a number.

Example:
*SELECT CustomerStatus FROM dbo.Customers WHERE CustomerName = @Name AND Active = @Active*

or

*SELECT CustomerStatus FROM dbo.Customers WHERE CustomerName = @1 AND Active = @2*


    {
    	"scopePath": [XPath/JPath of content scope],
    	"namespaces": [
    				{
    					"namespace": [XML Namespace],
    					"prefix": [XML Namespace prefix]
    				}
    			],
    	"destination": [XPath/JPath of the results destination, or Context key if promoteToContext = true],
	"promoteToContext": [If true query result is saved to Context at key destination],
    	"command": {
    		"databaseConnectionString":[Raw connection string to DB],
    		"databaseKeyVaultName": [Name of DB connection string secret in Key Vault],
    		"commandValue": [SQL query to be executed],
    		"isMandatory": [If true, will throw error when result is null],
    		"defaultValue": [Default value of result],
    		"parameters": [
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. XPath or JPath if valueType = "path"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					},
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. Any string value if valueType = "fixedValue"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					},
    					{
    						"paramName": [Name of param in query],
    						"value": [Type dependent. Key to value in context if valueType = "context"],
    						"type": [SQL DB type. See: https://learn.microsoft.com/en-us/dotnet/api/system.data.sqldbtype],
    						"valueType": ["path" or "fixedValue" or "context"]
    					}
    				],
    		"cache": {
    					"useCaching": [If true, query result is cached],
    					"cachingTimeout": [Cache timeout timespan]
    				}
    	}
    }

**XML Transform Instruction**
This instruction can be added to the Transco Config to transform XML content via the specified XSLT file. Assemblies and dependencies used by the XSLT transformation are also specified in this instruction so that they may downloaded from storage and loaded for use by Transco.

This instruction is only available when calling the /TranscoXML endpoint.

    {
	    "xsltTransform": [Name of XSLT file],
	    "extensions": [
		    {
		    		"namespace": [Assembly namespace],
		    		"assemblyName": [Assembly name],
		    		"className": [Assembly class name],
		    		"dependencies": [
			    		[DLL dependency file name],
			    		[DLL dependency file name]
				    ]
		    }
	    ]
    }

## Storage Account

All required files are to be saved in a storage account and in a container with name ***transcov2configstore***. This container is automatically created on startup of the Transco function.

Within the _**transcov2configstore**_ container:

 - Transco config files must be saved in a folder named ***Configs***
 - Transformation files must be saved in a folder named ***XSLTs***
 - Assembly and dependency DLL files must be saved in a folder named
   ***Assemblies***
  
![transcov2 Storage Account](../../images/transcoV2Storage.png)
  
## Transco Request Object

The Transco request requires three values:

 1. XML or JSON content in Base64 string format
 2. Context as key-value pair list
 3. Name of transco config file in storage account

Example payload:

    {
	    "Content":  "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTE2Ij8+PHJvb3Q+PG5hbWUgc3RhdHVzPSJNZW1iZXIiPkpvaG4gRG9lPC9uYW1lPjwvcm9vdD4=",
	    "Context":  {
		    "CustomerActive":  "true" 
	    }, 
	    "TranscoConfig":  "docs_config.json"    
    }

## Creating Logic App with TranscoV2 Connector

 1. Create a new blank Logic App in the Azure Portal
 2. Open the Logic App designer
 3. Choose a trigger of your choice, we will use a *Request* trigger
 4. Add a "Azure Function" action
 
 ![Azure Function Action](../../images/transcoV2LAAction.png)
 
 5. Select the appropriate TranscoV2 function from the list
 6. Select the Function endpoint you wish to use
 7. Set the Request Body to a valid Transco Request
 
![Function Request](../../images/transcoV2LA.png)

 8. Add any other actions you require and save

## Migrating Transco v1 to v2

We need to change the authentication and endpoint and remove the metadata links.

Also we need to change the transco configuration files, for this you can use the migration tool from Codit's integration practice that can be found [here](https://github.com/Codit/integration-practice/tree/main/src/Tools/Invictus/Transco-Matrix-Migration#invictus-transco--matrix-migration-tools).

Transco v1 example:
``` json
"Transform_XML": {
    "type": "Http",
    "inputs": {
        "method": "POST",
        "uri": "[parameters('invictus').Framework.Transco.v1.transcoXmlUrl]",
        "authentication": {
            "password": "@parameters('invictusPassword')",
            "type": "Basic",
            "username": "Invictus"
        },
        "body": {
            "Content": "@triggerBody()?['Content']",
            "Context": "",
            "TranscoConfig": "EFACT_D96A_ORDERS-to-Generic_Order.xml"
        }
    },
    "runAfter": {}
}
```

Transco v2 example:
``` json
"Transform_XML": {
    "type": "Http",
    "inputs": {
        "method": "POST",
        "uri": "[parameters('invictus').Framework.Transco.v2.transcoXmlUrl]",
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        },
        "body": {
            "Content": "@triggerBody()?['Content']",
            "Context": "",
            "TranscoConfig": "EFACT_D96A_ORDERS-to-Generic_Order.json"
        }
    },
    "runAfter": {}
}
```

## Migrating Matrix v1 to Transco v2

The Matrix component's functionality has been placed in the Transco v2 API. 

Basically all we need to do is change the authentication and endpoint and remove the metadata links.

Matrix v1 example:
``` json
"Extract_Message_Context": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.matrix.v1.basicMatrixUrl]",
        "body": {
            "Domain": "B2B-Gateway",
            "Service": "@{concat('AS2-Receive-', body('Decode_AS2_message')?.aS2Message?.aS2To)}",
            "Action": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PayloadFormat}",
            "Version": "1.0",
            "Sender": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PartyName}",
            "Content": "@{base64(body('Decode_AS2_message')?.AS2Message?.Content)}",
            "KeyValueCollection": {
                "ReceiveFileName": "@{body('Decode_AS2_message')?['AS2Message']?['FileName']}",
                "ReceiveProtocol": "AS2",
                "ReceiveProtocolDetails": "@{body('Decode_AS2_message')?['AS2Message']?['AS2From']} > @{body('Decode_AS2_message')?['AS2Message']?['AS2To']}",
                "ReceiveReference": "@{body('Decode_AS2_message')?['AS2Message']?['OriginalMessageId']}",
                "ReceiveTimeUtc": "@{utcNow()}"
            }
        },
        "authentication": {
            "type": "Basic",
            "username": "Invictus",
            "password": "@parameters('invictusPassword')"
        }
    },
    "runAfter": {},
    "metadata": {
        "apiDefinitionUrl": "[parameters('invictus').framework.matrix.v1.definitionUrl]",
        "swaggerSource": "custom"
    }
}
```

Transco v2 example:
``` json
"Extract_Message_Context": {
    "type": "Http",
    "inputs": {
        "method": "post",
        "uri": "[parameters('invictus').framework.transco.v2.basicMatrixUrl]",
        "body": {
            "Domain": "B2B-Gateway",
            "Service": "@{concat('AS2-Receive-', body('Decode_AS2_message')?.aS2Message?.aS2To)}",
            "Action": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PayloadFormat}",
            "Version": "1.0",
            "Sender": "@{outputs('Integration_Account_Artifact_Lookup_-_Get_SendingPartner')?.properties?.metadata?.PartyName}",
            "Content": "@{base64(body('Decode_AS2_message')?.AS2Message?.Content)}",
            "KeyValueCollection": {
                "ReceiveFileName": "@{body('Decode_AS2_message')?['AS2Message']?['FileName']}",
                "ReceiveProtocol": "AS2",
                "ReceiveProtocolDetails": "@{body('Decode_AS2_message')?['AS2Message']?['AS2From']} > @{body('Decode_AS2_message')?['AS2Message']?['AS2To']}",
                "ReceiveReference": "@{body('Decode_AS2_message')?['AS2Message']?['OriginalMessageId']}",
                "ReceiveTimeUtc": "@{utcNow()}"
            }
        },
        "authentication": {
            "audience": "[parameters('invictus').authentication.audience]",
            "identity": "[parameters('infra').managedIdentity.id]",
            "type": "ManagedServiceIdentity"
        }
    },
    "runAfter": {}
}
```