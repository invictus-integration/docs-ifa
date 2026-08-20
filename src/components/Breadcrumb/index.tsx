import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';
import { useTooltipStyles, usePinnedTooltip, useTooltipPosition } from '../tooltipStyles';

const TOOLTIP_WIDTH = 280;

type BreadcrumbProps = {
  /** Array of segments (strings or React nodes, e.g. <FontAwesomeIcon />); the last is active */
  paths?: React.ReactNode[];
  /** Array of React nodes — each becomes one item; the last is active by default */
  items?: React.ReactNode[];
  /** When false, no item receives the active style. Defaults to true. */
  activeLast?: boolean;
  /**
   * Plain-language description of the path for screen readers, e.g.
   * "Go to your profile settings, then Settings". Write it yourself instead
   * of relying on the visual segments — icons and short labels rarely make
   * sense read out on their own. Supports Markdown (e.g. `code`, **bold**).
   */
  summary: string;
};

function Chevron() {
  return (
    <span className={styles.separator} aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Breadcrumb({ paths, items, activeLast = true, summary }: BreadcrumbProps) {
  const segments: React.ReactNode[] = paths ?? items ?? [];
  const summaryId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const summaryContent = <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>;

  useTooltipStyles();
  const {
    visible,
    pinned,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onClick,
    onTooltipMouseEnter,
    onTooltipMouseLeave,
  } = usePinnedTooltip(triggerRef);
  const pos = useTooltipPosition(triggerRef, visible, { tooltipWidth: TOOLTIP_WIDTH });

  // This component illustrates a UI path inline in prose (e.g. "Go to
  // <Breadcrumb .../> to add..."); it isn't real page navigation. So instead
  // of a <nav>/<ol>/aria-current landmark (which would announce a false
  // "navigation" region and a false "current page"), we expose the
  // author-provided `summary` to assistive tech via a permanent sr-only span
  // (referenced through aria-describedby, independent of tooltip visibility
  // so it works reliably regardless of hover/focus timing) and, on
  // hover/focus, show that same sentence as a visible tooltip — sighted and
  // low-vision users benefit too, without it being on-page all the time.
  const tooltipEl = visible && createPortal(
    <div
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
      }}
    >
      {summaryContent}
      <span className="invictus-tooltip__arrow" style={{ left: pos.arrowLeft }} />
    </div>,
    document.body
  );

  return (
    <>
      <span id={summaryId} className={styles.srOnly}>{summaryContent}</span>
      <span
        ref={triggerRef}
        className={styles.nav}
        tabIndex={0}
        role="button"
        aria-pressed={pinned}
        aria-describedby={summaryId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <span className={styles.logo}>
          <img src="/img/favicon.ico" alt="" />
        </span>
        <Chevron />
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          const isActive = activeLast && isLast;
          return (
            <React.Fragment key={i}>
              {i > 0 && <Chevron />}
              <span className={`${styles.item}${isActive ? ` ${styles.active}` : ''}`}>
                {segment}
              </span>
            </React.Fragment>
          );
        })}
      </span>
      {tooltipEl}
    </>
  );
}
