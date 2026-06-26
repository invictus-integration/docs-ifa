import React from "react";

// ── Shared CSS-variable palette (mirrors TimeSequencerFlowDiagram) ─────────────
const c = {
  primary: "var(--ifm-color-primary)",
  primaryDark: "var(--ifm-color-primary-darker)",
  primaryDarker: "var(--ifm-color-primary-darkest)",
  primaryLightest: "var(--ifm-color-primary-lightest)",
  primaryLight: "var(--ifm-color-primary-light)",
  secondary: "var(--ifm-color-secondary)",
  secondaryDark: "var(--ifm-color-secondary-darker)",
  warning: "var(--ifm-color-warning)",
  bg: "var(--ifm-background-color)",
  text: "var(--ifm-font-color-base)",
} as const;

// ── Block style presets (same as flow diagram) ────────────────────────────────
const ACCENT = 6;

// Block identity → visual type
//   A (1:05): invictus  — teal filled   (like "Wait for exec." / "Complete exec.")
//   B (0:40): step      — dark filled   (like "Switch" / "Stop" / "Start")
//   C (1:23): warning   — orange filled (like the HTTP-callback badge)
//   D (2:01): regular   — outlined      (like "Receive")
type BlockType = "invictus" | "step" | "warning" | "regular";

const TYPES: Record<"A" | "B" | "C" | "D", BlockType> = {
  A: "invictus",
  B: "step",
  C: "warning",
  D: "regular",
};

const LABELS = { A: "1:05", B: "0:40", C: "1:23", D: "2:01" } as const;

// ── Dimensions ────────────────────────────────────────────────────────────────
const BW = 72;          // block width
const BH = 44;          // block height (same as flow diagram)
const GAP = 12;
const STEP = BW + GAP;    // 84
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
    type === "invictus" ? { fill: c.primaryLight } :
      type === "step" ? { fill: c.primaryDarker } :
        type === "warning" ? { fill: c.secondaryDark } :
          { fill: c.primaryLightest };

  const textStyle =
    type === "regular"
      ? { fontSize: 15, fontWeight: 700, fill: c.text, fontFamily: "var(--ifm-font-family-monospace)" }
      : { fontSize: 15, fontWeight: 700, fill: "#ffffff", fontFamily: "var(--ifm-font-family-monospace)" };

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
export default function TimeSequencerSortDiagram(): JSX.Element {
  // Left: arrival order — A B C D
  // Right: sorted order — B A C D  (0:40 < 1:05 < 1:23 < 2:01)
  const left: Array<keyof typeof TYPES> = ["A", "B", "C", "D"];
  const right: Array<keyof typeof TYPES> = ["B", "A", "C", "D"];

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="tssd-title tssd-desc"
      style={{
        width: "100%", maxWidth: 760, display: "block",
        margin: "2rem auto", fontFamily: "inherit", overflow: "visible"
      }}
    >
      <title id="tssd-title">Time Sequencer sorting diagram</title>
      <desc id="tssd-desc">
        Four Logic App workflows with timestamps 1:05, 0:40, 1:23 and 2:01 arrive in
        unordered sequence. After the Time Sequencer processes them they are reordered
        to 0:40, 1:05, 1:23, 2:01 in ascending order.
      </desc>

      {/* Left group — unsorted */}
      {left.map((id, i) => (
        <Block key={`L-${id}`} x={LEFT_X + i * STEP} type={TYPES[id]} label={LABELS[id]} />
      ))}

      {/* ">" separator */}
      <text
        x={SEP_X} y={BY + BH / 2}
        textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 26, fontWeight: 700, fill: c.secondaryDark }}
      >
        {">"}
      </text>

      {/* Right group — sorted */}
      {right.map((id, i) => (
        <Block key={`R-${id}`} x={RIGHT_X + i * STEP} type={TYPES[id]} label={LABELS[id]} />
      ))}
    </svg>
  );
}
