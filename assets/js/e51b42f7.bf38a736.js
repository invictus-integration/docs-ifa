"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3216"],{8422(t,e,r){r.r(e),r.d(e,{metadata:()=>o,default:()=>m,frontMatter:()=>l,contentTitle:()=>d,toc:()=>u,assets:()=>c});var o=JSON.parse('{"id":"dashboard/security/auditing","title":"View audits","description":"The audits page provides a list of notable actions happened.","source":"@site/versioned_docs/version-v6.0.0/dashboard/security/04_auditing.mdx","sourceDirName":"dashboard/security","slug":"/dashboard/security/auditing","permalink":"/dashboard/security/auditing","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":4,"frontMatter":{"sidebar_label":"View audits","title":"View audits"},"sidebar":"business_users","previous":{"title":"Access to flows","permalink":"/dashboard/security/roles"},"next":{"title":"Customize Dashboard","permalink":"/dashboard/settings"}}'),n=r(4848),i=r(8453),a=r(3742),s=r(9471);let l={sidebar_label:"View audits",title:"View audits"},d="View audited actions",c={},u=[];function p(t){let e={code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,i.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsx)(e.h1,{id:"view-audited-actions",children:(0,n.jsx)(a.V3,{badge:(0,n.jsx)(a.gw,{}),children:"View audited actions"})})}),"\n",(0,n.jsx)(s.A,{paths:["Audits"]}),"\n",(0,n.jsxs)(e.p,{children:["The audits page provides a list of notable actions happened.\nSearch audits by their ",(0,n.jsx)(e.code,{children:"Chain ID"})," or by categories in the ",(0,n.jsx)(e.code,{children:"Advanced Search"})," pane."]}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"Searching for audits with Chain ID and &#39;Advance pane&#39;",src:r(2465).A+"",width:"1600",height:"816"})})]})}function m(t={}){let{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(p,{...t})}):p(t)}},2465(t,e,r){r.d(e,{A:()=>o});let o=r.p+"assets/images/search-for-audits-b313a7f4868ba2857cfc8331490f5c7e.gif"},3742(t,e,r){r.d(e,{gw:()=>h,yo:()=>g,bP:()=>v,V3:()=>j,IG:()=>x,mw:()=>k,SV:()=>f,bE:()=>b});var o=r(4848),n=r(6540),i=r(961);let a="u">typeof window?n.useLayoutEffect:n.useEffect,s=`
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
`,l="invictus-tooltip-activate";var d=r(6370),c=r(4846),u=r(7066),p=r(6188);let m=`
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
`;function h(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u.gc,{icon:p.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function b(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u.gc,{icon:p.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow.",backgroundColor:"#b55d00",color:"white"})}function f(){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u.gc,{icon:p.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function g({version:t,style:e}){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u.gc,{icon:p.yy})," ",t]}),tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:e})}function v({version:t,note:e,style:r}){return w({title:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(u.gc,{icon:p.Dfk})," ",t]}),tooltip:`Feature deprecated since **Invictus ${t}**. ${e}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:r})}function x({variant:t}){return(0,n.useInsertionEffect)(()=>{let t="invictus-row-tint-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=m},[]),(0,o.jsx)("span",{"data-row-tint":t,"aria-hidden":"true",style:{display:"none"}})}function w({title:t,tooltip:e,backgroundColor:r,color:u,accentColor:p,style:m}){(0,n.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=s},[]);let h=(0,n.useRef)(null),{tooltipId:b,visible:f,pinned:g,onMouseEnter:v,onMouseLeave:x,onFocus:y,onBlur:k,onClick:j,tooltipEl:C}=function({badgeRef:t,tooltipContent:e,accentColor:r}){let s=(0,n.useId)(),{visible:d,pinned:c,onMouseEnter:u,onMouseLeave:p,onFocus:m,onBlur:h,onClick:b,onTooltipMouseEnter:f,onTooltipMouseLeave:g}=function(t){let[e,r]=(0,n.useState)(!1),[o,i]=(0,n.useState)(!1),[s,d]=(0,n.useState)(!1),[c,u]=(0,n.useState)(!1),p=(0,n.useRef)(null),m=(0,n.useRef)(`tip-${Math.random()}`),h=e||o||s||c,b=(0,n.useCallback)(()=>{clearTimeout(p.current),r(!1),i(!1),d(!1),u(!1)},[]),f=(0,n.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:m.current}}))},[]);return a(()=>{if(!h)return;let t=t=>{t.detail.id!==m.current&&b()};return document.addEventListener(l,t),()=>document.removeEventListener(l,t)},[h,b]),(0,n.useEffect)(()=>{if(!h)return;let e=t=>{"Escape"===t.key&&b()},r=e=>{let r=t.current&&t.current.contains(e.target),o=e.target.closest?.(".invictus-tooltip");r||o||b()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",r)}},[h,b,t]),(0,n.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:h,pinned:c,onMouseEnter:()=>{clearTimeout(p.current),r(!0),f()},onMouseLeave:()=>{p.current=setTimeout(()=>r(!1),150)},onFocus:()=>{d(!0),f()},onBlur:()=>d(!1),onClick:()=>u(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(p.current),i(!0)},onTooltipMouseLeave:()=>i(!1),pin:(0,n.useCallback)(()=>u(!0),[u])}}(t),v=function(t,e,{tooltipWidth:r=300,margin:o=12,navHeight:i=60,gap:a=10}={}){let[s,l]=(0,n.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,n.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),n=window.innerWidth,s=e.left+e.width/2-r/2;s=Math.max(o,Math.min(s,n-r-o));let d=Math.min(Math.max(e.left+e.width/2-s,14),r-14),c=e.top-i<70;l({top:c?e.bottom+a:e.top-a,left:s,arrowLeft:d,below:c})},[t,r,o,i,a]);return(0,n.useLayoutEffect)(()=>{e&&d()},[e,d]),(0,n.useEffect)(()=>{if(e)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[e,d]),s}(t,d,{tooltipWidth:260}),x=d&&(0,i.createPortal)((0,o.jsxs)("div",{id:s,role:"tooltip",className:`invictus-tooltip${c?" invictus-tooltip--pinned":""}`,"data-below":v.below?"true":"false",onMouseEnter:f,onMouseLeave:g,style:{position:"fixed",top:v.below?v.top:"auto",bottom:v.below?"auto":`calc(100vh - ${v.top}px)`,left:v.left,width:260,"--tooltip-accent":r},children:[e,(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:v.arrowLeft}})]}),document.body);return{tooltipId:s,visible:d,pinned:c,onMouseEnter:u,onMouseLeave:p,onFocus:m,onBlur:h,onClick:b,tooltipEl:x}}({badgeRef:h,tooltipContent:"string"==typeof e?(0,o.jsx)(d.oz,{remarkPlugins:[c.A],children:e}):e,accentColor:p??r});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{ref:h,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...m},role:"button","aria-pressed":g,"aria-describedby":f?b:void 0,onMouseEnter:v,onMouseLeave:x,onFocus:y,onBlur:k,onClick:j,children:(0,o.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:r,color:u,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":p??r,...m},children:t})}),C]})}let y=(0,o.jsxs)(o.Fragment,{children:["Same for both ",(0,o.jsx)("strong",{children:"Dashboard"})," and ",(0,o.jsx)("strong",{children:"Framework"}),". Can be skipped if done already."]});function k(){return w({title:"Shared",tooltip:y,backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",accentColor:"var(--inv-badge-shared-text)"})}function j({children:t,badge:e,variant:r="underline"}){let i=(0,n.useRef)(null),[a,s]=(0,n.useState)();(0,n.useEffect)(()=>{let t=i.current;if(!t)return;let e=()=>{let e=t.querySelector(".invictus-badge");if(!e)return!1;let r=window.getComputedStyle(e),o=r.getPropertyValue("--badge-accent").trim()||r.backgroundColor;return!!o&&"transparent"!==o&&"rgba(0, 0, 0, 0)"!==o&&(s(o),!0)};if(e())return;let r=new MutationObserver(()=>{e()&&r.disconnect()});return r.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>r.disconnect()},[e]);let l="background"==r?((t,e=.1)=>{if(!t)return;let r=Math.round(100*e);return`color-mix(in srgb, ${t} ${r}%, transparent)`})(a,.1):void 0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:a,backgroundColor:l,padding:"0.25rem"},children:t}),(0,o.jsx)("span",{ref:i,children:e})]})}},9471(t,e,r){r.d(e,{A:()=>a});var o=r(4848);r(6540);let n="listItem_IJSn";function i(){return(0,o.jsx)("span",{className:"separator_QEhJ","aria-hidden":"true",children:(0,o.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,o.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function a({paths:t,items:e,activeLast:r=!0}){let s=t??e??[];return(0,o.jsx)("nav",{className:"nav_ToMB","aria-label":"Breadcrumb",children:(0,o.jsxs)("ol",{className:"list_z7Ii",children:[(0,o.jsxs)("li",{className:n,children:[(0,o.jsx)("span",{className:"logo_lB7M",children:(0,o.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,o.jsx)(i,{})]}),s.map((t,e)=>{let a=e===s.length-1,l=r&&a;return(0,o.jsxs)("li",{className:n,children:[e>0&&(0,o.jsx)(i,{}),(0,o.jsx)("span",{className:`item_C4Vo${l?" active_ERe8":""}`,...l?{"aria-current":"page"}:{},children:t})]},e)})]})})}},8453(t,e,r){r.d(e,{R:()=>a,x:()=>s});var o=r(6540);let n={},i=o.createContext(n);function a(t){let e=o.useContext(i);return o.useMemo(function(){return"function"==typeof t?t(e):{...e,...t}},[e,t])}function s(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(n):t.components||n:a(t.components),o.createElement(i.Provider,{value:e},t.children)}}}]);