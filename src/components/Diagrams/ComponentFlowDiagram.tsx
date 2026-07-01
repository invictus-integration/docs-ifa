import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface FlowRow {
  input: string;
  opTitle: string;
  opSubtitle: string;
  output: string;
  /** Storage backend label shown as a footer inside the op block, e.g. "Blob Storage" */
  storageLabel?: string;
}

export interface ComponentFlowDiagramProps {
  /** Component display name — shown in the header */
  name: string;
  /** Short tagline — shown below the name in the header */
  tagline: string;
  /** FontAwesome icon definition — path data and viewBox are derived automatically */
  icon: IconDefinition;
  /** Set to true for icons that require evenodd fill-rule (e.g. faGear) */
  iconEvenOdd?: boolean;
  /** One entry per flow row rendered below the header */
  rows: FlowRow[];
}

const LIGHT = {
  header: "#065b68",
  accent: "#014550",
  fill: "#ffffff",
  stroke: "#b8c0c2",
  text: "#1c1e21",
  arrow: "#065b68",
  rowTitle: "#ffffff",
  rowSubtitle: "#a0dde5",
  headerSubtitle: "#a0dde5",
};

const DARK = {
  header: "#1a5f68",
  accent: "#2a8f9c",
  fill: "#374151",
  stroke: "#6B7280",
  text: "#D1D5DB",
  arrow: "#2a8f9c",
  rowTitle: "#ffffff",
  rowSubtitle: "#a0dde5",
  headerSubtitle: "#a0dde5",
};

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

// Matches --ifm-global-radius (0.4rem at 16px base = 6.4px)
const RX = 6;
// Matches --ifm-alert-border-left-width
const ACCENT_W = 5;

const W = 380;
const HEADER_Y = 10;
const HEADER_H = 54;
const ICON_BADGE_W = 46;
const ICON_SIZE = 28;
const ROW_H = 66; // taller to accommodate the storage-backend footer
const ROW_GAP = 12;
const FIRST_ROW_Y = HEADER_Y + HEADER_H + 10;

export default function ComponentFlowDiagram({
  name,
  tagline,
  icon,
  iconEvenOdd = false,
  rows,
}: ComponentFlowDiagramProps) {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  const totalH =
    FIRST_ROW_Y + rows.length * ROW_H + (rows.length - 1) * ROW_GAP + 8;

  // Derive dimensions directly from the FA icon definition
  const iconVbWidth = icon.icon[0];   // e.g. 512 or 576
  const iconVbHeight = icon.icon[1];  // always 512
  const iconPathData = icon.icon[4] as string;

  const iconScale = ICON_SIZE / iconVbWidth;
  const iconTx = 8 + (ICON_BADGE_W - iconVbWidth * iconScale) / 2;
  const iconTy = HEADER_Y + (HEADER_H - iconVbHeight * iconScale) / 2;

  // Unique base id — keeps marker + clipPath ids collision-free across diagrams
  const uid = `${name.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox={`0 0 ${W} ${totalH}`}
        role="img"
        aria-label={`${name} — flow diagram`}
      >
        <defs>
          {/* Arrow marker — absolute pixel size (markerUnits="userSpaceOnUse") so it
              stays proportional regardless of stroke width */}
          <marker
            id={`arr-${uid}`}
            markerWidth="5"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 5 2, 0 4" fill={c.arrow} />
          </marker>

          {/* Header clip — keeps icon badge inside the rounded header */}
          <clipPath id={`hdr-${uid}`}>
            <rect x="8" y={HEADER_Y} width="364" height={HEADER_H} rx={RX} />
          </clipPath>

          {/* Per-row clip paths for the accent bars */}
          {rows.map((_, i) => {
            const rowY = FIRST_ROW_Y + i * (ROW_H + ROW_GAP);
            return (
              <React.Fragment key={i}>
                <clipPath id={`in-${uid}-${i}`}>
                  <rect x="8" y={rowY} width="96" height={ROW_H} rx={RX} />
                </clipPath>
                <clipPath id={`op-${uid}-${i}`}>
                  <rect x="114" y={rowY} width="140" height={ROW_H} rx={RX} />
                </clipPath>
                <clipPath id={`out-${uid}-${i}`}>
                  <rect x="264" y={rowY} width="108" height={ROW_H} rx={RX} />
                </clipPath>
              </React.Fragment>
            );
          })}
        </defs>

        {/* ── Header ── */}
        <rect
          x="8"
          y={HEADER_Y}
          width="364"
          height={HEADER_H}
          fill={c.header}
          rx={RX}
        />
        {/* Icon badge — clipped to the header rounded shape */}
        <rect
          x="8"
          y={HEADER_Y}
          width={ICON_BADGE_W}
          height={HEADER_H}
          fill={c.accent}
          clipPath={`url(#hdr-${uid})`}
        />
        <path
          d={iconPathData}
          fill="white"
          fillRule={iconEvenOdd ? "evenodd" : undefined}
          transform={`translate(${iconTx.toFixed(2)},${iconTy.toFixed(2)}) scale(${iconScale.toFixed(6)})`}
        />
        <text
          x="213"
          y={HEADER_Y + 19}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="700"
          fill="#ffffff"
          style={{ fontFamily: HEADING_FONT }}
        >
          {name}
        </text>
        <text
          x="213"
          y={HEADER_Y + 36}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill={c.headerSubtitle}
          style={{ fontFamily: BODY_FONT }}
        >
          {tagline}
        </text>

        {/* ── Rows ── */}
        {rows.map((row, i) => {
          const rowY = FIRST_ROW_Y + i * (ROW_H + ROW_GAP);
          const midY = rowY + ROW_H / 2;

          return (
            <React.Fragment key={i}>
              {/* Input block */}
              <rect
                x="8"
                y={rowY}
                width="96"
                height={ROW_H}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth="1.5"
                rx={RX}
              />
              <rect
                x="8"
                y={rowY}
                width={ACCENT_W}
                height={ROW_H}
                fill={c.stroke}
                clipPath={`url(#in-${uid}-${i})`}
              />
              <text
                x="56"
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={c.text}
                style={{ fontFamily: BODY_FONT }}
              >
                {row.input}
              </text>

              {/* Arrow input → op */}
              <line
                x1="106"
                y1={midY}
                x2="113"
                y2={midY}
                stroke={c.arrow}
                strokeWidth="1.5"
                markerEnd={`url(#arr-${uid})`}
              />

              {/* Op block */}
              <rect
                x="114"
                y={rowY}
                width="140"
                height={ROW_H}
                fill={c.header}
                stroke={c.accent}
                strokeWidth="1"
                rx={RX}
              />
              <rect
                x="114"
                y={rowY}
                width={ACCENT_W}
                height={ROW_H}
                fill={c.accent}
                clipPath={`url(#op-${uid}-${i})`}
              />
              {/* Op title — shifted up when a storage footer is present */}
              <text
                x="184"
                y={row.storageLabel ? rowY + 20 : midY - 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill={c.rowTitle}
                style={{ fontFamily: HEADING_FONT }}
              >
                {row.opTitle}
              </text>
              <text
                x="184"
                y={row.storageLabel ? rowY + 33 : midY + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill={c.rowSubtitle}
                style={{ fontFamily: BODY_FONT }}
              >
                {row.opSubtitle}
              </text>
              {/* Storage backend footer — thin separator + label */}
              {row.storageLabel && (
                <>
                  <line
                    x1={114 + ACCENT_W + 3}
                    y1={rowY + 45}
                    x2={254 - 3}
                    y2={rowY + 45}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="0.75"
                  />
                  <text
                    x="184"
                    y={rowY + 56}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill={c.rowSubtitle}
                    style={{ fontFamily: BODY_FONT, opacity: 0.8 }}
                  >
                    {row.storageLabel}
                  </text>
                </>
              )}

              {/* Arrow op → output */}
              <line
                x1="256"
                y1={midY}
                x2="263"
                y2={midY}
                stroke={c.arrow}
                strokeWidth="1.5"
                markerEnd={`url(#arr-${uid})`}
              />

              {/* Output block */}
              <rect
                x="264"
                y={rowY}
                width="108"
                height={ROW_H}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth="1.5"
                rx={RX}
              />
              <rect
                x="264"
                y={rowY}
                width={ACCENT_W}
                height={ROW_H}
                fill={c.stroke}
                clipPath={`url(#out-${uid}-${i})`}
              />
              <text
                x="318"
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={c.text}
                style={{ fontFamily: BODY_FONT }}
              >
                {row.output}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
}

