"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["248"],{4579(e,t,n){n.r(t),n.d(t,{metadata:()=>o,default:()=>h,frontMatter:()=>l,contentTitle:()=>d,toc:()=>p,assets:()=>c});var o=JSON.parse('{"id":"dashboard/flows/import-flow-traces/import-flow-prog-via-http","title":"Import flow traces via HTTP","description":"<ComponentHeader","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/04_import-flow-traces/import-flow-prog-via-http.mdx","sourceDirName":"dashboard/flows/04_import-flow-traces","slug":"/dashboard/flows/import-flow-traces/import-flow-prog-via-http","permalink":"/dashboard/flows/import-flow-traces/import-flow-prog-via-http","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","frontMatter":{"sidebar_label":"Import via HTTP","title":"Import flow traces via HTTP","hide_title":true},"sidebar":"technical_users","previous":{"title":"Import via Event Hubs","permalink":"/dashboard/flows/import-flow-traces/import-flow-prog-via-eh"},"next":{"title":"Installation","permalink":"/framework/installation/"}}'),r=n(4848),i=n(8453),a=n(3742),s=n(2284);let l={sidebar_label:"Import via HTTP",title:"Import flow traces via HTTP",hide_title:!0},d,c={},p=[{value:"Sending flow traces to Invictus",id:"sending-flow-traces-to-invictus",level:2},{value:"<BadgedText>Map Dashboard flows to HTTP receive events</BadgedText>",id:"map-dashboard-flows-to-http-receive-events",level:2},{value:"Execution tree of sequentially events",id:"execution-tree-of-sequentially-events",level:2},{value:"Tracked properties of events",id:"tracked-properties-of-events",level:2},{value:"Errors on events",id:"errors-on-events",level:3}];function u(e){let t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.A,{icon:"/img/icons/import-jobs.png",name:"HTTP import job",tagline:"Import flow traces directly via HTTP"}),"\n",(0,r.jsx)(t.p,{children:"Invictus allows developers to programmatically import flow traces via a HTTP endpoint. You can locate this resource by the following name format:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.code,{children:"https://inv-{env}-we-sft-httpreceiver.*.northeurope.azurecontainerapps.io"})}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"sending-flow-traces-to-invictus",children:"Sending flow traces to Invictus"}),"\n",(0,r.jsxs)(t.p,{children:["The HTTP flow import accepts a series of ",(0,r.jsx)(t.code,{children:"event"})," models in a JSON array, each representing a status of the flow:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-powershell",children:"curl -X POST --data '[\n   {\n      // Flow started event.\n   },\n   {\n      // Flow completed event.\n   }\n]' https://inv-{env}-we-sft-httpreceiver.*\n"})}),"\n",(0,r.jsxs)(t.p,{children:["The minimal ",(0,r.jsx)(t.code,{children:"event"})," values are the following:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // When event was executed, recommended UTC datetime.\n   // (used to determine the order of events)\n   "Time":"2019-07-23 08:55:04.0500000 +00:00",\n\n   // Transactional ID to link events together.\n   // (like \'client tracking ID\')\n   "ChainId": "edbd5ddb-b206-4437-8ac3-5401b148c8cb",\n\n   // Represents a single \'step\' taken in the transaction of events.\n   // (like workflow \'Started\')\n   "Step": {\n      // Operation ID within the transaction of events.\n      // (like \'workflow run ID\')\n      "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299",\n\n      // Human-readable name for the operation/step ID.\n      "Name": "Invoice",\n\n      // Available values are:\n      // - Started\n      // - Active\n      // - Cancelled\n      // - Completed\n      // -Failed\n      "Status": "Started"\n   }\n}\n'})}),"\n",(0,r.jsx)(t.admonition,{type:"warning",children:(0,r.jsxs)(t.p,{children:["A ",(0,r.jsx)(t.code,{children:"Started"})," event is always required to create at least a single event in Invictus' backend storage. A ",(0,r.jsx)(t.code,{children:"Completed"}),"/",(0,r.jsx)(t.code,{children:"Failed"})," event then indicates the end of a given operation."]})}),"\n",(0,r.jsx)(t.h2,{id:"map-dashboard-flows-to-http-receive-events",children:(0,r.jsx)(a.V3,{badge:(0,r.jsx)(a.SV,{}),children:"Map Dashboard flows to HTTP receive events"})}),"\n",(0,r.jsxs)(t.p,{children:["Make sure that any of the ",(0,r.jsx)(t.code,{children:"event"})," mappings match the values in the ",(0,r.jsx)(t.a,{href:"/dashboard/flows/add",children:"flow created via the Dashboard"})]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Mappings": {\n      "Domain": "Invoicing",\n      "Action": "New invoice",\n      "Service": "Invoice system",\n      "Version": "v1.2.3"\n   }\n}\n'})}),"\n",(0,r.jsx)(t.h2,{id:"execution-tree-of-sequentially-events",children:"Execution tree of sequentially events"}),"\n",(0,r.jsxs)(t.p,{children:["Use the ",(0,r.jsx)(t.code,{children:"Step.Id"}),"/",(0,r.jsx)(t.code,{children:"Step.ParentId"})," combination to create parent-child relationships. This link is similar as how you can set the ",(0,r.jsx)(t.code,{children:"x-iv-parent-workflow-run-id"})," when ",(0,r.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"importing flows via Azure Logic App workflows"}),"."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'[\n   // event\n   {\n      // [omitted]\n      "Step": {\n         "Id": "8ecd1ea4-de94-4741-9c4a-a18477398299"\n         // [omitted]\n      }\n   },\n   // event\n   {\n      // [omitted]\n      "Step": {\n         "Id": "3e8e3fa4-b85a-4ee6-aaea-e0fd82008f8c",\n         "ParentId": "8ecd1ea4-de94-4741-9c4a-a18477398299"\n         // [omitted]\n      }\n   }\n]\n'})}),"\n",(0,r.jsx)(t.h2,{id:"tracked-properties-of-events",children:"Tracked properties of events"}),"\n",(0,r.jsxs)(t.p,{children:["Besides the ",(0,r.jsx)(t.code,{children:"Milestone"})," and ",(0,r.jsx)(t.code,{children:"EventText"}),", there also exists a set of custom ",(0,r.jsx)(t.code,{children:"Data"})," properties that you can link to the flow."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Properties": {\n      "Milestone": "LA-A-Reached",\n      "EventText": "Line1-A",\n      "Data": {\n         "MyKey1": "MyValue1",\n         "MyKey2": "MyValue2"\n      }\n   }\n}\n'})}),"\n",(0,r.jsx)(t.h3,{id:"errors-on-events",children:"Errors on events"}),"\n",(0,r.jsxs)(t.p,{children:["If an event represents an error, it can provide context information in the form of a ",(0,r.jsx)(t.code,{children:"code"})," and a ",(0,r.jsx)(t.code,{children:"description"}),":"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-json",children:'// event\n{\n   // [omitted]\n   "Error": {\n      "Code": "123",\n      "Description": "there was a failure during this operation"\n   }\n}\n'})})]})}function h(e={}){let{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},3742(e,t,n){n.d(t,{gw:()=>m,yo:()=>x,bP:()=>b,V3:()=>y,IG:()=>g,mw:()=>k,SV:()=>f,bE:()=>v});var o=n(4848),r=n(6540),i=n(961);let a="u">typeof window?r.useLayoutEffect:r.useEffect,s=`
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
  border-left: 4px solid var(--tooltip-accent, var(--ifm-color-primary));
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
  color: var(--tooltip-accent, var(--ifm-color-primary));
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
  color: var(--tooltip-accent, var(--ifm-color-primary));
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
              0 0 0 2px var(--tooltip-accent, var(--ifm-color-primary));
}

/* Entrance animation */
@keyframes invictus-tooltip-in {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
`,l="invictus-tooltip-activate";var d=n(6370),c=n(4846),p=n(7066),u=n(6188);let h=`
.markdown table tr:has([data-row-tint='deprecated']) {
  background: rgba(181, 93, 0, 0.05) !important;
}

.markdown table tr:has([data-row-tint='deprecated']) td:first-child {
  border-left: 3px solid rgba(181, 93, 0, 0.35);
}

.markdown table tr:has([data-row-tint='new']) {
  background: rgba(5, 150, 105, 0.05) !important;
}

.markdown table tr:has([data-row-tint='new']) td:first-child {
  border-left: 3px solid rgba(5, 150, 105, 0.35);
}

html[data-theme='dark'] .markdown table tr:has([data-row-tint='deprecated']) {
  background: rgba(251, 146, 60, 0.07) !important;
}

html[data-theme='dark'] .markdown table tr:has([data-row-tint='new']) {
  background: rgba(74, 222, 128, 0.07) !important;
}
`;function m(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:u.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function v(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:u.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow.",backgroundColor:"#b55d00",color:"white"})}function f(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:u.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function x({version:e,style:t}){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:u.yy})," ",e]}),tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:t})}function b({version:e,note:t,style:n}){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.gc,{icon:u.Dfk})," ",e]}),tooltip:`Feature deprecated since **Invictus ${e}**. ${t}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:n})}function g({variant:e}){return(0,r.useInsertionEffect)(()=>{let e="invictus-row-tint-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=h},[]),(0,o.jsx)("span",{"data-row-tint":e,"aria-hidden":"true",style:{display:"none"}})}function w({title:e,tooltip:t,backgroundColor:n,color:p,accentColor:u,style:h}){(0,r.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=s},[]);let m=(0,r.useRef)(null),{tooltipId:v,visible:f,pinned:x,onMouseEnter:b,onMouseLeave:g,onFocus:j,onBlur:k,onClick:y,tooltipEl:T}=function({badgeRef:e,tooltipContent:t,accentColor:n}){let s=(0,r.useId)(),{visible:d,pinned:c,onMouseEnter:p,onMouseLeave:u,onFocus:h,onBlur:m,onClick:v,onTooltipMouseEnter:f,onTooltipMouseLeave:x}=function(e){let[t,n]=(0,r.useState)(!1),[o,i]=(0,r.useState)(!1),[s,d]=(0,r.useState)(!1),[c,p]=(0,r.useState)(!1),u=(0,r.useRef)(null),h=(0,r.useRef)(`tip-${Math.random()}`),m=t||o||s||c,v=(0,r.useCallback)(()=>{clearTimeout(u.current),n(!1),i(!1),d(!1),p(!1)},[]),f=(0,r.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:h.current}}))},[]);return a(()=>{if(!m)return;let e=e=>{e.detail.id!==h.current&&v()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[m,v]),(0,r.useEffect)(()=>{if(!m)return;let t=e=>{"Escape"===e.key&&v()},n=t=>{let n=e.current&&e.current.contains(t.target),o=t.target.closest?.(".invictus-tooltip");n||o||v()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",n),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",n)}},[m,v,e]),(0,r.useEffect)(()=>()=>clearTimeout(u.current),[]),{visible:m,pinned:c,onMouseEnter:()=>{clearTimeout(u.current),n(!0),f()},onMouseLeave:()=>{u.current=setTimeout(()=>n(!1),150)},onFocus:()=>{d(!0),f()},onBlur:()=>d(!1),onClick:()=>p(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(u.current),i(!0)},onTooltipMouseLeave:()=>i(!1),pin:(0,r.useCallback)(()=>p(!0),[p])}}(e),b=function(e,t,{tooltipWidth:n=300,margin:o=12,navHeight:i=60,gap:a=10}={}){let[s,l]=(0,r.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,r.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),r=window.innerWidth,s=t.left+t.width/2-n/2;s=Math.max(o,Math.min(s,r-n-o));let d=Math.min(Math.max(t.left+t.width/2-s,14),n-14),c=t.top-i<70;l({top:c?t.bottom+a:t.top-a,left:s,arrowLeft:d,below:c})},[e,n,o,i,a]);return(0,r.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,r.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),s}(e,d,{tooltipWidth:260}),g=d&&(0,i.createPortal)((0,o.jsxs)("div",{id:s,role:"tooltip",className:`invictus-tooltip${c?" invictus-tooltip--pinned":""}`,"data-below":b.below?"true":"false",onMouseEnter:f,onMouseLeave:x,style:{position:"fixed",top:b.below?b.top:"auto",bottom:b.below?"auto":`calc(100vh - ${b.top}px)`,left:b.left,width:260,"--tooltip-accent":n},children:[t,(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:b.arrowLeft}})]}),document.body);return{tooltipId:s,visible:d,pinned:c,onMouseEnter:p,onMouseLeave:u,onFocus:h,onBlur:m,onClick:v,tooltipEl:g}}({badgeRef:m,tooltipContent:"string"==typeof t?(0,o.jsx)(d.oz,{remarkPlugins:[c.A],children:t}):t,accentColor:u??n});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{ref:m,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...h},role:"button","aria-pressed":x,"aria-describedby":f?v:void 0,onMouseEnter:b,onMouseLeave:g,onFocus:j,onBlur:k,onClick:y,children:(0,o.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:n,color:p,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":u??n,...h},children:e})}),T]})}let j=(0,o.jsxs)(o.Fragment,{children:["Same for both ",(0,o.jsx)("strong",{children:"Dashboard"})," and ",(0,o.jsx)("strong",{children:"Framework"}),". Can be skipped if done already."]});function k(){return w({title:"Shared",tooltip:j,backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",accentColor:"var(--inv-badge-shared-text)"})}function y({children:e,badge:t,variant:n="underline"}){let i=(0,r.useRef)(null),[a,s]=(0,r.useState)();(0,r.useEffect)(()=>{let e=i.current;if(!e)return;let t=()=>{let t=e.querySelector(".invictus-badge");if(!t)return!1;let n=window.getComputedStyle(t),o=n.getPropertyValue("--badge-accent").trim()||n.backgroundColor;return!!o&&"transparent"!==o&&"rgba(0, 0, 0, 0)"!==o&&(s(o),!0)};if(t())return;let n=new MutationObserver(()=>{t()&&n.disconnect()});return n.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>n.disconnect()},[t]);let l="background"==n?((e,t=.1)=>{if(!e)return;let n=Math.round(100*t);return`color-mix(in srgb, ${e} ${n}%, transparent)`})(a,.1):void 0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:a,backgroundColor:l,padding:"0.25rem"},children:e}),(0,o.jsx)("span",{ref:i,children:t})]})}},2284(e,t,n){n.d(t,{A:()=>r});var o=n(4848);n(6540);function r({icon:e,name:t,tagline:n}){return(0,o.jsxs)("div",{className:"header_Rs1Y",children:[(0,o.jsx)("div",{className:"iconBlock_flcq",children:(0,o.jsx)("img",{src:e,alt:""})}),(0,o.jsxs)("div",{className:"meta_kVky",children:[(0,o.jsx)("h1",{children:t}),(0,o.jsx)("p",{className:"tagline_Z4Kj",children:n})]})]})}},8453(e,t,n){n.d(t,{R:()=>a,x:()=>s});var o=n(6540);let r={},i=o.createContext(r);function a(e){let t=o.useContext(i);return o.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);