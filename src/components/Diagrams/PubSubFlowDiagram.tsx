import React from "react";

const c = {
  primary:      "var(--ifm-color-primary)",
  primaryLight: "var(--ifm-color-primary-light)",
  secondary:    "var(--ifm-color-secondary)",
  warning:      "var(--ifm-color-warning)",
  bg:           "var(--ifm-background-color)",
  text:         "var(--ifm-font-color-base)",
} as const;

const arrowBase  = { stroke: c.primaryLight, strokeWidth: 1.5, fill: "none" } as const;
const solid      = { ...arrowBase } as const;
const dashed     = { ...arrowBase, strokeDasharray: "6 4" } as const;

const pubsubRect = { fill: c.primaryLight, stroke: c.primary, strokeWidth: 1 } as const;
const regRect    = { fill: c.bg, stroke: c.secondary, strokeWidth: 1 } as const;
const boxRect    = { fill: c.bg, stroke: c.secondary, strokeWidth: 1.5 } as const;
const badgeRect  = { fill: c.warning } as const;

const pubsubText = { fontSize: 13, fill: "#ffffff", fontWeight: 600 } as const;
const titleText  = { fontSize: 13, fontWeight: 700, fill: c.text } as const;
const regText    = { fontSize: 13, fill: c.text } as const;
const badgeText  = { fontSize: 10, fill: "#ffffff", fontWeight: 700, letterSpacing: 0.5 } as const;

// ── Shared block constants ────────────────────────────────────────────────────
const BW        = 200;  // block width  — identical for all four blocks
const BH        = 64;   // block height — tall enough to read as a block, not a line
const ACCENT    = 8;    // left accent bar width
const BADGE_W   = 40;
const BADGE_H   = 18;
const PAD_X     = 12;   // horizontal padding inside each box
const PAD_TOP   = 20;   // vertical padding above first block
const PAD_BOT   = 20;   // vertical padding below last block
const ARROW_GAP = 36;   // vertical gap between the two blocks inside a box
const BOX_W     = BW + PAD_X * 2;  // 224

// Derived block/box rhythm (same for both columns and both layouts)
function blkX(boxX: number) { return boxX + PAD_X; }
function topBlkY(boxY: number) { return boxY + PAD_TOP; }
function botBlkY(boxY: number) { return topBlkY(boxY) + BH + ARROW_GAP; }
function boxH(boxY: number)   { return botBlkY(boxY) + BH + PAD_BOT - boxY; }
function cx(boxX: number)     { return blkX(boxX) + BW / 2; }
function cyTop(boxY: number)  { return topBlkY(boxY) + BH / 2; }
function cyBot(boxY: number)  { return botBlkY(boxY) + BH / 2; }
function arrY1(boxY: number)  { return topBlkY(boxY) + BH; }       // bottom of top block
function arrY2(boxY: number)  { return botBlkY(boxY) - 3; }        // just above bottom block

// ── Shared sub-components ─────────────────────────────────────────────────────
function HttpBadge({ blockX, blockY }: { blockX: number; blockY: number }) {
  const bx = blockX + BW - BADGE_W;
  const by = blockY - 9;  // overlaps the block's top border
  return (
    <>
      <rect x={bx} y={by} width={BADGE_W} height={BADGE_H} rx={3} style={badgeRect} />
      <text x={bx + BADGE_W / 2} y={by + BADGE_H / 2} textAnchor="middle" dominantBaseline="middle" style={badgeText}>
        HTTP
      </text>
    </>
  );
}

function Block({ x, y, label, type }: { x: number; y: number; label: string; type: "regular" | "pubsub" }) {
  const isReg = type === "regular";
  return (
    <>
      <rect x={x} y={y} width={BW} height={BH} rx={2} style={isReg ? regRect : pubsubRect} />
      <rect x={x} y={y} width={ACCENT} height={BH} style={{ fill: isReg ? c.secondary : c.primary }} />
      <text x={x + BW / 2} y={y + BH / 2} textAnchor="middle" dominantBaseline="middle" style={isReg ? regText : pubsubText}>
        {label}
      </text>
      {!isReg && <HttpBadge blockX={x} blockY={y} />}
    </>
  );
}

// ── Desktop layout (side-by-side) ─────────────────────────────────────────────
const D_PUB_BOX_X = 10;
const D_PUB_BOX_Y = 52;
const D_COL_GAP   = 55;  // horizontal gap between the two boxes
const D_SUB_BOX_X = D_PUB_BOX_X + BOX_W + D_COL_GAP;
const D_BOX_H     = boxH(D_PUB_BOX_Y);
const D_Z_MID_X   = D_PUB_BOX_X + BOX_W + Math.floor(D_COL_GAP / 2);
const D_VB_W      = D_SUB_BOX_X + BOX_W + 15;
const D_VB_H      = D_PUB_BOX_Y + D_BOX_H + 15;

function DesktopDiagram() {
  const pubBx = blkX(D_PUB_BOX_X);
  const subBx = blkX(D_SUB_BOX_X);
  const by    = D_PUB_BOX_Y;

  return (
    <svg
      viewBox={`0 0 ${D_VB_W} ${D_VB_H}`}
      role="img"
      aria-labelledby="psfd-d-title psfd-d-desc"
      style={{ width: "100%", maxWidth: 680, display: "block", margin: "2rem auto", fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="psfd-d-title">PubSub message flow diagram</title>
      <desc id="psfd-d-desc">
        Publisher Logic App: a Receive trigger feeds a solid arrow into a Publish
        HTTP endpoint. A Z-shaped dashed arrow connects Publish to the Subscriber
        Logic App. Subscriber Logic App: Subscribe HTTP endpoint feeds a solid
        arrow into Acknowledge HTTP endpoint.
      </desc>
      <defs>
        <marker id="psfd-d-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* Publisher Logic App */}
      <text x={D_PUB_BOX_X} y={by - 8} style={titleText}>Publisher Logic App</text>
      <rect x={D_PUB_BOX_X} y={by} width={BOX_W} height={D_BOX_H} rx={4} style={boxRect} />
      <Block x={pubBx} y={topBlkY(by)} label="Receive" type="regular" />
      <line x1={cx(D_PUB_BOX_X)} y1={arrY1(by)} x2={cx(D_PUB_BOX_X)} y2={arrY2(by)} style={solid} markerEnd="url(#psfd-d-arr)" />
      <Block x={pubBx} y={botBlkY(by)} label="Publish" type="pubsub" />

      {/* Subscriber Logic App */}
      <text x={D_SUB_BOX_X} y={by - 8} style={titleText}>Subscriber Logic App</text>
      <rect x={D_SUB_BOX_X} y={by} width={BOX_W} height={D_BOX_H} rx={4} style={boxRect} />
      <Block x={subBx} y={topBlkY(by)} label="Subscribe" type="pubsub" />
      <line x1={cx(D_SUB_BOX_X)} y1={arrY1(by)} x2={cx(D_SUB_BOX_X)} y2={arrY2(by)} style={solid} markerEnd="url(#psfd-d-arr)" />
      <Block x={subBx} y={botBlkY(by)} label="Acknowledge" type="pubsub" />

      {/* Z dashed arrow: Publish (bottom-left) → Subscribe (top-right) */}
      <path
        d={`M${pubBx + BW},${cyBot(by)} H${D_Z_MID_X} V${cyTop(by)} H${subBx}`}
        style={dashed} markerEnd="url(#psfd-d-arr)"
      />
    </svg>
  );
}

// ── Mobile layout (stacked) ───────────────────────────────────────────────────
const M_BOX_X     = 10;
const M_PUB_BOX_Y = 52;
const M_BOX_GAP   = 44;  // vertical gap between publisher and subscriber boxes
const M_SUB_BOX_Y = M_PUB_BOX_Y + boxH(M_PUB_BOX_Y) + M_BOX_GAP;
const M_PUB_BOX_H = boxH(M_PUB_BOX_Y);
const M_SUB_BOX_H = boxH(M_SUB_BOX_Y);
const M_BLK_X     = blkX(M_BOX_X);
const M_CX        = cx(M_BOX_X);
// Connecting arrow: exits bottom of Publish block, enters top of Subscribe block
const M_CONN_Y1   = botBlkY(M_PUB_BOX_Y) + BH;
const M_CONN_Y2   = topBlkY(M_SUB_BOX_Y) - 3;
const M_VB_W      = M_BOX_X + BOX_W + 15;
const M_VB_H      = M_SUB_BOX_Y + M_SUB_BOX_H + 15;

function MobileDiagram() {
  const py = M_PUB_BOX_Y;
  const sy = M_SUB_BOX_Y;

  return (
    <svg
      viewBox={`0 0 ${M_VB_W} ${M_VB_H}`}
      role="img"
      aria-labelledby="psfd-m-title psfd-m-desc"
      style={{ width: "100%", maxWidth: 380, display: "block", margin: "2rem auto", fontFamily: "inherit", overflow: "visible" }}
    >
      <title id="psfd-m-title">PubSub message flow diagram</title>
      <desc id="psfd-m-desc">
        Publisher Logic App: a Receive trigger feeds a solid arrow into a Publish
        HTTP endpoint. A dashed arrow connects Publish down to the Subscriber
        Logic App. Subscriber Logic App: Subscribe HTTP endpoint feeds a solid
        arrow into Acknowledge HTTP endpoint.
      </desc>
      <defs>
        <marker id="psfd-m-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" style={{ fill: c.primaryLight }} />
        </marker>
      </defs>

      {/* Publisher Logic App */}
      <text x={M_BOX_X} y={py - 8} style={titleText}>Publisher Logic App</text>
      <rect x={M_BOX_X} y={py} width={BOX_W} height={M_PUB_BOX_H} rx={4} style={boxRect} />
      <Block x={M_BLK_X} y={topBlkY(py)} label="Receive" type="regular" />
      <line x1={M_CX} y1={arrY1(py)} x2={M_CX} y2={arrY2(py)} style={solid} markerEnd="url(#psfd-m-arr)" />
      <Block x={M_BLK_X} y={botBlkY(py)} label="Publish" type="pubsub" />

      {/* Dashed connecting arrow: Publish → Subscribe (straight down) */}
      <line x1={M_CX} y1={M_CONN_Y1} x2={M_CX} y2={M_CONN_Y2} style={dashed} markerEnd="url(#psfd-m-arr)" />

      {/* Subscriber Logic App */}
      <text x={M_BOX_X} y={sy - 8} style={titleText}>Subscriber Logic App</text>
      <rect x={M_BOX_X} y={sy} width={BOX_W} height={M_SUB_BOX_H} rx={4} style={boxRect} />
      <Block x={M_BLK_X} y={topBlkY(sy)} label="Subscribe" type="pubsub" />
      <line x1={M_CX} y1={arrY1(sy)} x2={M_CX} y2={arrY2(sy)} style={solid} markerEnd="url(#psfd-m-arr)" />
      <Block x={M_BLK_X} y={botBlkY(sy)} label="Acknowledge" type="pubsub" />
    </svg>
  );
}

// ── Responsive wrapper ────────────────────────────────────────────────────────
/**
 * Side-by-side on wide viewports, stacked vertically on narrow ones.
 * CSS display:none removes the hidden variant from the accessibility tree,
 * so both SVGs can safely carry their own role/title/desc without conflict.
 */
export default function PubSubFlowDiagram(): JSX.Element {
  return (
    <>
      <style>{`
        .psfd-wide   { display: block; }
        .psfd-narrow { display: none;  }
        @media (max-width: 640px) {
          .psfd-wide   { display: none;  }
          .psfd-narrow { display: block; }
        }
      `}</style>
      <div className="psfd-wide">
        <DesktopDiagram />
      </div>
      <div className="psfd-narrow">
        <MobileDiagram />
      </div>
    </>
  );
}

