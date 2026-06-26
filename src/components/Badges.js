import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipStyles, usePinnedTooltip, useTooltipPosition } from './tooltipStyles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TOOLTIP_WIDTH = 260;

export function OnlyAdminsBadge() {
  return Badge({
    title: "Only Admins",
    tooltip: "Only available for users with a **System Admin** role."
  });
}

export function OnlyOperatorsBadge() {
  return Badge({
    title: "Requires Operator",
    tooltip: "Only available for users with at least **Operator** permissions on the flow."
  });
}

export function OnlyFolderAdminsBadge() {
  return Badge({
    title: "Only Admins",
    tooltip: "Only available for users with a **Folder** or **System Admin** role."
  });
}

export function NewSinceBadge({ version, style }) {
  return Badge({
    title: `New since ${version}`,
    tooltip: `Feature included since **Invictus ${version}**.`,
    backgroundColor: '#059669',
    color: 'white',
    style,
  });
}

export function DeprecatedSinceBadge({ version, note, style }) {
  return Badge({
    title: `Deprecated since ${version}`,
    tooltip: `Feature deprecated since **Invictus ${version}**. ${note}`,
    backgroundColor: '#b55d00',
    color: 'white',
    style,

  });
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
        style={{ position: 'relative', display: 'inline-block', marginLeft: '8px', textTransform: 'none', fontWeight: 'normal', ...style }}
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
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9rem',
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

const ACCENT = '#0b6369';
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
            backgroundColor: '#e0f7f7',
            color: ACCENT,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '600',
            fontFamily: 'Inter',
            cursor: 'help',
            userSelect: 'none',
            outline: 'none',
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