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
const INV_H = 56; // taller to accommodate the storage-backend footer
const RX = 6;
const ACCENT_W = 8;

export default function TimeSequencerFlow() {
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
            <polygon points="0 0, 8 3, 0 6" fill={C.arrow} />
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
        <rect x="125" y="12" width="150" height="44" fill={C.boxBg} stroke={C.boxStroke} strokeWidth="1.5" />
        <rect x="125" y="12" width="8" height="44" fill={C.boxStroke} />
        <text x="200" y="34" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={C.bodyText} style={{ fontFamily: BODY_FONT }}>
          Receive
        </text>

        <line x1="200" y1="56" x2="200" y2="78" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Wait for exec. (Invictus — INV_H=56) ══ */}
        <rect x="125" y="82" width="150" height={INV_H} rx={RX} fill={C.invBox} stroke={C.invStroke} strokeWidth="1" />
        <rect x="125" y="82" width={ACCENT_W} height={INV_H} fill={C.invAccent} clipPath="url(#clip-ts-wait)" />
        <text x="200" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Wait for exec.
        </text>
        <line x1={125 + ACCENT_W + 3} y1="122" x2="271" y2="122" stroke={C.separator} strokeWidth="0.75" />
        <text x="200" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={C.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP-callback badge */}
        <rect x="191" y="73" width="84" height="18" rx="3" fill={C.badge} />
        <text x="233" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill={C.rowTitle} style={{ fontFamily: BODY_FONT }}>
          HTTP-callback
        </text>

        {/* Arrow: Wait for exec. bottom (82+56=138) → group container (y=162) */}
        <line x1="200" y1="138" x2="200" y2="176" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Group container — shifted +12 from original ══ */}
        <rect x="20" y="162" width="388" height="248" rx="6" fill="none" stroke={C.groupBorder} strokeWidth="1" />

        {/* ══ Switch ══ */}
        <rect x="125" y="180" width="150" height="44" rx="2" fill={C.stepBox} />
        <text x="200" y="202" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Switch
        </text>

        {/* Branch lines */}
        <line x1="200" y1="224" x2="200" y2="240" stroke={C.arrow} strokeWidth="1.5" />
        <line x1="108" y1="240" x2="323" y2="240" stroke={C.arrow} strokeWidth="1.5" />
        <line x1="108" y1="240" x2="108" y2="260" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />
        <line x1="323" y1="240" x2="323" y2="260" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Stop / Start ══ */}
        <rect x="43" y="264" width="130" height="44" rx="2" fill={C.stepBox} />
        <text x="108" y="286" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Stop
        </text>
        <rect x="258" y="264" width="130" height="44" rx="2" fill={C.stepBox} />
        <text x="323" y="286" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.stepTitle} style={{ fontFamily: HEADING_FONT }}>
          Start
        </text>

        <line x1="108" y1="308" x2="108" y2="340" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />
        <line x1="323" y1="308" x2="323" y2="340" stroke={C.arrow} strokeWidth="1.5" markerEnd="url(#arr-TimeSequencer)" />

        {/* ══ Terminate ══ */}
        <rect x="43" y="344" width="130" height="44" rx="2" fill={C.termBox} />
        <text x="108" y="366" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.rowTitle} style={{ fontFamily: HEADING_FONT }}>
          Terminate
        </text>

        {/* ══ Complete exec. (Invictus — INV_H=56, y=344) ══ */}
        <rect x="258" y="344" width="130" height={INV_H} rx={RX} fill={C.invBox} stroke={C.invStroke} strokeWidth="1" />
        <rect x="258" y="344" width={ACCENT_W} height={INV_H} fill={C.invAccent} clipPath="url(#clip-ts-complete)" />
        <text x="323" y="362" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill={C.invTitle} style={{ fontFamily: HEADING_FONT }}>
          Complete exec.
        </text>
        <line x1={258 + ACCENT_W + 3} y1="384" x2="385" y2="384" stroke={C.separator} strokeWidth="0.75" />
        <text x="323" y="392" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={C.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Azure Blob Storage
        </text>
        {/* HTTP badge */}
        <rect x="348" y="335" width="40" height="18" rx="3" fill={C.badge} />
        <text x="368" y="344" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" letterSpacing="0.5" fill={C.rowTitle} style={{ fontFamily: BODY_FONT }}>
          HTTP
        </text>

        {/* Dashed return arrow: right of Wait for exec. → right of Complete exec. */}
        <path d="M 275,100 H 466 V 362 H 388" fill="none" stroke={C.arrow} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arr-TimeSequencer)" />
      </svg>
    </div>
  );
}
