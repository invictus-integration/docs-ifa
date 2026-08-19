// Shared visual tokens for the SVG flow/sequence diagrams in this folder.
//
// Colors are driven by CSS custom properties (--inv-diagram-*, --inv-sort-*)
// defined in custom.css, so dark mode is handled automatically without
// useColorMode. Every diagram component previously redeclared an identical
// copy of this object — it now lives here once and is imported everywhere.
export const DIAGRAM_COLORS = {
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
} as const;

export const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
export const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";
