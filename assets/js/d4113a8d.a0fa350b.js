"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3146"],{7531(t,e,o){o.r(e),o.d(e,{metadata:()=>n,default:()=>p,frontMatter:()=>s,contentTitle:()=>l,toc:()=>d,assets:()=>c});var n=JSON.parse('{"id":"dashboard/flows/import-flow-traces/import flow-via-fa","title":"Import flow traces via Azure Function App logs","description":"<ComponentHeader","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/04_import-flow-traces/import flow-via-fa.mdx","sourceDirName":"dashboard/flows/04_import-flow-traces","slug":"/dashboard/flows/import-flow-traces/import flow-via-fa","permalink":"/dashboard/flows/import-flow-traces/import flow-via-fa","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","frontMatter":{"sidebar_label":"Import via Function Apps","title":"Import flow traces via Azure Function App logs","hide_title":true},"sidebar":"technical_users","previous":{"title":"Import via Logic Apps","permalink":"/dashboard/flows/import-flow-traces/import-flows-via-la"},"next":{"title":"Import via Data Factory","permalink":"/dashboard/flows/import-flow-traces/import-flow-via-df"}}'),r=o(4848),i=o(8453);o(3742);var a=o(2284);let s={sidebar_label:"Import via Function Apps",title:"Import flow traces via Azure Function App logs",hide_title:!0},l,c={},d=[{value:"Send diagnostic traces from Function App",id:"send-diagnostic-traces-from-function-app",level:2},{value:"Log custom information from Function App",id:"log-custom-information-from-function-app",level:2}];function u(t){let e={a:"a",admonition:"admonition",code:"code",h2:"h2",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...t.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.A,{icon:"/img/icons/import-jobs.png",name:"Function App import job",tagline:"Import flow traces from Azure Function App logs"}),"\n",(0,r.jsx)(e.p,{children:"Invictus allows developers to import flow traces via function app logs coming from Azure Function Apps. These logs translate to the startup of the Function App, but can also contain developer-custom logging. Combined, they result in an execution tree in the Dashboard that represents."}),"\n",(0,r.jsx)(e.h2,{id:"send-diagnostic-traces-from-function-app",children:"Send diagnostic traces from Function App"}),"\n",(0,r.jsxs)(e.p,{children:["Configure the ",(0,r.jsx)(e.a,{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/platform/diagnostic-settings",children:"diagnostic settings"})," on the target Function App to monitor, to send the ",(0,r.jsx)(e.a,{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/functionapplogs",children:(0,r.jsx)(e.code,{children:"Function Application Logs"})})," to the Invictus Event Hub that can import these logs:"]}),"\n",(0,r.jsxs)(e.table,{children:[(0,r.jsx)(e.thead,{children:(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.th,{children:"Event Hub property"}),(0,r.jsx)(e.th,{children:"Value"})]})}),(0,r.jsxs)(e.tbody,{children:[(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{children:"Namespace"}),(0,r.jsx)(e.td,{children:(0,r.jsx)(e.code,{children:"invictus-{resourcePrefix}-we-sft-evnm"})})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{children:"Hub name"}),(0,r.jsx)(e.td,{children:(0,r.jsx)(e.code,{children:"invictus-{resourcePrefix}-functions-evhb"})})]})]})]}),"\n",(0,r.jsx)(e.admonition,{title:"automate configuration",type:"tip",children:(0,r.jsxs)(e.p,{children:["Take a look at ",(0,r.jsx)(e.a,{href:"https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/insights/diagnostic-setting",children:"Bicep AVM"})," to automate this diagnostic setting configuration in your deployment."]})}),"\n",(0,r.jsx)(e.h2,{id:"log-custom-information-from-function-app",children:"Log custom information from Function App"}),"\n",(0,r.jsxs)(e.p,{children:["Besides the default function app logs, Invictus can extract custom information from custom logs. The flow trace importing marks these logs with the ",(0,r.jsx)(e.code,{children:"EventName=InvictusLog"}),". Invictus assumes that the log message is a JSON object. The following JSON properties shows how to set customer information on all (including default) function app logs. This helps with mapping the entire set of function app logs to pre-defined flows in the Dashboard."]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-csharp",children:'var properties = new Dictionary<string, string>\n{\n    ["x-iv-domain"] = "<domain>",\n    ["x-iv-service"] = "<service>",\n    ["x-iv-action"] = "<action>",\n    ["x-iv-version"] = "<version>",\n    ["x-iv-milestone"] = "<milestone>",\n    ["x-iv-eventtext"] = "<event-text>",\n    ["x-iv-operation-name"] = "<operation-name>",\n    ["x-iv-chain-id"] = "<transaction-id>",\n    ["x-iv-parent-id"] = "<operation-parent-id>"\n};\n\nlogger.LogInformation(new EventId(0, "InvictusLog"), JsonSerializer.Serialize(properties));\n'})})]})}function p(t={}){let{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,r.jsx)(e,{...t,children:(0,r.jsx)(u,{...t})}):u(t)}},3742(t,e,o){o.d(e,{gw:()=>g,yo:()=>w,bP:()=>y,V3:()=>A,IG:()=>j,mw:()=>F,SV:()=>x,bE:()=>b});var n=o(4848),r=o(6540),i=o(961);let a="u">typeof window?r.useLayoutEffect:r.useEffect,s=`
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
`;function l(){(0,r.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=s},[])}function c(t,e,{tooltipWidth:o=300,margin:n=12,navHeight:i=60,gap:a=10}={}){let[s,l]=(0,r.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,r.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),r=window.innerWidth,s=e.left+e.width/2-o/2;s=Math.max(n,Math.min(s,r-o-n));let c=Math.min(Math.max(e.left+e.width/2-s,14),o-14),d=e.top-i<70;l({top:d?e.bottom+a:e.top-a,left:s,arrowLeft:c,below:d})},[t,o,n,i,a]);return(0,r.useLayoutEffect)(()=>{e&&d()},[e,d]),(0,r.useEffect)(()=>{if(e)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[e,d]),s}let d="invictus-tooltip-activate";function u(t){let[e,o]=(0,r.useState)(!1),[n,i]=(0,r.useState)(!1),[s,l]=(0,r.useState)(!1),[c,u]=(0,r.useState)(!1),p=(0,r.useRef)(null),m=(0,r.useRef)(`tip-${Math.random()}`),f=e||n||s||c,h=(0,r.useCallback)(()=>{clearTimeout(p.current),o(!1),i(!1),l(!1),u(!1)},[]),v=(0,r.useCallback)(()=>{document.dispatchEvent(new CustomEvent(d,{detail:{id:m.current}}))},[]);return a(()=>{if(!f)return;let t=t=>{t.detail.id!==m.current&&h()};return document.addEventListener(d,t),()=>document.removeEventListener(d,t)},[f,h]),(0,r.useEffect)(()=>{if(!f)return;let e=t=>{"Escape"===t.key&&h()},o=e=>{let o=t.current&&t.current.contains(e.target),n=e.target.closest?.(".invictus-tooltip");o||n||h()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",o),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",o)}},[f,h,t]),(0,r.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:f,pinned:c,onMouseEnter:()=>{clearTimeout(p.current),o(!0),v()},onMouseLeave:()=>{p.current=setTimeout(()=>o(!1),150)},onFocus:()=>{l(!0),v()},onBlur:()=>l(!1),onClick:()=>u(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(p.current),i(!0)},onTooltipMouseLeave:()=>i(!1),pin:(0,r.useCallback)(()=>u(!0),[u])}}var p=o(6370),m=o(4846),f=o(7066),h=o(6188);let v=`
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
`;function g(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(f.gc,{icon:h.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role."})}function b(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(f.gc,{icon:h.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function x(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(f.gc,{icon:h.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function w({version:t,style:e}){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(f.gc,{icon:h.yy})," ",t]}),tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:e})}function y({version:t,note:e,style:o}){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(f.gc,{icon:h.Dfk})," ",t]}),tooltip:`Feature deprecated since **Invictus ${t}**. ${e}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:o})}function j({variant:t}){return(0,r.useInsertionEffect)(()=>{let t="invictus-row-tint-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=v},[]),(0,n.jsx)("span",{"data-row-tint":t,"aria-hidden":"true",style:{display:"none"}})}function k({title:t,tooltip:e,backgroundColor:o="#b55d00",color:a="white",style:s}){l();let d=(0,r.useRef)(null),f=(0,r.useId)(),{visible:h,pinned:v,onMouseEnter:g,onMouseLeave:b,onFocus:x,onBlur:w,onClick:y,onTooltipMouseEnter:j,onTooltipMouseLeave:E}=u(d),F=c(d,h,{tooltipWidth:260}),A=h&&(0,i.createPortal)((0,n.jsxs)("div",{id:f,role:"tooltip",className:`invictus-tooltip${v?" invictus-tooltip--pinned":""}`,"data-below":F.below?"true":"false",onMouseEnter:j,onMouseLeave:E,style:{position:"fixed",top:F.below?F.top:"auto",bottom:F.below?"auto":`calc(100vh - ${F.top}px)`,left:F.left,width:260,"--tooltip-accent":o},children:["string"==typeof e?(0,n.jsx)(p.oz,{remarkPlugins:[m.A],children:e}):e,(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:F.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...s},role:"button","aria-pressed":v,"aria-describedby":h?f:void 0,onMouseEnter:g,onMouseLeave:b,onFocus:x,onBlur:w,onClick:y,children:(0,n.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:o,color:a,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":o,...s},children:t})}),A]})}let E="var(--inv-badge-shared-accent)";function F(){l();let t=(0,r.useRef)(null),e=(0,r.useId)(),{visible:o,pinned:a,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:m,onClick:f,onTooltipMouseEnter:h,onTooltipMouseLeave:v}=u(t),g=c(t,o,{tooltipWidth:260}),b=o&&(0,i.createPortal)((0,n.jsxs)("div",{id:e,role:"tooltip",className:`invictus-tooltip${a?" invictus-tooltip--pinned":""}`,"data-below":g.below?"true":"false",onMouseEnter:h,onMouseLeave:v,style:{position:"fixed",top:g.below?g.top:"auto",bottom:g.below?"auto":`calc(100vh - ${g.top}px)`,left:g.left,width:260,"--tooltip-accent":E},children:["Same for both ",(0,n.jsx)("strong",{children:"Dashboard"})," and ",(0,n.jsx)("strong",{children:"Framework"}),". Can be skipped if done already.",(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:g.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:t,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},children:(0,n.jsx)("span",{tabIndex:0,role:"button","aria-pressed":a,"aria-describedby":o?e:void 0,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:m,onClick:f,className:"invictus-badge",style:{backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",padding:"2px 6px",borderRadius:"4px",fontSize:"0.9rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":E},children:"Shared"})}),b]})}function A({children:t,badge:e,variant:o="underline"}){let i=(0,r.useRef)(null),[a,s]=(0,r.useState)();(0,r.useEffect)(()=>{let t=i.current;if(!t)return;let e=()=>{let e=t.querySelector(".invictus-badge");if(!e)return!1;let{backgroundColor:o}=window.getComputedStyle(e);return!!o&&"transparent"!==o&&"rgba(0, 0, 0, 0)"!==o&&(s(o),!0)};if(e())return;let o=new MutationObserver(()=>{e()&&o.disconnect()});return o.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>o.disconnect()},[e]);let l="background"==o?((t,e=.1)=>{if(!t)return;let o=Math.round(100*e);return`color-mix(in srgb, ${t} ${o}%, transparent)`})(a,.1):void 0;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:a,backgroundColor:l,padding:"0.25rem"},children:t}),(0,n.jsx)("span",{ref:i,children:e})]})}},2284(t,e,o){o.d(e,{A:()=>r});var n=o(4848);o(6540);function r({icon:t,name:e,tagline:o}){return(0,n.jsxs)("div",{className:"header_Rs1Y",children:[(0,n.jsx)("div",{className:"iconBlock_flcq",children:(0,n.jsx)("img",{src:t,alt:`${e} component icon \u{2014} ${o}`})}),(0,n.jsxs)("div",{className:"meta_kVky",children:[(0,n.jsx)("h1",{children:e}),(0,n.jsx)("p",{className:"tagline_Z4Kj",children:o})]})]})}},8453(t,e,o){o.d(e,{R:()=>a,x:()=>s});var n=o(6540);let r={},i=n.createContext(r);function a(t){let e=n.useContext(i);return n.useMemo(function(){return"function"==typeof t?t(e):{...e,...t}},[e,t])}function s(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(r):t.components||r:a(t.components),n.createElement(i.Provider,{value:e},t.children)}}}]);