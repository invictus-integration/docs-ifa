---
sidebar_label: Settings
---

# Available settings
<nav class="custom-breadcrumb">
  <span class="breadcrumb-item no-padding">
    ![logo](/img/favicon.ico)
  </span>
  <span>›</span>
  <span class="breadcrumb-item">profile_name&nbsp;<svg width="19" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.90901 10.4545V1M2.90901 10.4545C3.29478 10.4545 3.66475 10.6078 3.93753 10.8806C4.21031 11.1534 4.36356 11.5233 4.36356 11.9091C4.36356 12.2949 4.21031 12.6648 3.93753 12.9376C3.66475 13.2104 3.29478 13.3636 2.90901 13.3636M2.90901 10.4545C2.52324 10.4545 2.15327 10.6078 1.88049 10.8806C1.60771 11.1534 1.45447 11.5233 1.45447 11.9091C1.45447 12.2949 1.60771 12.6648 1.88049 12.9376C2.15327 13.2104 2.52324 13.3636 2.90901 13.3636M2.90901 13.3636V17M14.5454 10.4545V1M14.5454 10.4545C14.9311 10.4545 15.3011 10.6078 15.5739 10.8806C15.8467 11.1534 15.9999 11.5233 15.9999 11.9091C15.9999 12.2949 15.8467 12.6648 15.5739 12.9376C15.3011 13.2104 14.9311 13.3636 14.5454 13.3636M14.5454 10.4545C14.1596 10.4545 13.7896 10.6078 13.5169 10.8806C13.2441 11.1534 13.0908 11.5233 13.0908 11.9091C13.0908 12.2949 13.2441 12.6648 13.5169 12.9376C13.7896 13.2104 14.1596 13.3636 14.5454 13.3636M14.5454 13.3636V17M8.72719 4.63636V1M8.72719 4.63636C9.11296 4.63636 9.48293 4.78961 9.75571 5.06239C10.0285 5.33517 10.1817 5.70514 10.1817 6.09091C10.1817 6.47668 10.0285 6.84665 9.75571 7.11943C9.48293 7.39221 9.11296 7.54545 8.72719 7.54545M8.72719 4.63636C8.34143 4.63636 7.97146 4.78961 7.69868 5.06239C7.4259 5.33517 7.27265 5.70514 7.27265 6.09091C7.27265 6.47668 7.4259 6.84665 7.69868 7.11943C7.97146 7.39221 8.34143 7.54545 8.72719 7.54545M8.72719 7.54545V17" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
  <span>›</span>
  <span class="breadcrumb-item active">Settings</span>
</nav>

## Connected Dashboard

In a hybrid (BizTalk + Azure) setup, it is necessary to have a link from one Dashboard (BizTalk) to the other Dashboard (Azure) for hybrid flows.  With the introduction of the claimcheck component, it is now possible to have one flow starting in the cloud and being continued on prem (and vice versa). With this feature it is possible to have a click-through experience between the two different Dashboards.

You will find the option to enter the Connected Dashboard URL which is the base URL of the other Dashboard which you want to connect to.

![settings](/images/v2_settings1.png)

Now you need to enable the Connected Dashboard for the required flow. This can be done when either creating a new flow or editing an existing one. In this screen shot below, we are showing the Edit Flow example.

![settings](/images/v2_settings2.png)

If you navigate to the page for that flow, a new button will be added at the right-hand side for each table row. Clicking on this button will navigate you to your specified Connected Dashboard URL for that message chain.

![settings](/images/v2_settings3.png)

If you are not logged in the other Dashboard, it will direct you to the login page but with a return URL. Once logged in, you will be redirected to the actual link.
