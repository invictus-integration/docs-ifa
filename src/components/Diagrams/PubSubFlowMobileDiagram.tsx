import React from "react";

// Colors driven by CSS custom properties (--inv-diagram-*) in custom.css.
const C = {
  // Base keys (ComponentFlowDiagram-style)
  header:          "var(--inv-diagram-header-bg)",
  accent:          "var(--inv-diagram-header-accent)",
  fill:            "var(--inv-diagram-surface)",
  stroke:          "var(--inv-diagram-surface-stroke)",
  text:            "var(--inv-diagram-text)",
  arrow:           "var(--inv-diagram-arrow)",
  rowTitle:        "var(--inv-diagram-header-text)",
  rowSubtitle:     "var(--inv-diagram-header-subtitle)",
  headerSubtitle:  "var(--inv-diagram-header-subtitle)",
  separator:       "var(--inv-diagram-separator)",
  // Invictus teal component blocks
  invBox:          "var(--inv-diagram-header-bg)",
  invAccent:       "var(--inv-diagram-header-accent)",
  invStroke:       "var(--inv-diagram-header-accent)",
  invTitle:        "var(--inv-diagram-header-text)",
  invSubtitle:     "var(--inv-diagram-header-subtitle)",
  badge:           "var(--inv-diagram-header-bg)",
  // Regular action/container boxes
  boxBg:           "var(--inv-diagram-surface)",
  boxStroke:       "var(--inv-diagram-surface-stroke)",
  bodyText:        "var(--inv-diagram-text)",
  bodyAccent:      "var(--inv-diagram-surface-stroke)",
  labelText:       "var(--inv-diagram-text)",
  containerStroke: "var(--inv-diagram-surface-stroke)",
  // ExceptionHandler-specific
  clientBoxBg:     "var(--inv-diagram-surface)",
  clientBoxStroke: "var(--inv-diagram-surface-stroke)",
  clientLabel:     "var(--inv-diagram-text)",
  ehBox:           "var(--inv-diagram-header-bg)",
  ehStroke:        "var(--inv-diagram-header-accent)",
  ehTitle:         "var(--inv-diagram-header-text)",
  childStroke:     "var(--inv-diagram-header-accent)",
  actionBg:        "var(--inv-diagram-surface)",
  actionText:      "var(--inv-diagram-text)",
  actionStroke:    "var(--inv-diagram-surface-stroke)",
  scopeTitle:      "var(--inv-diagram-text)",
  scopeSep:        "var(--inv-diagram-surface-stroke)",
  // Customer step/task boxes (non-Invictus)
  stepBox:         "var(--inv-diagram-step-bg)",
  stepTitle:       "var(--inv-diagram-step-text)",
  termBox:         "var(--inv-diagram-header-bg)",
  controlTask:     "var(--inv-diagram-header-bg)",
  groupBorder:     "var(--inv-diagram-surface-stroke)",
  // Sort/sequence illustration boxes
  aBox:            "var(--inv-sort-a-bg)",
  aText:           "var(--inv-sort-text)",
  bBox:            "var(--inv-sort-b-bg)",
  bText:           "var(--inv-sort-text)",
  cBox:            "var(--inv-sort-c-bg)",
  cText:           "var(--inv-sort-text)",
  dBox:            "var(--inv-sort-d-bg)",
  dText:           "var(--inv-sort-text)",
  separatorFill:   "var(--inv-sort-separator)",
  slot1Box:        "var(--inv-sort-slot-active-bg)",
  slot1Accent:     "var(--inv-sort-slot-active-accent)",
  slot1Text:       "var(--inv-diagram-header-text)",
  slot2Box:        "var(--inv-sort-slot-default-bg)",
  slot2Text:       "var(--inv-sort-slot-default-text)",
  slot3Box:        "var(--inv-sort-slot-default-bg)",
  slot3Text:       "var(--inv-sort-slot-default-text)",
  slot4Box:        "var(--inv-sort-slot-pending-bg)",
  slot4Stroke:     "var(--inv-sort-slot-pending-stroke)",
  slot4Text:       "var(--inv-sort-slot-pending-text)",
};


const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

// Invictus block dimensions — matches ComponentFlowDiagram proportions
const INV_H = 64;
const RX = 6;
const ACCENT_W = 8;

export default function PubSubFlowMobile() {
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
            <polygon points="0 0, 8 3, 0 6" fill={C.arrow} />
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
        <text x="10" y="44" fontSize="13" fontWeight="700" fill={C.labelText} style={{ fontFamily: HEADING_FONT }}>
          Publisher Logic App
        </text>
        <rect x="10" y="52" width="224" height="204" rx="4" fill="none" stroke={C.containerStroke} strokeWidth="1.5" />

        {/* Receive */}
        <rect x="22" y="72" width="200" height="64" fill={C.boxBg} stroke={C.boxStroke} strokeWidth="1" />
        <rect x="22" y="72" width={ACCENT_W} height="64" fill={C.bodyAccent} />
        <text x="122" y="104" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={C.bodyText} style={{ fontFamily: BODY_FONT }}>
          Receive
        </text>

        <line x1="122" y1="136" x2="122" y2="169" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSubMobile)" />

        {/* Publish (Invictus) */}
        <rect x="22" y="172" width="200" height={INV_H} rx={RX} fill={C.invBox} stroke={C.invStroke} strokeWidth="1" />
        <rect x="22" y="172" width={ACCENT_W} height={INV_H} fill={C.invAccent} clipPath="url(#clip-psm-publish)" />
        <text x="122" y="192" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Publish
        </text>
        <line x1={22 + ACCENT_W + 3} y1="220" x2="218" y2="220" stroke={C.separator} strokeWidth="0.75" />
        <text x="122" y="228" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={C.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="163" width="40" height="18" rx="3" fill={C.badge} />
        <text x="202" y="172" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill={C.rowTitle} style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Dashed arrow: Publish → Subscribe (via Service Bus) */}
        <line x1="122" y1="236" x2="122" y2="317" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-PubSubMobile)" />

        {/* ══ Subscriber Logic App ══ */}
        <text x="10" y="292" fontSize="13" fontWeight="700" fill={C.labelText} style={{ fontFamily: HEADING_FONT }}>
          Subscriber Logic App
        </text>
        <rect x="10" y="300" width="224" height="204" rx="4" fill="none" stroke={C.containerStroke} strokeWidth="1.5" />

        {/* Subscribe (Invictus) */}
        <rect x="22" y="320" width="200" height={INV_H} rx={RX} fill={C.invBox} stroke={C.invStroke} strokeWidth="1" />
        <rect x="22" y="320" width={ACCENT_W} height={INV_H} fill={C.invAccent} clipPath="url(#clip-psm-subscribe)" />
        <text x="122" y="340" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Subscribe
        </text>
        <line x1={22 + ACCENT_W + 3} y1="368" x2="218" y2="368" stroke={C.separator} strokeWidth="0.75" />
        <text x="122" y="376" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={C.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="311" width="40" height="18" rx="3" fill={C.badge} />
        <text x="202" y="320" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill={C.rowTitle} style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        <line x1="122" y1="384" x2="122" y2="417" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-PubSubMobile)" />

        {/* Acknowledge (Invictus) */}
        <rect x="22" y="420" width="200" height={INV_H} rx={RX} fill={C.invBox} stroke={C.invStroke} strokeWidth="1" />
        <rect x="22" y="420" width={ACCENT_W} height={INV_H} fill={C.invAccent} clipPath="url(#clip-psm-acknowledge)" />
        <text x="122" y="440" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Acknowledge
        </text>
        <line x1={22 + ACCENT_W + 3} y1="468" x2="218" y2="468" stroke={C.separator} strokeWidth="0.75" />
        <text x="122" y="476" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={C.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Service Bus + Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="182" y="411" width="40" height="18" rx="3" fill={C.badge} />
        <text x="202" y="420" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" letterSpacing="0.5" fill={C.rowTitle} style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>
      </svg>
    </div>
  );
}
