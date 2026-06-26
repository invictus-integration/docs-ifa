"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3216"],{8422(e,t,o){o.r(t),o.d(t,{metadata:()=>i,default:()=>h,frontMatter:()=>l,contentTitle:()=>c,toc:()=>u,assets:()=>d});var i=JSON.parse('{"id":"dashboard/security/auditing","title":"View audits","description":"The audits page provides a list of mentionable actions happened throughout the system. Audits can be search specifically by their Chain ID, or by certain categories available in the [Advanced Search] pane:","source":"@site/versioned_docs/version-v6.0.0/dashboard/security/04_auditing.mdx","sourceDirName":"dashboard/security","slug":"/dashboard/security/auditing","permalink":"/dashboard/security/auditing","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":4,"frontMatter":{"sidebar_label":"View audits","title":"View audits"},"sidebar":"business_users","previous":{"title":"Access to flows","permalink":"/dashboard/security/roles"},"next":{"title":"Customize Dashboard","permalink":"/dashboard/settings"}}'),n=o(4848),r=o(8453),a=o(3742),s=o(4050);let l={sidebar_label:"View audits",title:"View audits"},c="View audited actions ",d={},u=[];function p(e){let t={code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsxs)(t.h1,{id:"view-audited-actions-",children:["View audited actions ",(0,n.jsx)(a.gw,{})]})}),"\n",(0,n.jsx)(s.A,{paths:["Audits"]}),"\n",(0,n.jsxs)(t.p,{children:["The audits page provides a list of mentionable actions happened throughout the system. Audits can be search specifically by their ",(0,n.jsx)(t.code,{children:"Chain ID"}),", or by certain categories available in the ",(0,n.jsx)(t.code,{children:"[Advanced Search]"})," pane:"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Searching for audits with Chain ID and &#39;Advance pane&#39;",src:o(2465).A+"",width:"1600",height:"816"})})]})}function h(e={}){let{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},2465(e,t,o){o.d(t,{A:()=>i});let i=o.p+"assets/images/search-for-audits-b313a7f4868ba2857cfc8331490f5c7e.gif"},3742(e,t,o){o.d(t,{SV:()=>b,gw:()=>m,yo:()=>v,bP:()=>x,bE:()=>f,mw:()=>y});var i=o(4848),n=o(6540),r=o(961);let a="u">typeof window?n.useLayoutEffect:n.useEffect,s=`
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
`;function l(){(0,n.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=s},[])}function c(e,t,{tooltipWidth:o=300,margin:i=12,navHeight:r=60,gap:a=10}={}){let[s,l]=(0,n.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,n.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),n=window.innerWidth,s=t.left+t.width/2-o/2;s=Math.max(i,Math.min(s,n-o-i));let c=Math.min(Math.max(t.left+t.width/2-s,14),o-14),d=t.top-r<70;l({top:d?t.bottom+a:t.top-a,left:s,arrowLeft:c,below:d})},[e,o,i,r,a]);return(0,n.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,n.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),s}let d="invictus-tooltip-activate";function u(e){let[t,o]=(0,n.useState)(!1),[i,r]=(0,n.useState)(!1),[s,l]=(0,n.useState)(!1),[c,u]=(0,n.useState)(!1),p=(0,n.useRef)(null),h=(0,n.useRef)(`tip-${Math.random()}`),m=t||i||s||c,f=(0,n.useCallback)(()=>{clearTimeout(p.current),o(!1),r(!1),l(!1),u(!1)},[]),b=(0,n.useCallback)(()=>{document.dispatchEvent(new CustomEvent(d,{detail:{id:h.current}}))},[]);return a(()=>{if(!m)return;let e=e=>{e.detail.id!==h.current&&f()};return document.addEventListener(d,e),()=>document.removeEventListener(d,e)},[m,f]),(0,n.useEffect)(()=>{if(!m)return;let t=e=>{"Escape"===e.key&&f()},o=t=>{let o=e.current&&e.current.contains(t.target),i=t.target.closest?.(".invictus-tooltip");o||i||f()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",o),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",o)}},[m,f,e]),(0,n.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:m,pinned:c,onMouseEnter:()=>{clearTimeout(p.current),o(!0),b()},onMouseLeave:()=>{p.current=setTimeout(()=>o(!1),150)},onFocus:()=>{l(!0),b()},onBlur:()=>l(!1),onClick:()=>u(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(p.current),r(!0)},onTooltipMouseLeave:()=>r(!1),pin:(0,n.useCallback)(()=>u(!0),[u])}}var p=o(6370),h=o(4846);function m(){return g({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function f(){return g({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function b(){return g({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function v({version:e,style:t}){return g({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#059669",color:"white",style:t})}function x({version:e,note:t,style:o}){return g({title:`Deprecated since ${e}`,tooltip:`Feature deprecated since **Invictus ${e}**. ${t}`,backgroundColor:"#b55d00",color:"white",style:o})}function g({title:e,tooltip:t,backgroundColor:o="#b55d00",color:a="white",style:s}){l();let d=(0,n.useRef)(null),m=(0,n.useId)(),{visible:f,pinned:b,onMouseEnter:v,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,onTooltipMouseEnter:j,onTooltipMouseLeave:E}=u(d),L=c(d,f,{tooltipWidth:260}),C=f&&(0,r.createPortal)((0,i.jsxs)("div",{id:m,role:"tooltip",className:`invictus-tooltip${b?" invictus-tooltip--pinned":""}`,"data-below":L.below?"true":"false",onMouseEnter:j,onMouseLeave:E,style:{position:"fixed",top:L.below?L.top:"auto",bottom:L.below?"auto":`calc(100vh - ${L.top}px)`,left:L.left,width:260,"--tooltip-accent":o},children:["string"==typeof t?(0,i.jsx)(p.oz,{remarkPlugins:[h.A],children:t}):t,(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:L.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold",...s},role:"button","aria-pressed":b,"aria-describedby":f?m:void 0,onMouseEnter:v,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,children:(0,i.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:o,color:a,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":o,...s},children:e})}),C]})}let w="#0b6369";function y(){l();let e=(0,n.useRef)(null),t=(0,n.useId)(),{visible:o,pinned:a,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:h,onClick:m,onTooltipMouseEnter:f,onTooltipMouseLeave:b}=u(e),v=c(e,o,{tooltipWidth:260}),x=o&&(0,r.createPortal)((0,i.jsxs)("div",{id:t,role:"tooltip",className:`invictus-tooltip${a?" invictus-tooltip--pinned":""}`,"data-below":v.below?"true":"false",onMouseEnter:f,onMouseLeave:b,style:{position:"fixed",top:v.below?v.top:"auto",bottom:v.below?"auto":`calc(100vh - ${v.top}px)`,left:v.left,width:260,"--tooltip-accent":w},children:["Same for both ",(0,i.jsx)("strong",{children:"Dashboard"})," and ",(0,i.jsx)("strong",{children:"Framework"}),". Can be skipped if done already.",(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:v.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{ref:e,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},children:(0,i.jsx)("span",{tabIndex:0,role:"button","aria-pressed":a,"aria-describedby":o?t:void 0,onMouseEnter:s,onMouseLeave:d,onFocus:p,onBlur:h,onClick:m,className:"invictus-badge",style:{backgroundColor:"#e0f7f7",color:w,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",outline:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":w},children:"Shared"})}),x]})}},4050(e,t,o){o.d(t,{A:()=>a});var i=o(4848);o(6540);let n="listItem_qpim";function r(){return(0,i.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,i.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function a({paths:e,items:t,activeLast:o=!0}){let s=e??t??[];return(0,i.jsx)("nav",{className:"nav_sYHQ","aria-label":"Breadcrumb",children:(0,i.jsxs)("ol",{className:"list_yxgx",children:[(0,i.jsxs)("li",{className:n,children:[(0,i.jsx)("span",{className:"logo_Er0S",children:(0,i.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,i.jsx)(r,{})]}),s.map((e,t)=>{let a=t===s.length-1,l=o&&a;return(0,i.jsxs)("li",{className:n,children:[t>0&&(0,i.jsx)(r,{}),(0,i.jsx)("span",{className:`item_gLbu${l?" active_Ij2Z":""}`,...l?{"aria-current":"page"}:{},children:e})]},t)})]})})}},8453(e,t,o){o.d(t,{R:()=>a,x:()=>s});var i=o(6540);let n={},r=i.createContext(n);function a(e){let t=i.useContext(r);return i.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);