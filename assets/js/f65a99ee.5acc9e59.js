"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["838"],{3392(e,t,r){r.r(t),r.d(t,{metadata:()=>o,default:()=>p,frontMatter:()=>s,contentTitle:()=>l,toc:()=>d,assets:()=>c});var o=JSON.parse('{"id":"architecture-diagram","title":"Invictus for Azure architecture","description":"An Invictus installation consists of two major parts: the Dashboard and the Framework.","source":"@site/versioned_docs/version-v6.0.0/architecture-diagram.mdx","sourceDirName":".","slug":"/architecture-diagram","permalink":"/architecture-diagram","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":2,"frontMatter":{"sidebar_label":"Architecture","sidebar_position":2,"hide_table_of_contents":true},"sidebar":"technical_users","previous":{"title":"Welcome","permalink":"/technical"},"next":{"title":"Installing Invictus Dashboard","permalink":"/dashboard/installation/"}}'),i=r(4848),n=r(8453),a=r(2860);let s={sidebar_label:"Architecture",sidebar_position:2,hide_table_of_contents:!0},l="Invictus for Azure architecture",c={},d=[{value:"Dashboard",id:"dashboard",level:2},{value:"Framework",id:"framework",level:2}];function h(e){let t={a:"a",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"invictus-for-azure-architecture",children:"Invictus for Azure architecture"})}),"\n",(0,i.jsxs)(t.p,{children:["An Invictus installation consists of two major parts: the ",(0,i.jsx)(t.strong,{children:"Dashboard"})," and the ",(0,i.jsx)(t.strong,{children:"Framework"}),"."]}),"\n",(0,i.jsx)(t.h2,{id:"dashboard",children:"Dashboard"}),"\n",(0,i.jsxs)(t.p,{children:["The Invictus ",(0,i.jsx)(t.strong,{children:"Dashboard"})," provides a business user friendly UI for interacting with client integrations (commonly Azure Logic Apps), without requiring direct access to Azure. The Dashboard displays integrations as ",(0,i.jsx)(a.M,{variant:"technical"}),", supported by diagnostic data (here called ",(0,i.jsx)(a.Nn,{}),") loaded via Invictus' backend infrastructure."]}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Architecture diagram",src:r(2735).A+"",title:"Invictus Dashboard architecture diagram",width:"1773",height:"958"})}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(a.nl,{variant:"technical"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Dashboard App:"})})," the business user interacts with the ",(0,i.jsx)(t.strong,{children:"Dashboard"})," via a deployed web app. Here, users manage their flows."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Dashboard Gateway:"})})," serves as the backend API for the ",(0,i.jsx)(t.strong,{children:"Dashboard App"}),". It shows the stored flows (",(0,i.jsx)(t.em,{children:"Cosmos DB for MongoDB"}),") and triggers flow operations (",(0,i.jsx)(t.em,{children:"Azure Service Bus"}),")."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Flow Handler:"})})," based on the required flow action triggered by the business user (",(0,i.jsx)(t.em,{children:"Ignore"}),", ",(0,i.jsx)(t.em,{children:"Resubmit"}),", ",(0,i.jsx)(t.em,{children:"Resume"}),") in the ",(0,i.jsx)(t.strong,{children:"Dashboard App"}),", it interacts with the deployed Azure Logic Apps on the client environment (See ",(0,i.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"import flow traces via Logic App workflows"})," for more info)."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(a.Yu,{}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"[type] import job:"})})," the Invictus installation provides 'import jobs' which are interaction endpoints to push flow traces into the ",(0,i.jsx)(t.strong,{children:"Dashboard"}),". These come from external client resources (Azure Logic Apps, Azure Data Factory, Azure Event Hubs). Once received, they push a canonical message into the system (",(0,i.jsx)(t.em,{children:"Azure Service Bus"}),")."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Cache job:"})})," listens for new canonical messages (",(0,i.jsx)(t.em,{children:"Azure Service Bus"}),") and caches them as batches (",(0,i.jsx)(t.em,{children:"Azure Blob Storage"}),")."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Merge job:"})})," listens for new/updated batches (",(0,i.jsx)(t.em,{children:"Azure Event Hubs"}),") and synchronizes the storage (",(0,i.jsx)(t.em,{children:"Cosmos DB for MongoDB"}),") with 'message content view' information (input/output of Azure Logic Apps, see ",(0,i.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"import flow traces via Azure Logic App workflows"})," for more info)."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)("u",{children:(0,i.jsx)(t.strong,{children:"Store job:"})})," listens for new batches (",(0,i.jsx)(t.em,{children:"Azure Event Hubs"}),"), loads referenced canonical message (",(0,i.jsx)(t.em,{children:"Azure Blob Storage"}),"), and combines as flow trace models (",(0,i.jsx)(t.em,{children:"Cosmos DB for MongoDB"}),"). These flow traces get available via the ",(0,i.jsx)(t.strong,{children:"Dashboard App"})," to the business user."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"framework",children:"Framework"}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Architecture diagram",src:r(2675).A+"",title:"Invictus Framework architecture diagram",width:"1655",height:"983"})}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsxs)(t.p,{children:["Common integration patterns aren't always built into tasks within the Azure Logic App workflow editor. The Invictus ",(0,i.jsx)(t.strong,{children:"Framework"})," provides these patterns as HTTP endpoints that client workflows can interact with."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/pubsubV2",children:(0,i.jsx)(t.strong,{children:"PubSub:"})})," uses Azure Service Bus as a message broker to publish/subscribe on messages across Azure Logic Apps."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/timesequencer",children:(0,i.jsx)(t.strong,{children:"Time Sequencer:"})})," control the order in which Azure Logic App workflows can run based on a custom timestamp."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/sequencecontroller",children:(0,i.jsx)(t.strong,{children:"Sequence Controller:"})})," control the order in which Azure Logic App workflow can run based on a custom sequence order."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/xmljsonconverter",children:(0,i.jsx)(t.strong,{children:"XML/JSON Converter:"})})," convert XML-JSON based on a custom XSLT transformation."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/xsd-validator",children:(0,i.jsx)(t.strong,{children:"XSD Validator:"})})," validate XML based on a custom XSD schema."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/regextranslation",children:(0,i.jsx)(t.strong,{children:"Regex Translator:"})})," translate user content based on custom regular expression patterns."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"/framework/transcoV2",children:(0,i.jsx)(t.strong,{children:"Transco:"})})," promote properties in an user content based on database records."]}),"\n"]})]})}function p(e={}){let{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},2735(e,t,r){r.d(t,{A:()=>o});let o=r.p+"assets/images/InvictusV2Diagram_Dashboard-0aa45e53575ca274ced362fcaf6525d8.png"},2675(e,t,r){r.d(t,{A:()=>o});let o=r.p+"assets/images/InvictusV2Diagram_Framework-bea74d7925634190d7c67730350374d9.png"},2860(e,t,r){r.d(t,{M:()=>g,Nn:()=>x,Yu:()=>b,nl:()=>f});var o=r(4848),i=r(6540),n=r(961),a=r(6370),s=r(4846),l=r(3937),c=r(3941);let d=`
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

Once imported, messages become visible and searchable in the flow monitoring view.`}},p=["flow","flow-trace","flow-trace-importing"];function u({termKey:e,label:t,termClass:r,tooltipMarkdown:m,variant:f="technical"}){(0,l.n9)(),(0,i.useInsertionEffect)(()=>{let e="term-highlight-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=d},[]);let{colorMode:g}=(0,c.G)(),b="dark"===g,x=(0,i.useRef)(null),w=(0,i.useId)(),{visible:v,pinned:j,onMouseEnter:k,onMouseLeave:y,onFocus:_,onBlur:A,onClick:z,pin:D,onTooltipMouseEnter:C,onTooltipMouseLeave:M}=(0,l.DV)(x),E=(0,l._W)(x,v,{tooltipWidth:300}),[L,I]=(0,i.useState)(e);(0,i.useEffect)(()=>{v||I(e)},[v,e]);let S=p.indexOf(L),B=p[(S-1+p.length)%p.length],F=p[(S+1)%p.length],T=h[L],N=L===e?m:T.tooltipMarkdown,P=v&&(0,n.createPortal)((0,o.jsxs)("div",{id:w,role:"tooltip",className:`invictus-tooltip${j?" invictus-tooltip--pinned":""}`,"data-below":E.below?"true":"false",onMouseEnter:C,onMouseLeave:M,style:{position:"fixed",top:E.below?E.top:"auto",bottom:E.below?"auto":`calc(100vh - ${E.top}px)`,left:E.left,width:300,"--tooltip-accent":b?T.accentDark:T.accent},children:["technical"===f&&(0,o.jsxs)("div",{className:"invictus-tooltip__nav",children:[(0,o.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),D(),I(B)},"aria-label":`Previous: ${h[B].label}`,children:"\u2039"}),(0,o.jsxs)("span",{className:"invictus-tooltip__nav-label",children:[T.label,(0,o.jsxs)("span",{className:"invictus-tooltip__nav-pager",children:[S+1," / ",p.length]})]}),(0,o.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),D(),I(F)},"aria-label":`Next: ${h[F].label}`,children:"\u203A"})]}),(0,o.jsx)(a.oz,{remarkPlugins:[s.A],components:{a:({href:e,children:t})=>{let r=e?.startsWith("#")?e.slice(1):null,i=r?h[r]:null;return i?(0,o.jsx)("button",{className:"invictus-tooltip__term-link",style:{color:b?i.accentDark:i.accent,borderBottomColor:b?i.accentDark:i.accent},onClick:e=>{e.stopPropagation(),D(),I(r)},children:t}):(0,o.jsx)("a",{href:e,children:t})}},children:N}),(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:E.arrowLeft}})]}),document.body);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("span",{ref:x,className:`term-highlight ${r}`,tabIndex:0,role:"button","aria-pressed":j,"aria-describedby":v?w:void 0,onMouseEnter:k,onMouseLeave:y,onFocus:_,onBlur:A,onClick:z,children:[t,(0,o.jsx)("span",{className:"term-highlight__icon","aria-hidden":"true",children:"?"})]}),P]})}let m=`A **Flow** is a named message chain \u{2014} a logical grouping of related **mapping messages** sharing a common integration origin.

Flows are organized in *folders* and defined by a name, optional mappings, and business properties.`;function f({tooltip:e,variant:t="business"}){return(0,o.jsx)(u,{termKey:"flow",label:"flow",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:m)})}function g({tooltip:e,variant:t="business"}){return(0,o.jsx)(u,{termKey:"flow",label:"flows",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:m)})}function b({tooltip:e}){return(0,o.jsx)(u,{termKey:"flow-trace",label:"flow trace",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}function x({tooltip:e}){return(0,o.jsx)(u,{termKey:"flow-trace",label:"flow traces",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}},3937(e,t,r){r.d(t,{DV:()=>c,_W:()=>s,n9:()=>a});var o=r(6540);let i="u">typeof window?o.useLayoutEffect:o.useEffect,n=`
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
`;function a(){(0,o.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=n},[])}function s(e,t,{tooltipWidth:r=300,margin:i=12,navHeight:n=60,gap:a=10}={}){let[l,c]=(0,o.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,o.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),o=window.innerWidth,s=t.left+t.width/2-r/2;s=Math.max(i,Math.min(s,o-r-i));let l=Math.min(Math.max(t.left+t.width/2-s,14),r-14),d=t.top-n<70;c({top:d?t.bottom+a:t.top-a,left:s,arrowLeft:l,below:d})},[e,r,i,n,a]);return(0,o.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,o.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),l}let l="invictus-tooltip-activate";function c(e){let[t,r]=(0,o.useState)(!1),[n,a]=(0,o.useState)(!1),[s,c]=(0,o.useState)(!1),[d,h]=(0,o.useState)(!1),p=(0,o.useRef)(null),u=(0,o.useRef)(`tip-${Math.random()}`),m=t||n||s||d,f=(0,o.useCallback)(()=>{clearTimeout(p.current),r(!1),a(!1),c(!1),h(!1)},[]),g=(0,o.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:u.current}}))},[]);return i(()=>{if(!m)return;let e=e=>{e.detail.id!==u.current&&f()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[m,f]),(0,o.useEffect)(()=>{if(!m)return;let t=e=>{"Escape"===e.key&&f()},r=t=>{let r=e.current&&e.current.contains(t.target),o=t.target.closest?.(".invictus-tooltip");r||o||f()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",r)}},[m,f,e]),(0,o.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:m,pinned:d,onMouseEnter:()=>{clearTimeout(p.current),r(!0),g()},onMouseLeave:()=>{p.current=setTimeout(()=>r(!1),150)},onFocus:()=>{c(!0),g()},onBlur:()=>c(!1),onClick:()=>h(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(p.current),a(!0)},onTooltipMouseLeave:()=>a(!1),pin:(0,o.useCallback)(()=>h(!0),[h])}}},8453(e,t,r){r.d(t,{R:()=>a,x:()=>s});var o=r(6540);let i={},n=o.createContext(i);function a(e){let t=o.useContext(n);return o.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),o.createElement(n.Provider,{value:t},e.children)}}}]);