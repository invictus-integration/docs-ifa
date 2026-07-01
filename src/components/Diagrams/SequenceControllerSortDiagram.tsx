import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";

const LIGHT = {
  slot1Box: "#2a8f9c",
  slot1Accent: "#014550",
  slot1Text: "#ffffff",
  slot2Box: "#6c7374",
  slot2Text: "#ffffff",
  slot3Box: "#01363f",
  slot3Text: "#ffffff",
  slot4Box: "#ffffff",
  slot4Stroke: "#b8c0c2",
  slot4Text: "#1c1e21",
  separatorFill: "#6c7374",
};

const DARK = {
  slot1Box: "#2a8f9c",
  slot1Accent: "#014550",
  slot1Text: "#ffffff",
  slot2Box: "#6B7280",
  slot2Text: "#ffffff",
  slot3Box: "#013c46",
  slot3Text: "#a0dde5",
  slot4Box: "#1F2937",
  slot4Stroke: "#6B7280",
  slot4Text: "#D1D5DB",
  separatorFill: "#9CA3AF",
};

function SequenceBox({
  x,
  label,
  fill,
  textFill,
  accentFill,
  strokeFill,
}: {
  x: number;
  label: string;
  fill: string;
  textFill: string;
  accentFill?: string;
  strokeFill?: string;
}) {
  return (
    <>
      <rect
        x={x}
        y="18"
        width="72"
        height="44"
        rx="2"
        fill={fill}
        stroke={strokeFill}
        strokeWidth={strokeFill ? "1.5" : undefined}
      />
      {accentFill && <rect x={x} y="18" width="6" height="44" fill={accentFill} />}
      {strokeFill && <rect x={x} y="18" width="6" height="44" fill={strokeFill} />}
      <text
        x={x + 36}
        y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="700"
        fill={textFill}
        style={{ fontFamily: HEADING_FONT }}
      >
        {label}
      </text>
    </>
  );
}

export default function SequenceControllerSort() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ maxWidth: 820, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 744 80"
        role="img"
        aria-label="Sequence Controller sorting diagram"
      >
        <SequenceBox x={16} label="2" fill={c.slot2Box} textFill={c.slot2Text} />
        <SequenceBox
          x={100}
          label="1"
          fill={c.slot1Box}
          accentFill={c.slot1Accent}
          textFill={c.slot1Text}
        />
        <SequenceBox x={184} label="3" fill={c.slot3Box} textFill={c.slot3Text} />
        <SequenceBox
          x={268}
          label="4"
          fill={c.slot4Box}
          strokeFill={c.slot4Stroke}
          textFill={c.slot4Text}
        />
        <text
          x="372"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="26"
          fontWeight="700"
          fill={c.separatorFill}
          style={{ fontFamily: HEADING_FONT }}
        >
          {">"}
        </text>
        <SequenceBox
          x={404}
          label="1"
          fill={c.slot1Box}
          accentFill={c.slot1Accent}
          textFill={c.slot1Text}
        />
        <SequenceBox x={488} label="2" fill={c.slot2Box} textFill={c.slot2Text} />
        <SequenceBox x={572} label="3" fill={c.slot3Box} textFill={c.slot3Text} />
        <SequenceBox
          x={656}
          label="4"
          fill={c.slot4Box}
          strokeFill={c.slot4Stroke}
          textFill={c.slot4Text}
        />
      </svg>
    </div>
  );
}
