"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3216"],{8422(t,e,o){o.r(e),o.d(e,{metadata:()=>r,default:()=>m,frontMatter:()=>l,contentTitle:()=>d,toc:()=>u,assets:()=>c});var r=JSON.parse('{"id":"dashboard/security/auditing","title":"View audits","description":"The audits page provides a list of notable actions happened.","source":"@site/versioned_docs/version-v6.0.0/dashboard/security/04_auditing.mdx","sourceDirName":"dashboard/security","slug":"/dashboard/security/auditing","permalink":"/dashboard/security/auditing","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":4,"frontMatter":{"sidebar_label":"View audits","title":"View audits"},"sidebar":"business_users","previous":{"title":"Access to flows","permalink":"/dashboard/security/roles"},"next":{"title":"Customize Dashboard","permalink":"/dashboard/settings"}}'),n=o(4848),i=o(8453),a=o(8246),s=o(9471);let l={sidebar_label:"View audits",title:"View audits"},d="View audited actions",c={},u=[];function p(t){let e={code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,i.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsx)(e.h1,{id:"view-audited-actions",children:(0,n.jsx)(a.V3,{badge:(0,n.jsx)(a.gw,{}),children:"View audited actions"})})}),"\n",(0,n.jsx)(s.A,{paths:["Audits"],summary:"From the Dashboard's main navigation, focus on the **Audits** tab"}),"\n",(0,n.jsxs)(e.p,{children:["The audits page provides a list of notable actions happened.\nSearch audits by their ",(0,n.jsx)(e.code,{children:"Chain ID"})," or by categories in the ",(0,n.jsx)(e.code,{children:"Advanced Search"})," pane."]}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"Searching for audits with Chain ID and &#39;Advance pane&#39;",src:o(2465).A+"",width:"1600",height:"816"})})]})}function m(t={}){let{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(p,{...t})}):p(t)}},2465(t,e,o){o.d(e,{A:()=>r});let r=o.p+"assets/images/search-for-audits-b313a7f4868ba2857cfc8331490f5c7e.gif"},8246(t,e,o){o.d(e,{IG:()=>v,SV:()=>h,V3:()=>y,bE:()=>m,bP:()=>f,gw:()=>p,mw:()=>w,yo:()=>b});var r=o(4848),n=o(6540),i=o(961),a=o(3937),s=o(6370),l=o(4846),d=o(7066),c=o(6188);let u=`
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
`;function p(){return g({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.gc,{icon:c.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function m(){return g({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.gc,{icon:c.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow.",backgroundColor:"#b55d00",color:"white"})}function h(){return g({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.gc,{icon:c.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role.",backgroundColor:"#b55d00",color:"white"})}function b({version:t,style:e}){return g({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.gc,{icon:c.yy})," ",t]}),tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:e})}function f({version:t,note:e,style:o}){return g({title:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.gc,{icon:c.Dfk})," ",t]}),tooltip:`Feature deprecated since **Invictus ${t}**. ${e}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:o})}function v({variant:t}){return(0,n.useInsertionEffect)(()=>{let t="invictus-row-tint-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=u},[]),(0,r.jsx)("span",{"data-row-tint":t,"aria-hidden":"true",style:{display:"none"}})}function g({title:t,tooltip:e,backgroundColor:o,color:d,accentColor:c,style:u}){(0,a.n9)();let p=(0,n.useRef)(null),{descriptionId:m,descriptionEl:h,visible:b,pinned:f,onMouseEnter:v,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,tooltipEl:j}=function({badgeRef:t,tooltipContent:e,accentColor:o}){let s=(0,n.useId)(),{visible:l,pinned:d,onMouseEnter:c,onMouseLeave:u,onFocus:p,onBlur:m,onClick:h,onTooltipMouseEnter:b,onTooltipMouseLeave:f}=(0,a.DV)(t),v=(0,a._W)(t,l,{tooltipWidth:260}),g=(0,r.jsx)("span",{id:s,className:"invictus-sr-only",children:e}),x=l&&(0,i.createPortal)((0,r.jsxs)("div",{role:"tooltip",className:`invictus-tooltip${d?" invictus-tooltip--pinned":""}`,"data-below":v.below?"true":"false",onMouseEnter:b,onMouseLeave:f,style:{position:"fixed",top:v.below?v.top:"auto",bottom:v.below?"auto":`calc(100vh - ${v.top}px)`,left:v.left,width:260,"--tooltip-accent":o},children:[e,(0,r.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:v.arrowLeft}})]}),document.body);return{descriptionId:s,descriptionEl:g,visible:l,pinned:d,onMouseEnter:c,onMouseLeave:u,onFocus:p,onBlur:m,onClick:h,tooltipEl:x}}({badgeRef:p,tooltipContent:"string"==typeof e?(0,r.jsx)(s.oz,{remarkPlugins:[l.A],children:e}):e,accentColor:c??o});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{ref:p,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...u},role:"button","aria-pressed":f,"aria-describedby":m,onMouseEnter:v,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,children:(0,r.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:o,color:d,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":c??o,...u},children:t})}),h,j]})}let x=(0,r.jsxs)(r.Fragment,{children:["Same for both ",(0,r.jsx)("strong",{children:"Dashboard"})," and ",(0,r.jsx)("strong",{children:"Framework"}),". Can be skipped if done already."]});function w(){return g({title:"Shared",tooltip:x,backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",accentColor:"var(--inv-badge-shared-text)"})}function y({children:t,badge:e,variant:o="underline"}){let i=(0,n.useRef)(null),[a,s]=(0,n.useState)();(0,n.useEffect)(()=>{let t=i.current;if(!t)return;let e=()=>{let e=t.querySelector(".invictus-badge");if(!e)return!1;let o=window.getComputedStyle(e),r=o.getPropertyValue("--badge-accent").trim()||o.backgroundColor;return!!r&&"transparent"!==r&&"rgba(0, 0, 0, 0)"!==r&&(s(r),!0)};if(e())return;let o=new MutationObserver(()=>{e()&&o.disconnect()});return o.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>o.disconnect()},[e]);let l="background"==o?((t,e=.1)=>{if(!t)return;let o=Math.round(100*e);return`color-mix(in srgb, ${t} ${o}%, transparent)`})(a,.1):void 0;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:a,backgroundColor:l,padding:"0.25rem"},children:t}),(0,r.jsx)("span",{ref:i,children:e})]})}},9471(t,e,o){o.d(e,{A:()=>c});var r=o(4848),n=o(6540),i=o(961),a=o(6370),s=o(4846),l=o(3937);function d(){return(0,r.jsx)("span",{className:"separator_QEhJ","aria-hidden":"true",children:(0,r.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,r.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function c({paths:t,items:e,activeLast:o=!0,summary:u}){let p=t??e??[],m=(0,n.useId)(),h=(0,n.useRef)(null),b=(0,r.jsx)(a.oz,{remarkPlugins:[s.A],children:u});(0,l.n9)();let{visible:f,pinned:v,onMouseEnter:g,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,onTooltipMouseEnter:j,onTooltipMouseLeave:C}=(0,l.DV)(h),E=(0,l._W)(h,f,{tooltipWidth:280}),L=f&&(0,i.createPortal)((0,r.jsxs)("div",{role:"tooltip",className:`invictus-tooltip${v?" invictus-tooltip--pinned":""}`,"data-below":E.below?"true":"false",onMouseEnter:j,onMouseLeave:C,style:{position:"fixed",top:E.below?E.top:"auto",bottom:E.below?"auto":`calc(100vh - ${E.top}px)`,left:E.left,width:280},children:[b,(0,r.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:E.arrowLeft}})]}),document.body);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{id:m,className:"srOnly_s7Ks",children:b}),(0,r.jsxs)("span",{ref:h,className:"nav_ToMB",tabIndex:0,role:"button","aria-pressed":v,"aria-describedby":m,onMouseEnter:g,onMouseLeave:x,onFocus:w,onBlur:y,onClick:k,children:[(0,r.jsx)("span",{className:"logo_lB7M",children:(0,r.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,r.jsx)(d,{}),p.map((t,e)=>{let i=e===p.length-1;return(0,r.jsxs)(n.Fragment,{children:[e>0&&(0,r.jsx)(d,{}),(0,r.jsx)("span",{className:`item_C4Vo${o&&i?" active_ERe8":""}`,children:t})]},e)})]}),L]})}},3937(t,e,o){o.d(e,{DV:()=>d,_W:()=>s,n9:()=>a});var r=o(6540);let n="u">typeof window?r.useLayoutEffect:r.useEffect,i=`
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

/* Visually-hidden but screen-reader-accessible content. Used to keep a
   tooltip's description permanently available via aria-describedby,
   independent of whether the visual tooltip is currently shown. */
.invictus-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;function a(){(0,r.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=i},[])}function s(t,e,{tooltipWidth:o=300,margin:n=12,navHeight:i=60,gap:a=10}={}){let[l,d]=(0,r.useState)({top:0,left:0,arrowLeft:14,below:!1}),c=(0,r.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),r=window.innerWidth,s=e.left+e.width/2-o/2;s=Math.max(n,Math.min(s,r-o-n));let l=Math.min(Math.max(e.left+e.width/2-s,14),o-14),c=e.top-i<70;d({top:c?e.bottom+a:e.top-a,left:s,arrowLeft:l,below:c})},[t,o,n,i,a]);return(0,r.useLayoutEffect)(()=>{e&&c()},[e,c]),(0,r.useEffect)(()=>{if(e)return window.addEventListener("scroll",c,{passive:!0,capture:!0}),window.addEventListener("resize",c,{passive:!0}),()=>{window.removeEventListener("scroll",c,{capture:!0}),window.removeEventListener("resize",c)}},[e,c]),l}let l="invictus-tooltip-activate";function d(t){let[e,o]=(0,r.useState)(!1),[i,a]=(0,r.useState)(!1),[s,d]=(0,r.useState)(!1),[c,u]=(0,r.useState)(!1),p=(0,r.useRef)(null),m=(0,r.useRef)(`tip-${Math.random()}`),h=e||i||s||c,b=(0,r.useCallback)(()=>{clearTimeout(p.current),o(!1),a(!1),d(!1),u(!1)},[]),f=(0,r.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:m.current}}))},[]);return n(()=>{if(!h)return;let t=t=>{t.detail.id!==m.current&&b()};return document.addEventListener(l,t),()=>document.removeEventListener(l,t)},[h,b]),(0,r.useEffect)(()=>{if(!h)return;let e=t=>{"Escape"===t.key&&b()},o=e=>{let o=t.current&&t.current.contains(e.target),r=e.target.closest?.(".invictus-tooltip");o||r||b()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",o),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",o)}},[h,b,t]),(0,r.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:h,pinned:c,onMouseEnter:()=>{clearTimeout(p.current),o(!0),f()},onMouseLeave:()=>{p.current=setTimeout(()=>o(!1),150)},onFocus:()=>{d(!0),f()},onBlur:()=>d(!1),onClick:()=>u(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(p.current),a(!0)},onTooltipMouseLeave:()=>a(!1),pin:(0,r.useCallback)(()=>u(!0),[u])}}},8453(t,e,o){o.d(e,{R:()=>a,x:()=>s});var r=o(6540);let n={},i=r.createContext(n);function a(t){let e=r.useContext(i);return r.useMemo(function(){return"function"==typeof t?t(e):{...e,...t}},[e,t])}function s(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(n):t.components||n:a(t.components),r.createElement(i.Provider,{value:e},t.children)}}}]);