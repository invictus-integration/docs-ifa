"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["3216"],{8422(t,e,i){i.r(e),i.d(e,{metadata:()=>o,default:()=>p,frontMatter:()=>s,contentTitle:()=>l,toc:()=>d,assets:()=>c});var o=JSON.parse('{"id":"dashboard/security/auditing","title":"View audited actions <OnlyAdminsBadge/>","description":"logo","source":"@site/versioned_docs/version-v6.0.0/dashboard/security/04_auditing.mdx","sourceDirName":"dashboard/security","slug":"/dashboard/security/auditing","permalink":"/dashboard/security/auditing","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":4,"frontMatter":{"sidebar_label":"View audits"},"sidebar":"business_users","previous":{"title":"Access to flows","permalink":"/dashboard/security/roles"},"next":{"title":"Customize Dashboard","permalink":"/dashboard/settings"}}'),n=i(4848),r=i(8453),a=i(2437);let s={sidebar_label:"View audits"},l="View audited actions ",c={},d=[];function u(t){let e={code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,r.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsxs)(e.h1,{id:"view-audited-actions-",children:["View audited actions ",(0,n.jsx)(a.gw,{})]})}),"\n",(0,n.jsxs)("nav",{class:"custom-breadcrumb",children:[(0,n.jsx)("span",{class:"breadcrumb-item no-padding",children:(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"logo",src:i(7129).A+"",width:"48",height:"48"})})}),(0,n.jsx)("span",{children:"\u203A"}),(0,n.jsx)("span",{class:"breadcrumb-item active",children:"Audits"})]}),"\n",(0,n.jsxs)(e.p,{children:["The audits page provides a list of mentionable actions happened throughout the system. Audits can be search specifically by their ",(0,n.jsx)(e.code,{children:"Chain ID"}),", or by certain categories available in the ",(0,n.jsx)(e.code,{children:"[Advanced Search]"})," pane:"]}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"Searching for audits with Chain ID and &#39;Advance pane&#39;",src:i(2465).A+"",width:"1600",height:"816"})})]})}function p(t={}){let{wrapper:e}={...(0,r.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(u,{...t})}):u(t)}},2465(t,e,i){i.d(e,{A:()=>o});let o=i.p+"assets/images/search-for-audits-b313a7f4868ba2857cfc8331490f5c7e.gif"},7129(t,e,i){i.d(e,{A:()=>o});let o=i.p+"assets/images/favicon-15a04d88a4bef273fbd1301921d1cd51.ico"},2437(t,e,i){i.d(e,{SV:()=>u,bE:()=>d,gw:()=>c,yo:()=>p});var o=i(4848),n=i(6540),r=i(961),a=i(6370),s=i(4846),l=i(3937);function c(){return m({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return m({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function u(){return m({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function p({version:t}){return m({title:`New since ${t}`,tooltip:`Feature included since **Invictus ${t}**.`,backgroundColor:"#008800",color:"white"})}function m({title:t,tooltip:e,backgroundColor:i="#b55d00",color:c="white"}){(0,l.n9)();let d=(0,n.useRef)(null),u=(0,n.useId)(),{visible:p,pinned:f,onMouseEnter:h,onMouseLeave:b,onFocus:v,onBlur:g,onClick:x,onTooltipMouseEnter:w,onTooltipMouseLeave:y}=(0,l.DV)(d),k=(0,l._W)(d,p,{tooltipWidth:260}),E=p&&(0,r.createPortal)((0,o.jsxs)("div",{id:u,role:"tooltip",className:`invictus-tooltip${f?" invictus-tooltip--pinned":""}`,"data-below":k.below?"true":"false",onMouseEnter:w,onMouseLeave:y,style:{position:"fixed",top:k.below?k.top:"auto",bottom:k.below?"auto":`calc(100vh - ${k.top}px)`,left:k.left,width:260,"--tooltip-accent":i},children:["string"==typeof e?(0,o.jsx)(a.oz,{remarkPlugins:[s.A],children:e}):e,(0,o.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:k.arrowLeft}})]}),document.body);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":f,"aria-describedby":p?u:void 0,onMouseEnter:h,onMouseLeave:b,onFocus:v,onBlur:g,onClick:x,children:(0,o.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:i,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":i},children:t})}),E]})}},3937(t,e,i){i.d(e,{DV:()=>c,_W:()=>s,n9:()=>a});var o=i(6540);let n="u">typeof window?o.useLayoutEffect:o.useEffect,r=`
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
`;function a(){(0,o.useInsertionEffect)(()=>{let t="invictus-tooltip-styles",e=document.getElementById(t);e||((e=document.createElement("style")).id=t,document.head.appendChild(e)),e.textContent=r},[])}function s(t,e,{tooltipWidth:i=300,margin:n=12,navHeight:r=60,gap:a=10}={}){let[l,c]=(0,o.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,o.useCallback)(()=>{if(!t.current)return;let e=t.current.getBoundingClientRect(),o=window.innerWidth,s=e.left+e.width/2-i/2;s=Math.max(n,Math.min(s,o-i-n));let l=Math.min(Math.max(e.left+e.width/2-s,14),i-14),d=e.top-r<70;c({top:d?e.bottom+a:e.top-a,left:s,arrowLeft:l,below:d})},[t,i,n,r,a]);return(0,o.useLayoutEffect)(()=>{e&&d()},[e,d]),(0,o.useEffect)(()=>{if(e)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[e,d]),l}let l="invictus-tooltip-activate";function c(t){let[e,i]=(0,o.useState)(!1),[r,a]=(0,o.useState)(!1),[s,c]=(0,o.useState)(!1),[d,u]=(0,o.useState)(!1),p=(0,o.useRef)(null),m=(0,o.useRef)(`tip-${Math.random()}`),f=e||r||s||d,h=(0,o.useCallback)(()=>{clearTimeout(p.current),i(!1),a(!1),c(!1),u(!1)},[]),b=(0,o.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:m.current}}))},[]);return n(()=>{if(!f)return;let t=t=>{t.detail.id!==m.current&&h()};return document.addEventListener(l,t),()=>document.removeEventListener(l,t)},[f,h]),(0,o.useEffect)(()=>{if(!f)return;let e=t=>{"Escape"===t.key&&h()},i=e=>{let i=t.current&&t.current.contains(e.target),o=e.target.closest?.(".invictus-tooltip");i||o||h()};return document.addEventListener("keydown",e),document.addEventListener("mousedown",i),()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",i)}},[f,h,t]),(0,o.useEffect)(()=>()=>clearTimeout(p.current),[]),{visible:f,pinned:d,onMouseEnter:()=>{clearTimeout(p.current),i(!0),b()},onMouseLeave:()=>{p.current=setTimeout(()=>i(!1),150)},onFocus:()=>{c(!0),b()},onBlur:()=>c(!1),onClick:()=>u(t=>!t),onTooltipMouseEnter:()=>{clearTimeout(p.current),a(!0)},onTooltipMouseLeave:()=>a(!1),pin:(0,o.useCallback)(()=>u(!0),[u])}}}}]);