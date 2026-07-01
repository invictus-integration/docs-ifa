import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

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

const LIGHT = {
  arrow: "#065b68",
  ehBox: "#065b68",
  ehStroke: "#014550",
  ehTitle: "#ffffff",
  childBox: "#014550",
  childStroke: "#014550",
  childText: "#a0dde5",
  invSubtitle: "#a0dde5",
  clientLabel: "#374151",
  clientBoxBg: "#F9FAFB",
  clientBoxStroke: "#D1D5DB",
  scopeTitle: "#374151",
  scopeSep: "#E5E7EB",
  actionBg: "#FFFFFF",
  actionStroke: "#D1D5DB",
  actionText: "#374151",
};

const DARK = {
  arrow: "#2a8f9c",
  ehBox: "#1a5f68",
  ehStroke: "#2a8f9c",
  ehTitle: "#ffffff",
  childBox: "#014550",
  childStroke: "#2a8f9c",
  childText: "#a0dde5",
  invSubtitle: "#a0dde5",
  clientLabel: "#D1D5DB",
  clientBoxBg: "#374151",
  clientBoxStroke: "#6B7280",
  scopeTitle: "#F9FAFB",
  scopeSep: "#4B5563",
  actionBg: "#1F2937",
  actionStroke: "#6B7280",
  actionText: "#D1D5DB",
};

export default function ExceptionHandlerFlowMobile() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

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
            <polygon points="0 0, 10 3.5, 0 7" fill={c.arrow} />
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
        <text x="140" y="18" textAnchor="middle" fontSize="12" fontWeight="600" fill={c.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="20" y="24" width="240" height="144" rx="4" fill={c.clientBoxBg} stroke={c.clientBoxStroke} strokeWidth="1.5" />
        <text x="140" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill={c.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="20" y1="54" x2="260" y2="54" stroke={c.scopeSep} strokeWidth="1" />
        <rect x="30" y="64" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="85" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="30" y="108" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="129" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>

        {/* Arrow: Logic App 1 → Exception Handler */}
        <line x1="140" y1="168" x2="140" y2="206" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Exception Handler Logic App ══ */}
        <rect x="20" y="210" width="240" height="152" rx="6"
          fill={c.clientBoxBg} stroke={c.clientBoxStroke} strokeWidth="1.5" />
        <text x="130" y="190" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ehTitle} style={{ fontFamily: HEADING_FONT }}>
          Exception Handler Logic App
        </text>

        {/* ── Resolve (invictus-style block) ── */}
        <rect x={RES_X} y={RES_Y} width="224" height={INV_H} rx="6"
          fill={c.childBox} stroke={c.childStroke} strokeWidth="1" />
        <rect x={RES_X} y={RES_Y} width={RESOLVE_BADGE_W} height={INV_H}
          fill={c.ehStroke} clipPath="url(#clip-ehm-resolve)" />
        <path
          d={resolveIconPath}
          fill={c.ehTitle}
          transform={`translate(${resolveIconTx.toFixed(2)},${resolveIconTy.toFixed(2)}) scale(${resolveIconScale.toFixed(6)})`}
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (224 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 18}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="13" fontWeight="600" fill={c.ehTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Resolve
        </text>
        <line
          x1={RES_X + RESOLVE_BADGE_W + 3} y1={RES_Y + 38}
          x2={RES_X + 224 - 3} y2={RES_Y + 38}
          stroke="rgba(255,255,255,0.18)" strokeWidth="0.75"
        />
        <text
          x={RES_X + RESOLVE_BADGE_W + (224 - RESOLVE_BADGE_W) / 2}
          y={RES_Y + 47}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill={c.invSubtitle}
          style={{ fontFamily: BODY_FONT, opacity: 0.8 }}
        >
          Regex Translator + AI Interpreter
        </text>

        {/* ── Return block ── */}
        <rect x="28" y="298" width="224" height="36" rx="3"
          fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />

        <text
          x="140" y="316"
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill={c.ehTitle}
          style={{ fontFamily: BODY_FONT }}
        >
          Return
        </text>

        {/* Arrow: Exception Handler → Logic App 2 */}
        <line x1="140" y1="555" x2="140" y2="365" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Logic App 2 (client) ══ */}
        <text x="140" y="416" textAnchor="middle" fontSize="12" fontWeight="600" fill={c.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="20" y="422" width="240" height="144" rx="4" fill={c.clientBoxBg} stroke={c.clientBoxStroke} strokeWidth="1.5" />
        <text x="140" y="442" textAnchor="middle" fontSize="11" fontWeight="700" fill={c.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="20" y1="452" x2="260" y2="452" stroke={c.scopeSep} strokeWidth="1" />
        <rect x="30" y="462" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="483" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="30" y="506" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="527" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>
      </svg>
    </div>
  );
}
