import React from "react";
import { DIAGRAM_COLORS as C, HEADING_FONT } from "./diagramTheme";

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
  return (
    <div style={{ maxWidth: 820, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 744 80"
        role="img"
        aria-label="Sequence Controller sorting diagram"
      >
        <SequenceBox x={16} label="2" fill={C.slot2Box} textFill={C.slot2Text} />
        <SequenceBox
          x={100}
          label="1"
          fill={C.slot1Box}
          accentFill={C.slot1Accent}
          textFill={C.slot1Text}
        />
        <SequenceBox x={184} label="3" fill={C.slot3Box} textFill={C.slot3Text} />
        <SequenceBox
          x={268}
          label="4"
          fill={C.slot4Box}
          strokeFill={C.slot4Stroke}
          textFill={C.slot4Text}
        />
        <text
          x="372"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="26"
          fontWeight="700"
          fill={C.separatorFill}
          style={{ fontFamily: HEADING_FONT }}
        >
          {">"}
        </text>
        <SequenceBox
          x={404}
          label="1"
          fill={C.slot1Box}
          accentFill={C.slot1Accent}
          textFill={C.slot1Text}
        />
        <SequenceBox x={488} label="2" fill={C.slot2Box} textFill={C.slot2Text} />
        <SequenceBox x={572} label="3" fill={C.slot3Box} textFill={C.slot3Text} />
        <SequenceBox
          x={656}
          label="4"
          fill={C.slot4Box}
          strokeFill={C.slot4Stroke}
          textFill={C.slot4Text}
        />
      </svg>
    </div>
  );
}
