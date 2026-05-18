"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["2075"],{5489(e,t,s){s.r(t),s.d(t,{metadata:()=>i,default:()=>x,frontMatter:()=>c,contentTitle:()=>d,toc:()=>h,assets:()=>u});var i=JSON.parse('{"id":"dashboard/installation/give_ad_access","title":"Give Invictus access to your Microsoft Entra ID","description":"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps.","source":"@site/versioned_docs/version-v6.0.0/dashboard/installation/01_give_ad_access.mdx","sourceDirName":"dashboard/installation","slug":"/dashboard/installation/give_ad_access","permalink":"/dashboard/installation/give_ad_access","draft":false,"unlisted":false,"tags":[],"version":"v6.0.0","sidebarPosition":1,"frontMatter":{"sidebar_label":"Give access to your Microsoft Entra ID"},"sidebar":"technical_users","previous":{"title":"Installing Invictus Dashboard","permalink":"/dashboard/installation/"},"next":{"title":"Give access to your Logic Apps","permalink":"/dashboard/installation/give_la_access"}}'),n=s(4848),r=s(8453),o=s(3832),a=s(2437),l=s(4050);let c={sidebar_label:"Give access to your Microsoft Entra ID"},d="Give Invictus access to your Microsoft Entra ID",u={},h=[{value:"Sync your Microsoft Entra ID groups to Invictus <OnlyAdminsBadge></OnlyAdminsBadge>",id:"sync-your-microsoft-entra-id-groups-to-invictus-",level:2},{value:"Enable only required groups <OnlyAdminsBadge></OnlyAdminsBadge>",id:"enable-only-required-groups-",level:2},{value:"Assign user role to required groups <OnlyAdminsBadge></OnlyAdminsBadge>",id:"assign-user-role-to-required-groups-",level:2}];function p(e){let t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",p:"p",path:"path",strong:"strong",svg:"svg",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"give-invictus-access-to-your-microsoft-entra-id",children:"Give Invictus access to your Microsoft Entra ID"})}),"\n",(0,n.jsx)(t.p,{children:"To use your Microsoft Entra ID groups as a way of authentication and flow authorization, you need to follow these steps."}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsxs)(o.Y,{title:"Register an Application for Invictus",children:[(0,n.jsx)("em",{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api",children:"\u{1F517} Microsoft Docs: Register an application"})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Choose the ",(0,n.jsx)("u",{children:"multi-tenant"})," account type option to let Invictus use the app registration."]}),"\n",(0,n.jsxs)(t.li,{children:["Add ",(0,n.jsx)("u",{children:"Redirect URI's"})," to ",(0,n.jsx)(t.strong,{children:"your"})," Invictus pages:","\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/login"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"https://your-invictusdashboard.azurewebsites.net/api/auth/callback/azure-ad"})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["Check the ",(0,n.jsx)(t.strong,{children:"\u2611\uFE0F Access tokens"})," box (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity-platform/v2-oauth2-implicit-grant-flow?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps",children:"why?"}),")"]}),"\n",(0,n.jsxs)(t.li,{children:["Add a new ",(0,n.jsx)("u",{children:"client secret"})," (copy the value for later use)."]}),"\n",(0,n.jsxs)(t.li,{children:["Linked Enterprise Application:","\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Assign ",(0,n.jsx)("u",{children:"Owners"})," (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/assign-app-owners?pivots=portal",children:"more info"}),")"]}),"\n",(0,n.jsxs)(t.li,{children:["Grant ",(0,n.jsx)("u",{children:"Admin consent"})," (",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal",children:"more info"}),")"]}),"\n"]}),"\n"]}),"\n"]})]}),(0,n.jsxs)(o.Y,{title:"Expose an API with scoped permissions",children:[(0,n.jsx)("em",{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope",children:" \u{1F517}Microsoft Docs: Expose an API"})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Use the default ",(0,n.jsx)("u",{children:"Application ID URI"})," (copy it)."]}),"\n",(0,n.jsxs)(t.li,{children:["Add a scope with ",(0,n.jsx)("u",{children:"Admin and users"})," consent."]}),"\n",(0,n.jsxs)(t.li,{children:["Use this name for the scope: ",(0,n.jsx)(t.code,{children:"access_as_user"})]}),"\n"]})]}),(0,n.jsxs)(o.Y,{title:"Add API permissions",children:[(0,n.jsx)("em",{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/Entra/identity-platform/quickstart-configure-app-access-web-apis",children:"\u{1F517} Microsoft Docs: Configure API Permissions"})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"Microsoft Graph"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Directory.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"User.Read"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"User.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Delegated"})," + ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Group.Read.All"}),": ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"Mail.Send"}),": ",(0,n.jsx)(t.strong,{children:"Application"})]}),"\n"]}),"\n"]}),"\n"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.strong,{children:"My APIs"})}),"\n"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["The ",(0,n.jsx)(t.code,{children:"access_as_user"})," scope you created earlier: ",(0,n.jsx)(t.strong,{children:"Delegated"})]}),"\n"]})]}),(0,n.jsx)(o.Y,{title:"Pass App Registration values to Invictus deployment",children:(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryClientId"})," \u2192 from ",(0,n.jsx)(t.strong,{children:"App Registration > Overview"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryTenantId"})," \u2192 from ",(0,n.jsx)(t.strong,{children:"App Registration > Overview"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryClientSecret"})," \u2192 the one you copied earlier"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"azureActiveDirectoryAudience"})," \u2192 the default ",(0,n.jsx)("u",{children:"Application ID URI"})]}),"\n"]})})]}),"\n",(0,n.jsxs)(t.h2,{id:"sync-your-microsoft-entra-id-groups-to-invictus-",children:["Sync your Microsoft Entra ID groups to Invictus ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{paths:["Groups","Sync all groups"]}),"\n",(0,n.jsxs)(t.p,{children:["The Dashboard uses groups available in your Microsoft Entra ID to determine whether users can access certain flows. (See ",(0,n.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),")."]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups",children:"Add Microsoft Entra ID group"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users",children:"Add Microsoft Entra ID user"})}),"\n"]}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsx)(t.p,{children:"Only groups of active users (Entra ID users that have already signed into the Dashboard) will be synced within the Dashboard."})}),"\n",(0,n.jsxs)(t.h2,{id:"enable-only-required-groups-",children:["Enable only required groups ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{items:["Groups",(0,n.jsx)(t.em,{children:"your group"}),(0,n.jsx)(t.svg,{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 1024 1024","aria-hidden":"true",focusable:"false",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)(t.path,{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z"})})]}),"\n",(0,n.jsxs)(t.p,{children:["Once the Dashboard knows about the related Entra ID groups, you have to manually enable the required groups which you want to use for ",(0,n.jsx)(t.a,{href:"/dashboard/flows/add#flow-permissions",children:"flow permissions"}),"."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Enable Groups",src:s(3486).A+"",width:"1847",height:"372"})}),"\n",(0,n.jsxs)(t.h2,{id:"assign-user-role-to-required-groups-",children:["Assign user role to required groups ",(0,n.jsx)(a.gw,{})]}),"\n",(0,n.jsx)(l.A,{items:["Groups",(0,n.jsx)(t.em,{children:"your group"}),(0,n.jsx)(t.svg,{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 1024 1024","aria-hidden":"true",focusable:"false",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,n.jsx)(t.path,{d:"M759 335c0-137-111-248-248-248S263 198 263 335c0 82.8 40.6 156.2 103 201.2-0.4 0.2-0.7 0.3-0.9 0.4-44.7 18.9-84.8 46-119.3 80.6-34.5 34.5-61.5 74.7-80.4 119.5C146.9 780.5 137 827 136 874.8c-0.1 4.5 3.5 8.2 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C356 614.2 431 583 511 583c137 0 248-111 248-248zM511 507c-95 0-172-77-172-172s77-172 172-172 172 77 172 172-77 172-172 172zM616 728h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H703.5l47.2-60.1c1.1-1.4 1.7-3.2 1.7-4.9 0-4.4-3.6-8-8-8h-72.6c-4.9 0-9.5 2.3-12.6 6.1l-68.5 87.1c-4.4 5.6-6.8 12.6-6.8 19.8 0.1 17.7 14.4 32 32.1 32zM856 792H592c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h176.5l-47.2 60.1c-1.1 1.4-1.7 3.2-1.7 4.9 0 4.4 3.6 8 8 8h72.6c4.9 0 9.5-2.3 12.6-6.1l68.5-87.1c4.4-5.6 6.8-12.6 6.8-19.8-0.1-17.7-14.4-32-32.1-32z"})})]}),"\n",(0,n.jsxs)(t.p,{children:["Each enabled group requires a user role permission. This describes what authority each member of the group has throughout the Dashboard, ",(0,n.jsx)(t.a,{href:"/dashboard/security/roles",children:"more info on Dashboard roles"}),"."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Add Global Roles",src:s(5374).A+"",width:"1853",height:"475"})})]})}function x(e={}){let{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},3486(e,t,s){s.d(t,{A:()=>i});let i=s.p+"assets/images/groups-disable-action-2b14324f28b5417aaec0920787194ae1.png"},5374(e,t,s){s.d(t,{A:()=>i});let i=s.p+"assets/images/groups-permissions-action-baa70b1093f4d79ba3b62bf9848ef25e.png"},4050(e,t,s){s.d(t,{A:()=>o});var i=s(4848),n=s(6540);function r(){return(0,i.jsx)("span",{className:"separator_qLva","aria-hidden":"true",children:(0,i.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{d:"M4.5 2.5L8 6L4.5 9.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function o({paths:e,items:t,activeLast:s=!0}){let a=e??t??[];return(0,i.jsxs)("nav",{className:"nav_sYHQ","aria-label":"UI navigation path",children:[(0,i.jsx)("span",{className:"logo_Er0S",children:(0,i.jsx)("img",{src:"/img/favicon.ico",alt:""})}),a.map((e,t)=>{let o=t===a.length-1;return(0,i.jsxs)(n.Fragment,{children:[(0,i.jsx)(r,{}),(0,i.jsx)("span",{className:`item_gLbu${s&&o?" active_Ij2Z":""}`,children:e})]},t)})]})}},2437(e,t,s){s.d(t,{SV:()=>u,bE:()=>d,gw:()=>c,yo:()=>h});var i=s(4848),n=s(6540),r=s(961),o=s(6370),a=s(4846),l=s(3937);function c(){return p({title:"Only Admins",tooltip:"Only available for users with a **System Admin** role."})}function d(){return p({title:"Requires Operator",tooltip:"Only available for users with at least **Operator** permissions on the flow."})}function u(){return p({title:"Only Admins",tooltip:"Only available for users with a **Folder** or **System Admin** role."})}function h({version:e}){return p({title:`New since ${e}`,tooltip:`Feature included since **Invictus ${e}**.`,backgroundColor:"#008800",color:"white"})}function p({title:e,tooltip:t,backgroundColor:s="#b55d00",color:c="white"}){(0,l.n9)();let d=(0,n.useRef)(null),u=(0,n.useId)(),{visible:h,pinned:x,onMouseEnter:m,onMouseLeave:f,onFocus:g,onBlur:v,onClick:j,onTooltipMouseEnter:b,onTooltipMouseLeave:w}=(0,l.DV)(d),y=(0,l._W)(d,h,{tooltipWidth:260}),A=h&&(0,r.createPortal)((0,i.jsxs)("div",{id:u,role:"tooltip",className:`invictus-tooltip${x?" invictus-tooltip--pinned":""}`,"data-below":y.below?"true":"false",onMouseEnter:b,onMouseLeave:w,style:{position:"fixed",top:y.below?y.top:"auto",bottom:y.below?"auto":`calc(100vh - ${y.top}px)`,left:y.left,width:260,"--tooltip-accent":s},children:["string"==typeof t?(0,i.jsx)(o.oz,{remarkPlugins:[a.A],children:t}):t,(0,i.jsx)("span",{className:"invictus-tooltip__arrow",style:{left:y.arrowLeft}})]}),document.body);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{ref:d,style:{position:"relative",display:"inline-block",marginLeft:"8px",textTransform:"none",fontWeight:"bold"},role:"button","aria-pressed":x,"aria-describedby":h?u:void 0,onMouseEnter:m,onMouseLeave:f,onFocus:g,onBlur:v,onClick:j,children:(0,i.jsx)("span",{tabIndex:0,className:"invictus-badge",style:{backgroundColor:s,color:c,padding:"2px 6px",borderRadius:"4px",fontSize:"1rem",fontWeight:"600",fontFamily:"Bitter",cursor:"help",userSelect:"none",borderBottom:"1.5px dotted currentColor","--badge-accent":s},children:e})}),A]})}},3832(e,t,s){s.d(t,{Y:()=>o,p:()=>r});var i=s(4848),n=s(6540);function r({children:e}){return(0,i.jsx)("div",{className:"walkthrough-container",children:(0,i.jsx)("div",{className:"walkthrough-line",children:n.Children.map(e,(e,t)=>n.isValidElement(e)?n.cloneElement(e,{number:t+1}):e)})})}function o({title:e,children:t,number:s}){let[r,a]=(0,n.useState)(!1),l=()=>a(!r);return(0,i.jsxs)("div",{className:`task-container${r?" open":""}`,children:[(0,i.jsxs)("div",{role:"button",tabIndex:0,"aria-expanded":r,onClick:l,onKeyDown:e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),l())},className:"task-header",children:[(0,i.jsx)("div",{className:"task-circle","aria-hidden":"true",children:s}),e]}),r&&(0,i.jsx)("div",{className:"task-content",children:t})]})}},3937(e,t,s){s.d(t,{DV:()=>c,_W:()=>a,n9:()=>o});var i=s(6540);let n="u">typeof window?i.useLayoutEffect:i.useEffect,r=`
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
`;function o(){(0,i.useInsertionEffect)(()=>{let e="invictus-tooltip-styles",t=document.getElementById(e);t||((t=document.createElement("style")).id=e,document.head.appendChild(t)),t.textContent=r},[])}function a(e,t,{tooltipWidth:s=300,margin:n=12,navHeight:r=60,gap:o=10}={}){let[l,c]=(0,i.useState)({top:0,left:0,arrowLeft:14,below:!1}),d=(0,i.useCallback)(()=>{if(!e.current)return;let t=e.current.getBoundingClientRect(),i=window.innerWidth,a=t.left+t.width/2-s/2;a=Math.max(n,Math.min(a,i-s-n));let l=Math.min(Math.max(t.left+t.width/2-a,14),s-14),d=t.top-r<70;c({top:d?t.bottom+o:t.top-o,left:a,arrowLeft:l,below:d})},[e,s,n,r,o]);return(0,i.useLayoutEffect)(()=>{t&&d()},[t,d]),(0,i.useEffect)(()=>{if(t)return window.addEventListener("scroll",d,{passive:!0,capture:!0}),window.addEventListener("resize",d,{passive:!0}),()=>{window.removeEventListener("scroll",d,{capture:!0}),window.removeEventListener("resize",d)}},[t,d]),l}let l="invictus-tooltip-activate";function c(e){let[t,s]=(0,i.useState)(!1),[r,o]=(0,i.useState)(!1),[a,c]=(0,i.useState)(!1),[d,u]=(0,i.useState)(!1),h=(0,i.useRef)(null),p=(0,i.useRef)(`tip-${Math.random()}`),x=t||r||a||d,m=(0,i.useCallback)(()=>{clearTimeout(h.current),s(!1),o(!1),c(!1),u(!1)},[]),f=(0,i.useCallback)(()=>{document.dispatchEvent(new CustomEvent(l,{detail:{id:p.current}}))},[]);return n(()=>{if(!x)return;let e=e=>{e.detail.id!==p.current&&m()};return document.addEventListener(l,e),()=>document.removeEventListener(l,e)},[x,m]),(0,i.useEffect)(()=>{if(!x)return;let t=e=>{"Escape"===e.key&&m()},s=t=>{let s=e.current&&e.current.contains(t.target),i=t.target.closest?.(".invictus-tooltip");s||i||m()};return document.addEventListener("keydown",t),document.addEventListener("mousedown",s),()=>{document.removeEventListener("keydown",t),document.removeEventListener("mousedown",s)}},[x,m,e]),(0,i.useEffect)(()=>()=>clearTimeout(h.current),[]),{visible:x,pinned:d,onMouseEnter:()=>{clearTimeout(h.current),s(!0),f()},onMouseLeave:()=>{h.current=setTimeout(()=>s(!1),150)},onFocus:()=>{c(!0),f()},onBlur:()=>c(!1),onClick:()=>u(e=>!e),onTooltipMouseEnter:()=>{clearTimeout(h.current),o(!0)},onTooltipMouseLeave:()=>o(!1),pin:(0,i.useCallback)(()=>u(!0),[u])}}}}]);