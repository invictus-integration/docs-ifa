[home](../README.md) | [dashboard](dashboard.md) | [Alerting](alerting.md)

# Alerting

This is a step by step on how to set up alerting. The following functionality is covered in this document:

- Create a Rule
- Update a Rule
- Delete a Rule
- Setup Activity check for a flow
- Setup Error check for a flow

**When creating the a rule, the name will always automatically have the flowname as the prefix set, example: {{flowname}}-AdrianRule**

## Add a new rule

First you need to choose a flow from the left panel which you want to see the rules. Then click on the 3 dots next to it and choose the Edit Flow.

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, you can see that there is a new tab "Alerting". Click on it.

![alerting](../images/dashboard/alerting2.JPG)

To add a rule, you need to click on the "Add Rule" tab and start inserting the rule information. 

![alerting](../images/dashboard/alerting3.JPG)

As soon as you are ready from the first tab, you can click on the "Set Recipient "button underneath. 

![alerting](../images/dashboard/alerting4.JPG)

In here you can enter the email subject and the emails of those individuals who need to be prompted.

When you are done, you can click on the "Save Rule" and give it some time till it saves. When it saves it will take you to the Rules tab with the new rule being added there.

![alerting](../images/dashboard/alerting6.JPG)

## Edit a rule

First you need to choose a flow from the left panel which you want to see the rules. Then click on the 3 dots next to it and choose the Edit Flow.

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, you can see that there is a new tab. It's called Alerting. Click on it.

![alerting](../images/dashboard/alerting5.JPG)

Click on the Rule you want to edit. In this case I will be editing the {{FlowName}}-AdrianRule one.

![alerting](../images/dashboard/alerting6.JPG)

Change any information and click on the Set Recepients button underneath and click on the Update Rule button.

![alerting](../images/dashboard/alerting7.JPG)

## Delete a rule

First you need to choose a flow from the left panel which you want to see the rules. Then click on the 3 dots next to it and choose the Edit Flow.

![alerting](../images/dashboard/alerting1.JPG)

As soon as the Edit Flow modal pop up opens, you can see that there is a new tab. It's called Alerting. Click on it.

![alerting](../images/dashboard/alerting5.JPG)

Click on the Rule you want to delete. In this case I will be deleting the {{FlowName}}-AdrianRule one.

![alerting](../images/dashboard/alerting6.JPG)

At the bottom, you will see a red button Delete Rule. Click on it and it will be deleted.

![alerting](../images/dashboard/alerting8.JPG)

**The Alerting tab will only be visible after a flow has been created. This tab will not be visible during the creation of a new flow**

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



