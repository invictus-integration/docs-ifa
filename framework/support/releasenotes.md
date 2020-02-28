[home](../../README.md) | [framework](../framework.md)

# Framework Release Notes

## Version 2.4.2

_Release date: 2020-02-06_

> Features and improvements:

* Added caching for Transco to improve performance 
* Fixed hardcoded regions inside the ARM template

## Version 2.4.1

_Release date: 2020-02-06_

> Features and improvements:

* Transco Custom Assemblies Dependency support

Note: Please update the Deploy Task in your release pipeline by enabling "Use Powershell Core"
 
NOTE: When passing the ApiKey1 and ApiKey2 to the Deploy.ps as arguments, please remember to enclose them in single quotes ''. This prevents any operator characters from breaking the ps script.

---

## v2.4.0

_Release date: 2019-12-11_

> Features:

* Added a new connector: [TimeSequencer](../components/timesequencer.md)
* New [installation procedure](../installation/framework-installation.md)

## v2.3.2

_Release date: 2019-11-26_

> Bug fixes:

* Optimizations cleanup job - include ignored messages
* Application insights logging level configurable and increased to warning

---

## v2.3 0

_Release date: 2019-09-16_

> Features and improvements:

* Cleanup job for Invictus for Azure dashboard tables
* Flow handler job and throttling
* See tracked properties (audit trail with Event Text) on execution tree level  
* Show the exception on logic app level 

> Bug fixes:

* Message with empty content are not picked up by the subscriber
* Logic App showing resubmitted when is part of a new flow
* Resume not working as expected in some scenarios  

### Important to know before you apply this new release

1. Builds need to be updated since a new Powershell file has been added, DataFactoryTriggerHandler.ps1. Build documentation has been updated for Backend, Framework and Dashboard
2. Task groups have been updated, Release documentation has been updated for Backend, Framework and Dashboard
3. Before releasing, switch off the function ending with "-invictusimportjob" for 5 minutes. This is required since the ClickThroughJob will be removed from the next release and if any data is already in the queue we need to let it process first
4. Login to the Dashboard after releasing its latest version and before switching on the "-invictusimportjob"  function
5. After the release is complete and you have already logged in to the dashboard, delete the function ending with "-clickthroughjob"

Step 3 & 4 are only required for existing installations. New installation do not require this step.

Please be aware that these packages will include the Cleanup Job, refer to the ARM settings below for the default values. You can override these settings from your release pipeline in DevOps.

> DataCleanup: Will run every hour, deleting data older than 90 days for all flow tables.

* cleanupJobIntervalInMinutes: 60
* dataCleanupMaxRetentionDays: 90
* dataCleanupMaxProcessingRows: 5000

> ReIndex: Will ReIndex all tables at 2am and will repeat every 24hrs

* reIndexStartTime: 2019-05-30T02:00:00.000Z
* reIndexIntervalInHours: 24

See also the [release notes of the dashboard](../../dashboard/support/releasenotes.md) version available with this release.

---

## v2.2.2

_Release date: 2019-05-07_

* minor changes to the ARM template following the release procedure.

---

## v2.2.1

_Release date: 2019-04-29_

* added `apiKey1`, `apiKey2` and `sqlServerLoginPassword` parameters to the ARM template.
* Fixed the output parameter `Invictus.SqlServer.Password.SecretName` of the ARM template.
* Added `Invictus.Secrets.KeyVault.Name` to the output of the ARM template.
* Fixed a bug for Transco where a BOM was added when using a mapping (BOM is now removed).
* Added `$(AdditionalTemplateParameters)` to the Release Dashboard task group so that the ARM template's parameters can be overridden.

---

## v2.2.0

_Release date: 2019-04-25_

> Features:

* Resume, Resubmit and handling of flows from the dashboard, refer to: [here](http://docs.invictus-integration.com/importjobresubmit)
* Message ignore functionality from the dashboard
* Transco Custom Assemblies: [link](http://docs.invictus-integration.com/transcocustomassemblies)
* New profile page in the dashboard - Users can now login and see their details in the dashboard. For now, they cannot edit anything but it will be included in the future.

> Changes:

* Keyvault updated in ARM template to keep previous Access Policies when publishing
* The PubSub component no longer publishes the entire Invictus message to ServiceBus. Only the Content(`byte\[\]`) is pushed and the Context Properties are passed as properties along with the ServiceBus message.
* The Subscribe component will return 2 new properties inside the context: RootId & ParentId. These are set automatically by ServiceBus.

> Fixes:

* 11371 - Passwords with ; for sql db seem not to be send properly to backend
* 11099 - Add scrollbar to assign users page
* 11108 - The back button is broken / not working as expected
* 11386 - When clicking the profile button, I’m redirected to the overview page.
* 11411 - Renaming Business property doesn't not work
* 11416 - Delete a flow not working
* 11169 - An operator can change the access rights to any folder
* Additional fix to show sorted by date the records in the clickthrough

---

## v2.2.0 BETA

_Release date: 2019-02-28_

> Features:

* Import Job now handles resubmit via Azure Portal
* Added access policies array parameter for KeyVault to the ARM template

> Fixes:

* Datetime values remain in their original format when passed as tracked properties to the importjob
* Fixed bug that was stopping DSAV and other properties from being populated
* Fixed bug that was stopping TriggerName from being populated
* Fixed bug that was stopping SubscriptionId from being populated
* Fixed bug that was stopping ResourceGroupName from being populated
* Fixed bug that was stopping ExecutionTime from being populated
* Fixed bug when TrackedProperties was null
* Fixed bug in ARM Resouces Template where Location was hard coded to europe.

> Changes:

* Transco and Matrix Connectors now retrieve db alias connection strings from KeyVault
* Added workFlowEventHubName as a parameter for KeyVault
* ImportJob now uses Records.Properties.StartTime instead of Record.Time as the StartTime of the LogicApp
* ImportJob now uses WorkFlowRunId instead of WorkFlowName when merging properties
* Added KeyVaultUrl to ARM template
* ImportJob now only pushes data to the Database if the WorkFlowRunStarted event is present. This reduces load and also stops triggers from being treated as flows.
* The Flow row in the dashboard now displays the time of the first WorkFlowRunStarted event rather than the time of the first event.
* If Resubmit is detected, the statuses of the previous LogicApps in the Execution tree are ignored.

> **For this package, before releasing you will need to migrate the DBAlias data in the Transco Database to KeyVault. Simply insert a secret with the same DbAlias name and a connectionstring as a value for each row found in the DBAlias table.**

---

## v2.1.0

_Release date: 2019-01-16_

**Features:**

* Dashboard Clickthrough(Execution Tree) is now available. The WorkFlows executed can now be viewed per flow message
* New parameter included in the ARM Template : "AlwaysOn" to allow enabling and disabling feature for WebApps
* The following values are now being outputted from the ARM template:
  * Invictus.SqlServer.ServerName
  * Invictus.SqlServer.DatabaseName.Dashboard
  * Invictus.SqlServer.DatabaseName.Transco.Root
  * Invictus.SqlServer.Username
  * Invictus.SqlServer.Password.SecretName  

> Fixes:

* Clickthrough error when ClientTrackingID was missing that resulted in missing events
* BOM removed from Transco component
* Transco fix for special characters
* Fix editing of flow (#10590)
* Fix that database passwords are not always send correctly (#10904)
* Fix that allows inline html in grid (#10938)
* Changes to how dates are display (#10994 & #10995)
* UI improvement, folders can be collapsed (#10445)
  
> Changes:

* Max message size for Transco and Matrix increased to 100mb
* Error messages now include the WorkFlowName and are displayed using the following format - `\[WorkFlowName\]:\[ErrorMessage\]`
* SQL Server Password is now also stored in keyvault upon release to make it easier to retrieve. This is done during the release of the Resources ARM Template
* PubSub `x-iv-client-tracking-id` renamed to `x-ms-client-tracking-id`

---

## v2.0.0

_Release date: 2018-10-29_

* Bug in PubSub fixed when receiving messages
* Bug in PubSub on Rule Creation duplicate error fixed
* Bug in PubSub on Rule Creation "name to long" error fixed
* Optimized ImportJob to improve reliability and speed
* ImportJob is now using a consumption plan 
* Added scale in rules for WebApps + ARM Parameters to customize
* EventHub is now by default installed as Standard with 32 partitions
* Added more parameters to "Resources" ARM template - Refer to documentation for full list of parameters 
* Size for all Databases is now by default setup as 250GB
* SQL Server Size default setting is now S1
* Some properties in Basic Matrix are now set as Advanced and will be hidden by default in Logic Apps
* Conversation, Correlation, Batch and Conversation Id properties have been removed from all components - BatchId was left in BasicMatrix
* Decreased EventHub batch size in ImportJob
* Added Outputs to ARM template
* ImportJob no Longer uses ChainID, refer to documentation for more information
* EnabledForTemplateDeployment for KeyVault
* Duplicate detection enabled for Pubsub
* Added MessageId to Publish Model, if left empty a random guid is generated. This is then passed with the BrokeredMessage to ServiceBus to detect duplicates
* Transco Extraction renamed to Transco Execution
* Basic Extract Message Context - Flow, Milestone & ApplicationName are now set as advanced properties
* JSON Notation for BasicMatrix has been updated(some values were in lower case).
* Publish Function now automatically promotes the x-ms-client-tracking-id passed by LogicApps to the Context
* Output Parameters for the Resources ARM template has been updated
* All APIs have been setup to use Live Metrics for AppInsights, you can now utilize this if you want to monitor live performance

---

## v1.0.0

_Release date: 2018-07-17_

* **Package for Resources:** Includes updates to the ARM template to add a new API App to support the Transco API, Databases, Resource Locks and Event Hub.
* **Pull Resources Powershell**: Script has been updated to be able to always pull specific versions and also removed the need to update list of containers.
* **Matrix Connector:** Transo Support is not supported with Matrix, documentation for Matrix has been updated. New Function **Basic Extract Message Context **is now also included with matrix, this is a simpler version for Logic Apps, documentation for this function has also been added.
* **Transco Connector:**  New API added to release which will expose new Transco Extract functions.

---

## v0.1.0

_Release date: 2018-05-28_

* **Pub/Sub Connector:** Includes optimizations, fixes and support for MSI authentication between Key Vault and the API.
* **Package for Resources:** Includes updates to the ARM template to add a new API App to support the Matrix API, reduction in parameters and MSI setup.
* **Matrix Connector**
