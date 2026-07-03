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

function SortBox({
  x,
  label,
  time,
  fill,
  textFill,
}: {
  x: number;
  label: string;
  time: string;
  fill: string;
  textFill: string;
}) {
  return (
    <>
      <rect x={x} y="16" width="68" height="48" rx="2" fill={fill} />
      <text
        x={x + 34}
        y="36"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={textFill}
        style={{ fontFamily: HEADING_FONT }}
      >
        {label}
      </text>
      <text
        x={x + 34}
        y="52"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill={textFill}
        style={{ fontFamily: BODY_FONT }}
      >
        {time}
      </text>
    </>
  );
}

export default function TimeSequencerSort() {
  return (
    <div style={{ maxWidth: 820, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 744 80"
        role="img"
        aria-label="Time Sequencer sorting diagram"
      >
        <SortBox x={16} label="A" time="1:05" fill={C.aBox} textFill={C.aText} />
        <SortBox x={100} label="B" time="0:40" fill={C.bBox} textFill={C.bText} />
        <SortBox x={184} label="C" time="1:23" fill={C.cBox} textFill={C.cText} />
        <SortBox x={268} label="D" time="2:01" fill={C.dBox} textFill={C.dText} />
        <text
          x="372"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fill={C.separatorFill}
          style={{ fontFamily: BODY_FONT }}
        >
          ›
        </text>
        <SortBox x={404} label="B" time="0:40" fill={C.bBox} textFill={C.bText} />
        <SortBox x={488} label="A" time="1:05" fill={C.aBox} textFill={C.aText} />
        <SortBox x={572} label="C" time="1:23" fill={C.cBox} textFill={C.cText} />
        <SortBox x={656} label="D" time="2:01" fill={C.dBox} textFill={C.dText} />
      </svg>
    </div>
  );
}
