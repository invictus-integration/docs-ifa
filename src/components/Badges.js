import { useId, useRef, useState, useEffect, useInsertionEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipStyles, usePinnedTooltip, useTooltipPosition } from './tooltipStyles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faStar, faRoadBarrier, faBan } from '@fortawesome/free-solid-svg-icons';

const TOOLTIP_WIDTH = 260;

// Tints the whole markdown-table <tr> that contains a <RowTint/> marker, using
// the same colors as ParameterTable's rowNew/rowDeprecated. Injected once into
// <head>, same self-contained pattern as useTooltipStyles below.
const ROW_TINT_STYLES = `
.markdown table tr:has([data-row-tint='deprecated']) {
  background: rgba(181, 93, 0, 0.05) !important;
}

.markdown table tr:has([data-row-tint='deprecated']) td:first-child {
  border-left: 3px solid rgba(181, 93, 0, 0.35);
}

.markdown table tr:has([data-row-tint='new']) {
  background: rgba(5, 150, 105, 0.05) !important;
}

.markdown table tr:has([data-row-tint='new']) td:first-child {
  border-left: 3px solid rgba(5, 150, 105, 0.35);
}

html[data-theme='dark'] .markdown table tr:has([data-row-tint='deprecated']) {
  background: rgba(251, 146, 60, 0.07) !important;
}

html[data-theme='dark'] .markdown table tr:has([data-row-tint='new']) {
  background: rgba(74, 222, 128, 0.07) !important;
}
`;

function useRowTintStyles() {
  useInsertionEffect(() => {
    const id = 'invictus-row-tint-styles';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = ROW_TINT_STYLES;
  }, []);
}

export function OnlyAdminsBadge() {
  return Badge({
    title: <><FontAwesomeIcon icon={faShield} /> Admins</>,
    tooltip: "Only available for users with a **System Admin** role."
  });
}

export function OnlyOperatorsBadge() {
  return Badge({
    title: <><FontAwesomeIcon icon={faShield} /> Operators</>,
    tooltip: "Only available for users with at least **Operator** permissions on the flow."
  });
}

export function OnlyFolderAdminsBadge() {
  return Badge({
    title: <><FontAwesomeIcon icon={faShield} /> Admins</>,
    tooltip: "Only available for users with a **Folder** or **System Admin** role."
  });
}

export function NewSinceBadge({ version, style }) {
  return Badge({
    title: <><FontAwesomeIcon icon={faStar} /> {version}</>,
    tooltip: `Feature included since **Invictus ${version}**.`,
    backgroundColor: 'var(--inv-badge-new-bg)',
    color: 'var(--inv-badge-new-text)',
    style,
  });
}

export function DeprecatedSinceBadge({ version, note, style }) {
  return Badge({
    title: <><FontAwesomeIcon icon={faBan} /> {version}</>,
    tooltip: `Feature deprecated since **Invictus ${version}**. ${note}`,
    backgroundColor: 'var(--inv-badge-deprecated-bg)',
    color: 'var(--inv-badge-deprecated-text)',
    style,
  });
}

/**
 * Invisible marker to manually tint the enclosing markdown-table row, the
 * same way ParameterTable's rowNew/rowDeprecated do. Drop it in any cell of
 * the row you want tinted — independent of which/how many badges that row
 * happens to contain, since a row can have more than one badge (e.g. a
 * Deprecated badge next to a Shared note) and auto-detecting off badge
 * presence would be ambiguous in that case.
 *
 * Example:
 *   | `useBeta` | `$null` | Use `acrEnvironment` instead. <DeprecatedSinceBadge version="v6.3" note="..." /><RowTint variant="deprecated" /> |
 */
export function RowTint({ variant }) {
  useRowTintStyles();
  return <span data-row-tint={variant} aria-hidden="true" style={{ display: 'none' }} />;
}

export function Badge({ title, tooltip, backgroundColor = '#b55d00', color = 'white', style }) {
  useTooltipStyles();

  const badgeRef = useRef(null);
  const tooltipId = useId();

  const { visible, pinned, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick, onTooltipMouseEnter, onTooltipMouseLeave } = usePinnedTooltip(badgeRef);
  const pos = useTooltipPosition(badgeRef, visible, { tooltipWidth: TOOLTIP_WIDTH });

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
        '--tooltip-accent': backgroundColor,
      }}
    >
      {typeof tooltip === 'string'
        ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{tooltip}</ReactMarkdown>
        : tooltip}
      <span className="invictus-tooltip__arrow" style={{ left: pos.arrowLeft }} />
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={badgeRef}
        style={{ position: 'relative', display: 'inline-block', textTransform: 'none', fontWeight: 'normal', ...style }}
        role="button"
        aria-pressed={pinned}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <span
          tabIndex={0}
          className="invictus-badge"
          style={{
            backgroundColor: backgroundColor,
            color: color,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: 'Inter',
            cursor: 'help',
            userSelect: 'none',
            borderBottom: '1.5px dotted currentColor',
            '--badge-accent': backgroundColor,
            ...style,
          }}
        >
          {title}
        </span>
      </span >

      {tooltipEl}
    </>
  );
}

const ACCENT = 'var(--inv-badge-shared-accent)';
export function SharedNote() {
  useTooltipStyles();

  const badgeRef = useRef(null);
  const tooltipId = useId();

  const { visible, pinned, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick, onTooltipMouseEnter, onTooltipMouseLeave } = usePinnedTooltip(badgeRef);
  const pos = useTooltipPosition(badgeRef, visible, { tooltipWidth: TOOLTIP_WIDTH });

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
        '--tooltip-accent': ACCENT,
      }}
    >
      Same for both <strong>Dashboard</strong> and <strong>Framework</strong>. Can be skipped if done already.
      <span className="invictus-tooltip__arrow" style={{ left: pos.arrowLeft }} />
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={badgeRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          marginLeft: '8px',
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        <span
          tabIndex={0}
          role="button"
          aria-pressed={pinned}
          aria-describedby={visible ? tooltipId : undefined}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick}
          className="invictus-badge"
          style={{
            backgroundColor: 'var(--inv-badge-shared-bg)',
            color: 'var(--inv-badge-shared-text)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '600',
            fontFamily: 'Inter',
            cursor: 'help',
            userSelect: 'none',
            borderBottom: '1.5px dotted currentColor',
            '--badge-accent': ACCENT,
          }}
        >
          Shared
        </span>
      </span>

      {tooltipEl}
    </>
  );
}


/**
 * Wraps a heading or list-item phrase with a dotted underline and places
 * the given badge right after it. Use this instead of appending a badge
 * straight onto a sentence, so the badge visually reads as describing the
 * underlined phrase rather than feeling tacked on at the end.
 *
 * Example:
 *   ## <BadgedText badge={<OnlyAdminsBadge/>}>Sync your Microsoft Entra ID groups to Invictus</BadgedText>
 */
export function BadgedText({ children, badge, variant = 'underline' }: { children: React.ReactNode, badge: React.ReactNode, variant?: 'underline' | 'background' }) {
  const badgeContainerRef = useRef(null);
  const [decorationColor, setDecorationColor] = useState();

  const withOpacity = (color, opacity = 0.1) => {
    if (!color) return undefined;
    const percent = Math.round(opacity * 100);
    return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
  };

  useEffect(() => {
    const root = badgeContainerRef.current;
    if (!root) return;

    const syncDecorationColor = () => {
      const badgeElement = root.querySelector('.invictus-badge');
      if (!badgeElement) return false;

      const { backgroundColor } = window.getComputedStyle(badgeElement);
      if (!backgroundColor || backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
        return false;
      }

      setDecorationColor(backgroundColor);
      return true;
    };

    if (syncDecorationColor()) return;

    const observer = new MutationObserver(() => {
      if (syncDecorationColor()) {
        observer.disconnect();
      }
    });

    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    return () => observer.disconnect();
  }, [badge]);

  const decorationColorWithOpacity = variant == 'background' ? withOpacity(decorationColor, 0.1) : undefined;
  return (
    <>
      <span style={{ textDecoration: 'underline dotted', textDecorationColor: decorationColor, backgroundColor: decorationColorWithOpacity, padding: '0.25rem' }}>{children}</span>
      <span ref={badgeContainerRef}>{badge}</span>
    </>
  );
}
