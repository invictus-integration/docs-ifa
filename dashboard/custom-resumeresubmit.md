[home](../README.md) | [dashboard](dashboard.md) | [custom resume/resubmit](custom-resumeresubmit.md)

# Custom Resume And Resubmit

## How to use this feature

From the Invictus dashboard, navigate to the sidebar, and create a new flow/edit a new flow as in the following images:

_Creating a new flow_

![Create New Flow example](../images/v2_custom-resumeresubmit-createflow.png)

_Editing an existing flow_

![Create New Flow example](../images/v2_custom-resumeresubmit-editflow.png)

Clicking these buttons will redirect you to the create/edit flow page as per below:
![Create/Edit Flow example](../images/v2_custom-resumeresubmit-flowscreen.png)

We will focus on the 'Advanced Settings' part of the screen, located on the right side of the page. To enable custom resume and resubmit for a flow, simply click the radio buttons of 'Custom resubmit URL' and 'Custom resume URL' respectively:

![Advanced Settings radio buttons](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings.png)

Once enabled, the 'Resubmit URL (HTTPS)' and 'Resume URL (HTTPS)' input fields become editable. One may enter a URL in one of the fields to set a Resubmit/Resume URL. The ![Advanced settings test url button](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl-button.png) button can be clicked in order to test the inputted URL:

![Advanced settings test url button demo](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl.png)

Clicking this button will test the URL to see if it is reachable. The URL needs to be an HTTPS URL. A toast will be displayed on screen to indicate if the URL fails or is successful.

![Advanced settings test url failure](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl-failure.png)

![Advanced settings test url success](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl-success.png)

You may need to have to use custom HTTP Headers when making the custom resubmit/resume request. To edit the HTTP headers, click the ![Advanced settings headers button](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-headers-button.png) to open the HTTP headers dialog box.

![Advanced settings headers button demo](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-headers.png)

![Advanced settings headers dialog](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-headers-dialog.png)

In this dialog, click the 'Add Header' button to enter the HTTP headers. A header consists of a key and a value. Click the ![Advanced settings headers dialog inputted header delete button](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-headers-dialog-inputted-header-delete-icon.png) to delete a header. Click the 'Save Headers' button to save the headers. Duplicate keys will automatically be removed when this button is clicked.

![Advanced settings headers dialog inputted header](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-headers-dialog-inputted-header.png)

Here is an example of what is being sent when clicking the ![Advanced settings test url button](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl-button.png) button. Let's use the custom resubmit URL and Resubmit HTTP Headers as above. Clicking this button simply will send a `POST` request with no body to the URL, alongside the custom headers as specified.
![Custom resume resubmit test url example request](../images/v2_custom-resumeresubmit-flowscreen-advancedsettings-testurl-example-request.png)

All this applies to the Custom Resume as well.

Once comfortable with the changes, do not forget to fill in the necessary inputs in the page and Save the flow.
