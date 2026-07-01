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

export default function PubSubFlowMobile() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 380, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 249 519"
        role="img"
        aria-label="PubSub message flow diagram for mobile layout"
      >
        <defs>
          <marker id="arr-PubSubMobile" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 8 3, 0 6" fill={c.arrow} />
          </marker>
          {/* Clip paths keep the accent bar inside the rounded block corners */}
          <clipPath id="clip-psm-publish">
            <rect x="22" y="172" width="200" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-psm-subscribe">
            <rect x="22" y="320" width="200" height={INV_H} rx={RX} />
          </clipPath>
          <clipPath id="clip-psm-acknowledge">
            <rect x="22" y="420" width="200" height={INV_H} rx={RX} />
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

        <line x1="122" y1="136" x2="122" y2="169" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSubMobile)" />

        {/* Publish (Invictus) */}
        <rect x="22" y="172" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="22" y="172" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-psm-publish)" />
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

        {/* Dashed arrow: Publish → Subscribe (via Service Bus) */}
        <line x1="122" y1="236" x2="122" y2="317" stroke={c.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-PubSubMobile)" />

        {/* ══ Subscriber Logic App ══ */}
        <text x="10" y="292" fontSize="13" fontWeight="700" fill={c.labelText} style={{ fontFamily: HEADING_FONT }}>
          Subscriber Logic App
        </text>
        <rect x="10" y="300" width="224" height="204" rx="4" fill="none" stroke={c.containerStroke} strokeWidth="1.5" />

        {/* Subscribe (Invictus) */}
        <rect x="22" y="320" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="22" y="320" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-psm-subscribe)" />
        <text x="122" y="340" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Subscribe
        </text>
        <line x1={22 + ACCENT_W + 3} y1="368" x2="218" y2="368" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="122" y="376" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="311" width="40" height="18" rx="3" fill={c.badge} />
        <text x="202" y="320" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        <line x1="122" y1="384" x2="122" y2="417" stroke={c.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSubMobile)" />

        {/* Acknowledge (Invictus) */}
        <rect x="22" y="420" width="200" height={INV_H} rx={RX} fill={c.invBox} stroke={c.invStroke} strokeWidth="1" />
        <rect x="22" y="420" width={ACCENT_W} height={INV_H} fill={c.invAccent} clipPath="url(#clip-psm-acknowledge)" />
        <text x="122" y="440" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={c.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Acknowledge
        </text>
        <line x1={22 + ACCENT_W + 3} y1="468" x2="218" y2="468" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="122" y="476" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="411" width="40" height="18" rx="3" fill={c.badge} />
        <text x="202" y="420" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill="#ffffff" style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>
      </svg>
    </div>
  );
}
