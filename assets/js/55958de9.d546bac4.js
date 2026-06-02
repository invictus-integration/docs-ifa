"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["710"],{9624(e,t,r){r.r(t),r.d(t,{metadata:()=>i,default:()=>m,frontMatter:()=>d,contentTitle:()=>h,toc:()=>p,assets:()=>u});var i=JSON.parse('{"id":"dashboard/flows/search","title":"Search for messages in a flow","description":"The Dashboard allows users to search for messages that went through a . This helps during defect localization or verification of client integrations. The [Select Flows] dropdown provides you to select one or more flows for which the search query should take place.","source":"@site/versioned_docs/version-v6.0.0/dashboard/flows/02_search.mdx","sourceDirName":"dashboard/flows","slug":"/dashboard/flows/search","permalink":"/dashboard/flows/search","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":2,"frontMatter":{"sidebar_label":"Search for messages"},"sidebar":"business_users","previous":{"title":"Add new flows","permalink":"/dashboard/flows/add"},"next":{"title":"Add new users","permalink":"/dashboard/security/users"}}'),o=r(4848),n=r(8453),a=r(773),s=r(7250),l=r(4050),c=r(2860);let d={sidebar_label:"Search for messages"},h="Search for messages in a flow",u={},p=[];function f(e){let t={a:"a",code:"code",em:"em",h1:"h1",header:"header",img:"img",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"search-for-messages-in-a-flow",children:"Search for messages in a flow"})}),"\n",(0,o.jsx)(l.A,{paths:["Your Flows","Click on a flow"]}),"\n",(0,o.jsxs)(t.p,{children:["The Dashboard allows users to search for messages that went through a ",(0,o.jsx)(c.nl,{}),". This helps during defect localization or verification of client integrations. The ",(0,o.jsx)(t.code,{children:"[Select Flows]"})," dropdown provides you to select one or more flows for which the search query should take place."]}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Select flows dropdown multi-select",src:r(6653).A+"",width:"1918",height:"921"})}),"\n",(0,o.jsxs)(t.p,{children:["Additionally, the Dashboard provides ",(0,o.jsx)(t.em,{children:"Basic"})," and ",(0,o.jsx)(t.em,{children:"Advanced"})," search capabilities to deepen the search."]}),"\n",(0,o.jsxs)(a.A,{groupId:"search-type",children:[(0,o.jsxs)(s.A,{value:"basic",label:"Basic search",default:!0,children:[(0,o.jsx)(t.p,{children:"The user is able to perform a basic text search through the top search bar."}),(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Basic search example",src:r(6110).A+"",width:"1600",height:"625"})}),(0,o.jsx)(t.p,{children:"This searches (case-insensitive) through these properties of the flow trace."}),(0,o.jsxs)(t.table,{children:[(0,o.jsx)(t.thead,{children:(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.th,{children:"Flow trace property"}),(0,o.jsx)(t.th,{children:"Description"})]})}),(0,o.jsxs)(t.tbody,{children:[(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Chain ID"})}),(0,o.jsx)(t.td,{children:"Shows only the flow traces within the same transaction, linked together with the Chain ID, also known in Azure Logic Apps as the 'client tracking ID'."})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"DSAV"})}),(0,o.jsxs)(t.td,{children:["Shows only flow traces with the same mapping: Domain, Service, Action, Version. (These are special business properties that are treated differently during flow trace importing, loaded from 'tracked properties, for instance, when using ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"importing them via Logic Apps"}),".)"]})]})]})]}),(0,o.jsxs)(t.p,{children:["Click the ",(0,o.jsx)(t.code,{children:"[Search]"})," button or press ",(0,o.jsx)(t.code,{children:"[Enter]"})," to perform your query."]})]}),(0,o.jsxs)(s.A,{value:"advanced",label:"Advanced search",children:[(0,o.jsxs)(t.p,{children:["An additional set of filters are available when clicking open the ",(0,o.jsx)(t.strong,{children:"Advanced Search"})," pane to further subset the flow traces search query."]}),(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Advanced search example",src:r(9152).A+"",width:"1600",height:"718"})}),(0,o.jsx)(t.p,{children:"The following filters may be applied:"}),(0,o.jsxs)(t.table,{children:[(0,o.jsx)(t.thead,{children:(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.th,{children:"Filter parameter"}),(0,o.jsx)(t.th,{style:{textAlign:"center"},children:"Required"}),(0,o.jsx)(t.th,{children:"Description"})]})}),(0,o.jsxs)(t.tbody,{children:[(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Date filter"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"yes"}),(0,o.jsxs)(t.td,{children:["Shows only the flow traces within a given time frame. Possible options are: ",(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"all"})," (= last 30 days)"]}),(0,o.jsx)("li",{children:(0,o.jsx)(t.code,{children:"after [your date]"})}),(0,o.jsx)("li",{children:(0,o.jsx)(t.code,{children:"before [your date]"})}),(0,o.jsx)("li",{children:(0,o.jsx)(t.code,{children:"between [your start date] and [your end date]"})}),(0,o.jsx)("li",{children:(0,o.jsx)(t.code,{children:"last [your amount] [minutes|hours|days|weeks|months]"})})]})]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Chain ID"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsx)(t.td,{children:"Shows only the flow traces within the same transaction, linked together with the Chain ID, also known in Azure Logic Apps as the 'client tracking ID'."})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Status"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsxs)(t.td,{children:["Shows only the flow traces at a given state: ",(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Active"}),": currently processing, (",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"including resubmit & resume for Logic Apps"}),")"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Completed"}),": successfully finished processing."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Error"}),": failure during processing (",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"including Logic Apps failures"}),")"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Ignored"}),": ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"when importing via LogicApps"}),", flows that users ignored via the Dashboard."]})]})]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"DSAV"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsxs)(t.td,{children:["Shows only flow traces with the same mapping: ",(0,o.jsx)(t.strong,{children:"Domain"}),", ",(0,o.jsx)(t.strong,{children:"Service"}),", ",(0,o.jsx)(t.strong,{children:"Action"}),", ",(0,o.jsx)(t.strong,{children:"Version"}),". (Invictus treats these special business properties differently when mapping imported messages, loaded from 'tracked properties, for instance, when using ",(0,o.jsx)(t.a,{href:"/dashboard/flows/import-flow-traces/import-flows-via-la",children:"importing them via Logic Apps"}),".) ",(0,o.jsx)("br",{})," An extra ",(0,o.jsx)(t.code,{children:"Contains Word"})," option is available to also include partial matches of these mappings."]})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:(0,o.jsx)(t.strong,{children:"Properties"})}),(0,o.jsx)(t.td,{style:{textAlign:"center"},children:"no"}),(0,o.jsxs)(t.td,{children:["Shows only flow traces that has certain custom user properties defined. You can filter by the property value by using a format: ",(0,o.jsxs)("ul",{children:[(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Equal"}),": include exact matches."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Not Equal"}),": include differences"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Starts With"}),": include matching prefix"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Ends With"}),": include matching postfix"]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Contains"}),": include partial matches."]}),(0,o.jsxs)("li",{children:[(0,o.jsx)(t.code,{children:"Regex"}),": include matching patterns (",(0,o.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference",children:"regular expression language"}),")"]})]})]})]})]})]})]})]})]})}function m(e={}){let{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(f,{...e})}):f(e)}},9152(e,t,r){r.d(t,{A:()=>i});let i=r.p+"assets/images/search-for-flow-traces-advanced-search-e66c8248cda78ea25a40fa1508e6619d.gif"},6110(e,t,r){r.d(t,{A:()=>i});let i=r.p+"assets/images/search-for-flow-traces-basic-search-738a912a0af8a58cc5a84c8ca682d1e5.gif"},6653(e,t,r){r.d(t,{A:()=>i});let i=r.p+"assets/images/v2_search-advanced3-45b938df234a7a3864a9f257f7ac1e78.png"},7250(e,t,r){r.d(t,{A:()=>s});var i=r(4848);r(6540);var o=r(4164),n=r(7663);function a({children:e,className:t,hidden:r}){return(0,i.jsx)("div",{role:"tabpanel",className:(0,o.A)("tabItem_Ymn6",t),hidden:r,children:e})}function s({children:e,className:t,value:r}){let{selectedValue:o,lazy:l}=(0,n.uc)(),c=r===o;return!c&&l?null:(0,i.jsx)(a,{className:t,hidden:!c,children:e})}},773(e,t,r){r.d(t,{A:()=>u});var i=r(4848);r(6540);var o=r(4164),n=r(8287),a=r(7663),s=r(8584),l=r(9863);function c({className:e}){let{selectedValue:t,selectValue:r,tabValues:n,block:l}=(0,a.uc)(),d=[],{blockElementScrollPositionUntilNextRender:h}=(0,s.a_)(),u=e=>{let i=e.currentTarget,o=n[d.indexOf(i)].value;o!==t&&(h(i),r(o))},p=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{let r=d.indexOf(e.currentTarget)+1;t=d[r]??d[0];break}case"ArrowLeft":{let r=d.indexOf(e.currentTarget)-1;t=d[r]??d[d.length-1]}}t?.focus()};return(0,i.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":l},e),children:n.map(({value:e,label:r,attributes:n})=>(0,i.jsx)("li",{role:"tab",tabIndex:t===e?0:-1,"aria-selected":t===e,ref:e=>{d.push(e)},onKeyDown:p,onClick:u,...n,className:(0,o.A)("tabs__item","tabItem_LNqP",n?.className,{"tabs__item--active":t===e}),children:r??e},e))})}function d({children:e}){return(0,i.jsx)("div",{className:"margin-top--md",children:e})}function h({className:e,children:t}){return(0,i.jsxs)("div",{className:(0,o.A)(n.G.tabs.container,"tabs-container","tabList__CuJ"),children:[(0,i.jsx)(c,{className:e}),(0,i.jsx)(d,{children:t})]})}function u(e){let t=(0,l.A)(),r=(0,a.OC)(e);return(0,i.jsx)(a.O_,{value:r,children:(0,i.jsx)(h,{className:e.className,children:(0,a.vT)(e.children)})},String(t))}},7663(e,t,r){r.d(t,{OC:()=>u,O_:()=>m,uc:()=>f,vT:()=>d});var i=r(4848),o=r(6540),n=r(6347),a=r(9989),s=r(6629),l=r(618),c=r(1367);function d(e){return o.Children.toArray(e).filter(e=>"\n"!==e)}function h({value:e,tabValues:t}){return t.some(t=>t.value===e)}function u(e){let t,{defaultValue:r,queryString:i=!1,groupId:d}=e,u=function(e){let{values:t,children:r}=e;return(0,o.useMemo)(()=>{let e=t??o.Children.toArray(r).flatMap(e=>{if(!e)return[];if((0,o.isValidElement)(e)&&function(e){let{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return[e];let t="string"==typeof e.type?e.type:e.type.name;throw Error(`Docusaurus error: Bad <Tabs> child <${t}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.
If you do not want to pass on a "value" prop to the direct children of <Tabs>, you can also pass an explicit <Tabs values={...}> prop.`)}).map(({props:{value:e,label:t,attributes:r,default:i}})=>({value:e,label:t,attributes:r,default:i})),i=(0,l.XI)(e,(e,t)=>e.value===t.value);if(i.length>0)throw Error(`Docusaurus error: Duplicate values "${i.map(e=>`'${e.value}'`).join(", ")}" found in <Tabs>. Every value needs to be unique.`);return e},[t,r])}(e),[p,f]=(0,o.useState)(()=>(function({defaultValue:e,tabValues:t}){if(0===t.length)throw Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(e){if(!h({value:e,tabValues:t}))throw Error(`Docusaurus error: The <Tabs> has a defaultValue "${e}" but none of its children has the corresponding value. Available values are: ${t.map(e=>e.value).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return e}let r=t.find(e=>e.default)??t[0];if(!r)throw Error("Unexpected error: 0 tabValues");return r.value})({defaultValue:r,tabValues:u})),[m,g]=function({queryString:e=!1,groupId:t}){let r=(0,n.W6)(),i=function({queryString:e=!1,groupId:t}){if("string"==typeof e)return e;if(!1===e)return null;if(!0===e&&!t)throw Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:e,groupId:t});return[(0,s.aZ)(i),(0,o.useCallback)(e=>{if(!i)return;let t=new URLSearchParams(r.location.search);t.set(i,e),r.replace({...r.location,search:t.toString()})},[i,r])]}({queryString:i,groupId:d}),[x,b]=function({groupId:e}){let t=e?`docusaurus.tab.${e}`:null,[r,i]=(0,c.Dv)(t);return[r,(0,o.useCallback)(e=>{t&&i.set(e)},[t,i])]}({groupId:d}),w=h({value:t=m??x,tabValues:u})?t:null;return(0,a.A)(()=>{w&&f(w)},[w]),{selectedValue:p,selectValue:(0,o.useCallback)(e=>{if(!h({value:e,tabValues:u}))throw Error(`Can't select invalid tab value=${e}`);f(e),g(e),b(e)},[g,b,u]),tabValues:u,lazy:e.lazy??!1,block:e.block??!1}}let p=(0,o.createContext)(null);function f(){let e=o.useContext(p);if(!e)throw Error("useTabsContext() must be used within a Tabs component");return e}function m(e){return(0,i.jsx)(p.Provider,{value:e.value,children:e.children})}},4050(e,t,r){r.d(t,{A:()=>a});var i=r(4848),o=r(6540);function n(){return(0,i.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,i.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function a({paths:e,items:t,activeLast:r=!0}){let s=e??t??[];return(0,i.jsxs)("nav",{className:"nav_sYHQ","aria-label":"UI navigation path",children:[(0,i.jsx)("span",{className:"logo_Er0S",children:(0,i.jsx)("img",{src:"/img/favicon.ico",alt:""})}),s.map((e,t)=>{let a=t===s.length-1;return(0,i.jsxs)(o.Fragment,{children:[(0,i.jsx)(n,{}),(0,i.jsx)("span",{className:`item_gLbu${r&&a?" active_Ij2Z":""}`,children:e})]},t)})]})}},2860(e,t,r){r.d(t,{M:()=>g,Nn:()=>b,Yu:()=>x,nl:()=>m});var i=r(4848),o=r(6540),n=r(961),a=r(6370),s=r(4846),l=r(3937),c=r(3941);let d=`
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

Once imported, messages become visible and searchable in the flow monitoring view.`}},u=["flow","flow-trace","flow-trace-importing"];function p({termKey:e,label:t,termClass:r,tooltipMarkdown:f,variant:m="technical"}){(0,l.n9)(),(0,o.useInsertionEffect)(()=>{let e="term-highlight-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=d},[]);let{colorMode:g}=(0,c.G)(),x="dark"===g,b=(0,o.useRef)(null),w=(0,o.useId)(),{visible:v,pinned:j,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,pin:E,onTooltipMouseEnter:T,onTooltipMouseLeave:S}=(0,l.DV)(b),D=(0,l._W)(b,v,{tooltipWidth:300}),[L,I]=(0,o.useState)(e);(0,o.useEffect)(()=>{v||I(e)},[v,e]);let M=u.indexOf(L),N=u[(M-1+u.length)%u.length],z=u[(M+1)%u.length],F=h[L],B=L===e?f:F.tooltipMarkdown,q=v&&(0,n.createPortal)((0,i.jsxs)("div",{id:w,role:"tooltip",className:`invictus-tooltip${j?" invictus-tooltip--pinned":""}`,"data-below":D.below?"true":"false",onMouseEnter:T,onMouseLeave:S,style:{position:"fixed",top:D.below?D.top:"auto",bottom:D.below?"auto":`calc(100vh - ${D.top}px)`,left:D.left,width:300,"--tooltip-accent":x?F.accentDark:F.accent},children:["technical"===m&&(0,i.jsxs)("div",{className:"invictus-tooltip__nav",children:[(0,i.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),I(N)},"aria-label":`Previous: ${h[N].label}`,children:"\u2039"}),(0,i.jsxs)("span",{className:"invictus-tooltip__nav-label",children:[F.label,(0,i.jsxs)("span",{className:"invictus-tooltip__nav-pager",children:[M+1," / ",u.length]})]}),(0,i.jsx)("button",{className:"invictus-tooltip__nav-btn",onClick:e=>{e.stopPropagation(),E(),I(z)},"aria-label":`Next: ${h[z].label}`,children:"\u203A"})]}),(0,i.jsx)(a.oz,{remarkPlugins:[s.A],components:{a:({href:e,children:t})=>{let r=e?.startsWith("#")?e.slice(1):null,o=r?h[r]:null;return o?(0,i.jsx)("button",{className:"invictus-tooltip__term-link",style:{color:x?o.accentDark:o.accent,borderBottomColor:x?o.accentDark:o.accent},onClick:e=>{e.stopPropagation(),E(),I(r)},children:t}):(0,i.jsx)("a",{href:e,children:t})}},children:B}),(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:D.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("span",{ref:b,className:`term-highlight ${r}`,tabIndex:0,role:"button","aria-pressed":j,"aria-describedby":v?w:void 0,onMouseEnter:y,onMouseLeave:k,onFocus:_,onBlur:A,onClick:C,children:[t,(0,i.jsx)("span",{className:"term-highlight__icon","aria-hidden":"true",children:"?"})]}),q]})}let f=`A **Flow** is a named message chain \u{2014} a logical grouping of related **mapping messages** sharing a common integration origin.

Flows are organized in *folders* and defined by a name, optional mappings, and business properties.`;function m({tooltip:e,variant:t="business"}){return(0,i.jsx)(p,{termKey:"flow",label:"flow",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:f)})}function g({tooltip:e,variant:t="business"}){return(0,i.jsx)(p,{termKey:"flow",label:"flows",termClass:"term-highlight--flow",variant:t,tooltipMarkdown:e??("technical"===t?h.flow.tooltipMarkdown:f)})}function x({tooltip:e}){return(0,i.jsx)(p,{termKey:"flow-trace",label:"flow trace",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}function b({tooltip:e}){return(0,i.jsx)(p,{termKey:"flow-trace",label:"flow traces",termClass:"term-highlight--flow-trace",tooltipMarkdown:e??h["flow-trace"].tooltipMarkdown})}},3937(e,t,r){r.d(t,{DV:()=>c,_W:()=>s,n9:()=>a});var i=r(6540);let o="u">typeof window?i.useLayoutEffect:i.useEffect,n=`
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
`;function a(){(0,i.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=n},[])}function s(e,t,{tooltipWidth:r=300,margin:o=12,navHeight:n=60,gap:a=10}={}){let[l,c]=(0,i.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,i.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),i=window.innerWidth,s=t.left+t.width/2-r/2;s=Math.max(o,Math.min(s,i-r-o));let l=Math.min(Math.max(t.left+t.width/2-s,14),r-14),d=t.top-n<70;c({top:d?t.bottom+a:t.top-a,left:s,arrowLeft:l,below:d})},[e,r,o,n,a]);return(0,i.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,i.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),l}let l="invictus-tooltip-activate";function c(e){let[t,r]=(0,i.useState)(!1),[n,a]=(0,i.useState)(!1),[s,c]=(0,i.useState)(!1),[d,h]=(0,i.useState)(!1),u=(0,i.useRef)(null),p=(0,i.useRef)(`tip-${Math.random()}`),f=t||n||s||d,m=(0,i.useCallback)(()=>{clearTimeout(u.current),r(!1),a(!1),c(!1),h(!1)},[]),g=(0,i.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:p.current}}))},[]);return o(()=>{if(!f)return;let e=e=>{e.detail.id!==p.current&&m()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[f,m]),(0,i.useEffect)(()=>{if(!f)return;let t=e=>{"Escape"===e.key&&m()},r=t=>{let r=e.current&&e.current.contains(t.target),i=t.target.closest?.(".invictus-tooltip");r||i||m()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",r)}},[f,m,e]),(0,i.useEffect)(()=>()=>clearTimeout(u.current),[]),{visible:f,pinned:d,onMouseEnter:()=>{clearTimeout(u.current),r(!0),g()},onMouseLeave:()=>{u.current=setTimeout(()=>r(!1),150)},onFocus:()=>{c(!0),g()},onBlur:()=>c(!1),onClick:()=>h(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(u.current),a(!0)},onTooltipMouseLeave:()=>a(!1),pin:(0,i.useCallback)(()=>h(!0),[h])}}},8453(e,t,r){r.d(t,{R:()=>a,x:()=>s});var i=r(6540);let o={},n=i.createContext(o);function a(e){let t=i.useContext(n);return i.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);