[home](../../README.md) | [dashboard](../dashboard.md)

# Dashboard Release Notes

## Version 4.9.0

_Release date: TBD

> Features and improvements:

* Option to configure milestone and event text columns in clickthrough to show or hide from the add/edit flow dialog
* Added support for HTML elements for milestone and event text
* DSAV is searched with a like not = .. so when searching it doesn't need to be the exact word
* Added Re-import with the resubmit/resume/ignore functionality.

> Bug Fixes

* Fixed the width of the dialog when you click on the clickthrough details icon
* Fixed dynamic width of columns for the messages result page
* Move and delete business properties when editing flow are now working as it should
* Fixed the documentation link for both biztalk and logicapps
* Fixed issue with subfolders having same name in different folders

---

## Version 4.8.0

_Release date: 2020-05-21_ 

> Features and improvements:

* Role management
* EventText & Milestone are now trimmed and can be viewed in a modal popup
* DataFactory receiver
* Move Flows from folder to another folder
* Disabled Re-Indexing Pipeline
* Added collapse/expand for the Flows
* Reduced Flows font size and padding
* Allow subfolders with the same names in different folders
* Improved loading time for the Flow messages page
* Improved loading time for the Statistics page
* Changed loading of Flow messages to last 24hrs. Added a config which can be set at the release stage
* Reduced ErrorInfo in WorkFlowEvent table nvarchar from max to 500

> Bug Fixes

* Increased timeout for API calls
* Increased timeout for Flow messages
* Increased timeout for Statistics messages
* Changed Statistics to load data first before refreshing
* Fixed Paging options null exception on Dashboard

---

## Version 4.7.7

_Release date: 2020-04-28_

> Features and improvements:

* Improved reindexing job to use store procedure provided by Microsoft (same as Azure version).

---

## Version 4.7.6

_Release date: 2020-04-14_

> Features and improvements:

* Create flows with the same name in different folders
* Advanced Search now showing the Folder name helping selecting specific flows
* Export to CSV improvements adding an option to export only the selected columns
* Show dates in English in Dashboard

> Bug Fixes

* Fix for error when renaming a flow with special characters
* Fix for selection of default date filter that was incorrect
* Fix for Select All checkbox after a bulk resume/resubmit

---

## Version 4.7.5

_Release date: 2020-03-13_

> Features and improvements:

* Azure Active Directory Login Support added to the Dashboard
* Flows are now sorted alphabetically in the menu
* Added Scope to Reindex SPR in DataFactory
* Added SQL Serverless support to the Dashboard ARM template

> Bug Fixes:

* Hidden incorrectly displayed export button in the Dashboard

---

## Version 4.7.4

_Release date: 2020-03-03_

> Features and improvements:

* Fixed Deploy.ps1, webApp names were hardcoded

> Bug Fixes:

* Changed datatype from int to bigint for the properties table

---

## Version 4.7.2

_Release date: 2020-02-19_

> Features and improvements:

* Fixed hardcoded regions inside the ARM template
* TriggerCleanup SPR bug - increased table name size to 500


## Version 4.7.1

_Release date: 2020-02-06_

> Features and improvements:

* Dashboard Edit Password
* Database Migrations are now triggered on release instead of on Login
* Reduced AI Logging and functionality to switch logging on or off
* VM Local AD Error Fix(Biztalk) 
* ImportJob is now using Blob Storage rather than Table Storage as a caching database

Note: Please update the Deploy Task in your release pipeline by enabling "Use Powershell Core"
 
Important: Please remember that you will need to stop your "triggering" logicapps before releasing this version so that any data in the pipeline is cleared. The reason for this is because since we are switching to Blob there might be some data loss. The ImportJob is now much more stable and able to handle more load as Table storage starts to suffer when load increases and connections start running out. If you are ok with some data loss then you can just proceed with the installation normally. 

Important: All failed flow messages should be re-triggered before the release. 

NOTE: When passing the ApiKey1 and ApiKey2 to the Deploy.ps as arguments, please remember to enclose them in single quotes ''. This prevents any operator characters from breaking the ps script.

---


## Version 4.7.0

_Release date: 2020-01-13_

> Features and improvements:

* 13377 - Use cache for the dashboard stats - default of 5 minutes. (Biztalk/Azure)
* 13353 - Redirect Http to Https. (Biztalk/Azure)
* 13307 - Add source column in workflowevents table - to show/hide the Details link from clickthrough if it's logicapps or generic. (Azure)
* 12573 - Custom resume/resubmit when creating a flow (Advanced Settings) - (Azure)
* Track messages from any source: implementation of two separate functions, a generic import job that includes a generic receiver over * EventHub and an HTTP receiver endpoint.
* Support to run inside a virtual network (VNET)	
* Import Job upgraded to Functions v2
* Simplified versioning and improved release procedure using a PowerShell script

---

## Version 4.6.1

_Release date: 2019-10-14_

> Features and improvements:

* 13147 - Hide the tracked property icon within the click through when there is no tracked property available. (Azure)
* 13064 - Fix alignment for the clickthrough table. (Azure)
* 13083 - Fix when searching on long text property value gives error. (Biztalk/Azure)
* 13149 - Added a loading screen when a flow is created or edit. (Biztalk/Azure)
* 13219 - Flows were taking long to be created - removed the update stats from the create flow stored procedure. Better Performance! (Biztalk/Azure)
* 13255 - Fixed an error when login when flow name name exceeds 50 characters. (Biztalk/Azure)
* 13242 - Fixed the order of the property columns when there is a change in the ordering from the Edit Flow. (Biztalk/Azure)

---
  
## Version 4.6.0

_Release date: 2019-09-16_

> Available for Invictus for BizTalk and Invictus for Azure Dashboard versions

> On existing installations of Invictus Dashboard (v4.5.0.6 and below) we suggest a backup of the CoditCip database is made, and ensure there will be no incoming messages while the setup is being done. After the setup is complete,  make sure you login immediately after to the dashboard .

> Features and improvements:

* 11498 - Hybrid link configuration on BizTalk dashboard
* 12989 - Keep login session active when navigating from BizTalk dashboard to Azure Dashboard (and viceversa)
* 12779 - Database set by default to CODitCIP on DSBImportJob steps 8 to 10
* 12544 - Validate distinct chain id's when resubmitting or resuming
* 12744 - Show link to navigate to Azure Portal on execution tree level
* 12743 - Adjust height of rows to be in line with rest of layout (as it was before introducing icons)
* 12892 - Default selection of columns in drop-down selection when there are more than six properties
* 12990 - Link to Technical Dashboard from BizTalk functional dashboard when flow is successful
* 10416 - Resize of columns for the message results

> Bug fixes:

* 12101 - Rename of folder with flows
* 12580 - When doing a resubmit, the resubmit icon to appear only be on the first logic app
* 12129 - Clear search values when switching to other flow
* 12114 - Columns different to DSAV properties are randomly lost sometimes
* 12579 - Free text search not working properly
* 12742 - Free text search includes a space behind chainid.
* 12581 - Selecting all columns in the message results shows empty column titles
* 12745 - Adjust alignment of the error message on logic app level
* 12920 - Wrapping of error text on logic app level
* 11384 - Sorting not working correctly
* 12860 - Not possible to see all columns when resolution is low or small

---

## Version 4.5.4

_Release date: 2019-07-09_

**Available only for Invictus for Azure Dashboard version.**

> Features and improvements:

* Business audit trail:  tracked properties, milestone and event text on execution tree (logic app) level
* General settings page to configure hybrid link between Invictus for BizTalk and Invictus for Azure dashboards
* Mass resume / resubmit of messages from dashboard
* Redefinition and organization of flow statuses on dashboard.  Resubmitted and Resumed are no longer treated as statuses
* Show status Active when a flow is resumed/resubmitted
* Show the actual error messages instead of a generic error message with Application Insights
* Audit trail for resubmit with Application Insights (who resubmitted what flow at what time)

> Bug fixes:

* 400 Bad Request when attempting to load over 70K messages
* UTC time when searching messages on dashboard
* CSV export of messages
* Totals (statistics) not matching between home screen and flow screen
* Search properties lost sometimes
* Resubmit when sending over 1.5k messages , status remained resubmit requested
* Clicking the settings button triggered a refresh
* Flow name change with invalid characters
* In between start date NaN when manually editing date
* Height of rows to be smaller
* Username password not set when running to setup second time

Please note that as from this version, we are advising users to not exceed the lenght of **100** chars for the **Workflow name** and **DSAV** properties when creating new flows.  In the following versions of Invictus for Azure and the dashboard this lenght will be truncated and validated.  

As for **ErrorInfo,** in the upcoming versions the limit will be truncated to 500 chars max for each execution tree item.

---

## Version 4.5.0.6

_Release date: 2019-02-28_

> Available only for Invictus for Azure Dashboard version.

* Visualize LogicApps resubmit
* Execution Tree is now in UTC time
* Fix for advanced search
* Fix for sorting

---

## Version 4.5.0.4

_Release date: 2019-01-21_

> Available for Invictus for BizTalk Dashboard version.

* Minor improvements and bug fixes.

---

## Version 4.5.0.1

_Release date: 2018-12-14_

> Available for Invictus for BizTalk Dashboard version.

* Feature - Message handling has improved
* Bugfix - Active Directory fix
* Bugfix - Passwords with # character are now working
* Bugfix - Edit biztalk flow

---

## Version 4.5.0

_Release date: 2018-11-30_

* Feature - Date Picker in the advanced search
* Bugfix - Search by properties works good with filters on
* Bugfix - Error messages showing now
* Performance - we worked on performance issues and now messages load faster

---

## Version 4.4.0

_Release date: 2018-10-08_

* Feature - Message cleanup job
* Bugfix - Message filters in advanced search

---

## Version 4.3.2

_Release date: 2018-09-07_

* Feature - Allow handling of resumable messages in BizTalk
* Feature - Added list with flow status to landing page
* Feature - Added cross flow search

---

## Version 4.3.0

_Release date: 2018-06-28_

* Feature - Make the receive port optional in the Portal
* Bugfix - Assign users only works in Chrome
* Bugfix - The setup of the columns is not saved
* Bugfix - The setup of a changed flow is not saved
* Bugfix - When assigning a user, nothing gets saved, no error is thrown

---

## Version 4.2.6

* Rebrand from Codit Functional Dashboard to Invictus Functional Dashboard
* Bugfix - Logout is redirecting to login page
* Bugfix - Subfolders are added to correct parent folder
* Bugfix - Rename of folders

---

## Version 4.2.5

* Feature - Ability to change business properties order to display in the grid.
* Feature - Ability to toggle visibility of columns in grid when the number of columns is greater than 6.

---

## Version 4.2.4

* Bug - Fix order when importing flows
* Bug - Dashboard setup screen not loading
* Bug - Homepage refresh button
* Bug - Block flowtype property for reserved keywords
* Bug - Block Flow property for reserved keywords
* Feature - Export to excel (server results instead of client results)
* Maintenance - Upgrade to Angular5 and PrimeNg5

---

## Version 4.2.3

* Bug - Entering IP address in the technical dashboard URL box is allowed when installing the functional dashboard
* Bug - Renaming flow name failed if no data
* Bug - Installer UX improvements
* Bug - Run schedule to clear statistics if data is not passing through
* Bug - Debug result query
* Bug - Consistency flow statistics and result page
* Bug - Text overlap when creating new flow
* Bug - Performance issues: Multiple message queries fired when navigating
* Bug - Refresh page after deletion of flows and folder
* Bug - IE11 caches data by default
* Bug - Filter on date not possible
* Feature - Search part of text in property filter

---

## Version 4.2.2

* Bug: Enable Active Directory mode in setup
* Bug: Match domain roles in setup with user roles on login
* Feature: Set Windows Authentication on in IIS during AD installation
* Feature: Make Active Directory configurable in installer

---

## Version 4.2.1

* Properties are case-insensitive for messages overview
* Bugfix: Changes on flowtype are changed on messages overview without refresh
* Bugfix: Thumbprint validation instead of name validation for SSL on installation
* Bugfix: Folder / Flow name is unreadable when using long names
* Bugfix: Usermanagement: delete confirmation when deleting user
* Bugfix: Usermanagement: no feedback if user already exists
* Bugfix: Extend user sessions
* Feature: Enable sort on messages grid

---

## Version 4.2.0

* Bugfix: show correct version in portal
* Bugfix: Queries failed because of incorrect conversion from int to bigint on sql in some cases
* Bugfix: More results button on messages screen did not work correctly
* Feature: Support for local ad login
* Feature: Support for local ad role mapping with dashboard roles
* Feature: Clickable URL in the messages grid if a promoted property has an "a href" value

---

## Version 4.1.1

* Bugfix: Pivot for FlowTypeProperties
* Bugfix: Layout fixes for IE11
* Bugfixes for User Management

---

## Version 4.1.0

> This version has breaking changes with 4.0.0.0.

* Creation flow does not immediately refresh dashboard
* URL Rewrite 2.0 check on installation + updated documentation
* CoditCip database is pre-selected on installation if present
* Installer uses Green color scheme
* Better explanation of flow context property name during setup
* Better explanation of permissions to online documentation
* Documentation link added on installer startup
* Upgraded Angular2 version and task runners
* Support for Active Directory (single user)
* Bugfix: Do not update database while retrieving previous configuration when running setup.
* Bugfix: Finish setup fails on a number of specific configurations
* Bugfix: Url specification to technical dashboard
* Bugfix: A flow with a reserved property type name (ex: "Flow") blocked query execution on search messages
* Bugfix: New technical dashboard installation should not remove ImportFlows step in DSBImportJob
