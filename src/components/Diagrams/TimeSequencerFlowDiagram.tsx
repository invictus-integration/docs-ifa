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
  stepBox: "#6c7374",
  stepTitle: "#ffffff",
  termBox: "#b91c1c",
  groupBorder: "#b8c0c2",
  badge: "#ff970f",
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
  stepBox: "#4B5563",
  stepTitle: "#ffffff",
  termBox: "#dc2626",
  groupBorder: "#374151",
  badge: "#c27311",
};

export default function TimeSequencerFlow() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 490 418"
        role="img"
        aria-label="Time Sequencer flow diagram"
      >
        <defs>
          <marker
            id="arr-TimeSequencer"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 8 3, 0 6" fill={c.arrow} />
          </marker>
          {/* Clip paths keep the accent bar inside the rounded block corners */}
          <clipPath id="clip-ts-wait">
            <rect x="125" y="82" width="150" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-ts-complete">
            <rect x="258" y="344" width="130" height={INV_H} rx={RX} />
          </clipPath>
        </defs>

        {/* ══ Receive ══ */}
        <rect x="125" y="12" width="150" height="44" fill={c.boxBg} stroke={c.boxStroke} strokeWidth="1.5" />
        <rect x="125" y="12" width="8" height="44" fill={c.boxStroke} />
        <text x="200" y="34" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={c.bodyText} style={{ fontFamily: BODY_FONT }}>
          Receive
        </text>

        <line x1="200" y1="56" x2="200" y2="78" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Wait for exec. (Invictus — INV_H=56) ══ */}
        <rect x="125" y="82" width="150" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="125" y="82" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-ts-wait)" />
        <text x="200" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Wait for exec.
        </text>
        <line x1={125 + ACCENT_W + 3} y1="122" x2="271" y2="122" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="200" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP-callback badge */}
        <rect x="191" y="73" width="84" height="18" rx="3" fill={c.badge} />
        <text x="233" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP-callback
        </text>

        {/* Arrow: Wait for exec. bottom (82+56=138) → group container (y=162) */}
        <line x1="200" y1="138" x2="200" y2="176" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Group container — shifted +12 from original ══ */}
        <rect x="20" y="162" width="388" height="248" rx="6" fill="none" stroke={c.groupBorder} strokeWidth="1" />

        {/* ══ Switch ══ */}
        <rect x="125" y="180" width="150" height="44" rx="2" fill={c.stepBox} />
        <text x="200" y="202" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Switch
        </text>

        {/* Branch lines */}
        <line x1="200" y1="224" x2="200" y2="240" stroke={c.arrow} strokeWidth="1.5" />
        <line x1="108" y1="240" x2="323" y2="240" stroke={c.arrow} strokeWidth="1.5" />
        <line x1="108" y1="240" x2="108" y2="260" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />
        <line x1="323" y1="240" x2="323" y2="260" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Stop / Start ══ */}
        <rect x="43" y="264" width="130" height="44" rx="2" fill={c.stepBox} />
        <text x="108" y="286" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Stop
        </text>
        <rect x="258" y="264" width="130" height="44" rx="2" fill={c.stepBox} />
        <text x="323" y="286" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Start
        </text>

        <line x1="108" y1="308" x2="108" y2="340" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />
        <line x1="323" y1="308" x2="323" y2="340" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Terminate ══ */}
        <rect x="43" y="344" width="130" height="44" rx="2" fill={c.termBox} />
        <text x="108" y="366" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill="#ffffff" style={{ fontFamily: HEADING_FONT }}>
          Terminate
        </text>

        {/* ══ Complete exec. (Invictus — INV_H=56, y=344) ══ */}
        <rect x="258" y="344" width="130" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="258" y="344" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-ts-complete)" />
        <text x="323" y="362" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Complete exec.
        </text>
        <line x1={258 + ACCENT_W + 3} y1="384" x2="385" y2="384" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="323" y="392" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="348" y="335" width="40" height="18" rx="3" fill={c.badge} />
        <text x="368" y="344" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Dashed return arrow: right of Wait for exec. → right of Complete exec. */}
        <path d="M 275,100 H 466 V 362 H 388" fill="none" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-TimeSequencer)" />
      </svg>
    </div>
  );
}
