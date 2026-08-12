import React from "react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { DIAGRAM_COLORS as C, HEADING_FONT, BODY_FONT } from "./diagramTheme";

const INV_H = 56;
const RESOLVE_BADGE_W = 20;
const RESOLVE_ICON_SIZE = 11;

// Resolve block anchor (inside the mobile EH box)
const RES_X = 28;
const RES_Y = 228;

const resolveIconVbW = faTriangleExclamation.icon[0];
const resolveIconVbH = faTriangleExclamation.icon[1];
const resolveIconPath = faTriangleExclamation.icon[4] as string;
const resolveIconScale = RESOLVE_ICON_SIZE / resolveIconVbW;

const resolveIconTx = RES_X + (RESOLVE_BADGE_W - resolveIconVbW * resolveIconScale) / 2;
const resolveIconTy = RES_Y + (INV_H - resolveIconVbH * resolveIconScale) / 2;

export default function ExceptionHandlerFlowMobile() {
  return (
    <div style={{ maxWidth: 360, margin: "1.5rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 280 572"
        role="img"
        aria-label="Exception Handler flow diagram"
      >
        <defs>
          <marker id="arr-EHMobile" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 10 3.5, 0 7" fill={C.arrow} />
          </marker>
          <marker id="arr-EHMobile-internal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.7)" />
          </marker>
          <clipPath id="clip-ehm-resolve">
            <rect x={RES_X} y={RES_Y} width="224" height={INV_H} rx="6" />
          </clipPath>
          <clipPath id="clip-ehm-return">
            <rect x="28" y="318" width="224" height="36" rx="3" />
          </clipPath>
        </defs>

        {/* ══ Logic App 1 (client) ══ */}
        <text x="140" y="18" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="20" y="24" width="240" height="144" rx="4" fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="140" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="20" y1="54" x2="260" y2="54" stroke={C.scopeSep} strokeWidth="1" />
        <rect x="30" y="64" width="220" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="140" y="85" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="30" y="108" width="220" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="140" y="129" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>

        {/* Arrow: Logic App 1 → Exception Handler */}
        <line x1="140" y1="168" x2="140" y2="206" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Exception Handler Logic App ══ */}
        <rect x="20" y="210" width="240" height="152" rx="6"
          fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="130" y="190" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Exception Handler Logic App
        </text>

        {/* ── Resolve (invictus-style block) ── */}
        <rect x={RES_X} y={RES_Y} width="224" height={INV_H} rx="6"
          fill={C.ehBox} stroke={C.ehStroke} strokeWidth="1" />
        <rect x={RES_X} y={RES_Y} width={RESOLVE_BADGE_W} height={INV_H}
          fill={C.ehStroke} clipPath="url(#clip-ehm-resolve)" />
        <path
          d={resolveIconPath}
          fill={C.ehTitle}
          transform={`translate(${resolveIconTx.toFixed(2)},${resolveIconTy.toFixed(2)}) scale(${resolveIconScale.toFixed(6)})`}
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (224 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 18}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="13" fontWeight="600" fill={C.ehTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Resolve
        </text>
        <line
          x1={RES_X + RESOLVE_BADGE_W + 3} y1={RES_Y + 38}
          x2={RES_X + 224 - 3} y2={RES_Y + 38}
          stroke={C.separator} strokeWidth="0.75"
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (224 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 47}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill={C.invSubtitle}
          style={{ fontFamily: BODY_FONT, opacity: 0.8 }}
        >
          Regex Translator + AI Interpreter
        </text>

        {/* ── Return block ── */}
        <rect x="28" y="298" width="224" height="36" rx="3"
          fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />

        <text
          x="140" y="316"
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill={C.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Return
        </text>

        {/* Arrow: Exception Handler → Logic App 2 */}
        <line x1="140" y1="555" x2="140" y2="365" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Logic App 2 (client) ══ */}
        <text x="140" y="416" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="20" y="422" width="240" height="144" rx="4" fill={C.clientBoxBg} stroke={C.clientBoxStroke} strokeWidth="1.5" />
        <text x="140" y="442" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="20" y1="452" x2="260" y2="452" stroke={C.scopeSep} strokeWidth="1" />
        <rect x="30" y="462" width="220" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="140" y="483" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="30" y="506" width="220" height="34" rx="3" fill={C.actionBg} stroke={C.actionStroke} strokeWidth="1" />
        <text x="140" y="527" textAnchor="middle" fontSize="11" fill={C.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>
      </svg>
    </div>
  );
}
