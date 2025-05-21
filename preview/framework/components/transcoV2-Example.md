---
sidebar_class_name: hidden
---

# Full Transco V2 Example

The following is a full example which demonstrates the usage of Transco V2.

**Example DB Setup**

In your DB of choice execute the following script:
```sql
 CREATE TABLE [dbo].[Customers]
 (
 	[CustomerId] int NOT NULL,
 	[CustomerName] nvarchar(100) NOT NULL,
 	[CustomerAge] int NOT NULL,
 	[CustomerStatus] nvarchar(100) NOT NULL,
 	[Active] bit NOT NULL
 )
 
 INSERT INTO [dbo].[Customers] (CustomerId, CustomerName, CustomerAge, CustomerStatus, Active)
 VALUES (1, 'John Doe', 35, 'Member', 1)
 
 INSERT INTO [dbo].[Customers] (CustomerId, CustomerName, CustomerAge, CustomerStatus, Active)
 VALUES (2, 'Mary Smith', 56, 'Member', 0)
 
 INSERT INTO [dbo].[Customers] (CustomerId, CustomerName, CustomerAge, CustomerStatus, Active)
 VALUES (3, 'Mike Brown', 29, 'Non-Member', 1)
```

**Transco Request**



The below Transco config is used to obtain the Customer Status from the DB and insert it into the XML Content. Then the content is transformed according to the defined XSLT file.

*XML Content (decoded)*
```xml
<?xml version="1.0" ?>
<persons>
	<header>Person Customers</header>
	<person>
		<name>John Doe</name>
		<status></status>
	</person>
	<person>
		<name>Mike Brown</name>
		<status></status>
	</person>
</persons>
```

*docsexample.config*
```json
{
  "instructions": [
    {
      "type": "xml",
      "scopePath": "/persons/person",
      "destination": "status",
      "command": {
        "databaseKeyVaultName": "transcodb",
        "commandValue": "SELECT CustomerStatus FROM dbo.Customers WHERE CustomerName = @Name AND Active = @Active",
        "isMandatory": true,
        "defaultValue": "0",
        "parameters": [
          {
            "paramName": "Name",
            "value": "name",
            "type": "nvarchar",
            "valueType": "path"
          },
          {
            "paramName": "Active",
            "value": "CustomerActive",
            "type": "bit",
            "valueType": "context"
          }
        ],
        "cache": {
          "useCaching": true,
          "cachingTimeout": "01:30:15"
        }
      }
    },
    {
      "xsltTransform": "docsexample.xslt",
      "extensions": []
    }
  ],
  "options": {
    "configCache": {
      "useCaching": false,
      "cachingTimeout": "01:30:00"
    }
  }
}
```


*docsexample.xslt*
```xslt
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="/persons">
    <root>
      <xsl:apply-templates select="person"/>
    </root>
  </xsl:template>

  <xsl:template match="person">
    <name status="{status}">
      <xsl:value-of select="name" />
    </name>
  </xsl:template>

</xsl:stylesheet>
```

A POST request is sent to the Transco function URL and endpoint */api/TranscoXML* with the following Body. An application such as Postman can be used for this.

![Postman Request](../../images/transcoV2Postman.png)

```json
{   
 "Content": "PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8cGVyc29ucz4KCTxoZWFkZXI+UGVyc29uIEN1c3RvbWVyczwvaGVhZGVyPgoJPHBlcnNvbj4KCQk8bmFtZT5Kb2huIERvZTwvbmFtZT4KCQk8c3RhdHVzPjwvc3RhdHVzPgoJPC9wZXJzb24+Cgk8cGVyc29uPgoJCTxuYW1lPk1pa2UgQnJvd248L25hbWU+CgkJPHN0YXR1cz48L3N0YXR1cz4KCTwvcGVyc29uPgo8L3BlcnNvbnM+",    
 "Context": {
  "CustomerActive": "true"   
 },   
 "TranscoConfig": "docsexample.config.json"  
}
```

Expected Response:
```json
{
 "Content": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTE2Ij8+PHJvb3Q+PG5hbWUgc3RhdHVzPSJNZW1iZXIiPkpvaG4gRG9lPC9uYW1lPjxuYW1lIHN0YXR1cz0iTm9uLU1lbWJlciI+TWlrZSBCcm93bjwvbmFtZT48L3Jvb3Q+",
 "Context": {
  "CustomerActive": "true"
 },
 "TranscoConfig": "docsexample.config.json"
}
```

Decoded Response Content:
```xml
<?xml version="1.0" encoding="utf-16"?>
<root>
    <name status="Member">John Doe</name>
    <name status="Non-Member">Mike Brown</name>
</root>
```
