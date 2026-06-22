import { useColorMode } from "@docusaurus/theme-common";
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

function DesktopDiagram() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={680}
      height={430}
      viewBox="0 0 495 313"
      role="img"
      aria-labelledby="ehfd-d-title ehfd-d-desc"
      style={{ margin: "auto", display: "block", fontFamily: "inherit" }}
    >
      <rect
        width={110}
        height={42}
        x={50}
        y={111.015}
        rx={3}
        ry={3}
        style={{
          fill: "#014550",
        }}
      />
      <text
        x={-52.459}
        y={-3.754}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(105.41 129.871)"
      >
        <tspan x={-52.459} y={-3.754}>
          {"E"}
        </tspan>
        <tspan x={-44.122} y={-3.754}>
          {"x"}
        </tspan>
        <tspan x={-37.622} y={-3.754}>
          {"c"}
        </tspan>
        <tspan x={-31.74} y={-3.754}>
          {"e"}
        </tspan>
        <tspan x={-25.858} y={-3.754}>
          {"p"}
        </tspan>
        <tspan x={-18.74} y={-3.754}>
          {"t"}
        </tspan>
        <tspan x={-14.077} y={-3.754}>
          {"i"}
        </tspan>
        <tspan x={-10.021} y={-3.754}>
          {"o"}
        </tspan>
        <tspan x={-3.521} y={-3.754}>
          {"n"}
        </tspan>
        <tspan
          x={3.597}
          y={-3.754}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={7.347} y={-3.754}>
          {"H"}
        </tspan>
        <tspan x={16.903} y={-3.754}>
          {"a"}
        </tspan>
        <tspan x={23.403} y={-3.754}>
          {"n"}
        </tspan>
        <tspan x={30.521} y={-3.754}>
          {"d"}
        </tspan>
        <tspan x={37.638} y={-3.754}>
          {"l"}
        </tspan>
        <tspan x={41.695} y={-3.754}>
          {"e"}
        </tspan>
        <tspan x={47.577} y={-3.754}>
          {"r"}
        </tspan>
        <tspan x={-28.602} y={10.665}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={10.665}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={10.665}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={10.665}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={10.665}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={10.665}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={10.665}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={10.665}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={10.665}>
          {"p"}
        </tspan>
      </text>
      <path
        d="M105 153.015v14M55 167.015h100M55 167.015v14M155 167.015v14"
        style={{
          stroke: "#014550",
          strokeWidth: 1.5,
          fill: "none",
        }}
      />
      <rect
        width={90}
        height={42}
        x={10}
        y={181.015}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#014550",
          strokeWidth: 2,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={90}
        height={42}
        x={110}
        y={181.015}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#014550",
          strokeWidth: 2,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <path
        strokeLinecap="round"
        d="M278.51 127.015H160.933"
        style={{
          stroke: "#065b68",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <path
        strokeLinecap="round"
        d="M341.37 255.242h-62.92V138.015H161"
        style={{
          stroke: "#065b68",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        width={110}
        height={42}
        x={330}
        y={36.015}
        rx={3}
        ry={3}
        style={{
          fill: "#6c7374",
        }}
      />
      <text
        x={-15.75}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(382.166 53.06)"
      >
        <tspan x={-15.75} y={3.456}>
          {"S"}
        </tspan>
        <tspan x={-8.632} y={3.456}>
          {"c"}
        </tspan>
        <tspan x={-2.75} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={3.75} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={10.868} y={3.456}>
          {"e"}
        </tspan>
      </text>
      <rect
        width={122.873}
        height={99.368}
        x={323.974}
        y={62.464}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          fill: "#000",
          fillOpacity: 0,
        }}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        width={75.007}
        height={30.491}
        x={345.234}
        y={85.729}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={110}
        height={42}
        x={330}
        y={186.015}
        rx={3}
        ry={3}
        style={{
          fill: "#6c7374",
        }}
      />
      <text
        x={-15.75}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(385.795 203.578)"
      >
        <tspan x={-15.75} y={3.456}>
          {"S"}
        </tspan>
        <tspan x={-8.632} y={3.456}>
          {"c"}
        </tspan>
        <tspan x={-2.75} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={3.75} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={10.868} y={3.456}>
          {"e"}
        </tspan>
      </text>
      <rect
        width={75.007}
        height={30.491}
        x={344.543}
        y={126.181}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={122.873}
        height={99.368}
        x={324.206}
        y={211.64}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          fill: "#000",
          fillOpacity: 0,
        }}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        width={75.007}
        height={30.491}
        x={345.288}
        y={235.711}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={75.007}
        height={30.491}
        x={344.543}
        y={276.243}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <text
        x={-19.112}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(381.55 101.03)"
      >
        <tspan x={-19.112} y={3.141}>
          {"R"}
        </tspan>
        <tspan x={-10.981} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-5.633} y={3.141}>
          {"s"}
        </tspan>
        <tspan x={-0.833} y={3.141}>
          {"o"}
        </tspan>
        <tspan x={5.077} y={3.141}>
          {"l"}
        </tspan>
        <tspan x={8.764} y={3.141}>
          {"v"}
        </tspan>
        <tspan x={14.673} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-19.112}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(381.55 250.168)"
      >
        <tspan x={-19.112} y={3.141}>
          {"R"}
        </tspan>
        <tspan x={-10.981} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-5.633} y={3.141}>
          {"s"}
        </tspan>
        <tspan x={-0.833} y={3.141}>
          {"o"}
        </tspan>
        <tspan x={5.077} y={3.141}>
          {"l"}
        </tspan>
        <tspan x={8.764} y={3.141}>
          {"v"}
        </tspan>
        <tspan x={14.673} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-25.67}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(381.922 141.382)"
      >
        <tspan x={-25.67} y={3.141}>
          {"T"}
        </tspan>
        <tspan x={-19.009} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-13.661} y={3.141}>
          {"r"}
        </tspan>
        <tspan x={-8.314} y={3.141}>
          {"m"}
        </tspan>
        <tspan x={0.925} y={3.141}>
          {"i"}
        </tspan>
        <tspan x={4.613} y={3.141}>
          {"n"}
        </tspan>
        <tspan x={11.083} y={3.141}>
          {"a"}
        </tspan>
        <tspan x={16.992} y={3.141}>
          {"t"}
        </tspan>
        <tspan x={21.232} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-25.67}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(383.038 291.443)"
      >
        <tspan x={-25.67} y={3.141}>
          {"T"}
        </tspan>
        <tspan x={-19.009} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-13.661} y={3.141}>
          {"r"}
        </tspan>
        <tspan x={-8.314} y={3.141}>
          {"m"}
        </tspan>
        <tspan x={0.925} y={3.141}>
          {"i"}
        </tspan>
        <tspan x={4.613} y={3.141}>
          {"n"}
        </tspan>
        <tspan x={11.083} y={3.141}>
          {"a"}
        </tspan>
        <tspan x={16.992} y={3.141}>
          {"t"}
        </tspan>
        <tspan x={21.232} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <path
        strokeLinecap="round"
        d="M279.242 125.45V97.722M341.106 98.774h-61.55"
        style={{
          stroke: "#065b68",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="m160.816 127.063 8.894-3.879v7.758ZM160.641 138.122l8.895-3.879v7.758Z"
        style={{
          strokeWidth: 0,
          fill: "#014550",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={-28.602}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(457.974 25.886)"
      >
        <tspan x={-28.602} y={3.456}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={3.456}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={3.456}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={3.456}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={3.456}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={3.456}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={3.456}>
          {"p"}
        </tspan>
      </text>
      <text
        x={-28.602}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        className="resolve-text"
        style={{
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(461.084 174.102)"
      >
        <tspan x={-28.602} y={3.456}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={3.456}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={3.456}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={3.456}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={3.456}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={3.456}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={3.456}>
          {"p"}
        </tspan>
      </text>
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
      xmlns="http://www.w3.org/2000/svg"

      viewBox="0 0 360 550"
    >
      <rect
        width={75.007}
        height={30.491}
        x={142.514}
        y={444.646}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={110}
        height={42}
        x={128.78}
        y={24.744}
        rx={3}
        ry={3}
        style={{
          fill: "#6c7374",
        }}
      />
      <rect
        width={122.873}
        height={99.368}
        x={123.21}
        y={55.36}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          fill: "#000",
          fillOpacity: 0,
        }}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        width={75.007}
        height={30.491}
        x={145.886}
        y={75.33}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <text
        x={-19.112}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(183.955 90.531)"
      >
        <tspan x={-19.112} y={3.141}>
          {"R"}
        </tspan>
        <tspan x={-10.981} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-5.633} y={3.141}>
          {"s"}
        </tspan>
        <tspan x={-0.833} y={3.141}>
          {"o"}
        </tspan>
        <tspan x={5.077} y={3.141}>
          {"l"}
        </tspan>
        <tspan x={8.764} y={3.141}>
          {"v"}
        </tspan>
        <tspan x={14.673} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <rect
        width={75.007}
        height={30.491}
        x={144.504}
        y={113.34}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <text
        x={-25.67}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(182.573 127.85)"
      >
        <tspan x={-25.67} y={3.141}>
          {"T"}
        </tspan>
        <tspan x={-19.009} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-13.661} y={3.141}>
          {"r"}
        </tspan>
        <tspan x={-8.314} y={3.141}>
          {"m"}
        </tspan>
        <tspan x={0.925} y={3.141}>
          {"i"}
        </tspan>
        <tspan x={4.613} y={3.141}>
          {"n"}
        </tspan>
        <tspan x={11.083} y={3.141}>
          {"a"}
        </tspan>
        <tspan x={16.992} y={3.141}>
          {"t"}
        </tspan>
        <tspan x={21.232} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-15.75}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(181.882 44.92)"
      >
        <tspan x={-15.75} y={3.456}>
          {"S"}
        </tspan>
        <tspan x={-8.632} y={3.456}>
          {"c"}
        </tspan>
        <tspan x={-2.75} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={3.75} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={10.868} y={3.456}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-28.602}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(277.713 18.351)"
      >
        <tspan x={-28.602} y={3.456}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={3.456}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={3.456}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={3.456}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={3.456}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={3.456}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={3.456}>
          {"p"}
        </tspan>
      </text>
      <rect
        width={110}
        height={42}
        x={131.72}
        y={225.025}
        rx={3}
        ry={3}
        style={{
          fill: "#014550",
        }}
      />
      <path
        strokeLinecap="round"
        d="M288.236 90.09h-61.551M288.399 248.906V96.31"
        style={{
          stroke: "#065b68",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        strokeLinecap="round"
        d="M283.349 248.177h-39.182"
        style={{
          stroke: "#065b68",
          strokeWidth: 2,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={-52.459}
        y={-3.754}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={700}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(187.694 247.322)"
      >
        <tspan x={-52.459} y={-3.754}>
          {"E"}
        </tspan>
        <tspan x={-44.122} y={-3.754}>
          {"x"}
        </tspan>
        <tspan x={-37.622} y={-3.754}>
          {"c"}
        </tspan>
        <tspan x={-31.74} y={-3.754}>
          {"e"}
        </tspan>
        <tspan x={-25.858} y={-3.754}>
          {"p"}
        </tspan>
        <tspan x={-18.74} y={-3.754}>
          {"t"}
        </tspan>
        <tspan x={-14.077} y={-3.754}>
          {"i"}
        </tspan>
        <tspan x={-10.021} y={-3.754}>
          {"o"}
        </tspan>
        <tspan x={-3.521} y={-3.754}>
          {"n"}
        </tspan>
        <tspan
          x={3.597}
          y={-3.754}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={7.347} y={-3.754}>
          {"H"}
        </tspan>
        <tspan x={16.903} y={-3.754}>
          {"a"}
        </tspan>
        <tspan x={23.403} y={-3.754}>
          {"n"}
        </tspan>
        <tspan x={30.521} y={-3.754}>
          {"d"}
        </tspan>
        <tspan x={37.638} y={-3.754}>
          {"l"}
        </tspan>
        <tspan x={41.695} y={-3.754}>
          {"e"}
        </tspan>
        <tspan x={47.577} y={-3.754}>
          {"r"}
        </tspan>
        <tspan x={-28.602} y={10.665}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={10.665}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={10.665}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={10.665}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={10.665}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={10.665}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={10.665}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={10.665}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={10.665}>
          {"p"}
        </tspan>
      </text>
      <path
        d="m241.862 248.184 8.894-3.88v7.758Z"
        style={{
          strokeWidth: 0,
          fill: "#014550",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M186.119 267.211v14M136.119 281.727h100M235.394 281.012v14M136.75 281.05v14"
        style={{
          stroke: "#014550",
          strokeWidth: 1.5,
          fill: "none",
        }}
      />
      <rect
        width={90}
        height={42}
        x={190.396}
        y={295.14}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#014550",
          strokeWidth: 2,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={90}
        height={42}
        x={91.793}
        y={294.975}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#014550",
          strokeWidth: 2,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <rect
        width={110}
        height={42}
        x={125.5}
        y={395.685}
        rx={3}
        ry={3}
        style={{
          fill: "#6c7374",
        }}
      />
      <rect
        width={122.873}
        height={99.368}
        x={119.064}
        y={419.889}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          fill: "#000",
          fillOpacity: 0,
        }}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={-15.75}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#fff",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(179.284 413.038)"
      >
        <tspan x={-15.75} y={3.456}>
          {"S"}
        </tspan>
        <tspan x={-8.632} y={3.456}>
          {"c"}
        </tspan>
        <tspan x={-2.75} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={3.75} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={10.868} y={3.456}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-19.112}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(180.5 458.023)"
      >
        <tspan x={-19.112} y={3.141}>
          {"R"}
        </tspan>
        <tspan x={-10.981} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-5.633} y={3.141}>
          {"s"}
        </tspan>
        <tspan x={-0.833} y={3.141}>
          {"o"}
        </tspan>
        <tspan x={5.077} y={3.141}>
          {"l"}
        </tspan>
        <tspan x={8.764} y={3.141}>
          {"v"}
        </tspan>
        <tspan x={14.673} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <text
        x={-25.67}
        y={3.141}
        fontFamily="inherit"
        fontSize={10}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(178.676 498.144)"
      >
        <tspan x={-25.67} y={3.141}>
          {"T"}
        </tspan>
        <tspan x={-19.009} y={3.141}>
          {"e"}
        </tspan>
        <tspan x={-13.661} y={3.141}>
          {"r"}
        </tspan>
        <tspan x={-8.314} y={3.141}>
          {"m"}
        </tspan>
        <tspan x={0.925} y={3.141}>
          {"i"}
        </tspan>
        <tspan x={4.613} y={3.141}>
          {"n"}
        </tspan>
        <tspan x={11.083} y={3.141}>
          {"a"}
        </tspan>
        <tspan x={16.992} y={3.141}>
          {"t"}
        </tspan>
        <tspan x={21.232} y={3.141}>
          {"e"}
        </tspan>
      </text>
      <rect
        width={75.007}
        height={30.491}
        x={141.298}
        y={482.943}
        fill="none"
        rx={3}
        ry={3}
        style={{
          stroke: "#6c7374",
          strokeWidth: 1.5,
          fill: "#000",
          fillOpacity: 0,
        }}
      />
      <path
        strokeLinecap="round"
        d="M137.93 462.204H64.106M64.046 458.717V245.763"
        style={{
          stroke: "#065b68",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        strokeLinecap="round"
        d="M127.862 245.752H64.34"
        style={{
          stroke: "#065b68",
          strokeWidth: 2,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          fill: "none",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="m131.383 245.831-8.894 3.88v-7.759Z"
        style={{
          strokeWidth: 0,
          fill: "#014550",
        }}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={-28.602}
        y={3.456}
        fontFamily="inherit"
        fontSize={11}
        fontWeight={600}
        style={{
          fill: "#000",
          textDecorationThickness: "6.6667%",
          whiteSpace: "pre",
        }}
        transform="translate(272.958 385.521)"
      >
        <tspan x={-28.602} y={3.456}>
          {"L"}
        </tspan>
        <tspan x={-20.265} y={3.456}>
          {"o"}
        </tspan>
        <tspan x={-13.765} y={3.456}>
          {"g"}
        </tspan>
        <tspan x={-7.265} y={3.456}>
          {"i"}
        </tspan>
        <tspan x={-3.209} y={3.456}>
          {"c"}
        </tspan>
        <tspan
          x={2.673}
          y={3.456}
          style={{
            whiteSpace: "pre",
          }}
        />
        <tspan x={6.423} y={3.456}>
          {"A"}
        </tspan>
        <tspan x={15.367} y={3.456}>
          {"p"}
        </tspan>
        <tspan x={22.485} y={3.456}>
          {"p"}
        </tspan>
      </text>
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
        .resolve-text { fill: black; }
        [data-theme="dark"] .resolve-text { fill: white; }
      `}</style>
      <div className="ehfd-wide"><DesktopDiagram /></div>
      <div className="ehfd-narrow"><MobileDiagram /></div>
    </>
  );
}
