[home](../README.md) | [dashboard](dashboard.md) | [Alerting](alerting.md)

# Alerting

This is a step by step on how to set up alerting. The following functionality is covered in this document:

- Create a Rule
- Update a Rule
- Delete a Rule
- Setup Activity check for a flow
- Setup Error check for a flow

**Please note that:**

- When creating the a rule, the name will always automatically have the flowname as the prefix set, example: {{flowname}}-AdrianRule
- The Alerting tab will only be visible after a flow has been created. This tab will not be visible during the creation of a new flow 

## Add Alert Rule

To Add a rule, start by editing a flow.

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, go to the "**Alerting**" tab

![alerting](../images/dashboard/alerting2.JPG)

To add a rule, you need to click on the "Add Rule" tab and start inserting the rule information. For more information regarding the parameters refer to the section "**Parameters Description**" below

![alerting](../images/dashboard/alerting3.JPG)

As soon as you are ready from the first tab, you can click on the "**Set Recipient**" button underneath. 

![alerting](../images/dashboard/alerting4.JPG)

In here you can enter the email subject and the emails of those individuals who need to be prompted.

When you are done, you can click on the "**Save Rule**". When the rule is saved it will take you to the Rules tab with the new rule being visible there.

![alerting](../images/dashboard/alerting6.JPG)

## Edit Alert Rule

To Edit a rule, start by editing a flow.

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, go to the "**Alerting**" tab

![alerting](../images/dashboard/alerting5.JPG)

Click on the Rule you want to edit. In this case I will be editing the **{{FlowName}}-AdrianRule**.

![alerting](../images/dashboard/alerting6.JPG)

Change any information and click on the "**Set Recepients**" button underneath and click on the "**Update Rule**" button.

![alerting](../images/dashboard/alerting7.JPG)

## Delete Alert Rule

To Delete a rule, start by editing a rule. Once the modal opens go to the "**Alerting**" tab

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, go to the "**Alerting**" tab

![alerting](../images/dashboard/alerting5.JPG)

Click on the Rule you want to delete. In this case I will be deleting the {{FlowName}}-AdrianRule one.

![alerting](../images/dashboard/alerting6.JPG)

At the bottom, you will see a red button Delete Rule. Click on it and it will be deleted.

![alerting](../images/dashboard/alerting8.JPG)

## Parameters Description

|Parameter Name|Required||Description|
| --- | :---: | --- | --- |
|Name|Yes|The name for the rule, must be unique per flow. Name will automatically have flow name prefix added to it|
|Description|No|Description for the rule|
|Severity|Yes|Has to be a value between 1-4 which identifies the severity of a warning|
|Time Window|Yes|This value will be used by the Azure rule to check the logs for the last x minutes - value must be between the range of 5-2880|
|Frequency|Yes|The frequency how often the rule is exectued - value must be between between the range of 5-1440|
|Trigger Threshold Operator|Yes|The values available are: Equal/GreaterThan/LessThan, these operators are used along with the Threshold field to check if a rule needs to be triggered or not|
|Threshold|Yes|This is the value which will set the threshold for the rule|
|Suppress Alerts|No|This by default is set of, if enabled the Suppress Alerts in Mins is enabled|
|Suppress Alerts in Mins|No|The minutes value set here is used to suppress alerts for x minutes if alerts for a rule have been triggered|
Query Type|Yes|This value is used to select which type of query the alert rule will have AzureResultCount/InvictusActivityCheck/InvictusErrorCheck - AzureResultCount lets the user enter custom script which is accepted by the Azure Rule Syntax. The ones starting with "Invictus" are premade scripts for the user to select without having to modify|
|Email Subject|Yes|The subject for an email when an alert is sent|
|Recipients|Yes|The list of email recipients for a rule|

## Query Type Description

### Invictus Activity Check

This query type will filter logs on Azure Logs by the "InvictusImportJobFlowActivityAlert" property. The ImportJob will every hour log activity for any flows that are active. An example how the alert settings for this flow could be set:

Frequency: 60
Time Window: 60
Trigger Threshold Operator: LessThan
Threshold: 0

This will create a rule to run every 60 minutes, scans the logs for the last 60 minutes and if the returned value is less than the threshold, it means that the flow is inactive, thus triggers the alert on Azure.

### Invictus Error Check

This query type will filter logs on Azure Logs by the "InvictusImportJobFlowErrorAlert" property. The ImportJob will log a message for each Flow that triggers an error. An example how the alert settings for this flow could be set:

Frequency: 10
Time Window: 10
Trigger Threshold Operator: GreaterThan
Threshold: 0

This will create a rule to run every 10 minutes, scans the logs for the last 10 minutes and if the returned value is greater than the threshold, it means that the flow has failing messages, thus triggers the alert on Azure.

