import React from "react";

// ── Shared CSS-variable palette (mirrors TimeSequencerFlowDiagram) ────────────
const c = {
  primary:       "var(--ifm-color-primary)",
  primaryLight:  "var(--ifm-color-primary-light)",
  secondary:     "var(--ifm-color-secondary)",
  secondaryDark: "var(--ifm-color-secondary-darker)",
  warning:       "var(--ifm-color-warning)",
  bg:            "var(--ifm-background-color)",
  text:          "var(--ifm-font-color-base)",
} as const;

// ── Style presets ─────────────────────────────────────────────────────────────
const ACCENT = 8;

const invRect  = { fill: c.primaryLight, stroke: c.primary,   strokeWidth: 1   } as const;
const regRect  = { fill: c.bg,           stroke: c.secondary, strokeWidth: 1.5 } as const;
const warnRect = { fill: c.warning,      stroke: c.warning,   strokeWidth: 1   } as const;
const badgeRect = { fill: c.warning } as const;

const solid  = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none" } as const;
const dashed = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none", strokeDasharray: "6 4" } as const;

const invText  = { fontSize: 13, fill: "#ffffff", fontWeight: 600 } as const;
const regText  = { fontSize: 13, fill: c.text } as const;
const badgeText = { fontSize: 9, fill: "#ffffff", fontWeight: 700, letterSpacing: 0.5 } as const;

// ── Dimensions ────────────────────────────────────────────────────────────────
const MW = 150;   // block width
const BH = 44;    // block height

const CX    = 200;              // main column center
const mainX = CX - MW / 2;     // 125

const Y_RECEIVE  = 12;
const Y_GET      = 82;
const Y_WAIT     = 172;
const Y_CTRL     = 258;
const Y_COMPLETE = 364;         // extra gap suggests omitted customer steps

const VB_W = 480;
const VB_H = Y_COMPLETE + BH + 28;   // 436

// ── Shared helpers ────────────────────────────────────────────────────────────
function Block({ x, y, w, label, type }: {
  x: number; y: number; w: number; label: string;
  type: "regular" | "invictus" | "warning";
}) {
  const rStyle = type === "invictus" ? invRect : type === "warning" ? warnRect : regRect;
  const tStyle = type === "regular"  ? regText : invText;
  const accentFill = type === "invictus" ? c.primary : type === "regular" ? c.secondary : null;

  return (
    <>
      <rect x={x} y={y} width={w} height={BH} rx={2} style={rStyle} />
      {accentFill && (
        <rect x={x} y={y} width={ACCENT} height={BH} style={{ fill: accentFill }} />
      )}
      <text x={x + w / 2} y={y + BH / 2} textAnchor="middle" dominantBaseline="middle" style={tStyle}>
        {label}
      </text>
    </>
  );
}

function Badge({ rightX: rx, topY, label }: { rightX: number; topY: number; label: string }) {
  const bw = label === "HTTP" ? 40 : 84;
  const bx = rx - bw;
  const by = topY - 9;
  return (
    <>
      <rect x={bx} y={by} width={bw} height={18} rx={3} style={badgeRect} />
      <text x={bx + bw / 2} y={by + 9} textAnchor="middle" dominantBaseline="middle" style={badgeText}>
        {label}
      </text>
    </>
  );
}

// ── Diagram ───────────────────────────────────────────────────────────────────
export default function SequenceControllerFlowDiagram(): JSX.Element {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="scfd-title scfd-desc"
      style={{ width: "100%", maxWidth: 520, display: "block", margin: "2rem auto",
               fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="scfd-title">Sequence Controller Logic App workflow</title>
      <desc id="scfd-desc">
        A Receive trigger feeds into Get sequence number (HTTP), then into Wait for
        sequence (HTTP-callback). A dashed arrow from Get sequence number loops back
        into Wait for sequence, indicating the same sequence number is reused. After
        waiting, a Control task performs the customer work. A dashed arrow from Wait
        for sequence loops down to Complete sequence (HTTP), which finalises the slot.
      </desc>
      <defs>
        <marker id="scfd-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* ── Receive ────────────────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_RECEIVE} w={MW} label="Receive" type="regular" />

      {/* Receive → Get sequence number */}
      <line x1={CX} y1={Y_RECEIVE + BH} x2={CX} y2={Y_GET - 4}
        style={solid} markerEnd="url(#scfd-arr)" />

      {/* ── Get sequence number ─────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_GET} w={MW} label="Get sequence number" type="invictus" />
      <Badge rightX={mainX + MW} topY={Y_GET} label="HTTP" />

      {/* Get sequence number → Wait for sequence */}
      <line x1={CX} y1={Y_GET + BH} x2={CX} y2={Y_WAIT - 4}
        style={solid} markerEnd="url(#scfd-arr)" />

      {/* ── Wait for sequence ───────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_WAIT} w={MW} label="Wait for sequence" type="invictus" />
      <Badge rightX={mainX + MW} topY={Y_WAIT} label="HTTP-callback" />

      {/* Wait for sequence → Control task */}
      <line x1={CX} y1={Y_WAIT + BH} x2={CX} y2={Y_CTRL - 4}
        style={solid} markerEnd="url(#scfd-arr)" />

      {/* ── Control task ────────────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_CTRL} w={MW} label="Control task" type="warning" />

      {/* Control task → Complete sequence */}
      <line x1={CX} y1={Y_CTRL + BH} x2={CX} y2={Y_COMPLETE - 4}
        style={solid} markerEnd="url(#scfd-arr)" />

      {/* ── Complete sequence ───────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_COMPLETE} w={MW} label="Complete sequence" type="invictus" />
      <Badge rightX={mainX + MW} topY={Y_COMPLETE} label="HTTP" />

      {/* ── Dashed right loop: Get seq # (right) → Wait for sequence (right) ── */}
      <path
        d={`M${mainX + MW},${Y_GET + BH / 2} H${VB_W - 28} V${Y_WAIT + BH / 2} H${mainX + MW}`}
        style={dashed}
        markerEnd="url(#scfd-arr)"
      />

      {/* ── Dashed left loop: Wait for sequence (left) → Complete sequence (left) ── */}
      <path
        d={`M${mainX},${Y_WAIT + BH / 2} H${28} V${Y_COMPLETE + BH / 2} H${mainX}`}
        style={dashed}
        markerEnd="url(#scfd-arr)"
      />
    </svg>
  );
}
