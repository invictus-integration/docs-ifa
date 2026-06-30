import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const HEADING_FONT = "var(--ifm-heading-font-family, 'Bitter', Georgia, serif)";
const BODY_FONT =
  "var(--ifm-font-family-base, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif)";

const LIGHT = {
  arrow: "#065b68",
  ehBox: "#065b68",
  ehStroke: "#014550",
  ehTitle: "#ffffff",
  connectorLine: "rgba(255,255,255,0.45)",
  childBox: "#014550",
  childStroke: "#014550",
  childText: "#a0dde5",
  invSubtitle: "#a0dde5",
  clientLabel: "#374151",
  clientBoxBg: "#F9FAFB",
  clientBoxStroke: "#D1D5DB",
  scopeTitle: "#374151",
  scopeSep: "#E5E7EB",
  actionBg: "#FFFFFF",
  actionStroke: "#D1D5DB",
  actionText: "#374151",
};

const DARK = {
  arrow: "#2a8f9c",
  ehBox: "#1a5f68",
  ehStroke: "#2a8f9c",
  ehTitle: "#ffffff",
  connectorLine: "rgba(255,255,255,0.35)",
  childBox: "#014550",
  childStroke: "#2a8f9c",
  childText: "#a0dde5",
  invSubtitle: "#a0dde5",
  clientLabel: "#D1D5DB",
  clientBoxBg: "#374151",
  clientBoxStroke: "#6B7280",
  scopeTitle: "#F9FAFB",
  scopeSep: "#4B5563",
  actionBg: "#1F2937",
  actionStroke: "#6B7280",
  actionText: "#D1D5DB",
};

export default function ExceptionHandlerFlow() {
  const { colorMode } = useColorMode();
  const c = colorMode === "dark" ? DARK : LIGHT;

  return (
    <div style={{ margin: "1.5rem auto" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 640 380"
        role="img"
        aria-label="Exception Handler flow diagram"
      >
        <defs>
          <marker
            id="arr-ExceptionHandler"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={c.arrow} />
          </marker>
        </defs>

        <rect
          x="20"
          y="138"
          width="210"
          height="150"
          rx="6"
          fill={c.ehBox}
          stroke={c.ehStroke}
          strokeWidth="1.5"
        />
        <text
          x="125"
          y="165"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={c.ehTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Exception Handler
        </text>
        <text
          x="125"
          y="182"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={c.ehTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Logic App
        </text>
        <line
          x1="125"
          y1="194"
          x2="125"
          y2="206"
          stroke={c.connectorLine}
          strokeWidth="1.5"
        />
        <line
          x1="70"
          y1="206"
          x2="180"
          y2="206"
          stroke={c.connectorLine}
          strokeWidth="1.5"
        />
        <line
          x1="70"
          y1="206"
          x2="70"
          y2="218"
          stroke={c.connectorLine}
          strokeWidth="1.5"
        />
        <line
          x1="180"
          y1="206"
          x2="180"
          y2="218"
          stroke={c.connectorLine}
          strokeWidth="1.5"
        />
        <rect
          x="25"
          y="218"
          width="88"
          height="32"
          rx="3"
          fill={c.childBox}
          stroke={c.childStroke}
          strokeWidth="1"
        />
        <text
          x="69"
          y="238"
          textAnchor="middle"
          fontSize="10"
          fill={c.childText}
          style={{ fontFamily: BODY_FONT }}
        >
          Resolve
        </text>
        <rect
          x="137"
          y="218"
          width="88"
          height="32"
          rx="3"
          fill={c.childBox}
          stroke={c.childStroke}
          strokeWidth="1"
        />
        <text
          x="181"
          y="238"
          textAnchor="middle"
          fontSize="10"
          fill={c.childText}
          style={{ fontFamily: BODY_FONT }}
        >
          Return
        </text>

        {/* Dependency footer inside EH box — separator + label */}
        <line x1="28" y1="264" x2="226" y2="264" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        <text x="125" y="276" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={c.invSubtitle} style={{ fontFamily: BODY_FONT, opacity: 0.8 }}>
          Regex Translator + AI Interpreter
        </text>

        <text
          x="500"
          y="38"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={c.clientLabel}
          style={{ fontFamily: HEADING_FONT }}
        >
          Logic App
        </text>
        <rect
          x="390"
          y="46"
          width="220"
          height="144"
          rx="4"
          fill={c.clientBoxBg}
          stroke={c.clientBoxStroke}
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="68"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={c.scopeTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Scope
        </text>
        <line x1="390" y1="78" x2="610" y2="78" stroke={c.scopeSep} strokeWidth="1" />
        <rect
          x="400"
          y="88"
          width="200"
          height="34"
          rx="3"
          fill={c.actionBg}
          stroke={c.actionStroke}
          strokeWidth="1"
        />
        <text
          x="500"
          y="109"
          textAnchor="middle"
          fontSize="11"
          fill={c.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Resolve
        </text>
        <rect
          x="400"
          y="132"
          width="200"
          height="34"
          rx="3"
          fill={c.actionBg}
          stroke={c.actionStroke}
          strokeWidth="1"
        />
        <text
          x="500"
          y="153"
          textAnchor="middle"
          fontSize="11"
          fill={c.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Terminate
        </text>

        <text
          x="500"
          y="212"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={c.clientLabel}
          style={{ fontFamily: HEADING_FONT }}
        >
          Logic App
        </text>
        <rect
          x="390"
          y="220"
          width="220"
          height="144"
          rx="4"
          fill={c.clientBoxBg}
          stroke={c.clientBoxStroke}
          strokeWidth="1.5"
        />
        <text
          x="500"
          y="242"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={c.scopeTitle}
          style={{ fontFamily: HEADING_FONT }}
        >
          Scope
        </text>
        <line
          x1="390"
          y1="252"
          x2="610"
          y2="252"
          stroke={c.scopeSep}
          strokeWidth="1"
        />
        <rect
          x="400"
          y="262"
          width="200"
          height="34"
          rx="3"
          fill={c.actionBg}
          stroke={c.actionStroke}
          strokeWidth="1"
        />
        <text
          x="500"
          y="283"
          textAnchor="middle"
          fontSize="11"
          fill={c.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Resolve
        </text>
        <rect
          x="400"
          y="306"
          width="200"
          height="34"
          rx="3"
          fill={c.actionBg}
          stroke={c.actionStroke}
          strokeWidth="1"
        />
        <text
          x="500"
          y="327"
          textAnchor="middle"
          fontSize="11"
          fill={c.actionText}
          style={{ fontFamily: BODY_FONT }}
        >
          Terminate
        </text>

        <path
          d="M 390,105 L 310,105 L 310,170 L 230,170"
          fill="none"
          stroke={c.arrow}
          strokeWidth="1.5"
          strokeDasharray="6,4"
          markerEnd="url(#arr-ExceptionHandler)"
        />
        <path
          d="M 390,279 L 310,279 L 310,210 L 230,210"
          fill="none"
          stroke={c.arrow}
          strokeWidth="1.5"
          strokeDasharray="6,4"
          markerEnd="url(#arr-ExceptionHandler)"
        />
      </svg>
    </div>
  );
}
