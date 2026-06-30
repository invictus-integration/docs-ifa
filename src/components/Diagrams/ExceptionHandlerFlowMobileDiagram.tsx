import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

const LIGHT = {
  arrow: "#065b68",
  ehBox: "#065b68",
  ehStroke: "#014550",
  ehTitle: "#ffffff",
  connectorLine: "rgba(255,255,255,0.45)",
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
  connectorLine: "rgba(255,255,255,0.35)",
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
        viewBox="0 0 280 552"
        role="img"
        aria-label="Exception Handler flow diagram"
      >
        <defs>
          <marker
            id="arr-EHMobile"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={c.arrow} />
          </marker>
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
        <line x1="140" y1="168" x2="140" y2="196" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Exception Handler Logic App ══ */}
        <rect x="20" y="200" width="240" height="150" rx="6" fill={c.ehBox} stroke={c.ehStroke} strokeWidth="1.5" />
        <text x="140" y="227" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ehTitle} style={{ fontFamily: HEADING_FONT }}>
          Exception Handler
        </text>
        <text x="140" y="243" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ehTitle} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        {/* T-shape connector to child boxes */}
        <line x1="140" y1="255" x2="140" y2="266" stroke={c.connectorLine} strokeWidth="1.5" />
        <line x1="78" y1="266" x2="202" y2="266" stroke={c.connectorLine} strokeWidth="1.5" />
        <line x1="78" y1="266" x2="78" y2="278" stroke={c.connectorLine} strokeWidth="1.5" />
        <line x1="202" y1="266" x2="202" y2="278" stroke={c.connectorLine} strokeWidth="1.5" />
        {/* Child action boxes */}
        <rect x="28" y="278" width="100" height="32" rx="3" fill={c.childBox} stroke={c.childStroke} strokeWidth="1" />
        <text x="78" y="298" textAnchor="middle" fontSize="10" fill={c.childText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="152" y="278" width="100" height="32" rx="3" fill={c.childBox} stroke={c.childStroke} strokeWidth="1" />
        <text x="202" y="298" textAnchor="middle" fontSize="10" fill={c.childText} style={{ fontFamily: BODY_FONT }}>
          Return
        </text>
        {/* Dependency footer */}
        <line x1="28" y1="324" x2="252" y2="324" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="140" y="338" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Regex Translator + AI Interpreter
        </text>

        {/* Arrow: Logic App 2 → Exception Handler (upward) */}
        <line x1="140" y1="380" x2="140" y2="352" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-EHMobile)" />

        {/* ══ Logic App 2 (client) ══ */}
        <text x="140" y="400" textAnchor="middle" fontSize="12" fontWeight="600" fill={c.clientLabel} style={{ fontFamily: HEADING_FONT }}>
          Logic App
        </text>
        <rect x="20" y="406" width="240" height="144" rx="4" fill={c.clientBoxBg} stroke={c.clientBoxStroke} strokeWidth="1.5" />
        <text x="140" y="426" textAnchor="middle" fontSize="11" fontWeight="700" fill={c.scopeTitle} style={{ fontFamily: HEADING_FONT }}>
          Scope
        </text>
        <line x1="20" y1="436" x2="260" y2="436" stroke={c.scopeSep} strokeWidth="1" />
        <rect x="30" y="446" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="467" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Resolve
        </text>
        <rect x="30" y="490" width="220" height="34" rx="3" fill={c.actionBg} stroke={c.actionStroke} strokeWidth="1" />
        <text x="140" y="511" textAnchor="middle" fontSize="11" fill={c.actionText} style={{ fontFamily: BODY_FONT }}>
          Terminate
        </text>
      </svg>
    </div>
  );
}
