"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3216"],{8422(t,e,o){o.r(e),o.d(e,{metadata:()=>r,default:()=>m,frontMatter:()=>l,contentTitle:()=>d,toc:()=>u,assets:()=>c});var r=JSON.parse('{"id":"dashboard/security/auditing","title":"View audits","description":"The audits page provides a list of notable actions happened.","source":"@site/versioned_docs/version-v6.0.0/dashboard/security/04_auditing.mdx","sourceDirName":"dashboard/security","slug":"/dashboard/security/auditing","permalink":"/dashboard/security/auditing","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":4,"frontMatter":{"sidebar_label":"View audits","title":"View audits"},"sidebar":"business_users","previous":{"title":"Access to flows","permalink":"/dashboard/security/roles"},"next":{"title":"Customize Dashboard","permalink":"/dashboard/settings"}}'),n=o(4848),i=o(8453),a=o(3742),s=o(4050);let l={sidebar_label:"View audits",title:"View audits"},d="View audited actions",c={},u=[];function p(t){let e={code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,i.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsx)(e.h1,{id:"view-audited-actions",children:(0,n.jsx)(a.V3,{badge:(0,n.jsx)(a.gw,{}),children:"View audited actions"})})}),"\n",(0,n.jsx)(s.A,{paths:["Audits"]}),"\n",(0,n.jsxs)(e.p,{children:["The audits page provides a list of notable actions happened.\nSearch audits by their ",(0,n.jsx)(e.code,{children:"Chain ID"})," or by categories in the ",(0,n.jsx)(e.code,{children:"Advanced Search"})," pane."]}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"Searching for audits with Chain ID and &#39;Advance pane&#39;",src:o(2465).A+"",width:"1600",height:"816"})})]})}function m(t={}){let{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(p,{...t})}):p(t)}},2465(t,e,o){o.d(e,{A:()=>r});let r=o.p+"assets/images/search-for-audits-b313a7f4868ba2857cfc8331490f5c7e.gif"},3742(t,e,o){o.d(e,{gw:()=>v,yo:()=>w,bP:()=>y,V3:()=>L,IG:()=>k,mw:()=>C,SV:()=>x,bE:()=>g});var r=o(4848),n=o(6540),i=o(961);let a="u">typeof window?n.useLayoutEffect:n.useEffect,s=`
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
`;function l(){(0,n.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=s},[])}function d(t,e,{tooltipWidth:o=300,margin:r=12,navHeight:i=60,gap:a=10}={}){let[s,l]=(0,n.useState)({top:0,left:0,arrowLeft:14,below:!1}),c=(0,n.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),n=window.innerWidth,s=e.left+e.width/2-o/2;s=Math.max(r,Math.min(s,n-o-r));let d=Math.min(Math.max(e.left+e.width/2-s,14),o-14),c=e.top-i<70;l({top:c?e.bottom+a:e.top-a,left:s,arrowLeft:d,below:c})},[t,o,r,i,a]);return(0,n.useLayoutEffect)(()=>{e&&c()},[e,c]),(0,n.useEffect)(()=>{if(e)return window.addEventListener("scroll",c,{passive:!0,capture:!0}),window.addEventListener("resize",c,{passive:!0}),()=>{window.removeEventListener("scroll",c,{capture:!0}),window.removeEventListener("resize",c)}},[e,c]),s}let c="invictus-tooltip-activate";function u(t){let[e,o]=(0,n.useState)(!1),[r,i]=(0,n.useState)(!1),[s,l]=(0,n.useState)(!1),[d,u]=(0,n.useState)(!1),p=(0,n.useRef)(null),m=(0,n.useRef)(`tip-${Math.random()}`),b=e||r||s||d,h=(0,n.useCallback)(()=>{clearTimeout(p.current),o(!1),i(!1),l(!1),u(!1)},[]),f=(0,n.useCallback)(()=>{document.dispatchEvent(new CustomEvent(c,{detail:{id:m.current}}))},[]);return a(()=>{if(!b)return;let t=t=>{t.detail.id!==m.current&&h()};return document.addEventListener(c,t),()=>document.removeEventListener(c,t)},[b,h]),(0,n.useEffect)(()=>{if(!b)return;let e=t=>{"Escape"===t.key&&h()},o=e=>{let o=t.current&&t.current.contains(e.target),r=e.target.closest?.(".invictus-tooltip");o||r||h()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",o),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",o)}},[b,h,t]),(0,n.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:b,pinned:d,onMouseEnter:()=>{clearTimeout(p.current),o(!0),f()},onMouseLeave:()=>{p.current=setTimeout(()=>o(!1),150)},onFocus:()=>{l(!0),f()},onBlur:()=>l(!1),onClick:()=>u(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(p.current),i(!0)},onTooltipMouseLeave:()=>i(!1),pin:(0,n.useCallback)(()=>u(!0),[u])}}var p=o(6370),m=o(4846),b=o(7066),h=o(6188);let f=`
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
`;function v(){return j({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b.gc,{icon:h.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role."})}function g(){return j({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b.gc,{icon:h.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function x(){return j({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b.gc,{icon:h.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function w({version:t,style:e}){return j({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b.gc,{icon:h.yy})," ",t]}),tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:e})}function y({version:t,note:e,style:o}){return j({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b.gc,{icon:h.Dfk})," ",t]}),tooltip:`Feature deprecated since **Invictus ${t}**. ${e}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:o})}function k({variant:t}){return(0,n.useInsertionEffect)(()=>{let t="invictus-row-tint-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=f},[]),(0,r.jsx)("span",{"data-row-tint":t,"aria-hidden":"true",style:{display:"none"}})}function j({title:t,tooltip:e,backgroundColor:o="#b55d00",color:a="white",style:s}){l();let c=(0,n.useRef)(null),b=(0,n.useId)(),{visible:h,pinned:f,onMouseEnter:v,onMouseLeave:g,onFocus:x,onBlur:w,onClick:y,onTooltipMouseEnter:k,onTooltipMouseLeave:E}=u(c),C=d(c,h,{tooltipWidth:260}),L=h&&(0,i.createPortal)((0,r.jsxs)("div",{id:b,role:"tooltip",className:`invictus-tooltip${f?" invictus-tooltip--pinned":""}`,"data-below":C.below?"true":"false",onMouseEnter:k,onMouseLeave:E,style:{position:"fixed",top:C.below?C.top:"auto",bottom:C.below?"auto":`calc(100vh - ${C.top}px)`,left:C.left,width:260,"--tooltip-accent":o},children:["string"==typeof e?(0,r.jsx)(p.oz,{remarkPlugins:[m.A],children:e}):e,(0,r.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:C.arrowLeft}})]}),document.body);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{ref:c,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...s},role:"button","aria-pressed":f,"aria-describedby":h?b:void 0,onMouseEnter:v,onMouseLeave:g,onFocus:x,onBlur:w,onClick:y,children:(0,r.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:o,color:a,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":o,...s},children:t})}),L]})}let E="var(--inv-badge-shared-accent)";function C(){l();let t=(0,n.useRef)(null),e=(0,n.useId)(),{visible:o,pinned:a,onMouseEnter:s,onMouseLeave:c,onFocus:p,onBlur:m,onClick:b,onTooltipMouseEnter:h,onTooltipMouseLeave:f}=u(t),v=d(t,o,{tooltipWidth:260}),g=o&&(0,i.createPortal)((0,r.jsxs)("div",{id:e,role:"tooltip",className:`invictus-tooltip${a?" invictus-tooltip--pinned":""}`,"data-below":v.below?"true":"false",onMouseEnter:h,onMouseLeave:f,style:{position:"fixed",top:v.below?v.top:"auto",bottom:v.below?"auto":`calc(100vh - ${v.top}px)`,left:v.left,width:260,"--tooltip-accent":E},children:["Same for both ",(0,r.jsx)("strong",{children:"Dashboard"})," and ",(0,r.jsx)("strong",{children:"Framework"}),". Can be skipped if done already.",(0,r.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:v.arrowLeft}})]}),document.body);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{ref:t,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},children:(0,r.jsx)("span",{tabIndex:0,role:"button","aria-pressed":a,"aria-describedby":o?e:void 0,onMouseEnter:s,onMouseLeave:c,onFocus:p,onBlur:m,onClick:b,className:"invictus-badge",style:{backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",padding:"2px 6px",borderRadius:"4px",fontSize:"0.9rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":E},children:"Shared"})}),g]})}function L({children:t,badge:e,variant:o="underline"}){let i=(0,n.useRef)(null),[a,s]=(0,n.useState)();(0,n.useEffect)(()=>{let t=i.current;if(!t)return;let e=()=>{let e=t.querySelector(".invictus-badge");if(!e)return!1;let{backgroundColor:o}=window.getComputedStyle(e);return!!o&&"transparent"!==o&&"rgba(0, 0, 0, 0)"!==o&&(s(o),!0)};if(e())return;let o=new MutationObserver(()=>{e()&&o.disconnect()});return o.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>o.disconnect()},[e]);let l="background"==o?((t,e=.1)=>{if(!t)return;let o=Math.round(100*e);return`color-mix(in srgb, ${t} ${o}%, transparent)`})(a,.1):void 0;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:a,backgroundColor:l,padding:"0.25rem"},children:t}),(0,r.jsx)("span",{ref:i,children:e})]})}},4050(t,e,o){o.d(e,{A:()=>a});var r=o(4848);o(6540);let n="listItem_qpim";function i(){return(0,r.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,r.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,r.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function a({paths:t,items:e,activeLast:o=!0}){let s=t??e??[];return(0,r.jsx)("nav",{className:"nav_sYHQ","aria-label":"Breadcrumb",children:(0,r.jsxs)("ol",{className:"list_yxgx",children:[(0,r.jsxs)("li",{className:n,children:[(0,r.jsx)("span",{className:"logo_Er0S",children:(0,r.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,r.jsx)(i,{})]}),s.map((t,e)=>{let a=e===s.length-1,l=o&&a;return(0,r.jsxs)("li",{className:n,children:[e>0&&(0,r.jsx)(i,{}),(0,r.jsx)("span",{className:`item_gLbu${l?" active_Ij2Z":""}`,...l?{"aria-current":"page"}:{},children:t})]},e)})]})})}},8453(t,e,o){o.d(e,{R:()=>a,x:()=>s});var r=o(6540);let n={},i=r.createContext(n);function a(t){let e=r.useContext(i);return r.useMemo(function(){return"function"==typeof t?t(e):{...e,...t}},[e,t])}function s(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(n):t.components||n:a(t.components),r.createElement(i.Provider,{value:e},t.children)}}}]);