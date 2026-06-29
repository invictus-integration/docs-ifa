import React from "react";

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

const invRect   = { fill: c.primaryLight, stroke: c.primary,    strokeWidth: 1   } as const;
const regRect   = { fill: c.bg,           stroke: c.secondary,  strokeWidth: 1.5 } as const;
const stepRect  = { fill: c.secondaryDark                                         } as const;
const termRect  = { fill: "#b91c1c"                                               } as const;
const groupRect = { fill: c.bg,           stroke: c.secondary,  strokeWidth: 1   } as const;
const badgeRect = { fill: c.warning                                               } as const;

const solid  = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none"                      } as const;
const dashed = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none", strokeDasharray: "6 4" } as const;

const invText  = { fontSize: 13, fill: "#ffffff", fontWeight: 600 } as const;
const regText  = { fontSize: 13, fill: c.text                     } as const;
const stepText = { fontSize: 13, fill: "#ffffff", fontWeight: 600,
                   fontFamily: "var(--ifm-font-family-monospace)"  } as const;
const badgeText = { fontSize: 9, fill: "#ffffff", fontWeight: 700, letterSpacing: 0.5 } as const;

// ── Dimensions ────────────────────────────────────────────────────────────────
const MW = 150;   // main block width  (Receive, Wait for exec., Switch)
const BW = 130;   // branch block width (Stop, Start, Terminate, Complete exec.)
const BH = 44;    // block height

const CX  = 200;  // center X — main column
const LCX = 108;  // center X — left branch (Stop, Terminate)
const RCX = 323;  // center X — right branch (Start, Complete exec.)

const mainX  = CX  - MW / 2;  // 125
const leftX  = LCX - BW / 2;  // 43
const rightX = RCX - BW / 2;  // 258

const Y_RECEIVE = 12;
const Y_WAIT    = 82;
const Y_SWITCH  = 168;
const Y_BRANCH  = 228;  // branch junction (stem from Switch bottom)
const Y_SS      = 252;  // Stop / Start top
const Y_TC      = 332;  // Terminate / Complete exec. top

const GRP_X = 20;
const GRP_Y = 150;
const GRP_W = rightX + BW + 20 - GRP_X;            // 408 - 20 = 388
const GRP_H = Y_TC + BH + 22 - GRP_Y;              // 396 - 150 = 246

const VB_W  = 490;
const VB_H  = Y_TC + BH + 30;                       // 406

// ── Shared helpers ────────────────────────────────────────────────────────────
function Block({ x, y, w, label, type }: {
  x: number; y: number; w: number; label: string;
  type: "regular" | "invictus" | "step" | "terminate";
}) {
  const rStyle =
    type === "invictus"  ? invRect  :
    type === "step"      ? stepRect :
    type === "terminate" ? termRect :
    regRect;
  const tStyle = type === "regular" ? regText : type === "step" ? stepText : invText;

  return (
    <>
      <rect x={x} y={y} width={w} height={BH} rx={2} style={rStyle} />
      {(type === "regular" || type === "invictus") && (
        <rect x={x} y={y} width={ACCENT} height={BH}
          style={{ fill: type === "regular" ? c.secondary : c.primary }} />
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
export default function TimeSequencerFlowDiagram(): JSX.Element {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="tsfd-title tsfd-desc"
      style={{ width: "100%", maxWidth: 520, display: "block", margin: "2rem auto",
               fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="tsfd-title">Time Sequencer Logic App workflow</title>
      <desc id="tsfd-desc">
        A Receive trigger feeds into a Wait for execution HTTP-callback endpoint.
        A Switch block then branches: the Stop path leads to a Terminate action,
        while the Start path leads to a Complete execution HTTP endpoint.
        A dashed arrow from Wait for execution loops back to Complete execution.
      </desc>
      <defs>
        <marker id="tsfd-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* ── Receive ─────────────────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_RECEIVE} w={MW} label="Receive" type="regular" />

      {/* Receive → Wait for exec. */}
      <line x1={CX} y1={Y_RECEIVE + BH} x2={CX} y2={Y_WAIT - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />

      {/* ── Wait for exec. ──────────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_WAIT} w={MW} label="Wait for exec." type="invictus" />
      <Badge rightX={mainX + MW} topY={Y_WAIT} label="HTTP-callback" />

      {/* Wait for exec. → Switch */}
      <line x1={CX} y1={Y_WAIT + BH} x2={CX} y2={Y_SWITCH - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />

      {/* ── Group box (Switch + branches) ───────────────────────────────────── */}
      <rect x={GRP_X} y={GRP_Y} width={GRP_W} height={GRP_H} rx={6} style={groupRect} />

      {/* ── Switch ──────────────────────────────────────────────────────────── */}
      <Block x={mainX} y={Y_SWITCH} w={MW} label="Switch" type="step" />

      {/* Switch → branch junction (stem + crossbar) */}
      <line x1={CX}  y1={Y_SWITCH + BH} x2={CX}  y2={Y_BRANCH} style={solid} />
      <line x1={LCX} y1={Y_BRANCH}      x2={RCX} y2={Y_BRANCH} style={solid} />
      {/* Branch → Stop */}
      <line x1={LCX} y1={Y_BRANCH} x2={LCX} y2={Y_SS - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />
      {/* Branch → Start */}
      <line x1={RCX} y1={Y_BRANCH} x2={RCX} y2={Y_SS - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />

      {/* ── Stop / Start ────────────────────────────────────────────────────── */}
      <Block x={leftX}  y={Y_SS} w={BW} label="Stop"  type="step" />
      <Block x={rightX} y={Y_SS} w={BW} label="Start" type="step" />

      {/* Stop → Terminate */}
      <line x1={LCX} y1={Y_SS + BH} x2={LCX} y2={Y_TC - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />
      {/* Start → Complete exec. */}
      <line x1={RCX} y1={Y_SS + BH} x2={RCX} y2={Y_TC - 4}
        style={solid} markerEnd="url(#tsfd-arr)" />

      {/* ── Terminate ───────────────────────────────────────────────────────── */}
      <Block x={leftX}  y={Y_TC} w={BW} label="Terminate"     type="terminate" />

      {/* ── Complete exec. ──────────────────────────────────────────────────── */}
      <Block x={rightX} y={Y_TC} w={BW} label="Complete exec." type="invictus" />
      <Badge rightX={rightX + BW} topY={Y_TC} label="HTTP" />

      {/* ── Dashed return arrow: Wait for exec. (right) → Complete exec. (right) ── */}
      <path
        d={`M${mainX + MW},${Y_WAIT + BH / 2} H${VB_W - 24} V${Y_TC + BH / 2} H${rightX + BW}`}
        style={dashed}
        markerEnd="url(#tsfd-arr)"
      />
    </svg>
  );
}
