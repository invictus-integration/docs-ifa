import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipStyles, usePinnedTooltip, useTooltipPosition } from './tooltipStyles';

const TOOLTIP_WIDTH = 260;
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
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: 'Bitter',
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