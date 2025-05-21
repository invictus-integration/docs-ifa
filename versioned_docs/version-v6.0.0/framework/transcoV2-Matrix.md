---
sidebar_class_name: hidden
---

# Transco V2 - Matrix Functionality

Matrix functionality has been rewritten in .NET 6.0 to modernize its capabilities. This functionality has now been included within the Transco V2 function, instead of its own standalone API.

This functionality is used to promote properties from the content and from an SQL DB to the context. Unlike the older version of Matrix. a dedicated Matrix config file is no longer required as this functionality has been moved to the Transco configs and endpoints.

## Basic Promotion
The basic promote is a simple way of promoting values to the context. This version accept a simple list of parameters and promotes them to the Context. Values are not required, any values not supplied will not be present in the response object and will be ignored.

The following endpoint in the TranscoV2 function is used for basic promotion
_/api/MatrixBasicPromote_

Supported data parameters in request:

-   KeyValueCollection: Key-Value collection
-   Flow: string
-   Domain: string
-   Service: string
-   Action: string
-   Version: string
-   Sender: string
-   ApplicationName: string
-   Milestone: string
-   ConversationId: string
-   CorrelationId: string
-   BatchId: string
-   Data1: string
-   Data2: string
-   Data3: string

Each key-value pair in the KeyValueCollection is individually promoted to the context.


Example Request:
```json
{
 "Content":  "ew0KICAiQ291bnRyeUNvZGUiOiAiQkUiLA0KICAiTW9uZXkiOiAgeyAiQW1vdW50IjogIDUwLCAiQ3VycmVuY3kiOiAgIkdCUCIgIH0NCn0NCg==",
 "Context":  {
 "x-conversationId":  "29500405-d7cf-4877-a72b-a3288cff9dc0",
 "x-correlationId":  "fc13d345-ebd7-44f2-89a9-4371258c0a08",
 "x-batchId":  "975f7ea4-6247-431b-afb6-6d27fb47516f",
 "x-applicationName":  "InvoiceApp",
 "filter":  "endtoendintegrationtests"	    
 },   
 "KeyValueCollection":  {
  "w":  3,
  "l":  10.2,
  "h":  1,
  "t":  200,
 },
 "Flow":  "fl1",
 "Domain":  "do",
 "Service":  "sr1",
 "Action":  "Ac",
 "Version":  "Vs",
 "Sender":  "Snd",
 "ApplicationName":  "Snd",
 "Milestone":  "2018",
 "ConversationId":  "29500405-d7cf-4877-a72b-a3288cff9dc0",   
 "CorrelationId":  "29500405-d7cf-4877-a72b-a3288cff9dc0", 
 "BatchId":  "29500405-d7cf-4877-a72b-a3288cff9dc0",  
 "Data1":  "d1", 
 "Data2":  "d2", 
 "Data3":  "d3"
}
```

Expected Response:
```json
{
    "content": "ew0KICAiQ291bnRyeUNvZGUiOiAiQkUiLA0KICAiTW9uZXkiOiAgeyAiQW1vdW50IjogIDUwLCAiQ3VycmVuY3kiOiAgIkdCUCIgIH0NCn0NCg==",
    "context": {
        "x-conversationId": "29500405-d7cf-4877-a72b-a3288cff9dc0",
        "x-correlationId": "fc13d345-ebd7-44f2-89a9-4371258c0a08",
        "x-batchId": "975f7ea4-6247-431b-afb6-6d27fb47516f",
        "x-applicationName": "InvoiceApp",
        "filter": "endtoendintegrationtests",
        "Flow": "fl1",
        "Domain": "do",	    
        "Service": "sr1",
        "Action": "Ac",
        "Version": "Vs",
        "ApplicationName": "Snd",
        "Milestone": "2018",
        "Data1": "d1",
        "Data2": "d2",
        "Data3": "d3",
        "Sender": "Snd",
        "w": 3,
        "l": 10.2,
        "h": 1,
        "t": 200
    },
    "conversationId": null,
    "correlationId": null,
    "batchId": "29500405-d7cf-4877-a72b-a3288cff9dc0"
}
```

## Transco Support

Promotion of values to the context via Transco operations is also supported. This is achieved by simply setting the *promoteToContext* property to *true* in the Transco config. The *destination* property must also be set to the key of the desired destination in the context. With these two properties, any result from the SQL operation is saved to the context.
