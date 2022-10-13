[home](../../README.md) | [framework](../framework.md)

# Publish / Subscribe

## Introduction

This documentation will give you an overview of the PubSub and will help you setup the Logic apps for both the Publisher and Subscriber.

The PubSub component will mainly be used to push messages to RabbitMQ using the Publish Logic App. The messages will be routed to the respective queues created on RabbitMQ and automatically forwarded to a main message queue carrying the initial properties the message was sent with and additional properties such as from which queue it was forwarded. The queues on RabbitMQ which are also known as subscribers are created automatically each time a new logic app subscriber is created following the steps found in the documentation. A RabbitMQ trigger function reads each message inside the main message queue. It then fetches the call back URL that was saved upon creation of the Logic App Subscriber from Table Storage and passes all of the contents of the message in the call back body.

## General Information

* 	Basic Authentication is used for API Authentication, this will require authentication for each connector
*   Passwords for API authentication - ApiKey1 and ApiKey2 will be stored in KeyVault
*   Each request can have a max size of 100mb
*   Blob Storage will only be used when message is greater than 20mb. This is configurable in the environmental variables.
*   Subscribe should always use the LogicAppName as the subscription property. This can be done when using ARM deployments or typed manually
*   A message id is automatically generated per message sent.
*	Once saving the newly created subscriber logic app an automatic run will be triggered.
*	The Storage Container is defined as "***invictus-pubsub-messages***"
*	The Storage Table Name is defined as "***InvictusPubSubRmqSubscribers***"
*	The Storage Table Partition Key is defined as "***RMQueue***"

## RabbitMQ Specific

*	All the required queue, exchanges and bindings are automatically created.
*	The main queue where all the message are forwarded from the subscriber queues is called “***inv_pubsubqueue***”.
*	There is only one exchange being created, it is called “***main_exchange***”.
*	The main exchange is of type headers.
*	RabbitMQ requires a connection string. Please follow the correct format (amqp://user:pass@host/vhost) for more information please visit [https://www.rabbitmq.com/uri-spec.html](https://www.rabbitmq.com/uri-spec.html).
*	A dead letter queue is automatically created and is called “***dead_letter_queue***”.
*	A dead letter exchange is automatically created and called “***dead..letter.exchange***”.

## Creating a new Logic App & Using PubSub Connectors

### Publish Connector

1. Start by creating a new Blank Logic App From Azure Portal
2. Click on Edit to open the LogicApp Designer, if asked what type of template you want, choose blank

   ![template](../../images/pubsub-template.png)

3. The first step when starting a new Logic app is to add a **Trigger.** A logic app must always start with a Trigger connector.
4. Since the publish is **not** a **trigger** but an action we will need to choose a trigger from the list available. For this example we will add a **Request** trigger
5. Setup the HTTP Request as seen in the image below. The Request Body is basically the schema of the json you will be Posting to this connector

   ![http request](../../images/pubsub-httprequest.png)

6. After setting up the above trigger, we will now add an action connector. We will now use the Publish connector which uses the InvictusFramework API. All this is abstracted but in reality, all calls act exactly like API calls
7. Click on **New Step** and select **Add an action**
8. Choose Http+Swagger

   ![swagger](../../images/pubsub-swagger.png)

9. Enter the swagger url (eg: for PubSub <https://invictus-dev-we-sft-pubsubapp.azurewebsites.net/swagger/docs/v1>).

   ![swagger connector](../../images/pubsub-swaggerconnector.png)

10. Then choose the function you wish to use as a connector. For this example choose **Publish**.
11. Populate the fields with the parameters you wish to pass to Publish.

    ![publish](../../images/pubsub-publishconnector.png)

12. Notice that Content was wrapped in base64. The reason this needs to be done is because Publish takes a byte\[\] as input for **Message Content**. The Context object is simply passed without modification, this is expected to be a key value pair list.

    ![json](../../images/pubsub-jsoncontext.png)

13. By clicking **Show advanced options**, you will get to see more properties which most of the time are not required.

    ![publish advanced](../../images/pubsub-publishconnectoradvanced.png)

14. Although Authentication can be found under advanced, since the API which is exposing the custom connectors is using Basic Authentication, this has to always be populated. Use the below Json structure to setup Basic Auth for the connector. **More info can be found with the official documentation of logic apps.**

    ![authentication](../../images/pubsub-authentication.png)

15. The password for the API can be retrieved from AzureKeyVault by using either ApiKey1 or ApiKey2.

    ![key vault](../../images/pubsub-keyvaultapikey.png)

16. At this point you can continue adding more actions if required. For this example this will conclude the use of the Publish Connector.
17. Click Save.

### Subscribe

1.  Start by creating a new Logic App in Azure Portal. The plan type should be of type Standard.
2.  Open the newly created logic app and create a new stateful workflow and give the workflow a name.
	![newworkflow](../../images/pubsub-newworkflow)
3.  Once the workflow is created, open the workflow and go to the designer.
4.  Select the Http Webhook as a trigger.
5.  Fill in the details as shown below:  
		![Http Webhook Designer View](../../images/pubsub-httpwebhook.png)
7.  Click Save

## Test

To test the above functions, you can use Postman. Before doing this part ensure that both Logic Apps have been setup as described. It is also important to have Subscribe setup before attempting to Post a request, as this will create both the topic and subscription on service bus.


1. Create a new subsciber by creating a new standard logic app and choose the Httpwebhook trigger. Fill in the required details as shown below.
	
	![postman](../../images/pubsub-httpwebhook.png)

2. Get the url exposed by the **Publish Request trigger**

	![http](../../images/pubsub-httprequestsmall.png)

3. Send a POST request using the below Json or anything that matches the schema which you setup when creating the HTTP request trigger.

	![postman](../../images/pubsub-publish-request.png)

4. Check the result in the subscriber logic app.

	![httpwebhookresult](../../images/pubsub-httpwebhook-result.png)
