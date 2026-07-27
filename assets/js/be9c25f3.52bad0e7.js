"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["2075"],{5489(e,t,r){r.r(t),r.d(t,{metadata:()=>n,default:()=>f,frontMatter:()=>h,contentTitle:()=>p,toc:()=>m,assets:()=>x});var n=JSON.parse('{"id":"dashboard/installation/give_ad_access","title":"<BadgedText badge={<OnlyAdminsBadge/>}>Give Invictus access to your Microsoft Entra ID</BadgedText>","description":"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps.","source":"@site/versioned_docs/version-v6.0.0/dashboard/installation/01_give_ad_access.mdx","sourceDirName":"dashboard/installation","slug":"/dashboard/installation/give_ad_access","permalink":"/dashboard/installation/give_ad_access","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":1,"frontMatter":{"sidebar_label":"Give access to your Microsoft Entra ID"},"sidebar":"technical_users","previous":{"title":"Installing Invictus Dashboard","permalink":"/dashboard/installation/"},"next":{"title":"Give access to your Logic Apps","permalink":"/dashboard/installation/give_la_access"}}'),i=r(4848),o=r(8453),s=r(2022),a=r(3742),l=r(4050),c=r(7066),d=r(6188),u=r(7897);let h={sidebar_label:"Give access to your Microsoft Entra ID"},p="Give Invictus access to your Microsoft Entra ID",x={},m=[{value:"Sync your Microsoft Entra ID groups to Invictus",id:"sync-your-microsoft-entra-id-groups-to-invictus",level:2},{value:"Enable only required groups",id:"enable-only-required-groups",level:2},{value:"Assign user role to required groups",id:"assign-user-role-to-required-groups",level:2}];function g(e){let t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"give-invictus-access-to-your-microsoft-entra-id",children:(0,i.jsx)(a.V3,{badge:(0,i.jsx)(a.gw,{}),children:"Give Invictus access to your Microsoft Entra ID"})})}),"\n",(0,i.jsx)(t.p,{children:"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps."}),"\n",(0,i.jsxs)(s.p6,{children:[(0,i.jsxs)(s.Nt,{title:"Register an Application for Invictus",children:[(0,i.jsx)("em",{children:(0,i.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api",children:[" ",(0,i.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: register an app"]})}),(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Choose the ",(0,i.jsx)("u",{children:"multi-tenant"})," account type option to let Invictus use the app registration."]}),"\n",(0,i.jsxs)(t.li,{children:["Add ",(0,i.jsx)("u",{children:"Redirect URI's"})," to ",(0,i.jsx)(t.strong,{children:"your"})," Invictus pages:","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/login"})}),"\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/api/auth/callback/azure-ad"})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["Check the ",(0,i.jsxs)(t.strong,{children:[(0,i.jsx)(c.gc,{icon:d.Dnq})," Access tokens"]})," box (",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity-platform/v2-oauth2-implicit-grant-flow?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps",children:"why?"}),")"]}),"\n",(0,i.jsxs)(t.li,{children:["Add a new ",(0,i.jsx)("u",{children:"client secret"})," (copy the value for later use)."]}),"\n",(0,i.jsxs)(t.li,{children:["Linked Enterprise Application:","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Assign ",(0,i.jsx)("u",{children:"Owners"})," (",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/assign-app-owners?pivots=portal",children:"more info"}),")"]}),"\n",(0,i.jsxs)(t.li,{children:["Grant ",(0,i.jsx)("u",{children:"Admin consent"})," (",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal",children:"more info"}),")"]}),"\n"]}),"\n"]}),"\n"]})]}),(0,i.jsxs)(s.Nt,{title:"Expose an API with scoped permissions",children:[(0,i.jsx)("em",{children:(0,i.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope",children:[" ",(0,i.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: expose an API"]})}),(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Use the default ",(0,i.jsx)("u",{children:"Application ID URI"})," (copy it)."]}),"\n",(0,i.jsxs)(t.li,{children:["Add a scope with ",(0,i.jsx)("u",{children:"Admin and users"})," consent."]}),"\n",(0,i.jsxs)(t.li,{children:["Use this name for the scope: ",(0,i.jsx)(t.code,{children:"access_as_user"})]}),"\n"]})]}),(0,i.jsxs)(s.Nt,{title:"Add API permissions",children:[(0,i.jsx)("em",{children:(0,i.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-access-web-apis",children:[" ",(0,i.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: configure API permissions"]})}),(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Microsoft Graph"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"Directory.Read.All"}),": ",(0,i.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"User.Read"}),": ",(0,i.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"User.Read.All"}),": ",(0,i.jsx)(t.strong,{children:"Delegated"})," + ",(0,i.jsx)(t.strong,{children:"Application"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"Group.Read.All"}),": ",(0,i.jsx)(t.strong,{children:"Application"})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"Mail.Send"}),": ",(0,i.jsx)(t.strong,{children:"Application"})]}),"\n"]}),"\n"]}),"\n"]}),(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.strong,{children:"My APIs"})}),"\n"]}),(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["The ",(0,i.jsx)(t.code,{children:"access_as_user"})," scope you created earlier: ",(0,i.jsx)(t.strong,{children:"Delegated"})]}),"\n"]})]}),(0,i.jsx)(s.Nt,{title:"Pass App Registration values to Invictus deployment",children:(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"azureActiveDirectoryClientId"})," ",(0,i.jsx)(c.gc,{icon:d.dmS})," from ",(0,i.jsxs)(t.strong,{children:["App Registration ",(0,i.jsx)(c.gc,{icon:d.XkK})," Overview"]})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"azureActiveDirectoryTenantId"})," ",(0,i.jsx)(c.gc,{icon:d.dmS})," from ",(0,i.jsxs)(t.strong,{children:["App Registration ",(0,i.jsx)(c.gc,{icon:d.XkK})," Overview"]})]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"azureActiveDirectoryClientSecret"})," ",(0,i.jsx)(c.gc,{icon:d.dmS})," the one you copied earlier"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"azureActiveDirectoryAudience"})," ",(0,i.jsx)(c.gc,{icon:d.dmS})," the default ",(0,i.jsx)("u",{children:"Application ID URI"})]}),"\n"]})})]}),"\n",(0,i.jsx)(t.h2,{id:"sync-your-microsoft-entra-id-groups-to-invictus",children:"Sync your Microsoft Entra ID groups to Invictus"}),"\n",(0,i.jsx)(l.A,{paths:["Groups","Sync all groups"]}),"\n",(0,i.jsxs)(t.p,{children:["The Dashboard uses groups available in your Microsoft Entra ID to determine whether users can access certain flows. (See ",(0,i.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),")."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups",children:"Add Microsoft Entra ID group"})}),"\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users",children:"Add Microsoft Entra ID user"})}),"\n"]}),"\n",(0,i.jsx)(t.admonition,{type:"warning",children:(0,i.jsx)(t.p,{children:"Only groups of active users (Entra ID users that have already signed into the Dashboard) will be synced within the Dashboard."})}),"\n",(0,i.jsx)(t.h2,{id:"enable-only-required-groups",children:"Enable only required groups"}),"\n",(0,i.jsx)(l.A,{items:["Groups",(0,i.jsx)(t.em,{children:"your group"}),(0,i.jsx)(c.gc,{icon:u.M6O})]}),"\n",(0,i.jsxs)(t.p,{children:["Once the Dashboard knows about the related Entra ID groups, you have to manually enable the required groups which you want to use for ",(0,i.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),"."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Enable Groups",src:r(3486).A+"",width:"1847",height:"372"})}),"\n",(0,i.jsx)(t.h2,{id:"assign-user-role-to-required-groups",children:"Assign user role to required groups"}),"\n",(0,i.jsx)(l.A,{items:["Groups",(0,i.jsx)(t.em,{children:"your group"}),(0,i.jsx)(c.gc,{icon:u.X46})]}),"\n",(0,i.jsxs)(t.p,{children:["Each enabled group requires a user role permission. This describes what authority each member of the group has throughout the Dashboard, ",(0,i.jsx)(t.a,{href:"/dashboard/security/roles",children:"more info on Dashboard roles"}),"."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Add Global Roles",src:r(5374).A+"",width:"1853",height:"475"})})]})}function f(e={}){let{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(g,{...e})}):g(e)}},3486(e,t,r){r.d(t,{A:()=>n});let n=r.p+"assets/images/groups-disable-action-2b14324f28b5417aaec0920787194ae1.png"},5374(e,t,r){r.d(t,{A:()=>n});let n=r.p+"assets/images/groups-permissions-action-baa70b1093f4d79ba3b62bf9848ef25e.png"},3742(e,t,r){r.d(t,{gw:()=>f,yo:()=>j,bP:()=>w,V3:()=>_,IG:()=>y,mw:()=>A,SV:()=>v,bE:()=>b});var n=r(4848),i=r(6540),o=r(961);let s="u">typeof window?i.useLayoutEffect:i.useEffect,a=`
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
`;function l(){(0,i.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=a},[])}function c(e,t,{tooltipWidth:r=300,margin:n=12,navHeight:o=60,gap:s=10}={}){let[a,l]=(0,i.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,i.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),i=window.innerWidth,a=t.left+t.width/2-r/2;a=Math.max(n,Math.min(a,i-r-n));let c=Math.min(Math.max(t.left+t.width/2-a,14),r-14),d=t.top-o<70;l({top:d?t.bottom+s:t.top-s,left:a,arrowLeft:c,below:d})},[e,r,n,o,s]);return(0,i.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,i.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),a}let d="invictus-tooltip-activate";function u(e){let[t,r]=(0,i.useState)(!1),[n,o]=(0,i.useState)(!1),[a,l]=(0,i.useState)(!1),[c,u]=(0,i.useState)(!1),h=(0,i.useRef)(null),p=(0,i.useRef)(`tip-${Math.random()}`),x=t||n||a||c,m=(0,i.useCallback)(()=>{clearTimeout(h.current),r(!1),o(!1),l(!1),u(!1)},[]),g=(0,i.useCallback)(()=>{document.dispatchEvent(new CustomEvent(d,{detail:{id:p.current}}))},[]);return s(()=>{if(!x)return;let e=e=>{e.detail.id!==p.current&&m()};return document.addEventListener(d,e),()=>document.removeEventListener(d,e)},[x,m]),(0,i.useEffect)(()=>{if(!x)return;let t=e=>{"Escape"===e.key&&m()},r=t=>{let r=e.current&&e.current.contains(t.target),n=t.target.closest?.(".invictus-tooltip");r||n||m()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",r),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",r)}},[x,m,e]),(0,i.useEffect)(()=>()=>clearTimeout(h.current),[]),{visible:x,pinned:c,onMouseEnter:()=>{clearTimeout(h.current),r(!0),g()},onMouseLeave:()=>{h.current=setTimeout(()=>r(!1),150)},onFocus:()=>{l(!0),g()},onBlur:()=>l(!1),onClick:()=>u(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(h.current),o(!0)},onTooltipMouseLeave:()=>o(!1),pin:(0,i.useCallback)(()=>u(!0),[u])}}var h=r(6370),p=r(4846),x=r(7066),m=r(6188);let g=`
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
`;function f(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(x.gc,{icon:m.V2x})," Admins"]}),tooltip:"Only available for users with a **System Admin** role."})}function b(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(x.gc,{icon:m.V2x})," Operators"]}),tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function v(){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(x.gc,{icon:m.V2x})," Admins"]}),tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function j({version:e,style:t}){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(x.gc,{icon:m.yy})," ",e]}),tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"var(--inv-badge-new-bg)",color:"var(--inv-badge-new-text)",style:t})}function w({version:e,note:t,style:r}){return k({title:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(x.gc,{icon:m.Dfk})," ",e]}),tooltip:`Feature deprecated since **Invictus ${e}**. ${t}`,backgroundColor:"var(--inv-badge-deprecated-bg)",color:"var(--inv-badge-deprecated-text)",style:r})}function y({variant:e}){return(0,i.useInsertionEffect)(()=>{let e="invictus-row-tint-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=g},[]),(0,n.jsx)("span",{"data-row-tint":e,"aria-hidden":"true",style:{display:"none"}})}function k({title:e,tooltip:t,backgroundColor:r="#b55d00",color:s="white",style:a}){l();let d=(0,i.useRef)(null),x=(0,i.useId)(),{visible:m,pinned:g,onMouseEnter:f,onMouseLeave:b,onFocus:v,onBlur:j,onClick:w,onTooltipMouseEnter:y,onTooltipMouseLeave:E}=u(d),A=c(d,m,{tooltipWidth:260}),_=m&&(0,o.createPortal)((0,n.jsxs)("div",{id:x,role:"tooltip",className:`invictus-tooltip${g?" invictus-tooltip--pinned":""}`,"data-below":A.below?"true":"false",onMouseEnter:y,onMouseLeave:E,style:{position:"fixed",top:A.below?A.top:"auto",bottom:A.below?"auto":`calc(100vh - ${A.top}px)`,left:A.left,width:260,"--tooltip-accent":r},children:["string"==typeof t?(0,n.jsx)(h.oz,{remarkPlugins:[p.A],children:t}):t,(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:A.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",textTransform:"none",fontWeight:"normal",...a},role:"button","aria-pressed":g,"aria-describedby":m?x:void 0,onMouseEnter:f,onMouseLeave:b,onFocus:v,onBlur:j,onClick:w,children:(0,n.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:r,color:s,padding:"4px 8px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":r,...a},children:e})}),_]})}let E="var(--inv-badge-shared-accent)";function A(){l();let e=(0,i.useRef)(null),t=(0,i.useId)(),{visible:r,pinned:s,onMouseEnter:a,onMouseLeave:d,onFocus:h,onBlur:p,onClick:x,onTooltipMouseEnter:m,onTooltipMouseLeave:g}=u(e),f=c(e,r,{tooltipWidth:260}),b=r&&(0,o.createPortal)((0,n.jsxs)("div",{id:t,role:"tooltip",className:`invictus-tooltip${s?" invictus-tooltip--pinned":""}`,"data-below":f.below?"true":"false",onMouseEnter:m,onMouseLeave:g,style:{position:"fixed",top:f.below?f.top:"auto",bottom:f.below?"auto":`calc(100vh - ${f.top}px)`,left:f.left,width:260,"--tooltip-accent":E},children:["Same for both ",(0,n.jsx)("strong",{children:"Dashboard"})," and ",(0,n.jsx)("strong",{children:"Framework"}),". Can be skipped if done already.",(0,n.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:f.arrowLeft}})]}),document.body);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{ref:e,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},children:(0,n.jsx)("span",{tabIndex:0,role:"button","aria-pressed":s,"aria-describedby":r?t:void 0,onMouseEnter:a,onMouseLeave:d,onFocus:h,onBlur:p,onClick:x,className:"invictus-badge",style:{backgroundColor:"var(--inv-badge-shared-bg)",color:"var(--inv-badge-shared-text)",padding:"2px 6px",borderRadius:"4px",fontSize:"0.9rem",fontWeight:"600",fontFamily:"Inter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":E},children:"Shared"})}),b]})}function _({children:e,badge:t,variant:r="underline"}){let o=(0,i.useRef)(null),[s,a]=(0,i.useState)();(0,i.useEffect)(()=>{let e=o.current;if(!e)return;let t=()=>{let t=e.querySelector(".invictus-badge");if(!t)return!1;let{backgroundColor:r}=window.getComputedStyle(t);return!!r&&"transparent"!==r&&"rgba(0, 0, 0, 0)"!==r&&(a(r),!0)};if(t())return;let r=new MutationObserver(()=>{t()&&r.disconnect()});return r.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style"]}),()=>r.disconnect()},[t]);let l="background"==r?((e,t=.1)=>{if(!e)return;let r=Math.round(100*t);return`color-mix(in srgb, ${e} ${r}%, transparent)`})(s,.1):void 0;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{style:{textDecoration:"underline dotted",textDecorationColor:s,backgroundColor:l,padding:"0.25rem"},children:e}),(0,n.jsx)("span",{ref:o,children:t})]})}},4050(e,t,r){r.d(t,{A:()=>s});var n=r(4848);r(6540);let i="listItem_qpim";function o(){return(0,n.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,n.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function s({paths:e,items:t,activeLast:r=!0}){let a=e??t??[];return(0,n.jsx)("nav",{className:"nav_sYHQ","aria-label":"Breadcrumb",children:(0,n.jsxs)("ol",{className:"list_yxgx",children:[(0,n.jsxs)("li",{className:i,children:[(0,n.jsx)("span",{className:"logo_Er0S",children:(0,n.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,n.jsx)(o,{})]}),a.map((e,t)=>{let s=t===a.length-1,l=r&&s;return(0,n.jsxs)("li",{className:i,children:[t>0&&(0,n.jsx)(o,{}),(0,n.jsx)("span",{className:`item_gLbu${l?" active_Ij2Z":""}`,...l?{"aria-current":"page"}:{},children:e})]},t)})]})})}},2022(e,t,r){r.d(t,{Nt:()=>a,p6:()=>o,pn:()=>s});var n=r(4848),i=r(6540);function o({children:e,label:t="Steps"}){return(0,n.jsx)("ol",{className:"walkthrough_MEF5","aria-label":t,children:i.Children.map(e,(e,t)=>i.isValidElement(e)?i.cloneElement(e,{number:e.props.number??t+1}):e)})}function s({title:e,children:t,number:r,headingLevel:i=2}){let o=`walkthrough-step-${r}-title`,a=`h${i}`;return(0,n.jsx)("li",{className:"walkthroughStepItem_viPK",children:(0,n.jsxs)("section",{className:"walkthroughStep_bwf6","aria-labelledby":o,children:[(0,n.jsxs)("div",{className:"walkthroughStepHeader_VEU7",children:[(0,n.jsx)("div",{className:"walkthroughStepCircle_o5Ym","aria-hidden":"true",children:r}),(0,n.jsx)(a,{id:o,className:"walkthroughStepTitle_VmS5",children:e})]}),(0,n.jsx)("div",{className:"walkthroughStepContent_byiw",children:t})]})})}function a({title:e,children:t,number:r,id:o,open:s=!1}){let[l,c]=(0,i.useState)(s),d=`walkthrough-task-${r}-content`;return(0,n.jsxs)("li",{id:o,className:`walkthroughTaskItem_zVVk${l?" walkthroughTaskOpen_Lkhy":""}`,children:[(0,n.jsxs)("button",{type:"button","aria-expanded":l,"aria-controls":d,onClick:()=>c(!l),className:"walkthroughTaskHeader_TnFN",children:[(0,n.jsx)("div",{className:"walkthroughTaskCircle_bdU4","aria-hidden":"true",children:r}),(0,n.jsx)("h3",{className:"walkthroughTaskTitle_l_pz",children:e}),(0,n.jsx)("svg",{className:"walkthroughTaskChevron_B30H","aria-hidden":"true",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:(0,n.jsx)("path",{d:"M4 6l4 4 4-4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),l&&(0,n.jsx)("div",{id:d,className:"walkthroughTaskContent_dHAu",children:t})]})}},8453(e,t,r){r.d(t,{R:()=>s,x:()=>a});var n=r(6540);let i={},o=n.createContext(i);function s(e){let t=n.useContext(o);return n.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);