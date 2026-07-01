import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

// Invictus block dimensions — matches ComponentFlowDiagram proportions
const INV_H = 64;
const RX = 6;
const ACCENT_W = 8;

const LIGHT = {
  arrow: "#065b68",
  invBox: "#065b68",
  invStroke: "#014550",
  invAccent: "#014550",
  invTitle: "#ffffff",
  invSubtitle: "#a0dde5",
  containerStroke: "#b8c0c2",
  boxStroke: "#b8c0c2",
  bodyAccent: "#b8c0c2",
  boxBg: "#ffffff",
  bodyText: "#1c1e21",
  labelText: "#1c1e21",
  badge: "#ff970f",
};

const DARK = {
  arrow: "#2a8f9c",
  invAccent: "#2a8f9c",
  invStroke: "#2a8f9c",
  invBox: "#1a5f68",
  invTitle: "#ffffff",
  invSubtitle: "#a0dde5",
  containerStroke: "#374151",
  boxBg: "#374151",
  boxStroke: "#6B7280",
  bodyAccent: "#6B7280",
  bodyText: "#D1D5DB",
  labelText: "#e3e3e3",
  badge: "#c27311",
};

export default function PubSubFlow() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 680, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 528 271"
        role="img"
        aria-label="PubSub message flow diagram"
      >
        <defs>
          <marker id="arr-PubSub" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 8 3, 0 6" fill={c.arrow} />
          </marker>
          {/* Clip paths keep the accent bar inside the rounded block corners */}
          <clipPath id="clip-ps-publish">
            <rect x="22" y="172" width="200" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-ps-subscribe">
            <rect x="301" y="72" width="200" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-ps-acknowledge">
            <rect x="301" y="172" width="200" height={INV_H} rx={RX} />
          </clipPath>
        </defs>

        {/* ══ Publisher Logic App ══ */}
        <text x="10" y="44" fontSize="13" fontWeight="700" fill={c.labelText} style={{ fontFamily: HEADING_FONT }}>
          Publisher Logic App
        </text>
        <rect x="10" y="52" width="224" height="204" rx="4" fill="none" stroke={c.containerStroke} strokeWidth="1.5" />

        {/* Receive */}
        <rect x="22" y="72" width="200" height="64" fill={c.boxBg} stroke={c.boxStroke} strokeWidth="1" />
        <rect x="22" y="72" width={ACCENT_W} height="64" fill={c.bodyAccent} />
        <text x="122" y="104" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={c.bodyText} style={{ fontFamily: BODY_FONT }}>
          Receive
        </text>

        <line x1="122" y1="136" x2="122" y2="169" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSub)" />

        {/* Publish (Invictus) */}
        <rect x="22" y="172" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="22" y="172" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-ps-publish)" />
        <text x="122" y="192" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Publish
        </text>
        <line x1={22 + ACCENT_W + 3} y1="220" x2="218" y2="220" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="122" y="228" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="163" width="40" height="18" rx="3" fill={c.badge} />
        <text x="202" y="172" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* ══ Subscriber Logic App ══ */}
        <text x="289" y="44" fontSize="13" fontWeight="700" fill={c.labelText} style={{ fontFamily: HEADING_FONT }}>
          Subscriber Logic App
        </text>
        <rect x="289" y="52" width="224" height="204" rx="4" fill="none" stroke={c.containerStroke} strokeWidth="1.5" />

        {/* Subscribe (Invictus) */}
        <rect x="301" y="72" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="301" y="72" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-ps-subscribe)" />
        <text x="401" y="92" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Subscribe
        </text>
        <line x1={301 + ACCENT_W + 3} y1="120" x2="497" y2="120" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="401" y="128" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="461" y="63" width="40" height="18" rx="3" fill={c.badge} />
        <text x="481" y="72" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        <line x1="401" y1="136" x2="401" y2="169" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSub)" />

        {/* Acknowledge (Invictus) */}
        <rect x="301" y="172" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="301" y="172" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-ps-acknowledge)" />
        <text x="401" y="192" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Acknowledge
        </text>
        <line x1={301 + ACCENT_W + 3} y1="220" x2="497" y2="220" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="401" y="228" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="461" y="163" width="40" height="18" rx="3" fill={c.badge} />
        <text x="481" y="172" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Z-arrow: Publish → Subscribe (via Service Bus) */}
        <path d="M 222,192 H 261 V 92 H 301" fill="none" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-PubSub)" />
      </svg>
    </div>
  );
}

