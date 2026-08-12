import React from "react";
import { DIAGRAM_COLORS as C, HEADING_FONT, BODY_FONT } from "./diagramTheme";

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
  return (
    <div style={{ maxWidth: 820, margin: "2rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 744 80"
        role="img"
        aria-label="Time Sequencer sorting diagram"
      >
        <SortBox x={16} label="A" time="1:05" fill={C.aBox} textFill={C.aText} />
        <SortBox x={100} label="B" time="0:40" fill={C.bBox} textFill={C.bText} />
        <SortBox x={184} label="C" time="1:23" fill={C.cBox} textFill={C.cText} />
        <SortBox x={268} label="D" time="2:01" fill={C.dBox} textFill={C.dText} />
        <text
          x="372"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fill={C.separatorFill}
          style={{ fontFamily: BODY_FONT }}
        >
          ›
        </text>
        <SortBox x={404} label="B" time="0:40" fill={C.bBox} textFill={C.bText} />
        <SortBox x={488} label="A" time="1:05" fill={C.aBox} textFill={C.aText} />
        <SortBox x={572} label="C" time="1:23" fill={C.cBox} textFill={C.cText} />
        <SortBox x={656} label="D" time="2:01" fill={C.dBox} textFill={C.dText} />
      </svg>
    </div>
  );
}
