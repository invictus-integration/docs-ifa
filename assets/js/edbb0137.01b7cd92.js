"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["2156"],{7876(e,t,r){r.r(t),r.d(t,{metadata:()=>n,default:()=>f,frontMatter:()=>c,contentTitle:()=>d,toc:()=>u,assets:()=>h});var n=JSON.parse('{"id":"dashboard/flows/add","title":"Add new flows","description":"Users can create folders via the Dashboard to organize their .","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/01_add.mdx","sourceDirName":"dashboard/flows","slug":"/dashboard/flows/add","permalink":"/dashboard/flows/add","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":1,"frontMatter":{"sidebar_label":"Add new flows","title":"Add new flows"},"sidebar":"business_users","previous":{"title":"Dashboard Homepage: Overview of flow statuses","permalink":"/dashboard/flows/"},"next":{"title":"Search for messages","permalink":"/dashboard/flows/search"}}'),o=r(4848),i=r(8453);r(773),r(7250);var s=r(2437),a=r(2860),l=r(4050);let c={sidebar_label:"Add new flows",title:"Add new flows"},d="Add new flows ",h={},u=[{value:"Add/Edit a flow",id:"addedit-a-flow",level:2}];function p(e){let t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components},{Details:r}=t;return r||function(e,t){throw Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsxs)(t.h1,{id:"add-new-flows-",children:["Add new flows ",(0,o.jsx)(s.SV,{})]})}),"\n",(0,o.jsxs)(t.p,{children:["Users can create ",(0,o.jsx)(t.a,{href:"/dashboard/flows/#organizing-flows-in-folders",children:"folders"})," via the Dashboard to organize their ",(0,o.jsx)(a.M,{}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"addedit-a-flow",children:"Add/Edit a flow"}),"\n",(0,o.jsx)(l.A,{paths:["Your Flows","\u2022\u2022\u2022 on a folder or flow","Create New / Edit Flow"]}),"\n",(0,o.jsxs)(t.table,{children:[(0,o.jsx)(t.thead,{children:(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.th,{children:"Flow property"}),(0,o.jsx)(t.th,{style:{textAlign:"center"},children:"Required"}),(0,o.jsx)(t.th,{children:"Description"})]})}),(0,o.jsxs)(t.tbody,{children:[(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Flow Name"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"yes"}),(0,o.jsx)(t.td,{children:"A case sensitive name that describe the client interaction (example: ex. invoice request, invoice approval, \u2026)"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Folder"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"yes"}),(0,o.jsx)(t.td,{children:"The location of where to save the flow. Flows are always structured in folders."})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Mapping"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsxs)(t.td,{children:["The mapping that's used to 'map' imported messages to this flow. Invictus treats these special business properties (",(0,o.jsx)(t.strong,{children:"Domain"}),", ",(0,o.jsx)(t.strong,{children:"Service"}),", ",(0,o.jsx)(t.strong,{children:"Action"}),", ",(0,o.jsx)(t.strong,{children:"Version"}),") differently (loaded from 'tracked properties, for instance, when using ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"importing them via Logic Apps"}),". Invictus adds a dedicated ",(0,o.jsx)(t.code,{children:"WorkflowName"})," in those cases as well to map the messages of the Logic App workflow to the flow.)"]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Business Properties"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsx)(t.td,{children:"Context properties to describe the flow. These are only here to provide metadata."})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Advanced Settings"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsx)(t.td,{children:(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(t.em,{children:"Connected Dashboard:"})," in a hybrid (BizTalk + Azure) setup, it's necessary to have a link from one Dashboard (BizTalk) to the other Dashboard (Azure) for hybrid flows. ",(0,o.jsx)(t.a,{href:"/dashboard/settings",children:"More details on hybrid setups"}),"."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.em,{children:"Show milestone and event text:"})," displays the flow milestone and event text data."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(s.yo,{version:"v6.2"})," ",(0,o.jsx)(t.em,{children:"Show Resubmit / Resume"}),": make the 'Resubmit/Resume' flow action buttons available per flow."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.em,{children:"Custom resubmit/resume URLs:"})," Check these options and provide the necessary URLs to use ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"your own resume and resubmit logic"}),"."]})]})})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Alerts"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsx)(t.td,{children:(0,o.jsx)(t.a,{href:"#flow-alerting",children:"See alerting"})})]})]})]}),"\n",(0,o.jsxs)(r,{id:"flow-permissions",children:[(0,o.jsx)("summary",{children:(0,o.jsx)("span",{children:(0,o.jsx)(t.strong,{children:"Allow access to flow"})})}),(0,o.jsx)(l.A,{paths:["Your Flows","Click \u2022\u2022\u2022 of folder","Edit Folder Permissions"]}),(0,o.jsxs)(t.p,{children:["You can allow both active Microsoft Entra ID groups and local users to access the flows in the folder.\nBased on the ",(0,o.jsx)(t.a,{href:"/dashboard/security/roles",children:"chosen role"}),", the user receives their allowed permissions on the flow."]}),(0,o.jsx)(t.admonition,{type:"info",children:(0,o.jsxs)(t.p,{children:["Users with the ",(0,o.jsx)(t.code,{children:"[System admin]"})," role can access all flows in every folder available."]})})]}),"\n",(0,o.jsxs)(r,{id:"flow-alerting",children:[(0,o.jsx)("summary",{children:(0,o.jsx)("span",{children:(0,o.jsx)(t.strong,{children:"Add an alert for a flow"})})}),(0,o.jsx)(t.admonition,{title:"require role assignments after installation",type:"warning",children:(0,o.jsxs)(t.p,{children:["The Invictus Dashboard ",(0,o.jsx)(t.a,{href:"/dashboard/installation/give_la_access",children:"requires additional role assignments"})," to add alerts to flows."]})}),(0,o.jsx)(l.A,{paths:["Your Flows","Click \u2022\u2022\u2022 of flow","Edit Flow","(+) Alert rule"]}),(0,o.jsxs)("table",{border:"1",cellpadding:"4",cellspacing:"0",children:[(0,o.jsx)("thead",{children:(0,o.jsxs)("tr",{children:[(0,o.jsx)("th",{children:"Alert property"}),(0,o.jsx)("th",{children:"Required"}),(0,o.jsx)("th",{children:"Description"})]})}),(0,o.jsxs)("tbody",{children:[(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Alert name"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsx)("td",{children:"The name for the alert rule, must be unique per flow. (Name automatically has the flow name added as a prefix to it.)"})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Description"})}),(0,o.jsx)("td",{children:"no"}),(0,o.jsx)("td",{children:"The optional text giving more context to the alert."})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Severity"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsx)("td",{children:"The level of severity of the alert."})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Schedule"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsx)("td",{children:(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)("em",{children:"Frequency"}),": how often to execute the rule - value must be between the range of ",(0,o.jsx)("code",{children:"5-1440"}),"."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)("em",{children:"Time window"}),": range that Azure uses, the logs for the last x minutes - value must be between the range of ",(0,o.jsx)("code",{children:"5-2880"}),"."]})]})})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Trigger"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsxs)("td",{children:["The ",(0,o.jsx)("em",{children:"Threshold"})," value together with the ",(0,o.jsx)("em",{children:"Threshold Operator"})," (",(0,o.jsx)("code",{children:"Equal"}),"/",(0,o.jsx)("code",{children:"GreaterThan"}),"/",(0,o.jsx)("code",{children:"LessThan"}),") defines when to trigger the alert rule."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Throttling"})}),(0,o.jsx)("td",{children:"no"}),(0,o.jsxs)("td",{children:[(0,o.jsx)("em",{children:"Suppress alerts (minutes)"}),": suppress triggered alerts for x minutes."]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Query"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsxs)("td",{children:[(0,o.jsxs)(r,{children:[(0,o.jsx)("summary",{children:(0,o.jsx)("em",{children:"Invictus Activity Check"})}),"Monitors flow activity via Azure logs (",(0,o.jsx)("code",{children:"InvictusImportJobFlowActivityAlert"})," custom events). Invictus logs one activity per active flow every hour. If an alert running every 60 minutes finds no logs in the last 60 minutes (threshold < 0), Invictus flags the flow as inactive and triggers an alert. Note: logging is per flow (not per message) and may exceed one entry per hour due to scaling or multi-threading. To increase logging frequency, reduce ",(0,o.jsx)("code",{children:"FlowActivityIntervalInMinutes"})," during deployment (",(0,o.jsx)("a",{href:"../installation/index.mdx?step=deploy",children:"link"}),")."]}),(0,o.jsxs)(r,{children:[(0,o.jsx)("summary",{children:(0,o.jsx)("em",{children:"Invictus Error Check"})}),"Monitors flow activity via Azure logs (",(0,o.jsx)("code",{children:"InvictusImportJobFlowErrorAlert"}),"). Invictus logs an entry for each flow that triggers an error. If an alert running every 10 minutes finds more than 0 logs in the last 10 minutes (threshold > 0), Invictus flags the flow as failed and triggers an alert."]}),(0,o.jsxs)(r,{children:[(0,o.jsx)("summary",{children:(0,o.jsx)("em",{children:"Azure Resource Count"})}),"Use custom Azure alert syntax, see the official ",(0,o.jsx)("a",{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview",children:"Microsoft documentation"})," to learn more about alerting."]})]})]}),(0,o.jsxs)("tr",{children:[(0,o.jsx)("td",{children:(0,o.jsx)("strong",{children:"Recipients"})}),(0,o.jsx)("td",{children:"yes"}),(0,o.jsx)("td",{children:"The email recipients that get notified upon a triggered alert rule."})]})]})]})]})]})}function f(e={}){let{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},7250(e,t,r){r.d(t,{A:()=>a});var n=r(4848);r(6540);var o=r(4164),i=r(7663);function s({children:e,className:t,hidden:r}){return(0,n.jsx)("div",{role:"tabpanel",className:(0,o.A)("tabItem_Ymn6",t),hidden:r,children:e})}function a({children:e,className:t,value:r}){let{selectedValue:o,lazy:l}=(0,i.uc)(),c=r===o;return!c&&l?null:(0,n.jsx)(s,{className:t,hidden:!c,children:e})}},773(e,t,r){r.d(t,{A:()=>u});var n=r(4848);r(6540);var o=r(4164),i=r(8287),s=r(7663),a=r(8584),l=r(9863);function c({className:e}){let{selectedValue:t,selectValue:r,tabValues:i,block:l}=(0,s.uc)(),d=[],{blockElementScrollPositionUntilNextRender:h}=(0,a.a_)(),u=e=>{let n=e.currentTarget,o=i[d.indexOf(n)].value;o!==t&&(h(n),r(o))},p=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{let r=d.indexOf(e.currentTarget)+1;t=d[r]??d[0];break}case"ArrowLeft":{let r=d.indexOf(e.currentTarget)-1;t=d[r]??d[d.length-1]}}t?.focus()};return(0,n.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":l},e),children:i.map(({value:e,label:r,attributes:i})=>(0,n.jsx)("li",{role:"tab",tabIndex:t===e?0:-1,"aria-selected":t===e,ref:e=>{d.push(e)},onKeyDown:p,onClick:u,...i,className:(0,o.A)("tabs__item","tabItem_LNqP",i?.className,{"tabs__item--active":t===e}),children:r??e},e))})}function d({children:e}){return(0,n.jsx)("div",{className:"margin-top--md",children:e})}function h({className:e,children:t}){return(0,n.jsxs)("div",{className:(0,o.A)(i.G.tabs.container,"tabs-container","tabList__CuJ"),children:[(0,n.jsx)(c,{className:e}),(0,n.jsx)(d,{children:t})]})}function u(e){let t=(0,l.A)(),r=(0,s.OC)(e);return(0,n.jsx)(s.O_,{value:r,children:(0,n.jsx)(h,{className:e.className,children:(0,s.vT)(e.children)})},String(t))}},7663(e,t,r){r.d(t,{OC:()=>u,O_:()=>m,uc:()=>f,vT:()=>d});var n=r(4848),o=r(6540),i=r(6347),s=r(9989),a=r(6629),l=r(618),c=r(1367);function d(e){return o.Children.toArray(e).filter(e=>"\n"!==e)}function h({value:e,tabValues:t}){return t.some(t=>t.value===e)}function u(e){let t,{defaultValue:r,queryString:n=!1,groupId:d}=e,u=function(e){let{values:t,children:r}=e;return(0,o.useMemo)(()=>{let e=t??o.Children.toArray(r).flatMap(e=>{if(!e)return[];if((0,o.isValidElement)(e)&&function(e){let{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return[e];let t="string"==typeof e.type?e.type:e.type.name;throw Error(`Docusaurus error: Bad <Tabs> child <${t}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.
If you do not want to pass on a "value" prop to the direct children of <Tabs>, you can also pass an explicit <Tabs values={...}> prop.`)}).map(({props:{value:e,label:t,attributes:r,default:n}})=>({value:e,label:t,attributes:r,default:n})),n=(0,l.XI)(e,(e,t)=>e.value===t.value);if(n.length>0)throw Error(`Docusaurus error: Duplicate values "${n.map(e=>`'${e.value}'`).join(", ")}" found in <Tabs>. Every value needs to be unique.`);return e},[t,r])}(e),[p,f]=(0,o.useState)(()=>(function({defaultValue:e,tabValues:t}){if(0===t.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(e){if(!h({value:e,tabValues:t}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${e}" but none of its children has the corresponding value. Available values are: ${t.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return e}let r=t.find(e=>e.default)??t[0];if(!r)throw Error("Unexpected error: 0 tabValues");return r.value})({defaultValue:r,tabValues:u})),[m,g]=function({queryString:e=!1,groupId:t}){let r=(0,i.W6)(),n=function({queryString:e=!1,groupId:t}){if("string"==typeof e)return e;if(!1===e)return null;if(!0===e&&!t)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:e,groupId:t});return[(0,a.aZ)(n),(0,o.useCallback)(e=>{if(!n)return;let t=new URLSearchParams(r.location.search);t.set(n,e),r.replace({...r.location,search:t.toString()})},[n,r])]}({queryString:n,groupId:d}),[x,v]=function({groupId:e}){let t=e?`docusaurus.tab.${e}`:null,[r,n]=(0,c.Dv)(t);return[r,(0,o.useCallback)(e=>{t&&n.set(e)},[t,n])]}({groupId:d}),b=h({value:t=m??x,tabValues:u})?t:null;return(0,s.A)(()=>{b&&f(b)},[b]),{selectedValue:p,selectValue:(0,o.useCallback)(e=>{if(!h({value:e,tabValues:u}))throw Error(`Can't select invalid tab value=${e}`);f(e),g(e),v(e)},[g,v,u]),tabValues:u,lazy:e.lazy??!1,block:e.block??!1}}let p=(0,o.createContext)(null);function f(){let e=o.useContext(p);if(!e)throw Error("useTabsContext() must be used within a Tabs component");return e}function m(e){return(0,n.jsx)(p.Provider,{value:e.value,children:e.children})}},4050(e,t,r){r.d(t,{A:()=>s});var n=r(4848),o=r(6540);function i(){return(0,n.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,n.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function s({paths:e,items:t,activeLast:r=!0}){let a=e??t??[];return(0,n.jsxs)("nav",{className:"nav_sYHQ","aria-label":"UI navigation path",children:[(0,n.jsx)("span",{className:"logo_Er0S",children:(0,n.jsx)("img",{src:"/img/favicon.ico",alt:""})}),a.map((e,t)=>{let s=t===a.length-1;return(0,n.jsxs)(o.Fragment,{children:[(0,n.jsx)(i,{}),(0,n.jsx)("span",{className:`item_gLbu${r&&s?" active_Ij2Z":""}`,children:e})]},t)})]})}},2437(e,t,r){r.d(t,{SV:()=>h,bE:()=>d,gw:()=>c,yo:()=>u});var n=r(4848),o=r(6540),i=r(961),s=r(6370),a=r(4846),l=r(3937);function c(){return p({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return p({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function h(){return p({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function u({version:e}){return p({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#008800",color:"white"})}function p({title:e,tooltip:t,backgroundColor:r="#b55d00",color:c="white"}){(0,l.n9)();let d=(0,o.useRef)(null),h=(0,o.useId)(),{visible:u,pinned:f,onMouseEnter:m,onMouseLeave:g,onFocus:x,onBlur:v,onClick:b,onTooltipMouseEnter:w,onTooltipMouseLeave:j}=(0,l.DV)(d),y=(0,l._W)(d,u,{tooltipWidth:260}),k=u&&(0,i.createPortal)((0,n.jsxs)("div",{id:h,role:"tooltip",className:`invictus-tooltip${f?" invictus-tooltip--pinned":""}`,"data-below":y.below?"true":"false",onMouseEnter:w,onMouseLeave:j,style:{position:"fixed",top:y.below?y.top:"auto",bottom:y.below?"auto":`calc(100vh - ${y.top}px)`,left:y.left,width:260,"--tooltip-accent":r},children:["string"==typeof t?(0,n.jsx)(s.oz,{remarkPlugins:[a.A],children:t}):t,(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:y.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":f,"aria-describedby":u?h:void 0,onMouseEnter:m,onMouseLeave:g,onFocus:x,onBlur:v,onClick:b,children:(0,n.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:r,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":r},children:e})}),k]})}},2860(e,t,r){r.d(t,{M:()=>g,Nn:()=>v,Yu:()=>x,nl:()=>m});var n=r(4848),o=r(6540),i=r(961),s=r(6370),a=r(4846),l=r(3937),c=r(3941);let d=`
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

Once imported, messages become visible and searchable in the flow monitoring view.`}},u=["flow","flow-trace","flow-trace-importing"];function p({termKey:e,label:t,termClass:r,tooltipMarkdown:f,variant:m="technical"}){(0,l.n9)(),(0,o.useInsertionEffect)(()=>{let e="term-highlight-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=d},[]);let{colorMode:g}=(0,c.G)(),x="dark"===g,v=(0,o.useRef)(null),b=(0,o.useId)(),{visible:w,pinned:j,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,pin:E,onTooltipMouseEnter:T,onTooltipMouseLeave:I}=(0,l.DV)(v),M=(0,l._W)(v,w,{tooltipWidth:300}),[L,N]=(0,o.useState)(e);(0,o.useEffect)(()=>{w||N(e)},[w,e]);let z=u.indexOf(L),D=u[(z-1+u.length)%u.length],F=u[(z+1)%u.length],S=h[L],B=L===e?f:S.tooltipMarkdown,R=w&&(0,i.createPortal)((0,n.jsxs)("div",{id:b,role:"tooltip",className:`invictus-tooltip${j?" invictus-tooltip--pinned":""}`,"data-below":M.below?"true":"false",onMouseEnter:T,onMouseLeave:I,style:{position:"fixed",top:M.below?M.top:"auto",bottom:M.below?"auto":`calc(100vh - ${M.top}px)`,left:M.left,width:300,"--tooltip-accent":x?S.accentDark:S.accent},children:["technical"===m&&(0,n.jsxs)("div",{className:"invictus-tooltip__nav",children:[(0,n.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),N(D)},"aria-label":`Previous: ${h[D].label}`,children:"\u2039"}),(0,n.jsxs)("span",{className:"invictus-tooltip__nav-label",children:[S.label,(0,n.jsxs)("span",{className:"invictus-tooltip__nav-pager",children:[z+1," / ",u.length]})]}),(0,n.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),N(F)},"aria-label":`Next: ${h[F].label}`,children:"\u203A"})]}),(0,n.jsx)(s.oz,{remarkPlugins:[a.A],components:{a:({href:e,children:t})=>{let r=e?.startsWith("#")?e.slice(1):null,o=r?h[r]:null;return o?(0,n.jsx)("button",{className:"invictus-tooltip__term-link",style:{color:x?o.accentDark:o.accent,borderBottomColor:x?o.accentDark:o.accent},onClick:e=>{e.stopPropagation(),E(),N(r)},children:t}):(0,n.jsx)("a",{href:e,children:t})}},children:B}),(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:M.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("span",{ref:v,className:`term-highlight ${r}`,tabIndex:0,role:"button","aria-pressed":j,"aria-describedby":w?b:void 0,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,children:[t,(0,n.jsx)("span",{className:"term-highlight__icon","aria-hidden":"true",children:"?"})]}),R]})}let f=`A **Flow** is a named message chain \u{2014} a logical grouping of related **mapping messages** sharing a common integration origin.

Flows are organized in *folders* and defined by a name, optional mappings, and business properties.`;function m({tooltip:e,variant:t="business"}){return(0,n.jsx)(p,{termKey:"flow",label:"flow",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:f)})}function g({tooltip:e,variant:t="business"}){return(0,n.jsx)(p,{termKey:"flow",label:"flows",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:f)})}function x({tooltip:e}){return(0,n.jsx)(p,{termKey:"flow-trace",label:"flow trace",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}function v({tooltip:e}){return(0,n.jsx)(p,{termKey:"flow-trace",label:"flow traces",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}},3937(e,t,r){r.d(t,{DV:()=>c,_W:()=>a,n9:()=>s});var n=r(6540);let o="u">typeof window?n.useLayoutEffect:n.useEffect,i=`
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
  --tooltip-bg: #1e2829;
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
`;function s(){(0,n.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=i},[])}function a(e,t,{tooltipWidth:r=300,margin:o=12,navHeight:i=60,gap:s=10}={}){let[l,c]=(0,n.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,n.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),n=window.innerWidth,a=t.left+t.width/2-r/2;a=Math.max(o,Math.min(a,n-r-o));let l=Math.min(Math.max(t.left+t.width/2-a,14),r-14),d=t.top-i<70;c({top:d?t.bottom+s:t.top-s,left:a,arrowLeft:l,below:d})},[e,r,o,i,s]);return(0,n.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,n.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),l}let l="invictus-tooltip-activate";function c(e){let[t,r]=(0,n.useState)(!1),[i,s]=(0,n.useState)(!1),[a,c]=(0,n.useState)(!1),[d,h]=(0,n.useState)(!1),u=(0,n.useRef)(null),p=(0,n.useRef)(`tip-${Math.random()}`),f=t||i||a||d,m=(0,n.useCallback)(()=>{clearTimeout(u.current),r(!1),s(!1),c(!1),h(!1)},[]),g=(0,n.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:p.current}}))},[]);return o(()=>{if(!f)return;let e=e=>{e.detail.id!==p.current&&m()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[f,m]),(0,n.useEffect)(()=>{if(!f)return;let t=e=>{"Escape"===e.key&&m()},r=t=>{let r=e.current&&e.current.contains(t.target),n=t.target.closest?.(".invictus-tooltip");r||n||m()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",r)}},[f,m,e]),(0,n.useEffect)(()=>()=>clearTimeout(u.current),[]),{visible:f,pinned:d,onMouseEnter:()=>{clearTimeout(u.current),r(!0),g()},onMouseLeave:()=>{u.current=setTimeout(()=>r(!1),150)},onFocus:()=>{c(!0),g()},onBlur:()=>c(!1),onClick:()=>h(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(u.current),s(!0)},onTooltipMouseLeave:()=>s(!1),pin:(0,n.useCallback)(()=>h(!0),[h])}}},8453(e,t,r){r.d(t,{R:()=>s,x:()=>a});var n=r(6540);let o={},i=n.createContext(o);function s(e){let t=n.useContext(i);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);