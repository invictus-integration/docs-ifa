import React from "react";

const c = {
  primary: "var(--ifm-color-primary)",
  primaryLight: "var(--ifm-color-primary-light)",
  secondary: "var(--ifm-color-secondary-darker)",
  bg: "var(--ifm-background-color)",
  text: "var(--ifm-font-color-base)",
} as const;

// ── Style presets ─────────────────────────────────────────────────────────────
const invHdrRect = { fill: c.primary } as const;
const invChRect = { fill: c.bg, stroke: c.primary, strokeWidth: 2 } as const;
const invLine = { stroke: c.primary, strokeWidth: 1.5, fill: "none" } as const;
const invHdrTxt = { fontSize: 11, fill: "#ffffff", fontWeight: 700 } as const;
const invChTxt = { fontSize: 10, fill: c.text } as const;

const cliHdrRect = { fill: c.secondary } as const;
const cliChRect = { fill: c.bg, stroke: c.secondary, strokeWidth: 1.5 } as const;
const cliLine = { stroke: c.secondary, strokeWidth: 1.5, fill: "none" } as const;
const cliHdrTxt = { fontSize: 11, fill: "#ffffff", fontWeight: 600 } as const;
const cliChTxt = { fontSize: 10, fill: c.text } as const;

const arrowStyle = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none", strokeDasharray: "6 4" } as const;
const titleStyle = { fontSize: 12, fontWeight: 700, fill: c.text } as const;

// ── Unit dimensions ───────────────────────────────────────────────────────────
const HW = 110;  // header block width
const HH = 42;   // header block height
const CW = 90;   // child block width
const CH = 42;   // child block height
const HG = 10;   // horizontal gap between children
const VG = 28;   // vertical gap: header bottom → children top

const UNIT_W = CW * 2 + HG;         // 190
const UNIT_H = HH + VG + CH;        // 112
const HDR_OX = (UNIT_W - HW) / 2;  // 40 — centers header over children

// Coordinate helpers (unitX / unitY = top-left anchor of a logic app unit)
const hdrX = (ux: number) => ux + HDR_OX;
const lChX = (ux: number) => ux;
const rChX = (ux: number) => ux + CW + HG;
const chTopY = (uy: number) => uy + HH + VG;
const branchY = (uy: number) => uy + HH + Math.round(VG / 2);
const unitCX = (ux: number) => ux + UNIT_W / 2;
const lChCX = (ux: number) => ux + CW / 2;
const rChCX = (ux: number) => ux + CW + HG + CW / 2;
const chCY = (uy: number) => chTopY(uy) + CH / 2;

// ── LogicAppUnit ──────────────────────────────────────────────────────────────
function LogicAppUnit({
  ux, uy, title, headerLabel, variant,
}: {
  ux: number; uy: number;
  title: string;
  headerLabel: string;
  leftLabel: string;
  rightLabel: string;
  variant: "invictus" | "client";
}) {
  const isInv = variant === "invictus";
  const hRect = isInv ? invHdrRect : cliHdrRect;
  const cRect = isInv ? invChRect : cliChRect;
  const connLine = isInv ? invLine : cliLine;
  const hTxt = isInv ? invHdrTxt : cliHdrTxt;
  const cTxt = isInv ? invChTxt : cliChTxt;

  const cx = unitCX(ux);
  const lcx = lChCX(ux);
  const rcx = rChCX(ux);
  const cTop = chTopY(uy);
  const bY = branchY(uy);

  return (
    <>
      {/* Title label above unit */}
      <text x={ux} y={uy - 8} style={titleStyle}>{title}</text>

      {/* Header block */}
      <rect x={hdrX(ux)} y={uy} width={HW} height={HH} rx={3} style={hRect} />
      <text x={hdrX(ux) + HW / 2} y={uy + HH / 2} textAnchor="middle" dominantBaseline="middle" style={hTxt}>
        {headerLabel}
      </text>

      {/* Tree connecting lines: header → branch → children */}
      <line x1={cx} y1={uy + HH} x2={cx} y2={bY} style={connLine} />
      <line x1={lcx} y1={bY} x2={rcx} y2={bY} style={connLine} />
      <line x1={lcx} y1={bY} x2={lcx} y2={cTop} style={connLine} />
      <line x1={rcx} y1={bY} x2={rcx} y2={cTop} style={connLine} />

      {/* Left child block */}
      <rect x={lChX(ux)} y={cTop} width={CW} height={CH} rx={3} style={cRect} />


      {/* Right child block */}
      <rect x={rChX(ux)} y={cTop} width={CW} height={CH} rx={3} style={cRect} />

    </>
  );
}

// ── Desktop layout ────────────────────────────────────────────────────────────
// Invictus handler on the left, two client apps stacked on the upper/lower right.
// The Invictus unit is vertically centered between the two client units.
const D_IX = 10;
const D_IY = 111;
const D_CX = 290;
const D_C1Y = 36;
const D_C2Y = 186;

// Routing: right edge of Invictus header block (arrow target = the trigger block)
const D_INV_HDR_RX = hdrX(D_IX) + HW + 1;  // 161
// Routing: left edge of client left-child (Trigger — arrow origin, no block crossing)
const D_CLI_LEFT_X = lChX(D_CX);            // 290
// Midpoint X between the two units (bend point for the C2 L-shaped path)
const D_MID_X = Math.round((D_IX + UNIT_W + D_CX) / 2);  // 245

function DesktopDiagram() {
  const c1CY = chCY(D_C1Y);  // 127 — center Y of Client 1 children row
  const c2CY = chCY(D_C2Y);  // 277 — center Y of Client 2 children row
  // Invictus header center Y — the two arrows enter at slightly different offsets
  const invHdrCY = D_IY + Math.round(HH / 2);  // 132

  return (
    <svg
      viewBox="0 0 495 313"
      role="img"
      aria-labelledby="ehfd-d-title ehfd-d-desc"
      style={{ width: "100%", maxWidth: 680, display: "block", margin: "2rem auto", fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="ehfd-d-title">Exception Handler flow diagram</title>
      <desc id="ehfd-d-desc">
        Two Client Logic Apps (each with a Trigger and Exception Scope step) send dashed arrows to
        a Common Exception Handler Logic App highlighted in the Invictus color palette. The central
        app has a Receive step and a ResolveException step.
      </desc>
      <defs>
        <marker id="ehfd-d-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* Common Exception Handler — Invictus (left) */}
      <LogicAppUnit
        ux={D_IX} uy={D_IY}
        title="Client Logic App"
        headerLabel="Exception Handler"
        leftLabel="Receive"
        rightLabel="ResolveException"
        variant="invictus"
      />

      {/* Dashed arrow: Client 1 Trigger → Invictus header (straight horizontal — c1CY ≈ header cy) */}
      <path
        d={`M${D_CLI_LEFT_X},${c1CY} H${D_INV_HDR_RX}`}
        style={arrowStyle} markerEnd="url(#ehfd-d-arr)"
      />

      {/* Dashed arrow: Client 2 Trigger → Invictus header (L-shape via midpoint) */}
      <path
        d={`M${D_CLI_LEFT_X},${c2CY} H${D_MID_X} V${invHdrCY + 6} H${D_INV_HDR_RX}`}
        style={arrowStyle} markerEnd="url(#ehfd-d-arr)"
      />

      {/* Client Logic App 1 — upper right */}
      <LogicAppUnit
        ux={D_CX} uy={D_C1Y}
        title="Client Logic App"
        headerLabel="Logic App"
        leftLabel="Trigger"
        rightLabel="Exception Scope"
        variant="client"
      />

      {/* Client Logic App 2 — lower right */}
      <LogicAppUnit
        ux={D_CX} uy={D_C2Y}
        title="Client Logic App"
        headerLabel="Logic App"
        leftLabel="Trigger"
        rightLabel="Exception Scope"
        variant="client"
      />
    </svg>
  );
}

// ── Mobile layout ─────────────────────────────────────────────────────────────
// Client 1 (top) → Invictus (middle) ← Client 2 (bottom).
// Both arrows route via the right margin to avoid overlapping the units.
const M_UX = 10;
const M_C1Y = 44;
const M_INY = M_C1Y + UNIT_H + 40;   // 196
const M_C2Y = M_INY + UNIT_H + 40;   // 348
const M_SIDE_X = M_UX + UNIT_W + 12;    // 212 — routing lane on the right

function MobileDiagram() {
  // Arrow routing constants (computed from module-level layout constants)
  const cliExsRX = rChX(M_UX) + CW;           // 200 — right edge of client Exception Scope block
  const invHdrRX = hdrX(M_UX) + HW + 1;        // 161 — right edge of Invictus header block
  const invHdrCY = M_INY + Math.round(HH / 2); // 217 — Invictus header center Y
  // Exit points: vertical center of each client's Exception Scope block right edge
  const exsCY1 = chCY(M_C1Y);                // 135 — C1 children center Y
  const exsCY2 = chCY(M_C2Y);                // 439 — C2 children center Y

  return (
    <svg
      viewBox="0 0 222 475"
      role="img"
      aria-labelledby="ehfd-m-title ehfd-m-desc"
      style={{ width: "100%", maxWidth: 380, display: "block", margin: "2rem auto", fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="ehfd-m-title">Exception Handler flow diagram</title>
      <desc id="ehfd-m-desc">
        Two Client Logic Apps send their Exception Scope to a central Common Exception Handler
        Logic App that uses the Invictus ResolveException component.
      </desc>
      <defs>
        <marker id="ehfd-m-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* Client Logic App 1 — top */}
      <LogicAppUnit
        ux={M_UX} uy={M_C1Y}
        title="Client Logic App"
        headerLabel="Logic App"
        leftLabel="Trigger"
        rightLabel="Exception Scope"
        variant="client"
      />

      {/* Dashed arrow: Client 1 Exception Scope → Invictus header (right margin, then down) */}
      <path
        d={`M${cliExsRX},${exsCY1} H${M_SIDE_X} V${invHdrCY - 6} H${invHdrRX}`}
        style={arrowStyle} markerEnd="url(#ehfd-m-arr)"
      />

      {/* Common Exception Handler — Invictus (middle) */}
      <LogicAppUnit
        ux={M_UX} uy={M_INY}
        title="Common Exception Handler"
        headerLabel="Exception Handler"
        leftLabel="Receive"
        rightLabel="ResolveException"
        variant="invictus"
      />

      {/* Dashed arrow: Client 2 Exception Scope → Invictus header (right margin, then up) */}
      <path
        d={`M${cliExsRX},${exsCY2} H${M_SIDE_X} V${invHdrCY + 6} H${invHdrRX}`}
        style={arrowStyle} markerEnd="url(#ehfd-m-arr)"
      />

      {/* Client Logic App 2 — bottom */}
      <LogicAppUnit
        ux={M_UX} uy={M_C2Y}
        title="Client Logic App"
        headerLabel="Logic App"
        leftLabel="Trigger"
        rightLabel="Exception Scope"
        variant="client"
      />
    </svg>
  );
}

// ── Responsive wrapper ────────────────────────────────────────────────────────
export default function ExceptionHandlerFlowDiagram(): JSX.Element {
  return (
    <>
      <style>{`
        .ehfd-wide   { display: block; }
        .ehfd-narrow { display: none;  }
        @media (max-width: 640px) {
          .ehfd-wide   { display: none;  }
          .ehfd-narrow { display: block; }
        }
      `}</style>
      <div className="ehfd-wide"><DesktopDiagram /></div>
      <div className="ehfd-narrow"><MobileDiagram /></div>
    </>
  );
}
