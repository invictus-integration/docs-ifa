"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["6091"],{7145(e,t,n){n.r(t),n.d(t,{metadata:()=>o,default:()=>p,frontMatter:()=>s,contentTitle:()=>l,toc:()=>d,assets:()=>c});var o=JSON.parse('{"id":"dashboard/flows/import-flow-traces/import-flow-prog-via-eh","title":"Import flow traces programmatically via Azure Event Hubs","description":"Invictus allows developers to programmatically import flow traces via an Event Hub. You can locate this resource by the following:","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/04_import-flow-traces/import-flow-prog-via-eh.mdx","sourceDirName":"dashboard/flows/04_import-flow-traces","slug":"/dashboard/flows/import-flow-traces/import-flow-prog-via-eh","permalink":"/dashboard/flows/import-flow-traces/import-flow-prog-via-eh","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","frontMatter":{"sidebar_label":"Import via Event Hubs"},"sidebar":"technical_users","previous":{"title":"Import via Data Factory","permalink":"/dashboard/flows/import-flow-traces/import-flow-via-df"},"next":{"title":"Import via HTTP","permalink":"/dashboard/flows/import-flow-traces/import-flow-prog-via-http"}}'),r=n(4848),i=n(8453),a=n(3742);let s={sidebar_label:"Import via Event Hubs"},l="Import flow traces programmatically via Azure Event Hubs",c={},d=[{value:"Sending flow traces to Invictus",id:"sending-flow-traces-to-invictus",level:2},{value:"Map Dashboard flows to Event Hub receive events <OnlyFolderAdminsBadge></OnlyFolderAdminsBadge>",id:"map-dashboard-flows-to-event-hub-receive-events-",level:2},{value:"Execution tree of sequentially events",id:"execution-tree-of-sequentially-events",level:2},{value:"Tracked properties of events",id:"tracked-properties-of-events",level:2},{value:"Errors on events",id:"errors-on-events",level:3},{value:"Azure link on events",id:"azure-link-on-events",level:3}];function u(e){let t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"import-flow-traces-programmatically-via-azure-event-hubs",children:"Import flow traces programmatically via Azure Event Hubs"})}),"\n",(0,r.jsx)(t.p,{children:"Invictus allows developers to programmatically import flow traces via an Event Hub. You can locate this resource by the following:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["EventHub namespace: ",(0,r.jsx)(t.code,{children:"invictus-{env}-we-sft-evnm"})]}),"\n",(0,r.jsxs)(t.li,{children:["Event Hub name: ",(0,r.jsx)(t.code,{children:"invictus-{env}-we-sft-genericreceiver-evhb"})]}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"sending-flow-traces-to-invictus",children:"Sending flow traces to Invictus"}),"\n",(0,r.jsxs)(t.p,{children:["The Event Hub import accepts a series of ",(0,r.jsx)(t.code,{children:"event"})," models in a JSON array, each representing a status of the flow:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:"[\n   {\n      // Flow started event.\n   },\n   {\n      // Flow completed event.\n   }\n]\n"})}),"\n",(0,r.jsxs)(t.p,{children:["The minimal ",(0,r.jsx)(t.code,{children:"event"})," values are the following:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // When event was executed, recommended UTC datetime.\n   // (used to determine the order of events)\n   "Time":"2019-07-23 08:55:04.0500000 +00:00",\n\n   // Transactional ID to link events together.\n   // (like \'client tracking ID\')\n   "ChainId": "edbd5ddb-b206-4437-8ac3-5401b148c8cb",\n\n   // Represents a single \'step\' taken in the transaction of events.\n   // (like workflow \'Started\')\n   "Step": {\n      // Operation ID within the transaction of events.\n      // (like \'workflow run ID\')\n      "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299",\n\n      // Human-readable name for the operation/step ID.\n      "Name": "Invoice",\n\n      // Available values are:\n      // - Started\n      // - Active\n      // - Cancelled\n      // - Completed\n      // -Failed\n      "Status": "Started"\n   }\n}\n'})}),"\n",(0,r.jsx)(t.admonition,{type:"warning",children:(0,r.jsxs)(t.p,{children:["A ",(0,r.jsx)(t.code,{children:"Started"})," event is always required to create at least a single event in Invictus' backend storage. A ",(0,r.jsx)(t.code,{children:"Completed"}),"/",(0,r.jsx)(t.code,{children:"Failed"})," event then indicates the end of a given operation."]})}),"\n",(0,r.jsxs)(t.h2,{id:"map-dashboard-flows-to-event-hub-receive-events-",children:["Map Dashboard flows to Event Hub receive events ",(0,r.jsx)(a.SV,{})]}),"\n",(0,r.jsxs)(t.p,{children:["Make sure that any of the ",(0,r.jsx)(t.code,{children:"event"})," mappings match the values in the ",(0,r.jsx)(t.a,{href:"/dashboard/flows/add",children:"flow created via the Dashboard"})]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Mappings": {\n      "Domain": "Invoicing",\n      "Action": "New invoice",\n      "Service": "Invoice system",\n      "Version": "v1.2.3"\n   }\n}\n'})}),"\n",(0,r.jsx)(t.h2,{id:"execution-tree-of-sequentially-events",children:"Execution tree of sequentially events"}),"\n",(0,r.jsxs)(t.p,{children:["Use the ",(0,r.jsx)(t.code,{children:"Step.Id"}),"/",(0,r.jsx)(t.code,{children:"Step.ParentId"})," combination to create parent-child relationships. This link is similar as how you can set the ",(0,r.jsx)(t.code,{children:"x-iv-parent-workflow-run-id"})," when ",(0,r.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"importing flows via Azure Logic App workflows"}),"."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'[\n   // event\n   {\n      // [omitted]\n      "Step": {\n         "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299"\n         // [omitted]\n      }\n   },\n   // event\n   {\n      // [omitted]\n      "Step": {\n         "Id": "3e8e3fa4-b85a-4ee6-aaea-e0fd82008f8c",\n         "ParentId": "8ecd1ea4-de94-4741-9c4a-a18477398299"\n         // [omitted]\n      }\n   }\n]\n'})}),"\n",(0,r.jsx)(t.h2,{id:"tracked-properties-of-events",children:"Tracked properties of events"}),"\n",(0,r.jsxs)(t.p,{children:["Besides the ",(0,r.jsx)(t.code,{children:"Milestone"})," and ",(0,r.jsx)(t.code,{children:"EventText"}),", there also exists a set of custom ",(0,r.jsx)(t.code,{children:"Data"})," properties that you can link to the flow."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Properties": {\n      "Milestone": "LA-A-Reached",\n      "EventText": "Line1-A",\n      "Data": {\n         "MyKey1": "MyValue1",\n         "MyKey2": "MyValue2"\n      }\n   }\n}\n'})}),"\n",(0,r.jsx)(t.h3,{id:"errors-on-events",children:"Errors on events"}),"\n",(0,r.jsxs)(t.p,{children:["If an event represents an error, it can provide context information in the form of a ",(0,r.jsx)(t.code,{children:"code"})," and a ",(0,r.jsx)(t.code,{children:"description"}),":"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Error": {\n      "Code": "123",\n      "Description": "there was a failure during this operation"\n   }\n}\n'})}),"\n",(0,r.jsx)(t.h3,{id:"azure-link-on-events",children:"Azure link on events"}),"\n",(0,r.jsx)(t.p,{children:"Add a link and resource ID if you can track back an event to Azure. These details populates the Dashboard for a click-through experience."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   "Azure": {\n      "ResourceId": "/subscriptions/.../resourceGroups/...",\n      "PortalLink": "https://portal.azure.com/to-your-resource"\n   }\n}\n'})})]})}function p(e={}){let{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},3742(e,t,n){n.d(t,{SV:()=>m,gw:()=>h,yo:()=>b,bP:()=>x,bE:()=>f,mw:()=>j});var o=n(4848),r=n(6540),i=n(961);let a="u">typeof window?r.useLayoutEffect:r.useEffect,s=`
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
`;function l(){(0,r.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=s},[])}function c(e,t,{tooltipWidth:n=300,margin:o=12,navHeight:i=60,gap:a=10}={}){let[s,l]=(0,r.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,r.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),r=window.innerWidth,s=t.left+t.width/2-n/2;s=Math.max(o,Math.min(s,r-n-o));let c=Math.min(Math.max(t.left+t.width/2-s,14),n-14),d=t.top-i<70;l({top:d?t.bottom+a:t.top-a,left:s,arrowLeft:c,below:d})},[e,n,o,i,a]);return(0,r.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,r.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),s}let d="invictus-tooltip-activate";function u(e){let[t,n]=(0,r.useState)(!1),[o,i]=(0,r.useState)(!1),[s,l]=(0,r.useState)(!1),[c,u]=(0,r.useState)(!1),p=(0,r.useRef)(null),v=(0,r.useRef)(`tip-${Math.random()}`),h=t||o||s||c,f=(0,r.useCallback)(()=>{clearTimeout(p.current),n(!1),i(!1),l(!1),u(!1)},[]),m=(0,r.useCallback)(()=>{document.dispatchEvent(new CustomEvent(d,{detail:{id:v.current}}))},[]);return a(()=>{if(!h)return;let e=e=>{e.detail.id!==v.current&&f()};return document.addEventListener(d,e),()=>document.removeEventListener(d,e)},[h,f]),(0,r.useEffect)(()=>{if(!h)return;let t=e=>{"Escape"===e.key&&f()},n=t=>{let n=e.current&&e.current.contains(t.target),o=t.target.closest?.(".invictus-tooltip");n||o||f()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",n),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",n)}},[h,f,e]),(0,r.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:h,pinned:c,onMouseEnter:()=>{clearTimeout(p.current),n(!0),m()},onMouseLeave:()=>{p.current=setTimeout(()=>n(!1),150)},onFocus:()=>{l(!0),m()},onBlur:()=>l(!1),onClick:()=>u(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(p.current),i(!0)},onTooltipMouseLeave:()=>i(!1),pin:(0,r.useCallback)(()=>u(!0),[u])}}var p=n(6370),v=n(4846);function h(){return w({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function f(){return w({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function m(){return w({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function b({version:e,style:t}){return w({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#059669",color:"white",style:t})}function x({version:e,note:t,style:n}){return w({title:`Deprecated since ${e}`,tooltip:`Feature deprecated since **Invictus ${e}**. ${t}`,backgroundColor:"#b55d00",color:"white",style:n})}function w({title:e,tooltip:t,backgroundColor:n="#b55d00",color:a="white",style:s}){l();let d=(0,r.useRef)(null),h=(0,r.useId)(),{visible:f,pinned:m,onMouseEnter:b,onMouseLeave:x,onFocus:g,onBlur:j,onClick:y,onTooltipMouseEnter:k,onTooltipMouseLeave:E}=u(d),I=c(d,f,{tooltipWidth:260}),M=f&&(0,i.createPortal)((0,o.jsxs)("div",{id:h,role:"tooltip",className:`invictus-tooltip${m?" invictus-tooltip--pinned":""}`,"data-below":I.below?"true":"false",onMouseEnter:k,onMouseLeave:E,style:{position:"fixed",top:I.below?I.top:"auto",bottom:I.below?"auto":`calc(100vh - ${I.top}px)`,left:I.left,width:260,"--tooltip-accent":n},children:["string"==typeof t?(0,o.jsx)(p.oz,{remarkPlugins:[v.A],children:t}):t,(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:I.arrowLeft}})]}),document.body);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold",...s},role:"button","aria-pressed":m,"aria-describedby":f?h:void 0,onMouseEnter:b,onMouseLeave:x,onFocus:g,onBlur:j,onClick:y,children:(0,o.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:n,color:a,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":n,...s},children:e})}),M]})}let g="#0b6369";function j(){l();let e=(0,r.useRef)(null),t=(0,r.useId)(),{visible:n,pinned:a,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:v,onClick:h,onTooltipMouseEnter:f,onTooltipMouseLeave:m}=u(e),b=c(e,n,{tooltipWidth:260}),x=n&&(0,i.createPortal)((0,o.jsxs)("div",{id:t,role:"tooltip",className:`invictus-tooltip${a?" invictus-tooltip--pinned":""}`,"data-below":b.below?"true":"false",onMouseEnter:f,onMouseLeave:m,style:{position:"fixed",top:b.below?b.top:"auto",bottom:b.below?"auto":`calc(100vh - ${b.top}px)`,left:b.left,width:260,"--tooltip-accent":g},children:["Same for both ",(0,o.jsx)("strong",{children:"Dashboard"})," and ",(0,o.jsx)("strong",{children:"Framework"}),". Can be skipped if done already.",(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:b.arrowLeft}})]}),document.body);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{ref:e,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},children:(0,o.jsx)("span",{tabIndex:0,role:"button","aria-pressed":a,"aria-describedby":n?t:void 0,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:v,onClick:h,className:"invictus-badge",style:{backgroundColor:"#e0f7f7",color:g,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",outline:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":g},children:"Shared"})}),x]})}},8453(e,t,n){n.d(t,{R:()=>a,x:()=>s});var o=n(6540);let r={},i=o.createContext(r);function a(e){let t=o.useContext(i);return o.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);