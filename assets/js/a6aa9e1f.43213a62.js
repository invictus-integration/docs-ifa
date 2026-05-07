"use strict";(self.webpackChunkinvictus_integration=self.webpackChunkinvictus_integration||[]).push([["7496"],{5370(e,r,a){a.d(r,{A:()=>x}),a(6540);var i=a(6369),t=a(4848),l=a(4164),o=a(568),c=a(9987),n=a(7066),d=a(6188);let f={icon:(0,t.jsx)(n.gc,{icon:d.LPI}),title:(0,t.jsx)(o.A,{id:"theme.admonition.praise",description:"The default label used for the Praise admonition (:::praise)",children:"praise"})},h={icon:(0,t.jsx)(n.gc,{icon:d.yy}),title:(0,t.jsx)(o.A,{id:"theme.admonition.feature",description:"The default label for the Feature admonition (:::feature)",children:"New features"})},s=`
  .alert--feature {
    --ifm-alert-background-color: #ecfdf5;
    --ifm-alert-background-color-highlight: #d1fae5;
    --ifm-alert-foreground-color: #166534;
    --ifm-alert-border-color: #1a8c3a;
  }
  html[data-theme='dark'] .alert--feature {
    --ifm-alert-background-color: #0a1f14;
    --ifm-alert-background-color-highlight: #0f2e1d;
    --ifm-alert-foreground-color: #4ade80;
    --ifm-alert-border-color: #4ade80;
  }
`,m={icon:(0,t.jsx)(n.gc,{icon:d.BH7}),title:(0,t.jsx)(o.A,{id:"theme.admonition.tech",description:"The default label for the Tech admonition (:::tech)",children:"Technical changes"})},u=`
  .alert--tech {
    --ifm-alert-background-color: #f0f9fa;
    --ifm-alert-background-color-highlight: #d4eef1;
    --ifm-alert-foreground-color: #014550;
    --ifm-alert-border-color: #014550;
  }
  html[data-theme='dark'] .alert--tech {
    --ifm-alert-background-color: #061619;
    --ifm-alert-background-color-highlight: #0b2227;
    --ifm-alert-foreground-color: #36b1c5;
    --ifm-alert-border-color: #36b1c5;
  }
`,g={icon:(0,t.jsx)(n.gc,{icon:d.wG0}),title:(0,t.jsx)(o.A,{id:"theme.admonition.fix",description:"The default label for the Fix admonition (:::fix)",children:"Bug fixes"})},b=`
  .alert--fix {
    --ifm-alert-background-color: #fff7ed;
    --ifm-alert-background-color-highlight: #fed7aa;
    --ifm-alert-foreground-color: #92400e;
    --ifm-alert-border-color: #92400e;
  }
  html[data-theme='dark'] .alert--fix {
    --ifm-alert-background-color: #1c1106;
    --ifm-alert-background-color-highlight: #2a1a09;
    --ifm-alert-foreground-color: #ff970f;
    --ifm-alert-border-color: #ff970f;
  }
`,x={...i.A,praise:function(e){return(0,t.jsx)(c.A,{...f,...e,className:(0,l.A)("alert alert--praise",e.className),children:e.children})},feature:function(e){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:s}),(0,t.jsx)(c.A,{...h,...e,className:(0,l.A)("alert alert--feature",e.className),children:e.children})]})},tech:function(e){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:u}),(0,t.jsx)(c.A,{...m,...e,className:(0,l.A)("alert alert--tech",e.className),children:e.children})]})},fix:function(e){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:b}),(0,t.jsx)(c.A,{...g,...e,className:(0,l.A)("alert alert--fix",e.className),children:e.children})]})}}}}]);