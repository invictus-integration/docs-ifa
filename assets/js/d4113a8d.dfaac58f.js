"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3146"],{7531(t,e,o){o.r(e),o.d(e,{metadata:()=>i,default:()=>u,frontMatter:()=>s,contentTitle:()=>l,toc:()=>d,assets:()=>c});var i=JSON.parse('{"id":"dashboard/flows/import-flow-traces/import flow-via-fa","title":"Import flow traces via Azure Function App logs <NewSinceBadge version=\\"v6.2\\" />","description":"Invictus allows developers to import flow traces via application logs coming from Azure Function Apps. These logs translate to the startup of the Function App, but can also contain developer-custom logging. Combined, they result in an execution tree in the Dashboard that represents.","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/04_import-flow-traces/import flow-via-fa.mdx","sourceDirName":"dashboard/flows/04_import-flow-traces","slug":"/dashboard/flows/import-flow-traces/import flow-via-fa","permalink":"/dashboard/flows/import-flow-traces/import flow-via-fa","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","frontMatter":{"sidebar_label":"Import flow traces via Azure Function Apps"},"sidebar":"technical_users","previous":{"title":"Give access to your Logic Apps","permalink":"/dashboard/installation/give_la_access"},"next":{"title":"Import flow traces programmatically via Azure Event Hubs","permalink":"/dashboard/flows/import-flow-traces/import-flow-prog-via-eh"}}'),n=o(4848),r=o(8453),a=o(2437);let s={sidebar_label:"Import flow traces via Azure Function Apps"},l="Import flow traces via Azure Function App logs ",c={},d=[{value:"Send diagnostic traces from Function App",id:"send-diagnostic-traces-from-function-app",level:2},{value:"Log custom information from Function App",id:"log-custom-information-from-function-app",level:2}];function p(t){let e={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsxs)(e.h1,{id:"import-flow-traces-via-azure-function-app-logs-",children:["Import flow traces via Azure Function App logs ",(0,n.jsx)(a.yo,{version:"v6.2"})]})}),"\n",(0,n.jsx)(e.p,{children:"Invictus allows developers to import flow traces via application logs coming from Azure Function Apps. These logs translate to the startup of the Function App, but can also contain developer-custom logging. Combined, they result in an execution tree in the Dashboard that represents."}),"\n",(0,n.jsx)(e.h2,{id:"send-diagnostic-traces-from-function-app",children:"Send diagnostic traces from Function App"}),"\n",(0,n.jsxs)(e.p,{children:["Configure the ",(0,n.jsx)(e.a,{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/platform/diagnostic-settings",children:"diagnostic settings"})," on the target Function App to monitor, to send the ",(0,n.jsx)(e.a,{href:"https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/functionapplogs",children:(0,n.jsx)(e.code,{children:"Function Application Logs"})})," to the Invictus Event Hub that can import these logs:"]}),"\n",(0,n.jsxs)(e.table,{children:[(0,n.jsx)(e.thead,{children:(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.th,{children:"Event Hub property"}),(0,n.jsx)(e.th,{children:"Value"})]})}),(0,n.jsxs)(e.tbody,{children:[(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:"Namespace"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"invictus-{resourcePrefix}-we-sft-evnm"})})]}),(0,n.jsxs)(e.tr,{children:[(0,n.jsx)(e.td,{children:"Hub name"}),(0,n.jsx)(e.td,{children:(0,n.jsx)(e.code,{children:"invictus-{resourcePrefix}-functions-evhb"})})]})]})]}),"\n",(0,n.jsx)(e.admonition,{title:"automate configuration",type:"tip",children:(0,n.jsxs)(e.p,{children:["Take a look at ",(0,n.jsx)(e.a,{href:"https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/insights/diagnostic-setting",children:"Bicep AVM"})," to automate this diagnostic setting configuration in your deployment."]})}),"\n",(0,n.jsx)(e.h2,{id:"log-custom-information-from-function-app",children:"Log custom information from Function App"}),"\n",(0,n.jsxs)(e.p,{children:["Besides the default application logs, Invictus can extract custom information from custom logs. The flow trace importing marks these logs with the ",(0,n.jsx)(e.code,{children:"EventName=InvictusLog"}),". Invictus assumes that the log message is a JSON object. The following JSON properties shows how to set customer information on all (including default) application logs. This helps with mapping the entire set of application logs to pre-defined flows in the Dashboard."]}),"\n",(0,n.jsx)(e.pre,{children:(0,n.jsx)(e.code,{className:"language-csharp",children:'var properties = new Dictionary<string, string>\n{\n    ["x-iv-domain"] = "<domain>",\n    ["x-iv-service"] = "<service>",\n    ["x-iv-action"] = "<action>",\n    ["x-iv-version"] = "<version>",\n    ["x-iv-milestone"] = "<milestone>",\n    ["x-iv-eventtext"] = "<event-text>",\n    ["x-iv-operation-name"] = "<operation-name>",\n    ["x-iv-chain-id"] = "<transaction-id>",\n    ["x-iv-parent-id"] = "<operation-parent-id>"\n};\n\nlogger.LogInformation(new EventId(0, "InvictusLog"), JsonSerializer.Serialize(properties));\n'})})]})}function u(t={}){let{wrapper:e}={...(0,r.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(p,{...t})}):p(t)}},2437(t,e,o){o.d(e,{SV:()=>p,bE:()=>d,gw:()=>c,yo:()=>u});var i=o(4848),n=o(6540),r=o(961),a=o(6370),s=o(4846),l=o(3937);function c(){return m({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return m({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function p(){return m({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function u({version:t}){return m({title:`New since ${t}`,tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"#008800",color:"white"})}function m({title:t,tooltip:e,backgroundColor:o="#b55d00",color:c="white"}){(0,l.n9)();let d=(0,n.useRef)(null),p=(0,n.useId)(),{visible:u,pinned:f,onMouseEnter:h,onMouseLeave:v,onFocus:g,onBlur:x,onClick:b,onTooltipMouseEnter:w,onTooltipMouseLeave:y}=(0,l.DV)(d),j=(0,l._W)(d,u,{tooltipWidth:260}),k=u&&(0,r.createPortal)((0,i.jsxs)("div",{id:p,role:"tooltip",className:`invictus-tooltip${f?" invictus-tooltip--pinned":""}`,"data-below":j.below?"true":"false",onMouseEnter:w,onMouseLeave:y,style:{position:"fixed",top:j.below?j.top:"auto",bottom:j.below?"auto":`calc(100vh - ${j.top}px)`,left:j.left,width:260,"--tooltip-accent":o},children:["string"==typeof e?(0,i.jsx)(a.oz,{remarkPlugins:[s.A],children:e}):e,(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:j.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":f,"aria-describedby":u?p:void 0,onMouseEnter:h,onMouseLeave:v,onFocus:g,onBlur:x,onClick:b,children:(0,i.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:o,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":o},children:t})}),k]})}},3937(t,e,o){o.d(e,{DV:()=>c,_W:()=>s,n9:()=>a});var i=o(6540);let n="u">typeof window?i.useLayoutEffect:i.useEffect,r=`
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
`;function a(){(0,i.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=r},[])}function s(t,e,{tooltipWidth:o=300,margin:n=12,navHeight:r=60,gap:a=10}={}){let[l,c]=(0,i.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,i.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),i=window.innerWidth,s=e.left+e.width/2-o/2;s=Math.max(n,Math.min(s,i-o-n));let l=Math.min(Math.max(e.left+e.width/2-s,14),o-14),d=e.top-r<70;c({top:d?e.bottom+a:e.top-a,left:s,arrowLeft:l,below:d})},[t,o,n,r,a]);return(0,i.useLayoutEffect)(()=>{e&&d()},[e,d]),(0,i.useEffect)(()=>{if(e)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[e,d]),l}let l="invictus-tooltip-activate";function c(t){let[e,o]=(0,i.useState)(!1),[r,a]=(0,i.useState)(!1),[s,c]=(0,i.useState)(!1),[d,p]=(0,i.useState)(!1),u=(0,i.useRef)(null),m=(0,i.useRef)(`tip-${Math.random()}`),f=e||r||s||d,h=(0,i.useCallback)(()=>{clearTimeout(u.current),o(!1),a(!1),c(!1),p(!1)},[]),v=(0,i.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:m.current}}))},[]);return n(()=>{if(!f)return;let t=t=>{t.detail.id!==m.current&&h()};return document.addEventListener(l,t),()=>document.removeEventListener(l,t)},[f,h]),(0,i.useEffect)(()=>{if(!f)return;let e=t=>{"Escape"===t.key&&h()},o=e=>{let o=t.current&&t.current.contains(e.target),i=e.target.closest?.(".invictus-tooltip");o||i||h()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",o),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",o)}},[f,h,t]),(0,i.useEffect)(()=>()=>clearTimeout(u.current),[]),{visible:f,pinned:d,onMouseEnter:()=>{clearTimeout(u.current),o(!0),v()},onMouseLeave:()=>{u.current=setTimeout(()=>o(!1),150)},onFocus:()=>{c(!0),v()},onBlur:()=>c(!1),onClick:()=>p(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(u.current),a(!0)},onTooltipMouseLeave:()=>a(!1),pin:(0,i.useCallback)(()=>p(!0),[p])}}}}]);