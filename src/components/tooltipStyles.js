import { useState, useRef, useCallback, useEffect, useLayoutEffect, useInsertionEffect } from 'react';

// useLayoutEffect runs synchronously after DOM commit (before paint).
// This matters for the exclusivity listener: we need it registered before
// Cypress (or any consumer) can observe the tooltip in the DOM.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Shared tooltip card styles used by Badge, SharedNote, and TermHighlight.
// Injected once into <head> so every component stays self-contained.
const TOOLTIP_STYLES = `
.invictus-tooltip {
  --tooltip-bg: #ffffff;
  background: var(--tooltip-bg);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #1a2b2e;
  z-index: 9999;
  pointer-events: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.14), 0 1px 4px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--tooltip-accent, #014550);
  animation: invictus-tooltip-in 0.14s ease;
  white-space: normal;
}

.invictus-tooltip p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: inherit;
}

.invictus-tooltip p + p {
  margin-top: 6px;
}

.invictus-tooltip strong {
  font-family: 'Bitter', sans-serif;
  color: var(--tooltip-accent, #014550);
}

.invictus-tooltip em {
  font-style: italic;
}

.invictus-tooltip code {
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 4px;
  border-radius: 3px;
}

.invictus-tooltip a {
  color: var(--tooltip-accent, #014550);
  text-underline-offset: 2px;
}

/* Arrow — colour is driven by --tooltip-bg so dark mode is automatic */
.invictus-tooltip__arrow {
  position: absolute;
  margin-left: -7px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
}

.invictus-tooltip[data-below='false'] .invictus-tooltip__arrow {
  top: 100%;
  border-top: 7px solid var(--tooltip-bg);
}

.invictus-tooltip[data-below='true'] .invictus-tooltip__arrow {
  bottom: 100%;
  border-bottom: 7px solid var(--tooltip-bg);
}

/* Dark mode */
html[data-theme='dark'] .invictus-tooltip {
  --tooltip-bg: #1e2829;
  color: #d8eaed;
}

html[data-theme='dark'] .invictus-tooltip strong {
  color: color-mix(in srgb, var(--tooltip-accent, #2a8f9c) 85%, white);
}

html[data-theme='dark'] .invictus-tooltip code {
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme='dark'] .invictus-tooltip a {
  color: color-mix(in srgb, var(--tooltip-accent, #2a8f9c) 80%, white);
}

/* Pinned state — pointer-events enabled so text is selectable, ring accent */
.invictus-tooltip--pinned {
  pointer-events: auto;
  cursor: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18), 0 1px 4px rgba(0, 0, 0, 0.1),
              0 0 0 2px var(--tooltip-accent, #014550);
}

/* Entrance animation */
@keyframes invictus-tooltip-in {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export function useTooltipStyles() {
  useInsertionEffect(() => {
    const id = 'invictus-tooltip-styles';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = TOOLTIP_STYLES;
  }, []);
}

/**
 * Calculates and tracks the tooltip position relative to a trigger element.
 * Re-calculates on scroll and resize while the tooltip is visible so it
 * always stays anchored to the trigger even when the page scrolls.
 */
export function useTooltipPosition(ref, visible, {
  tooltipWidth = 300,
  margin = 12,
  navHeight = 60,
  gap = 10,
} = {}) {
  const [pos, setPos] = useState({ top: 0, left: 0, arrowLeft: 14, below: false });

  const calculate = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(margin, Math.min(left, vw - tooltipWidth - margin));

    const arrowLeft = Math.min(
      Math.max(rect.left + rect.width / 2 - left, 14),
      tooltipWidth - 14
    );

    const spaceAbove = rect.top - navHeight;
    const below = spaceAbove < 70;

    setPos({
      top: below ? rect.bottom + gap : rect.top - gap,
      left,
      arrowLeft,
      below,
    });
  }, [ref, tooltipWidth, margin, navHeight, gap]);

  // Initial calculation when tooltip becomes visible
  useLayoutEffect(() => {
    if (visible) calculate();
  }, [visible, calculate]);

  // Keep position in sync while visible
  useEffect(() => {
    if (!visible) return;
    window.addEventListener('scroll', calculate, { passive: true, capture: true });
    window.addEventListener('resize', calculate, { passive: true });
    return () => {
      window.removeEventListener('scroll', calculate, { capture: true });
      window.removeEventListener('resize', calculate);
    };
  }, [visible, calculate]);

  return pos;
}


// One-tooltip-at-a-time: when any tooltip activates, all others close.
const TOOLTIP_ACTIVATE_EVENT = 'invictus-tooltip-activate';

/**
 * - Hover / focus  → shows tooltip
 * - Click          → pins it open (stays visible when mouse leaves)
 * - Click again, Escape, or click outside → closes
 * - Another tooltip activating → closes this one
 */
export function usePinnedTooltip(ref) {
  const [hovered, setHovered] = useState(false);
  const [tooltipHovered, setTooltipHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hideTimer = useRef(null);
  const instanceId = useRef(`tip-${Math.random()}`);

  const visible = hovered || tooltipHovered || focused || pinned;

  const hide = useCallback(() => {
    clearTimeout(hideTimer.current);
    setHovered(false);
    setTooltipHovered(false);
    setFocused(false);
    setPinned(false);
  }, []);

  const activate = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent(TOOLTIP_ACTIVATE_EVENT, { detail: { id: instanceId.current } })
    );
  }, []);

  // Close when another tooltip activates (useLayoutEffect so the listener is
  // registered synchronously after DOM commit — before Cypress/MutationObserver
  // callbacks can fire and trigger the next hover event in tests).
  useIsoLayoutEffect(() => {
    if (!visible) return;
    const onOtherActivated = (e) => {
      if (e.detail.id !== instanceId.current) hide();
    };
    document.addEventListener(TOOLTIP_ACTIVATE_EVENT, onOtherActivated);
    return () => document.removeEventListener(TOOLTIP_ACTIVATE_EVENT, onOtherActivated);
  }, [visible, hide]);

  // Close on click-outside or Escape
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === 'Escape') hide(); };
    const onClickOut = (e) => {
      const insideBadge = ref.current && ref.current.contains(e.target);
      const insideTooltip = e.target.closest?.('.invictus-tooltip');
      if (!insideBadge && !insideTooltip) hide();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOut);
    };
  }, [visible, hide, ref]);

  // Clear the hide timer on unmount
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  return {
    visible,
    pinned,
    onMouseEnter: () => {
      clearTimeout(hideTimer.current);
      setHovered(true);
      activate();
    },
    onMouseLeave: () => {
      hideTimer.current = setTimeout(() => setHovered(false), 150);
    },
    onFocus: () => {
      setFocused(true);
      activate();
    },
    onBlur:              () => setFocused(false),
    onClick:             () => setPinned(p => !p),
    onTooltipMouseEnter: () => {
      clearTimeout(hideTimer.current);
      setTooltipHovered(true);
    },
    onTooltipMouseLeave: () => setTooltipHovered(false),
    // Exposed so interactive elements inside the tooltip can pin it before
    // causing a content re-render (which might trigger a spurious mouseleave).
    pin: useCallback(() => setPinned(true), [setPinned]),
  };
}
