# DataFactory Receiver

To enable diagnostics and automatically stream all events from your DataFactory pipelines to event hub follow the steps below.

It is important to also target the EventHubNamespace and EventHubName created by the Invictus Resources ARM Template for datafactory, since the Import Job is set to listen on the mentioned Namespace and Hub. By default the eventhub name will contain "df-evhb" in it's name.

## Setting up the Diagnostics Settings

By enabling the below, the importjob will start listening for events from the DataFactory eventhub, the data is then processed and saved to the database which makes the event viewable on the Dashboard.

To start receiving data from DataFactory:

- Find the DataFactory in the resource group
- Click on the Diagnostic settings tab
- Click on the "+ Add diagnostic setting"
- Set the following Settings
  - Set the name for the Diagnostic Setting
  - Enable TriggerRuns, ActivityRuns and PipelineRuns
  - DO NOT enable AllMetrics
  - Enable Stream to an eventhub
  - Select the eventhub created by the Invictus deployment choose the one with "df-evhb" in it's name
  - Click Save

![datafactorydiagnosticsettings](../images/ehdatafactorydiag.png)

## Tracked Properties

To track properties when executing pipeline runs you will need to set the User Properties within an Activity inside a pipeline. These will be then picked up by the importjob.

![datafactoryuserproperties](../images/dfuserproperties.PNG)

