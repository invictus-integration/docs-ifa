"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["2075"],{5489(e,t,s){s.r(t),s.d(t,{metadata:()=>i,default:()=>f,frontMatter:()=>h,contentTitle:()=>p,toc:()=>m,assets:()=>x});var i=JSON.parse('{"id":"dashboard/installation/give_ad_access","title":"Give Invictus access to your Microsoft Entra ID","description":"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps.","source":"@site/versioned_docs/version-v6.0.0/dashboard/installation/01_give_ad_access.mdx","sourceDirName":"dashboard/installation","slug":"/dashboard/installation/give_ad_access","permalink":"/dashboard/installation/give_ad_access","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":1,"frontMatter":{"sidebar_label":"Give access to your Microsoft Entra ID"},"sidebar":"technical_users","previous":{"title":"Installing Invictus Dashboard","permalink":"/dashboard/installation/"},"next":{"title":"Give access to your Logic Apps","permalink":"/dashboard/installation/give_la_access"}}'),n=s(4848),r=s(8453),o=s(2022),a=s(2437),l=s(4050),c=s(7066),d=s(6188),u=s(7897);let h={sidebar_label:"Give access to your Microsoft Entra ID"},p="Give Invictus access to your Microsoft Entra ID",x={},m=[{value:"Sync your Microsoft Entra ID groups to Invictus <OnlyAdminsBadge></OnlyAdminsBadge>",id:"sync-your-microsoft-entra-id-groups-to-invictus-",level:2},{value:"Enable only required groups <OnlyAdminsBadge></OnlyAdminsBadge>",id:"enable-only-required-groups-",level:2},{value:"Assign user role to required groups <OnlyAdminsBadge></OnlyAdminsBadge>",id:"assign-user-role-to-required-groups-",level:2}];function g(e){let t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"give-invictus-access-to-your-microsoft-entra-id",children:"Give Invictus access to your Microsoft Entra ID"})}),"\n",(0,n.jsx)(t.p,{children:"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps."}),"\n",(0,n.jsxs)(o.p6,{children:[(0,n.jsxs)(o.Nt,{title:"Register an Application for Invictus",children:[(0,n.jsx)("em",{children:(0,n.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api",children:[" ",(0,n.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: register an app"]})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Choose the ",(0,n.jsx)("u",{children:"multi-tenant"})," account type option to let Invictus use the app registration."]}),"\n",(0,n.jsxs)(t.li,{children:["Add ",(0,n.jsx)("u",{children:"Redirect URI's"})," to ",(0,n.jsx)(t.strong,{children:"your"})," Invictus pages:","\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/login"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/api/auth/callback/azure-ad"})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["Check the ",(0,n.jsxs)(t.strong,{children:[(0,n.jsx)(c.gc,{icon:d.Dnq})," Access tokens"]})," box (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity-platform/v2-oauth2-implicit-grant-flow?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps",children:"why?"}),")"]}),"\n",(0,n.jsxs)(t.li,{children:["Add a new ",(0,n.jsx)("u",{children:"client secret"})," (copy the value for later use)."]}),"\n",(0,n.jsxs)(t.li,{children:["Linked Enterprise Application:","\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Assign ",(0,n.jsx)("u",{children:"Owners"})," (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/assign-app-owners?pivots=portal",children:"more info"}),")"]}),"\n",(0,n.jsxs)(t.li,{children:["Grant ",(0,n.jsx)("u",{children:"Admin consent"})," (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal",children:"more info"}),")"]}),"\n"]}),"\n"]}),"\n"]})]}),(0,n.jsxs)(o.Nt,{title:"Expose an API with scoped permissions",children:[(0,n.jsx)("em",{children:(0,n.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope",children:[" ",(0,n.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: expose an API"]})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Use the default ",(0,n.jsx)("u",{children:"Application ID URI"})," (copy it)."]}),"\n",(0,n.jsxs)(t.li,{children:["Add a scope with ",(0,n.jsx)("u",{children:"Admin and users"})," consent."]}),"\n",(0,n.jsxs)(t.li,{children:["Use this name for the scope: ",(0,n.jsx)(t.code,{children:"access_as_user"})]}),"\n"]})]}),(0,n.jsxs)(o.Nt,{title:"Add API permissions",children:[(0,n.jsx)("em",{children:(0,n.jsxs)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-access-web-apis",children:[" ",(0,n.jsx)(c.gc,{icon:d.CQO})," Microsoft Docs: configure API permissions"]})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"Microsoft Graph"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Directory.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"User.Read"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"User.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})," + ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Group.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Mail.Send"}),": ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n"]}),"\n"]}),"\n"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.strong,{children:"My APIs"})}),"\n"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["The ",(0,n.jsx)(t.code,{children:"access_as_user"})," scope you created earlier: ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n"]})]}),(0,n.jsx)(o.Nt,{title:"Pass App Registration values to Invictus deployment",children:(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryClientId"})," ",(0,n.jsx)(c.gc,{icon:d.dmS})," from ",(0,n.jsxs)(t.strong,{children:["App Registration ",(0,n.jsx)(c.gc,{icon:d.XkK})," Overview"]})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryTenantId"})," ",(0,n.jsx)(c.gc,{icon:d.dmS})," from ",(0,n.jsxs)(t.strong,{children:["App Registration ",(0,n.jsx)(c.gc,{icon:d.XkK})," Overview"]})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryClientSecret"})," ",(0,n.jsx)(c.gc,{icon:d.dmS})," the one you copied earlier"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryAudience"})," ",(0,n.jsx)(c.gc,{icon:d.dmS})," the default ",(0,n.jsx)("u",{children:"Application ID URI"})]}),"\n"]})})]}),"\n",(0,n.jsxs)(t.h2,{id:"sync-your-microsoft-entra-id-groups-to-invictus-",children:["Sync your Microsoft Entra ID groups to Invictus ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{paths:["Groups","Sync all groups"]}),"\n",(0,n.jsxs)(t.p,{children:["The Dashboard uses groups available in your Microsoft Entra ID to determine whether users can access certain flows. (See ",(0,n.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),")."]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups",children:"Add Microsoft Entra ID group"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users",children:"Add Microsoft Entra ID user"})}),"\n"]}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsx)(t.p,{children:"Only groups of active users (Entra ID users that have already signed into the Dashboard) will be synced within the Dashboard."})}),"\n",(0,n.jsxs)(t.h2,{id:"enable-only-required-groups-",children:["Enable only required groups ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{items:["Groups",(0,n.jsx)(t.em,{children:"your group"}),(0,n.jsx)(c.gc,{icon:u.M6O})]}),"\n",(0,n.jsxs)(t.p,{children:["Once the Dashboard knows about the related Entra ID groups, you have to manually enable the required groups which you want to use for ",(0,n.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),"."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Enable Groups",src:s(3486).A+"",width:"1847",height:"372"})}),"\n",(0,n.jsxs)(t.h2,{id:"assign-user-role-to-required-groups-",children:["Assign user role to required groups ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{items:["Groups",(0,n.jsx)(t.em,{children:"your group"}),(0,n.jsx)(c.gc,{icon:u.X46})]}),"\n",(0,n.jsxs)(t.p,{children:["Each enabled group requires a user role permission. This describes what authority each member of the group has throughout the Dashboard, ",(0,n.jsx)(t.a,{href:"/dashboard/security/roles",children:"more info on Dashboard roles"}),"."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Add Global Roles",src:s(5374).A+"",width:"1853",height:"475"})})]})}function f(e={}){let{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},3486(e,t,s){s.d(t,{A:()=>i});let i=s.p+"assets/images/groups-disable-action-2b14324f28b5417aaec0920787194ae1.png"},5374(e,t,s){s.d(t,{A:()=>i});let i=s.p+"assets/images/groups-permissions-action-baa70b1093f4d79ba3b62bf9848ef25e.png"},4050(e,t,s){s.d(t,{A:()=>r});var i=s(4848);s(6540);function n(){return(0,i.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,i.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function r({paths:e,items:t,activeLast:s=!0}){let o=e??t??[];return(0,i.jsxs)("nav",{className:"nav_sYHQ","aria-label":"Breadcrumb",children:[(0,i.jsx)("span",{className:"logo_Er0S",children:(0,i.jsx)("img",{src:"/img/favicon.ico",alt:""})}),(0,i.jsx)("ol",{className:"list_yxgx",children:o.map((e,t)=>{let r=t===o.length-1,a=s&&r;return(0,i.jsxs)("li",{className:"listItem_qpim",children:[t>0&&(0,i.jsx)(n,{}),(0,i.jsx)("span",{className:`item_gLbu${a?" active_Ij2Z":""}`,...a?{"aria-current":"page"}:{},children:e})]},t)})})]})}},2437(e,t,s){s.d(t,{SV:()=>u,bE:()=>d,gw:()=>c,yo:()=>h});var i=s(4848),n=s(6540),r=s(961),o=s(6370),a=s(4846),l=s(3937);function c(){return p({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return p({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function u(){return p({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function h({version:e}){return p({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#059669",color:"white"})}function p({title:e,tooltip:t,backgroundColor:s="#b55d00",color:c="white"}){(0,l.n9)();let d=(0,n.useRef)(null),u=(0,n.useId)(),{visible:h,pinned:x,onMouseEnter:m,onMouseLeave:g,onFocus:f,onBlur:j,onClick:v,onTooltipMouseEnter:b,onTooltipMouseLeave:w}=(0,l.DV)(d),y=(0,l._W)(d,h,{tooltipWidth:260}),k=h&&(0,r.createPortal)((0,i.jsxs)("div",{id:u,role:"tooltip",className:`invictus-tooltip${x?" invictus-tooltip--pinned":""}`,"data-below":y.below?"true":"false",onMouseEnter:b,onMouseLeave:w,style:{position:"fixed",top:y.below?y.top:"auto",bottom:y.below?"auto":`calc(100vh - ${y.top}px)`,left:y.left,width:260,"--tooltip-accent":s},children:["string"==typeof t?(0,i.jsx)(o.oz,{remarkPlugins:[a.A],children:t}):t,(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:y.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":x,"aria-describedby":h?u:void 0,onMouseEnter:m,onMouseLeave:g,onFocus:f,onBlur:j,onClick:v,children:(0,i.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:s,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":s},children:e})}),k]})}},2022(e,t,s){s.d(t,{Nt:()=>a,p6:()=>r,pn:()=>o});var i=s(4848),n=s(6540);function r({children:e,label:t="Steps"}){return(0,i.jsx)("ol",{className:"walkthrough_MEF5","aria-label":t,children:n.Children.map(e,(e,t)=>n.isValidElement(e)?n.cloneElement(e,{number:t+1}):e)})}function o({title:e,children:t,number:s,headingLevel:n=2}){let r=`walkthrough-step-${s}-title`,a=`h${n}`;return(0,i.jsx)("li",{className:"walkthroughStepItem_viPK",children:(0,i.jsxs)("section",{className:"walkthroughStep_bwf6","aria-labelledby":r,children:[(0,i.jsxs)("div",{className:"walkthroughStepHeader_VEU7",children:[(0,i.jsx)("div",{className:"walkthroughStepCircle_o5Ym","aria-hidden":"true",children:s}),(0,i.jsx)(a,{id:r,className:"walkthroughStepTitle_VmS5",children:e})]}),(0,i.jsx)("div",{className:"walkthroughStepContent_byiw",children:t})]})})}function a({title:e,children:t,number:s,id:r}){let[o,l]=(0,n.useState)(!1),c=`walkthrough-task-${s}-content`;return(0,i.jsxs)("li",{id:r,className:`walkthroughTaskItem_zVVk${o?" walkthroughTaskOpen_Lkhy":""}`,children:[(0,i.jsxs)("button",{type:"button","aria-expanded":o,"aria-controls":c,onClick:()=>l(!o),className:"walkthroughTaskHeader_TnFN",children:[(0,i.jsx)("div",{className:"walkthroughTaskCircle_bdU4","aria-hidden":"true",children:s}),(0,i.jsx)("h3",{className:"walkthroughTaskTitle_l_pz",children:e}),(0,i.jsx)("svg",{className:"walkthroughTaskChevron_B30H","aria-hidden":"true",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:(0,i.jsx)("path",{d:"M4 6l4 4 4-4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),o&&(0,i.jsx)("div",{id:c,className:"walkthroughTaskContent_dHAu",children:t})]})}},3937(e,t,s){s.d(t,{DV:()=>c,_W:()=>a,n9:()=>o});var i=s(6540);let n="u">typeof window?i.useLayoutEffect:i.useEffect,r=`
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
`;function o(){(0,i.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=r},[])}function a(e,t,{tooltipWidth:s=300,margin:n=12,navHeight:r=60,gap:o=10}={}){let[l,c]=(0,i.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,i.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),i=window.innerWidth,a=t.left+t.width/2-s/2;a=Math.max(n,Math.min(a,i-s-n));let l=Math.min(Math.max(t.left+t.width/2-a,14),s-14),d=t.top-r<70;c({top:d?t.bottom+o:t.top-o,left:a,arrowLeft:l,below:d})},[e,s,n,r,o]);return(0,i.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,i.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),l}let l="invictus-tooltip-activate";function c(e){let[t,s]=(0,i.useState)(!1),[r,o]=(0,i.useState)(!1),[a,c]=(0,i.useState)(!1),[d,u]=(0,i.useState)(!1),h=(0,i.useRef)(null),p=(0,i.useRef)(`tip-${Math.random()}`),x=t||r||a||d,m=(0,i.useCallback)(()=>{clearTimeout(h.current),s(!1),o(!1),c(!1),u(!1)},[]),g=(0,i.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:p.current}}))},[]);return n(()=>{if(!x)return;let e=e=>{e.detail.id!==p.current&&m()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[x,m]),(0,i.useEffect)(()=>{if(!x)return;let t=e=>{"Escape"===e.key&&m()},s=t=>{let s=e.current&&e.current.contains(t.target),i=t.target.closest?.(".invictus-tooltip");s||i||m()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",s),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",s)}},[x,m,e]),(0,i.useEffect)(()=>()=>clearTimeout(h.current),[]),{visible:x,pinned:d,onMouseEnter:()=>{clearTimeout(h.current),s(!0),g()},onMouseLeave:()=>{h.current=setTimeout(()=>s(!1),150)},onFocus:()=>{c(!0),g()},onBlur:()=>c(!1),onClick:()=>u(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(h.current),o(!0)},onTooltipMouseLeave:()=>o(!1),pin:(0,i.useCallback)(()=>u(!0),[u])}}},8453(e,t,s){s.d(t,{R:()=>o,x:()=>a});var i=s(6540);let n={},r=i.createContext(n);function o(e){let t=i.useContext(r);return i.useMemo(function(){return"function"==typeof e?e(t):{...t,...e}},[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);