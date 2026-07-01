import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

const LIGHT = {
  aBox: "#065b68",
  aText: "#ffffff",
  bBox: "#002b32",
  bText: "#ffffff",
  cBox: "#6c7374",
  cText: "#ffffff",
  dBox: "#2a8f9c",
  dText: "#1c1e21",
  separatorFill: "#b8c0c2",
};

const DARK = {
  aBox: "#1a5f68",
  aText: "#ffffff",
  bBox: "#002b32",
  bText: "#ffffff",
  cBox: "#4B5563",
  cText: "#ffffff",
  dBox: "#374151",
  dText: "#D1D5DB",
  separatorFill: "#6B7280",
};

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
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 820, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 744 80"
        role="img"
        aria-label="Time Sequencer sorting diagram"
      >
        <SortBox x={16} label="A" time="1:05" fill={c.aBox} textFill={c.aText} />
        <SortBox x={100} label="B" time="0:40" fill={c.bBox} textFill={c.bText} />
        <SortBox x={184} label="C" time="1:23" fill={c.cBox} textFill={c.cText} />
        <SortBox x={268} label="D" time="2:01" fill={c.dBox} textFill={c.dText} />
        <text
          x="372"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fill={c.separatorFill}
          style={{ fontFamily: BODY_FONT }}
        >
          ›
        </text>
        <SortBox x={404} label="B" time="0:40" fill={c.bBox} textFill={c.bText} />
        <SortBox x={488} label="A" time="1:05" fill={c.aBox} textFill={c.aText} />
        <SortBox x={572} label="C" time="1:23" fill={c.cBox} textFill={c.cText} />
        <SortBox x={656} label="D" time="2:01" fill={c.dBox} textFill={c.dText} />
      </svg>
    </div>
  );
}
