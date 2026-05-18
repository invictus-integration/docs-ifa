import { useState, useEffect, useRef, useId, useInsertionEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTooltipStyles, usePinnedTooltip, useTooltipPosition } from './tooltipStyles';
import { useColorMode } from '@docusaurus/theme-common';

// ─── Styles ──────────────────────────────────────────────────────────────────
// Only the term badge highlight styles live here; the shared tooltip card
// styles are injected via useTooltipStyles() from tooltipStyles.js.

const STYLES = `
/* ── Base badge — mirrors the existing Badge component style ─────────────── */
.term-highlight {
  display: inline;
  padding: 2px 5px 2px 6px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Bitter', sans-serif;
  cursor: help;
  user-select: none;
  white-space: nowrap;
  border-bottom: 2px solid var(--term-accent);
  background-color: var(--term-bg);
  color: var(--term-color);
  transition: filter 0.15s ease, outline-color 0.15s ease;
  outline: 2px solid transparent;
  outline-offset: 1px;
}

.term-highlight:hover,
.term-highlight:focus-visible {
  filter: brightness(0.92);
  outline-color: var(--term-accent);
}

.term-highlight:focus-visible {
  outline-style: solid;
}

/* Small circled ? indicator appended to the term */
.term-highlight__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--term-accent);
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  font-family: 'Bitter', sans-serif;
  vertical-align: middle;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.term-highlight:hover .term-highlight__icon,
.term-highlight:focus-visible .term-highlight__icon {
  opacity: 1;
}

/* ── Color tokens per term ────────────────────────────────────────────────── */

/* Flow — teal (site primary) */
.term-highlight--flow {
  --term-bg: #dff2f4;
  --term-color: #013b45;
  --term-accent: #014550;
}
html[data-theme='dark'] .term-highlight--flow {
  --term-bg: rgba(1, 69, 80, 0.32);
  --term-color: #7dd8e3;
}

/* Flow Trace — warm amber (consistent with warning/accent tones in the codebase) */
.term-highlight--flow-trace {
  --term-bg: #fef2d9;
  --term-color: #7a4b00;
  --term-accent: #9a5f00;
}
html[data-theme='dark'] .term-highlight--flow-trace {
  --term-bg: rgba(154, 95, 0, 0.28);
  --term-color: #f0bc55;
}

/* Flow Trace Importing — steel blue (distinct from teal) */
.term-highlight--flow-trace-importing {
  --term-bg: #dceef9;
  --term-color: #00476e;
  --term-accent: #005f8a;
}
html[data-theme='dark'] .term-highlight--flow-trace-importing {
  --term-bg: rgba(0, 95, 138, 0.3);
  --term-color: #7ec8f0;
}

/* ── Tooltip accent per term (referenced by invictus-tooltip CSS var) ─────── */
.term-highlight--flow-tooltip                 { --tooltip-accent: #014550; }
.term-highlight--flow-trace-tooltip           { --tooltip-accent: #9a5f00; }
.term-highlight--flow-trace-importing-tooltip { --tooltip-accent: #005f8a; }

/* ── Carousel nav bar ─────────────────────────────────────────────────────── */
.invictus-tooltip__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.invictus-tooltip__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--tooltip-accent);
  background: transparent;
  color: var(--tooltip-accent);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: background 0.15s ease;
}

.invictus-tooltip__nav-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

html[data-theme='dark'] .invictus-tooltip__nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.invictus-tooltip__nav-label {
  flex: 1;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  font-family: 'Bitter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tooltip-accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.invictus-tooltip__nav-pager {
  font-size: 10px;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.5;
}

/* ── Inline term links inside tooltip content ────────────────────────────── */
.invictus-tooltip__term-link {
  display: inline;
  padding: 0 2px;
  border: none;
  border-bottom: 1.5px solid;
  background: transparent;
  font-size: inherit;
  font-weight: 600;
  font-family: 'Bitter', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.invictus-tooltip__term-link:hover {
  opacity: 0.72;
}
`;

function useTermHighlightStyles() {
  useTooltipStyles();
  useInsertionEffect(() => {
    const id = 'term-highlight-styles';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = STYLES;
  }, []);
}

// ─── Term registry ───────────────────────────────────────────────────────────
// Single source of truth for all technical term definitions.
// Cross-references use #term-key anchors; clicking them navigates the carousel.

type TermDef = {
  label: string;
  termClass: string;
  accent: string;
  accentDark: string;
  tooltipMarkdown: string;
};

const TERM_REGISTRY: Record<string, TermDef> = {
  'flow': {
    label: 'flow',
    termClass: 'term-highlight--flow',
    accent: '#014550',
    accentDark: '#7dd8e3',
    tooltipMarkdown: `A **Flow** is a named message chain — a logical grouping of related [flow traces](#flow-trace) sharing a common integration origin.\n\nFlows are organized in *folders* and defined by a name, optional mappings, and business properties.`,
  },
  'flow-trace': {
    label: 'flow trace',
    termClass: 'term-highlight--flow-trace',
    accent: '#9a5f00',
    accentDark: '#f0bc55',
    tooltipMarkdown: `A **Flow trace** is a single tracked message instance within a [flow](#flow). It records the full lifecycle of one execution: status, timestamps, properties, and the chain of processing steps.\n\nEach flow trace can be searched and inspected in the Dashboard, and is loaded via [flow trace importing](#flow-trace-importing).`,
  },
  'flow-trace-importing': {
    label: 'flow trace importing',
    termClass: 'term-highlight--flow-trace-importing',
    accent: '#005f8a',
    accentDark: '#7ec8f0',
    tooltipMarkdown: `**Flow trace importing** is the process of ingesting [flow trace](#flow-trace) data into the Dashboard — automatically via Logic Apps or Function Apps, or manually.\n\nOnce imported, messages become visible and searchable in the flow monitoring view.`,
  },
};

const TERM_ORDER = ['flow', 'flow-trace', 'flow-trace-importing'];

// ─── Component ───────────────────────────────────────────────────────────────

const TOOLTIP_WIDTH = 300;

type TermHighlightProps = {
  termKey: string;
  label: string;
  termClass: string;
  tooltipMarkdown: string;
  variant?: 'business' | 'technical';
};

function TermHighlight({ termKey, label, termClass, tooltipMarkdown, variant = 'technical' }: TermHighlightProps) {
  useTermHighlightStyles();

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const ref = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const { visible, pinned, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick, pin, onTooltipMouseEnter, onTooltipMouseLeave } = usePinnedTooltip(ref);
  const pos = useTooltipPosition(ref, visible, { tooltipWidth: TOOLTIP_WIDTH });

  // Carousel state — which term is currently shown in the tooltip
  const [currentTermKey, setCurrentTermKey] = useState(termKey);

  // Reset to the originating term each time the tooltip closes
  useEffect(() => {
    if (!visible) setCurrentTermKey(termKey);
  }, [visible, termKey]);

  const currentIdx = TERM_ORDER.indexOf(currentTermKey);
  const prevKey = TERM_ORDER[(currentIdx - 1 + TERM_ORDER.length) % TERM_ORDER.length];
  const nextKey = TERM_ORDER[(currentIdx + 1) % TERM_ORDER.length];
  const currentTerm = TERM_REGISTRY[currentTermKey];

  // Show the passed tooltipMarkdown for the originating term (may be custom or
  // a variant-specific default); all other terms use their registry defaults.
  const contentMarkdown =
    currentTermKey === termKey ? tooltipMarkdown : currentTerm.tooltipMarkdown;

  // Custom <a> renderer: #term-key links navigate the carousel instead of routing
  const mdComponents = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      const key = href?.startsWith('#') ? href.slice(1) : null;
      const target = key ? TERM_REGISTRY[key] : null;
      if (target) {
        return (
          <button
            className="invictus-tooltip__term-link"
            style={{ color: isDark ? target.accentDark : target.accent, borderBottomColor: isDark ? target.accentDark : target.accent }}
            onClick={(e) => { e.stopPropagation(); pin(); setCurrentTermKey(key!); }}
          >
            {children}
          </button>
        );
      }
      return <a href={href}>{children}</a>;
    },
  };

  const tooltipEl = visible && createPortal(
    <div
      id={tooltipId}
      role="tooltip"
      className={`invictus-tooltip${pinned ? ' invictus-tooltip--pinned' : ''}`}
      data-below={pos.below ? 'true' : 'false'}
      onMouseEnter={onTooltipMouseEnter}
      onMouseLeave={onTooltipMouseLeave}
      style={{
        position: 'fixed',
        top: pos.below ? pos.top : 'auto',
        bottom: pos.below ? 'auto' : `calc(100vh - ${pos.top}px)`,
        left: pos.left,
        width: TOOLTIP_WIDTH,
        '--tooltip-accent': isDark ? currentTerm.accentDark : currentTerm.accent,
      } as React.CSSProperties}
    >
      {/* Carousel nav — technical variant only */}
      {variant === 'technical' && (
        <div className="invictus-tooltip__nav">
          <button
            className="invictus-tooltip__nav-btn"
            onClick={(e) => { e.stopPropagation(); pin(); setCurrentTermKey(prevKey); }}
            aria-label={`Previous: ${TERM_REGISTRY[prevKey].label}`}
          >‹</button>
          <span className="invictus-tooltip__nav-label">
            {currentTerm.label}
            <span className="invictus-tooltip__nav-pager">{currentIdx + 1} / {TERM_ORDER.length}</span>
          </span>
          <button
            className="invictus-tooltip__nav-btn"
            onClick={(e) => { e.stopPropagation(); pin(); setCurrentTermKey(nextKey); }}
            aria-label={`Next: ${TERM_REGISTRY[nextKey].label}`}
          >›</button>
        </div>
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents as any}>
        {contentMarkdown}
      </ReactMarkdown>
      <span
        className="invictus-tooltip__arrow"
        style={{ left: pos.arrowLeft }}
      />
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={ref}
        className={`term-highlight ${termClass}`}
        tabIndex={0}
        role="button"
        aria-pressed={pinned}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        {label}<span className="term-highlight__icon" aria-hidden="true">?</span>
      </span>
      {tooltipEl}
    </>
  );
}

const FLOW_TOOLTIP_BUSINESS =
  `A **Flow** is a named message chain — a logical grouping of related **mapping messages** sharing a common integration origin.\n\nFlows are organized in *folders* and defined by a name, optional mappings, and business properties.`;

type FlowProps = { tooltip?: string; variant?: 'business' | 'technical' };

export function Flow({ tooltip, variant = 'business' }: FlowProps) {
  return (
    <TermHighlight
      termKey="flow"
      label="flow"
      termClass="term-highlight--flow"
      variant={variant}
      tooltipMarkdown={tooltip ?? (variant === 'technical' ? TERM_REGISTRY['flow'].tooltipMarkdown : FLOW_TOOLTIP_BUSINESS)}
    />
  );
}

export function Flows({ tooltip, variant = 'business' }: FlowProps) {
  return (
    <TermHighlight
      termKey="flow"
      label="flows"
      termClass="term-highlight--flow"
      variant={variant}
      tooltipMarkdown={tooltip ?? (variant === 'technical' ? TERM_REGISTRY['flow'].tooltipMarkdown : FLOW_TOOLTIP_BUSINESS)}
    />
  );
}

export function FlowTrace({ tooltip }: { tooltip?: string }) {
  return (
    <TermHighlight
      termKey="flow-trace"
      label="flow trace"
      termClass="term-highlight--flow-trace"
      tooltipMarkdown={tooltip ?? TERM_REGISTRY['flow-trace'].tooltipMarkdown}
    />
  );
}

export function FlowTraces({ tooltip }: { tooltip?: string }) {
  return (
    <TermHighlight
      termKey="flow-trace"
      label="flow traces"
      termClass="term-highlight--flow-trace"
      tooltipMarkdown={tooltip ?? TERM_REGISTRY['flow-trace'].tooltipMarkdown}
    />
  );
}

export function FlowTraceImporting({ tooltip }: { tooltip?: string }) {
  return (
    <TermHighlight
      termKey="flow-trace-importing"
      label="flow trace importing"
      termClass="term-highlight--flow-trace-importing"
      tooltipMarkdown={tooltip ?? TERM_REGISTRY['flow-trace-importing'].tooltipMarkdown}
    />
  );
}
