"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["2156"],{1942(e,t,r){r.r(t),r.d(t,{metadata:()=>n,default:()=>w,frontMatter:()=>f,contentTitle:()=>g,toc:()=>b,assets:()=>x});var n=JSON.parse('{"id":"dashboard/flows/add","title":"Add new flows","description":"{/ vale Vale.Spelling = NO /}","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/01_add.mdx","sourceDirName":"dashboard/flows","slug":"/dashboard/flows/add","permalink":"/dashboard/flows/add","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":1,"frontMatter":{"sidebar_label":"Add new flows","title":"Add new flows","hide_table_of_contents":true,"breadcrumbs":false},"sidebar":"business_users","previous":{"title":"Dashboard Homepage: Overview of flow statuses","permalink":"/dashboard/flows/"},"next":{"title":"Search for messages","permalink":"/dashboard/flows/search"}}'),o=r(4848),i=r(8453),s=r(773),l=r(7250),a=r(2437),c=r(2860),d=r(1444),h=r(4050);function u({targetId:e,children:t}){return(0,o.jsx)("a",{href:`#${e}`,onClick:function(t){t.preventDefault();let r=document.getElementById(e);if(r){if(!(r.hasAttribute("open")&&"true"!==r.getAttribute("data-collapsed"))){let e=r.querySelector("summary");e?.click()}setTimeout(()=>r.scrollIntoView({behavior:"smooth"}),50),window.history.pushState(null,"",`#${e}`)}},children:t})}r(6540);var p=r(7066),m=r(6188);let f={sidebar_label:"Add new flows",title:"Add new flows",hide_table_of_contents:!0,breadcrumbs:!1},g="Add new flows ",x={},b=[];function v(e){let t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",header:"header",i:"i",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components},{Details:r}=t;return r||function(e,t){throw Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsxs)(t.h1,{id:"add-new-flows-",children:["Add new flows ",(0,o.jsx)(a.SV,{})]})}),"\n","\n",(0,o.jsx)(h.A,{paths:["Your Flows",(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.i,{children:"your_folder"})," \u2022\u2022\u2022"]}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:m.QLR})," Create New Flow"]})]}),"\n","\n",(0,o.jsxs)(t.p,{children:["As business user, you can create new ",(0,o.jsx)(c.M,{})," to track your integrations. By specifying the right mapping and context, you can track the messages going through your integrations"]}),"\n",(0,o.jsxs)(t.table,{children:[(0,o.jsx)(t.thead,{children:(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.th,{children:"Property"}),(0,o.jsx)(t.th,{children:"Description"})]})}),(0,o.jsxs)(t.tbody,{children:[(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Flow Name"})}),(0,o.jsxs)(t.td,{children:["A ",(0,o.jsx)(d.ks,{label:"Flow Name"})," that describes the client interaction (example: ",(0,o.jsx)(t.em,{children:"invoice request"}),", ",(0,o.jsx)(t.em,{children:"invoice approval"}),")"]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Folder"})}),(0,o.jsxs)(t.td,{children:["The ",(0,o.jsx)(d.ic,{label:"Folder"})," where to add the flow. Flows are always structured in ",(0,o.jsx)(t.a,{href:"/dashboard/flows/#organizing-flows-in-folders",children:"folders"}),"."]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Mapping"})}),(0,o.jsxs)(t.td,{children:["The information to identify messages going through this flow. The ",(0,o.jsx)(d.ks,{label:"Domain"}),", ",(0,o.jsx)(d.ks,{label:"Service"}),", ",(0,o.jsx)(d.ks,{label:"Action"})," and ",(0,o.jsx)(d.ks,{label:"Version"})," are special business properties to 'map' messages to flows. You can use ",(0,o.jsx)(d.ks,{label:"Workflow name"})," in cases where the message goes through an Azure Logic App workflow."]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Business Properties"})}),(0,o.jsxs)(t.td,{children:["Metadata context properties to further describe the flow. Every ",(0,o.jsx)(d.ks,{label:"Business property name"})," you add here gets filled if the message contains the corresponding value."]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Advanced Settings"})}),(0,o.jsx)(t.td,{children:(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(d.lz,{label:"Connected Dashboard"})," (= ",(0,o.jsx)(t.a,{href:"/dashboard/settings",children:"hybrid setups"})," require a link from one Dashboard (BizTalk) to the other Dashboard (Azure))"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(d.lz,{label:"Show milestone and event text"})," (= displays the flow milestone and event text data)"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(d.lz,{label:"Show Resubmit / Resume"})," (= make the 'Resubmit/Resume' flow action buttons available per flow, ",(0,o.jsx)(a.yo,{version:"v6.2"}),")"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(d.lz,{label:"Custom resubmit URL"}),(0,o.jsx)(d.ks,{label:"Your resubmit URL"})," and ",(0,o.jsx)(d.lz,{label:"Custom resume URL"}),(0,o.jsx)(d.ks,{label:"Your resume URL"})," (= turn these options on and provide the URLs to use ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"your own resume and resubmit logic"}),")"]})]})})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Alerts"})}),(0,o.jsx)(t.td,{children:(0,o.jsx)(u,{targetId:"flow-alerting",children:"See alerting"})})]})]})]}),"\n",(0,o.jsxs)(r,{id:"flow-permissions",children:[(0,o.jsx)("summary",{children:(0,o.jsx)("span",{children:(0,o.jsx)(t.strong,{children:"Allow access to flow"})})}),(0,o.jsxs)(t.p,{children:["You can allow both active Microsoft Entra ID groups and local users to access the flows in the folder.\nBased on the ",(0,o.jsx)(t.a,{href:"/dashboard/security/roles",children:"allowed role"}),", the user receives their allowed permissions on the flow."]}),(0,o.jsx)(h.A,{paths:["Your Flows",(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.i,{children:"your_folder"})," \u2022\u2022\u2022"]}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:m.USd})," Edit Folder Permissions"]})]}),(0,o.jsx)(t.admonition,{title:"Admins can access all flows",type:"info",children:(0,o.jsxs)(t.p,{children:["Users with the ",(0,o.jsx)(t.em,{children:"System admin"})," role can access all flows in every folder available."]})})]}),"\n",(0,o.jsxs)(r,{id:"flow-alerting",children:[(0,o.jsx)("summary",{children:(0,o.jsx)("span",{children:(0,o.jsx)(t.strong,{children:"Add an alert for a flow"})})}),(0,o.jsxs)(t.p,{children:["You can create ",(0,o.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview",children:"Azure Monitor alerts"})," right from the flow.\nThis allows you to pro-actively monitor your flows and get notified when something needs your attention, for example when a flow becomes inactive or starts failing."]}),(0,o.jsx)(t.admonition,{title:"require role assignments after installation",type:"warning",children:(0,o.jsxs)(t.p,{children:["The Invictus Dashboard ",(0,o.jsx)(t.a,{href:"/dashboard/installation/give_la_access",children:"requires additional role assignments"})," to add alerts to flows."]})}),(0,o.jsx)(h.A,{paths:["Your Flows",(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.i,{children:"your_flow"})," \u2022\u2022\u2022"]}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:m.LFz})," Edit Flow"]}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:m.q_k})," Alert rule"]})]}),(0,o.jsxs)("table",{border:"1",cellpadding:"4",cellspacing:"0",children:[(0,o.jsx)("thead",{children:(0,o.jsxs)("tr",{children:[(0,o.jsx)("th",{children:"Property"}),(0,o.jsx)("th",{children:"Description"})]})}),(0,o.jsxs)("tbody",{children:[(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Alert name"})}),(0,o.jsxs)("td",{children:["The ",(0,o.jsx)(d.ks,{label:"Alert name"})," for the alert rule must be unique per flow. (Flow name becomes a prefix.)"]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Description"})}),(0,o.jsxs)("td",{children:["The ",(0,o.jsx)(d.ks,{label:"Description"})," text giving more context to the alert."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Severity"})}),(0,o.jsxs)("td",{children:["The level of ",(0,o.jsx)(d.ic,{label:"Severity"})," of the alert. This determines the importance and urgency of the alert."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Schedule"})}),(0,o.jsx)("td",{children:(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(d.Q7,{label:"Frequency"})," (= how often to execute the rule - in the range of ",(0,o.jsx)("code",{children:"5-1440"}),")"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(d.Q7,{label:"Time window"})," (= range that Azure uses, the logs for the last x minutes - in the range of ",(0,o.jsx)("code",{children:"5-2880"}),")"]})]})})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Trigger"})}),(0,o.jsxs)("td",{children:["The ",(0,o.jsx)(d.Q7,{label:"Threshold"})," value and the ",(0,o.jsx)(d.ic,{label:"Threshold Operator"})," defines when to trigger the alert rule."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Throttling"})}),(0,o.jsxs)("td",{children:["The ",(0,o.jsx)(d.lz,{label:"Suppress alerts"})," and ",(0,o.jsx)(d.Q7,{label:"Suppress alerts (minutes)"})," allows you to throttle triggered alerts for x minutes to prevent alert fatigue."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Query"})}),(0,o.jsx)("td",{children:(0,o.jsxs)(s.A,{children:[(0,o.jsxs)(l.A,{value:"invictus-activity-check",label:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(d.ic,{label:"Invictus Activity Check"})}),children:[(0,o.jsxs)(t.p,{children:["Monitors flow activity via Azure logs (custom events with name: ",(0,o.jsx)("code",{children:"InvictusImportJobFlowActivityAlert"}),").\nInvictus logs one activity per active flow every hour. If an alert running every 60 minutes finds no logs in the last 60 minutes (threshold < 0), Invictus flags the flow as inactive and triggers an alert."]}),(0,o.jsx)(t.admonition,{title:"logging frequency",type:"tip",children:(0,o.jsxs)(t.p,{children:["Logging happens per flow (not per message) and may exceed one entry per hour due to scaling or multi-threading.\nReduce ",(0,o.jsx)(t.a,{href:"/dashboard/installation/?q=q=FlowActivityIntervalInMinutes#bicep-template-parameters",children:(0,o.jsx)(t.code,{children:"FlowActivityIntervalInMinutes"})})," to increase logging frequency."]})})]}),(0,o.jsx)(l.A,{value:"invictus-error-check",label:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(d.ic,{label:"Invictus Error Check"})}),children:(0,o.jsxs)(t.p,{children:["Monitors flow activity via Azure logs (custom events with name: ",(0,o.jsx)("code",{children:"InvictusImportJobFlowErrorAlert"}),"). Invictus logs an entry for each flow that triggers an error. If an alert running every 10 minutes finds more than 0 logs in the last 10 minutes (threshold > 0), Invictus flags the flow as failed and triggers an alert."]})}),(0,o.jsx)(l.A,{value:"azure-result-count",label:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(d.ic,{label:"Azure Result Count"})}),children:(0,o.jsxs)(t.p,{children:["Use custom Azure alert syntax, see the official ",(0,o.jsx)("a",{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview",children:"Microsoft documentation"})," to learn more about alerting."]})})]})})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Recipients"})}),(0,o.jsxs)("td",{children:["Add a email ",(0,o.jsx)(d.cX,{label:"Recipient"})," that gets notified with a mail with your email ",(0,o.jsx)(d.ks,{label:"Subject"})," upon a triggered alert rule."]})]})]})]})]})]})}function w(e={}){let{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(v,{...e})}):v(e)}},7250(e,t,r){r.d(t,{A:()=>l});var n=r(4848);r(6540);var o=r(4164),i=r(7663);function s({children:e,className:t,hidden:r}){return(0,n.jsx)("div",{role:"tabpanel",className:(0,o.A)("tabItem_Ymn6",t),hidden:r,children:e})}function l({children:e,className:t,value:r}){let{selectedValue:o,lazy:a}=(0,i.uc)(),c=r===o;return!c&&a?null:(0,n.jsx)(s,{className:t,hidden:!c,children:e})}},773(e,t,r){r.d(t,{A:()=>u});var n=r(4848);r(6540);var o=r(4164),i=r(8287),s=r(7663),l=r(8584),a=r(9863);function c({className:e}){let{selectedValue:t,selectValue:r,tabValues:i,block:a}=(0,s.uc)(),d=[],{blockElementScrollPositionUntilNextRender:h}=(0,l.a_)(),u=e=>{let n=e.currentTarget,o=i[d.indexOf(n)].value;o!==t&&(h(n),r(o))},p=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{let r=d.indexOf(e.currentTarget)+1;t=d[r]??d[0];break}case"ArrowLeft":{let r=d.indexOf(e.currentTarget)-1;t=d[r]??d[d.length-1]}}t?.focus()};return(0,n.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":a},e),children:i.map(({value:e,label:r,attributes:i})=>(0,n.jsx)("li",{role:"tab",tabIndex:t===e?0:-1,"aria-selected":t===e,ref:e=>{d.push(e)},onKeyDown:p,onClick:u,...i,className:(0,o.A)("tabs__item","tabItem_LNqP",i?.className,{"tabs__item--active":t===e}),children:r??e},e))})}function d({children:e}){return(0,n.jsx)("div",{className:"margin-top--md",children:e})}function h({className:e,children:t}){return(0,n.jsxs)("div",{className:(0,o.A)(i.G.tabs.container,"tabs-container","tabList__CuJ"),children:[(0,n.jsx)(c,{className:e}),(0,n.jsx)(d,{children:t})]})}function u(e){let t=(0,a.A)(),r=(0,s.OC)(e);return(0,n.jsx)(s.O_,{value:r,children:(0,n.jsx)(h,{className:e.className,children:(0,s.vT)(e.children)})},String(t))}},7663(e,t,r){r.d(t,{OC:()=>u,O_:()=>f,uc:()=>m,vT:()=>d});var n=r(4848),o=r(6540),i=r(6347),s=r(9989),l=r(6629),a=r(618),c=r(1367);function d(e){return o.Children.toArray(e).filter(e=>"\n"!==e)}function h({value:e,tabValues:t}){return t.some(t=>t.value===e)}function u(e){let t,{defaultValue:r,queryString:n=!1,groupId:d}=e,u=function(e){let{values:t,children:r}=e;return(0,o.useMemo)(()=>{let e=t??o.Children.toArray(r).flatMap(e=>{if(!e)return[];if((0,o.isValidElement)(e)&&function(e){let{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return[e];let t="string"==typeof e.type?e.type:e.type.name;throw Error(`Docusaurus error: Bad <Tabs> child <${t}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.
If you do not want to pass on a "value" prop to the direct children of <Tabs>, you can also pass an explicit <Tabs values={...}> prop.`)}).map(({props:{value:e,label:t,attributes:r,default:n}})=>({value:e,label:t,attributes:r,default:n})),n=(0,a.XI)(e,(e,t)=>e.value===t.value);if(n.length>0)throw Error(`Docusaurus error: Duplicate values "${n.map(e=>`'${e.value}'`).join(", ")}" found in <Tabs>. Every value needs to be unique.`);return e},[t,r])}(e),[p,m]=(0,o.useState)(()=>(function({defaultValue:e,tabValues:t}){if(0===t.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(e){if(!h({value:e,tabValues:t}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${e}" but none of its children has the corresponding value. Available values are: ${t.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return e}let r=t.find(e=>e.default)??t[0];if(!r)throw Error("Unexpected error: 0 tabValues");return r.value})({defaultValue:r,tabValues:u})),[f,g]=function({queryString:e=!1,groupId:t}){let r=(0,i.W6)(),n=function({queryString:e=!1,groupId:t}){if("string"==typeof e)return e;if(!1===e)return null;if(!0===e&&!t)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:e,groupId:t});return[(0,l.aZ)(n),(0,o.useCallback)(e=>{if(!n)return;let t=new URLSearchParams(r.location.search);t.set(n,e),r.replace({...r.location,search:t.toString()})},[n,r])]}({queryString:n,groupId:d}),[x,b]=function({groupId:e}){let t=e?`docusaurus.tab.${e}`:null,[r,n]=(0,c.Dv)(t);return[r,(0,o.useCallback)(e=>{t&&n.set(e)},[t,n])]}({groupId:d}),v=h({value:t=f??x,tabValues:u})?t:null;return(0,s.A)(()=>{v&&m(v)},[v]),{selectedValue:p,selectValue:(0,o.useCallback)(e=>{if(!h({value:e,tabValues:u}))throw Error(`Can't select invalid tab value=${e}`);m(e),g(e),b(e)},[g,b,u]),tabValues:u,lazy:e.lazy??!1,block:e.block??!1}}let p=(0,o.createContext)(null);function m(){let e=o.useContext(p);if(!e)throw Error("useTabsContext() must be used within a Tabs component");return e}function f(e){return(0,n.jsx)(p.Provider,{value:e.value,children:e.children})}},4050(e,t,r){r.d(t,{A:()=>i});var n=r(4848);r(6540);function o(){return(0,n.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,n.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function i({paths:e,items:t,activeLast:r=!0}){let s=e??t??[];return(0,n.jsxs)("nav",{className:"nav_sYHQ","aria-label":"Breadcrumb",children:[(0,n.jsx)("span",{className:"logo_Er0S",children:(0,n.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,n.jsx)("ol",{className:"list_yxgx",children:s.map((e,t)=>{let i=t===s.length-1,l=r&&i;return(0,n.jsxs)("li",{className:"listItem_qpim",children:[t>0&&(0,n.jsx)(o,{}),(0,n.jsx)("span",{className:`item_gLbu${l?" active_Ij2Z":""}`,...l?{"aria-current":"page"}:{},children:e})]},t)})})]})}},1444(e,t,r){r.d(t,{J3:()=>u,Q7:()=>m,TM:()=>c,WM:()=>g,cX:()=>b,ic:()=>x,ks:()=>p,lz:()=>f,nl:()=>w,v6:()=>a,vd:()=>v});var n=r(4848);r(6540);var o=r(7066),i=r(6188),s=r(7897),l=r(3941);let a={fontWeight:"bold",fontSize:"0.875rem",padding:"0.5rem"},c={listStyleType:"none",paddingLeft:"0"},d={border:"1px solid var(--ifm-color-gray-300)",color:"var(--ifm-color-gray-700)",backgroundColor:"var(--ifm-color-secondary-lighter)",padding:"0.25rem 0.5rem",fontSize:"0.875rem",fontWeight:"normal",borderRadius:"5px"},h={...d,backgroundColor:"var(--ifm-background-color)",color:"var(--ifm-color-gray-300)",border:"1px solid var(--ifm-color-gray-600)"};function u(){let{colorMode:e}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===e?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:i.okg})," your date"]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:i.okg})," your date"]})})}function p({label:e,icon:t}){let{colorMode:r}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===r?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:t||i.lSN})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:t||i.lSN})," ",e]})})}function m({label:e}){let{colorMode:t}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===t?(0,n.jsxs)("span",{style:h,children:[e," ",(0,n.jsx)(o.gc,{icon:i.$GG})]}):(0,n.jsxs)("span",{style:d,children:[e," ",(0,n.jsx)(o.gc,{icon:i.$GG})]})})}function f({label:e,toggled:t}){let{colorMode:r}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===r?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:i.tKC})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:i.tKC})," ",e]})})}function g({label:e,checked:t}){let{colorMode:r}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===r?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:t?i.Dnq:s.Nfw})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:t?i.Dnq:s.Nfw})," ",e]})})}function x({label:e}){let{colorMode:t}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===t?(0,n.jsxs)("span",{style:h,children:[e," ",(0,n.jsx)(o.gc,{icon:i.tdl})]}):(0,n.jsxs)("span",{style:d,children:[e," ",(0,n.jsx)(o.gc,{icon:i.tdl})]})})}function b({label:e}){let{colorMode:t}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===t?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:i.q_k})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:i.q_k})," ",e]})})}function v({label:e}){let{colorMode:t}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===t?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)(o.gc,{icon:s.ao0})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)(o.gc,{icon:s.ao0})," ",e]})})}function w({label:e}){let{colorMode:t}=(0,l.G)();return(0,n.jsx)(n.Fragment,{children:"dark"===t?(0,n.jsxs)("span",{style:h,children:[(0,n.jsx)("svg",{stroke:"currentColor",fill:"none","stroke-width":"1.5",viewBox:"0 0 24 24","aria-hidden":"true",focusable:"false",class:"chakra-icon css-w8v3vn",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"})})," ",e]}):(0,n.jsxs)("span",{style:d,children:[(0,n.jsx)("svg",{stroke:"currentColor",fill:"none","stroke-width":"1.5",viewBox:"0 0 24 24","aria-hidden":"true",focusable:"false",class:"chakra-icon css-w8v3vn",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"})})," ",e]})})}},2437(e,t,r){r.d(t,{SV:()=>h,bE:()=>d,gw:()=>c,yo:()=>u});var n=r(4848),o=r(6540),i=r(961),s=r(6370),l=r(4846),a=r(3937);function c(){return p({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return p({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function h(){return p({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function u({version:e}){return p({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#059669",color:"white"})}function p({title:e,tooltip:t,backgroundColor:r="#b55d00",color:c="white"}){(0,a.n9)();let d=(0,o.useRef)(null),h=(0,o.useId)(),{visible:u,pinned:m,onMouseEnter:f,onMouseLeave:g,onFocus:x,onBlur:b,onClick:v,onTooltipMouseEnter:w,onTooltipMouseLeave:j}=(0,a.DV)(d),y=(0,a._W)(d,u,{tooltipWidth:260}),k=u&&(0,i.createPortal)((0,n.jsxs)("div",{id:h,role:"tooltip",className:`invictus-tooltip${m?" invictus-tooltip--pinned":""}`,"data-below":y.below?"true":"false",onMouseEnter:w,onMouseLeave:j,style:{position:"fixed",top:y.below?y.top:"auto",bottom:y.below?"auto":`calc(100vh - ${y.top}px)`,left:y.left,width:260,"--tooltip-accent":r},children:["string"==typeof t?(0,n.jsx)(s.oz,{remarkPlugins:[l.A],children:t}):t,(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:y.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":m,"aria-describedby":u?h:void 0,onMouseEnter:f,onMouseLeave:g,onFocus:x,onBlur:b,onClick:v,children:(0,n.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:r,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":r},children:e})}),k]})}},2860(e,t,r){r.d(t,{M:()=>g,Nn:()=>b,Yu:()=>x,nl:()=>f});var n=r(4848),o=r(6540),i=r(961),s=r(6370),l=r(4846),a=r(3937),c=r(3941);let d=`
/* \u{2500}\u{2500} Base badge \u{2014} mirrors the existing Badge component style \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
.term-highlight {
  display: inline;
  padding: 2px 5px 2px 6px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Bitter', sans-serif;
  cursor: help;
  user-select: none;
  white-space: nowrap;
  border-bottom: 2px solid var(--term-accent);
  background-color: var(--term-bg);
  color: var(--term-color);
  transition: filter 0.15s ease, outline-color 0.15s ease;
  outline: 2px solid transparent;
  outline-offset: 1px;
}

.term-highlight:hover,
.term-highlight:focus-visible {
  filter: brightness(0.92);
  outline-color: var(--term-accent);
}

.term-highlight:focus-visible {
  outline-style: solid;
}

/* Small circled ? indicator appended to the term */
.term-highlight__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--term-accent);
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  font-family: 'Bitter', sans-serif;
  vertical-align: middle;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.term-highlight:hover .term-highlight__icon,
.term-highlight:focus-visible .term-highlight__icon {
  opacity: 1;
}

/* \u{2500}\u{2500} Color tokens per term \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */

/* Flow \u{2014} teal (site primary) */
.term-highlight--flow {
  --term-bg: #dff2f4;
  --term-color: #013b45;
  --term-accent: #014550;
}
html[data-theme='dark'] .term-highlight--flow {
  --term-bg: rgba(1, 69, 80, 0.32);
  --term-color: #7dd8e3;
}

/* Flow Trace \u{2014} warm amber (consistent with warning/accent tones in the codebase) */
.term-highlight--flow-trace {
  --term-bg: #fef2d9;
  --term-color: #7a4b00;
  --term-accent: #9a5f00;
}
html[data-theme='dark'] .term-highlight--flow-trace {
  --term-bg: rgba(154, 95, 0, 0.28);
  --term-color: #f0bc55;
}

/* Flow Trace Importing \u{2014} steel blue (distinct from teal) */
.term-highlight--flow-trace-importing {
  --term-bg: #dceef9;
  --term-color: #00476e;
  --term-accent: #005f8a;
}
html[data-theme='dark'] .term-highlight--flow-trace-importing {
  --term-bg: rgba(0, 95, 138, 0.3);
  --term-color: #7ec8f0;
}

/* \u{2500}\u{2500} Tooltip accent per term (referenced by invictus-tooltip CSS var) \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
.term-highlight--flow-tooltip                 { --tooltip-accent: #014550; }
.term-highlight--flow-trace-tooltip           { --tooltip-accent: #9a5f00; }
.term-highlight--flow-trace-importing-tooltip { --tooltip-accent: #005f8a; }

/* \u{2500}\u{2500} Carousel nav bar \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
.invictus-tooltip__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.invictus-tooltip__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--tooltip-accent);
  background: transparent;
  color: var(--tooltip-accent);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: background 0.15s ease;
}

.invictus-tooltip__nav-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

html[data-theme='dark'] .invictus-tooltip__nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.invictus-tooltip__nav-label {
  flex: 1;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  font-family: 'Bitter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tooltip-accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.invictus-tooltip__nav-pager {
  font-size: 10px;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.5;
}

/* \u{2500}\u{2500} Inline term links inside tooltip content \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
.invictus-tooltip__term-link {
  display: inline;
  padding: 0 2px;
  border: none;
  border-bottom: 1.5px solid;
  background: transparent;
  font-size: inherit;
  font-weight: 600;
  font-family: 'Bitter', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.invictus-tooltip__term-link:hover {
  opacity: 0.72;
}
`,h={flow:{label:"flow",termClass:"term-highlight--flow",accent:"#014550",accentDark:"#7dd8e3",tooltipMarkdown:`A **Flow** is a named message chain \u{2014} a logical grouping of related [flow traces](#flow-trace) sharing a common integration origin.

Flows are organized in *folders* and defined by a name, optional mappings, and business properties.`},"flow-trace":{label:"flow trace",termClass:"term-highlight--flow-trace",accent:"#9a5f00",accentDark:"#f0bc55",tooltipMarkdown:`A **Flow trace** is a single tracked message instance within a [flow](#flow). It records the full lifecycle of one execution: status, timestamps, properties, and the chain of processing steps.

Each flow trace can be searched and inspected in the Dashboard, and is loaded via [flow trace importing](#flow-trace-importing).`},"flow-trace-importing":{label:"flow trace importing",termClass:"term-highlight--flow-trace-importing",accent:"#005f8a",accentDark:"#7ec8f0",tooltipMarkdown:`**Flow trace importing** is the process of ingesting [flow trace](#flow-trace) data into the Dashboard \u{2014} automatically via Logic Apps or Function Apps, or manually.

Once imported, messages become visible and searchable in the flow monitoring view.`}},u=["flow","flow-trace","flow-trace-importing"];function p({termKey:e,label:t,termClass:r,tooltipMarkdown:m,variant:f="technical"}){(0,a.n9)(),(0,o.useInsertionEffect)(()=>{let e="term-highlight-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=d},[]);let{colorMode:g}=(0,c.G)(),x="dark"===g,b=(0,o.useRef)(null),v=(0,o.useId)(),{visible:w,pinned:j,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,pin:E,onTooltipMouseEnter:F,onTooltipMouseLeave:M}=(0,a.DV)(b),T=(0,a._W)(b,w,{tooltipWidth:300}),[z,I]=(0,o.useState)(e);(0,o.useEffect)(()=>{w||I(e)},[w,e]);let S=u.indexOf(z),L=u[(S-1+u.length)%u.length],N=u[(S+1)%u.length],D=h[z],B=z===e?m:D.tooltipMarkdown,R=w&&(0,i.createPortal)((0,n.jsxs)("div",{id:v,role:"tooltip",className:`invictus-tooltip${j?" invictus-tooltip--pinned":""}`,"data-below":T.below?"true":"false",onMouseEnter:F,onMouseLeave:M,style:{position:"fixed",top:T.below?T.top:"auto",bottom:T.below?"auto":`calc(100vh - ${T.top}px)`,left:T.left,width:300,"--tooltip-accent":x?D.accentDark:D.accent},children:["technical"===f&&(0,n.jsxs)("div",{className:"invictus-tooltip__nav",children:[(0,n.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),I(L)},"aria-label":`Previous: ${h[L].label}`,children:"\u2039"}),(0,n.jsxs)("span",{className:"invictus-tooltip__nav-label",children:[D.label,(0,n.jsxs)("span",{className:"invictus-tooltip__nav-pager",children:[S+1," / ",u.length]})]}),(0,n.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),I(N)},"aria-label":`Next: ${h[N].label}`,children:"\u203A"})]}),(0,n.jsx)(s.oz,{remarkPlugins:[l.A],components:{a:({href:e,children:t})=>{let r=e?.startsWith("#")?e.slice(1):null,o=r?h[r]:null;return o?(0,n.jsx)("button",{className:"invictus-tooltip__term-link",style:{color:x?o.accentDark:o.accent,borderBottomColor:x?o.accentDark:o.accent},onClick:e=>{e.stopPropagation(),E(),I(r)},children:t}):(0,n.jsx)("a",{href:e,children:t})}},children:B}),(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:T.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("span",{ref:b,className:`term-highlight ${r}`,tabIndex:0,role:"button","aria-pressed":j,"aria-describedby":w?v:void 0,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,children:[t,(0,n.jsx)("span",{className:"term-highlight__icon","aria-hidden":"true",children:"?"})]}),R]})}let m=`A **Flow** is a named message chain \u{2014} a logical grouping of related **mapping messages** sharing a common integration origin.

Flows are organized in *folders* and defined by a name, optional mappings, and business properties.`;function f({tooltip:e,variant:t="business"}){return(0,n.jsx)(p,{termKey:"flow",label:"flow",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:m)})}function g({tooltip:e,variant:t="business"}){return(0,n.jsx)(p,{termKey:"flow",label:"flows",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:m)})}function x({tooltip:e}){return(0,n.jsx)(p,{termKey:"flow-trace",label:"flow trace",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}function b({tooltip:e}){return(0,n.jsx)(p,{termKey:"flow-trace",label:"flow traces",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}},3937(e,t,r){r.d(t,{DV:()=>c,_W:()=>l,n9:()=>s});var n=r(6540);let o="u">typeof window?n.useLayoutEffect:n.useEffect,i=`
.invictus-tooltip {
  --tooltip-bg: #ffffff;
  background: var(--tooltip-bg);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #1a2b2e;
  z-index: 9999;
  pointer-events: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.14), 0 1px 4px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--tooltip-accent, #014550);
  animation: invictus-tooltip-in 0.14s ease;
  white-space: normal;
}

.invictus-tooltip p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: inherit;
}

.invictus-tooltip p + p {
  margin-top: 6px;
}

.invictus-tooltip strong {
  font-family: 'Bitter', sans-serif;
  color: var(--tooltip-accent, #014550);
}

.invictus-tooltip em {
  font-style: italic;
}

.invictus-tooltip code {
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 4px;
  border-radius: 3px;
}

.invictus-tooltip a {
  color: var(--tooltip-accent, #014550);
  text-underline-offset: 2px;
}

/* Arrow \u{2014} colour is driven by --tooltip-bg so dark mode is automatic */
.invictus-tooltip__arrow {
  position: absolute;
  margin-left: -7px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
}

.invictus-tooltip[data-below='false'] .invictus-tooltip__arrow {
  top: 100%;
  border-top: 7px solid var(--tooltip-bg);
}

.invictus-tooltip[data-below='true'] .invictus-tooltip__arrow {
  bottom: 100%;
  border-bottom: 7px solid var(--tooltip-bg);
}

/* Dark mode */
html[data-theme='dark'] .invictus-tooltip {
  --tooltip-bg: var(--ifm-color-gray-800);
  color: #d8eaed;
}

html[data-theme='dark'] .invictus-tooltip strong {
  color: color-mix(in srgb, var(--tooltip-accent, #2a8f9c) 85%, white);
}

html[data-theme='dark'] .invictus-tooltip code {
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme='dark'] .invictus-tooltip a {
  color: color-mix(in srgb, var(--tooltip-accent, #2a8f9c) 80%, white);
}

/* Pinned state \u{2014} pointer-events enabled so text is selectable, ring accent */
.invictus-tooltip--pinned {
  pointer-events: auto;
  cursor: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18), 0 1px 4px rgba(0, 0, 0, 0.1),
              0 0 0 2px var(--tooltip-accent, #014550);
}

/* Entrance animation */
@keyframes invictus-tooltip-in {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;function s(){(0,n.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=i},[])}function l(e,t,{tooltipWidth:r=300,margin:o=12,navHeight:i=60,gap:s=10}={}){let[a,c]=(0,n.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,n.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),n=window.innerWidth,l=t.left+t.width/2-r/2;l=Math.max(o,Math.min(l,n-r-o));let a=Math.min(Math.max(t.left+t.width/2-l,14),r-14),d=t.top-i<70;c({top:d?t.bottom+s:t.top-s,left:l,arrowLeft:a,below:d})},[e,r,o,i,s]);return(0,n.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,n.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),a}let a="invictus-tooltip-activate";function c(e){let[t,r]=(0,n.useState)(!1),[i,s]=(0,n.useState)(!1),[l,c]=(0,n.useState)(!1),[d,h]=(0,n.useState)(!1),u=(0,n.useRef)(null),p=(0,n.useRef)(`tip-${Math.random()}`),m=t||i||l||d,f=(0,n.useCallback)(()=>{clearTimeout(u.current),r(!1),s(!1),c(!1),h(!1)},[]),g=(0,n.useCallback)(()=>{document.dispatchEvent(new CustomEvent(a,{detail:{id:p.current}}))},[]);return o(()=>{if(!m)return;let e=e=>{e.detail.id!==p.current&&f()};return document.addEventListener(a,e),()=>document.removeEventListener(a,e)},[m,f]),(0,n.useEffect)(()=>{if(!m)return;let t=e=>{"Escape"===e.key&&f()},r=t=>{let r=e.current&&e.current.contains(t.target),n=t.target.closest?.(".invictus-tooltip");r||n||f()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",r)}},[m,f,e]),(0,n.useEffect)(()=>()=>clearTimeout(u.current),[]),{visible:m,pinned:d,onMouseEnter:()=>{clearTimeout(u.current),r(!0),g()},onMouseLeave:()=>{u.current=setTimeout(()=>r(!1),150)},onFocus:()=>{c(!0),g()},onBlur:()=>c(!1),onClick:()=>h(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(u.current),s(!0)},onTooltipMouseLeave:()=>s(!1),pin:(0,n.useCallback)(()=>h(!0),[h])}}},8453(e,t,r){r.d(t,{R:()=>s,x:()=>l});var n=r(6540);let o={},i=n.createContext(o);function s(e){let t=n.useContext(i);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);