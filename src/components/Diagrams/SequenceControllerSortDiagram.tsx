import React from "react";

// ── Shared CSS-variable palette (mirrors TimeSequencerFlowDiagram) ────────────
const c = {
  primary: "var(--ifm-color-primary)",
  primaryLight: "var(--ifm-color-primary-light)",
  primaryDark: "var(--ifm-color-primary-darker)",
  primaryLightest: "var(--ifm-color-primary-lightest)",
  secondary: "var(--ifm-color-secondary)",
  secondaryDark: "var(--ifm-color-secondary-darker)",
  warning: "var(--ifm-color-warning)",
  bg: "var(--ifm-background-color)",
  text: "var(--ifm-font-color-base)",
} as const;

// ── Block style presets (same as flow diagram) ────────────────────────────────
const ACCENT = 6;

// Sequence number → visual type
//   1: invictus  — teal filled
//   2: step      — dark filled
//   3: warning   — orange filled
//   4: regular   — outlined
type BlockType = "invictus" | "step" | "warning" | "regular";

const TYPES: Record<1 | 2 | 3 | 4, BlockType> = {
  1: "invictus",
  2: "step",
  3: "warning",
  4: "regular",
};

// ── Dimensions ────────────────────────────────────────────────────────────────
const BW = 72;
const BH = 44;
const GAP = 12;
const STEP = BW + GAP;        // 84
const BY = 18;
const PAD = 16;
const GROUP_W = 4 * BW + 3 * GAP;   // 324

const LEFT_X = PAD;
const SEP_X = PAD + GROUP_W + 32;
const RIGHT_X = SEP_X + 32;
const VB_W = RIGHT_X + GROUP_W + PAD;
const VB_H = BY + BH + BY;

// ── Block component ───────────────────────────────────────────────────────────
function Block({ x, type, label }: { x: number; type: BlockType; label: string }) {
  const rectStyle =
    type === "invictus" ? { fill: c.primaryLightest } :
      type === "step" ? { fill: c.secondaryDark } :
        type === "warning" ? { fill: c.primaryDark, } :
          { fill: c.bg, stroke: c.secondary, strokeWidth: 1.5 };

  const textStyle =
    type === "regular"
      ? { fontSize: 18, fontWeight: 700, fill: c.text, fontFamily: "var(--ifm-font-family-monospace)" }
      : { fontSize: 18, fontWeight: 700, fill: "#ffffff", fontFamily: "var(--ifm-font-family-monospace)" };

  const accentFill =
    type === "invictus" ? c.primary :
      type === "regular" ? c.secondary : null;

  return (
    <>
      <rect x={x} y={BY} width={BW} height={BH} rx={2} style={rectStyle} />
      <text x={x + BW / 2} y={BY + BH / 2}
        textAnchor="middle" dominantBaseline="middle" style={textStyle}>
        {label}
      </text>
    </>
  );
}

// ── Diagram ───────────────────────────────────────────────────────────────────
export default function SequenceControllerSortDiagram(): JSX.Element {
  // Left: arrival order — 2, 1, 3, 4
  // Right: sorted order — 1, 2, 3, 4
  const left: Array<1 | 2 | 3 | 4> = [2, 1, 3, 4];
  const right: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="scsd-title scsd-desc"
      style={{
        width: "100%", maxWidth: 760, display: "block",
        margin: "2rem auto", fontFamily: "inherit", overflow: "visible"
      }}
    >
      <title id="scsd-title">Sequence Controller sorting diagram</title>
      <desc id="scsd-desc">
        Four workflow executions with sequence numbers 2, 1, 3 and 4 arrive in
        unordered sequence. After the Sequence Controller processes them they are
        executed in order: 1, 2, 3, 4.
      </desc>

      {/* Left group — unordered arrival */}
      {left.map((seq, i) => (
        <Block key={`L-${seq}`} x={LEFT_X + i * STEP} type={TYPES[seq]} label={String(seq)} />
      ))}

      {/* ">" separator */}
      <text
        x={SEP_X} y={BY + BH / 2}
        textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 26, fontWeight: 700, fill: c.secondaryDark }}
      >
        {">"}
      </text>

      {/* Right group — ordered execution */}
      {right.map((seq, i) => (
        <Block key={`R-${seq}`} x={RIGHT_X + i * STEP} type={TYPES[seq]} label={String(seq)} />
      ))}
    </svg>
  );
}
