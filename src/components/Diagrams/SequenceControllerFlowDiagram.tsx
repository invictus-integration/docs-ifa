import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

// Invictus block dimensions — matches ComponentFlowDiagram proportions
const INV_H = 56; // taller to accommodate the storage-backend footer
const RX = 6;
const ACCENT_W = 8;

const LIGHT = {
  arrow: "#065b68",
  boxBg: "#ffffff",
  boxStroke: "#b8c0c2",
  bodyText: "#1c1e21",
  invBox: "#065b68",
  invStroke: "#014550",
  invAccent: "#014550",
  invTitle: "#ffffff",
  invSubtitle: "#a0dde5",
  badge: "#ff970f",
  controlTask: "#ff970f",
};

const DARK = {
  arrow: "#2a8f9c",
  boxBg: "#374151",
  boxStroke: "#6B7280",
  bodyText: "#D1D5DB",
  invBox: "#1a5f68",
  invStroke: "#2a8f9c",
  invAccent: "#2a8f9c",
  invTitle: "#ffffff",
  invSubtitle: "#a0dde5",
  badge: "#c27311",
  controlTask: "#c27311",
};

export default function SequenceControllerFlow() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 480 472"
        role="img"
        aria-label="Sequence Controller flow diagram"
      >
        <defs>
          <marker id="arr-SeqController" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 8 3, 0 6" fill={c.arrow} />
          </marker>
          {/* Clip paths keep the accent bar inside the rounded block corners */}
          <clipPath id="clip-sc-get">
            <rect x="125" y="82" width="150" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-sc-wait">
            <rect x="125" y="184" width="150" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-sc-complete">
            <rect x="125" y="388" width="150" height={INV_H} rx={RX} />
          </clipPath>
        </defs>

        {/* ══ Receive ══ */}
        <rect x="125" y="12" width="150" height="44" fill={c.boxBg} stroke={c.boxStroke} strokeWidth="1.5" />
        <rect x="125" y="12" width="8" height="44" fill={c.boxStroke} />
        <text x="200" y="34" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={c.bodyText} style={{ fontFamily: BODY_FONT }}>
          Receive
        </text>

        <line x1="200" y1="56" x2="200" y2="78" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-SeqController)" />

        {/* ══ Get sequence number (Invictus — y=82, h=56) ══ */}
        <rect x="125" y="82" width="150" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="125" y="82" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-sc-get)" />
        <text x="200" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Get sequence number
        </text>
        <line x1={125 + ACCENT_W + 3} y1="122" x2="271" y2="122" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="200" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="235" y="73" width="40" height="18" rx="3" fill={c.badge} />
        <text x="255" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Arrow: Get seq# bottom (82+56=138) → Wait for sequence (y=184), gap=46 */}
        <line x1="200" y1="138" x2="200" y2="180" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-SeqController)" />

        {/* ══ Wait for sequence (Invictus — y=184, h=56) ══ */}
        <rect x="125" y="184" width="150" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="125" y="184" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-sc-wait)" />
        <text x="200" y="202" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Wait for sequence
        </text>
        <line x1={125 + ACCENT_W + 3} y1="224" x2="271" y2="224" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="200" y="232" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP-callback badge */}
        <rect x="191" y="175" width="84" height="18" rx="3" fill={c.badge} />
        <text x="233" y="184" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP-callback
        </text>

        {/* Arrow: Wait for seq bottom (184+56=240) → Control task (y=278), gap=38 */}
        <line x1="200" y1="240" x2="200" y2="278" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-SeqController)" />

        {/* ══ Control task (customer work) ══ */}
        <rect x="125" y="282" width="150" height="44" fill={c.controlTask} stroke={c.controlTask} strokeWidth="1" />
        <text x="200" y="304" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill="#ffffff" style={{ fontFamily: HEADING_FONT }}>
          Control task
        </text>

        {/* Arrow: Control task bottom (282+44=326) → Complete sequence (y=384), gap=58 */}
        <line x1="200" y1="326" x2="200" y2="384" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-SeqController)" />

        {/* ══ Complete sequence (Invictus — y=388, h=56) ══ */}
        <rect x="125" y="388" width="150" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="125" y="388" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-sc-complete)" />
        <text x="200" y="406" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Complete sequence
        </text>
        <line x1={125 + ACCENT_W + 3} y1="428" x2="271" y2="428" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="200" y="436" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="235" y="379" width="40" height="18" rx="3" fill={c.badge} />
        <text x="255" y="388" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Dashed right loop: right of Get seq# → right of Wait for seq (passes sequence number) */}
        <path d="M 275,100 H 452 V 202 H 275" fill="none" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-SeqController)" />

        {/* Dashed left loop: left of Wait for seq → left of Complete seq (passes sequence number) */}
        <path d="M 125,202 H 28 V 406 H 125" fill="none" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-SeqController)" />
      </svg>
    </div>
  );
}

