import React from "react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { DIAGRAM_COLORS as C, HEADING_FONT, BODY_FONT } from "./diagramTheme";

// Invictus block dimensions — mirrors SequenceControllerFlow / TimeSequencerFlow
const INV_H = 56;       // taller block to fit the storage-backend footer
const RESOLVE_BADGE_W = 20;  // icon-badge width (wider than plain ACCENT_W to hold the icon)
const RESOLVE_ICON_SIZE = 11;

// Resolve block anchor
const RES_X = 28;
const RES_Y = 136;

// faTriangleExclamation: icon[0]=vbWidth, icon[1]=vbHeight, icon[4]=pathData
const resolveIconVbW = faTriangleExclamation.icon[0];
const resolveIconVbH = faTriangleExclamation.icon[1];
const resolveIconPath = faTriangleExclamation.icon[4] as string;
const resolveIconScale = RESOLVE_ICON_SIZE / resolveIconVbW;

// Icon centred inside the badge (pre-computed; block position is fixed)
const resolveIconTx = RES_X + (RESOLVE_BADGE_W - resolveIconVbW * resolveIconScale) / 2;
const resolveIconTy = RES_Y + (INV_H - resolveIconVbH * resolveIconScale) / 2;

type ExceptionHandlerFlowProps = { describedById?: string };

export default function ExceptionHandlerFlow({ describedById }: ExceptionHandlerFlowProps) {
  return (
    <div style={{ margin: "1.5rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 640 380"
        role="img"
        aria-label="Exception Handler flow diagram"
        aria-describedby={describedById}
      >
        <defs>
          {/* External arrows — teal, used for LA → EH dashed connections */}
          <marker id="arr-ExceptionHandler" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 10 3.5, 0 7" fill={C.arrow} />
          </marker>
          {/* Internal arrow — white, used for Resolve → Return inside the teal EH box */}
          <marker id="arr-EH-internal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.7)" />
          </marker>
          {/* Clip paths — keep accent bars inside rounded block corners */}
          <clipPath id="clip-eh-resolve">
            <rect x={RES_X} y={RES_Y} width="204" height={INV_H} rx="6" />
          </clipPath>
          <clipPath id="clip-eh-return">
            <rect x="28" y="202" width="204" height="36" rx="3" />
          </clipPath>
        </defs>

        {/* ══ Exception Handler Logic App ══ */}
        <rect x="20" y="110" width="220" height="152" rx="6"
          fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="130" y="85" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Exception Handler
        </text>
        <text x="130" y="101" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>

        {/* ── Resolve (invictus-style block) ── */}
        <rect x={RES_X} y={RES_Y} width="204" height={INV_H} rx="6"
          fill={C.ehBox} stroke={C.childStroke} strokeWidth="1" />
        {/* Icon badge — lighter accent section, clipped to rounded corners */}
        <rect x={RES_X} y={RES_Y} width={RESOLVE_BADGE_W} height={INV_H}
          fill={C.ehStroke} clipPath="url(#clip-eh-resolve)" />
        {/* Triangle-exclamation icon centred in the badge */}
        <path
          d={resolveIconPath}
          fill={C.ehTitle}
          transform={`translate(${resolveIconTx.toFixed(2)},${resolveIconTy.toFixed(2)}) scale(${resolveIconScale.toFixed(6)})`}
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (204 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 18}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="13" fontWeight="600" fill={C.ehTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Resolve
        </text>
        {/* Storage / dependency footer — matches invictus block pattern */}
        <line
          x1={RES_X + RESOLVE_BADGE_W + 3} y1={RES_Y + 38}
          x2={RES_X + 204 - 3} y2={RES_Y + 38}
          stroke={C.separator} strokeWidth="0.75"
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (204 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 47}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill={C.invSubtitle}
          style={{ fontFamily: BODY_FONT, opacity: 0.8 }}
        >
          Regex Translator + AI Interpreter
        </text>

        {/* ── Return block ── */}
        <rect x="28" y="202" width="204" height="36" rx="3"
          fill={C.actionBg} stroke={C.clientBoxStroke} strokeWidth="1" />
        <text
          x="130" y="220"
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill={C.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Return
        </text>

        {/* ══ Logic App 1 ══ */}
        <text x="500" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="390" y="46" width="220" height="144" rx="4"
          fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="500" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="390" y1="78" x2="610" y2="78" stroke={C.scopeSep} strokeWidth="1" />
        <rect x="400" y="88" width="200" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="500" y="109" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="400" y="132" width="200" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="500" y="153" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>

        {/* ══ Logic App 2 ══ */}
        <text x="500" y="212" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="390" y="220" width="220" height="144" rx="4"
          fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="500" y="242" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="390" y1="252" x2="610" y2="252" stroke={C.scopeSep} strokeWidth="1" />
        <rect x="400" y="262" width="200" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="500" y="283" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="400" y="306" width="200" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="500" y="327" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>

        {/* ══ Dashed arrows: Logic Apps → Exception Handler ══ */}
        {/* LA1 Resolve → EH entry (Resolve level) */}
        <path
          d="M 390,105 L 310,105 L 310,164 L 240,164"
          fill="none" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6,4"
          markerEnd="url(#arr-ExceptionHandler)"
        />
        {/* LA2 Resolve → EH (Return level) */}
        <path
          d="M 390,279 L 310,279 L 310,175 L 240,175"
          fill="none" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6,4"
          markerEnd="url(#arr-ExceptionHandler)"
        />
      </svg>
    </div>
  );
}
