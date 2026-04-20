import { useState, useId, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export function SharedNote() {
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, arrowLeft: '50%', below: false });
  const badgeRef = useRef(null);
  const tooltipId = useId();
  const TOOLTIP_WIDTH = 260;
  const MARGIN = 10;
  const NAV_HEIGHT = 60;
  const GAP = 8;

  useLayoutEffect(() => {
    if (visible && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const vw = window.innerWidth;

      // Center tooltip on badge, then clamp within viewport
      let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      left = Math.max(MARGIN, Math.min(left, vw - TOOLTIP_WIDTH - MARGIN));

      // Arrow points to badge center, relative to clamped tooltip left
      const arrowLeft = Math.min(
        Math.max(rect.left + rect.width / 2 - left, 16),
        TOOLTIP_WIDTH - 16
      );

      const spaceAbove = rect.top - NAV_HEIGHT;
      const below = spaceAbove < 50;

      setTooltipPos({
        top: below ? rect.bottom + GAP : rect.top - GAP,
        left,
        arrowLeft,
        below,
      });
    }
  }, [visible]);

  const tooltipElement = (
    <span
      id={tooltipId}
      role="tooltip"
      style={{
        position: 'fixed',
        top: tooltipPos.below ? tooltipPos.top : 'auto',
        bottom: tooltipPos.below ? 'auto' : `calc(100vh - ${tooltipPos.top}px)`,
        left: tooltipPos.left,
        width: TOOLTIP_WIDTH,
        backgroundColor: '#333',
        color: '#fff',
        padding: '6px 8px',
        borderRadius: '6px',
        whiteSpace: 'normal',
        fontSize: '0.85rem',
        fontFamily: 'Bitter',
        fontWeight: 'normal',
        zIndex: 1000,
        pointerEvents: 'none',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      Same for both Dashboard and Framework. Can be skipped if done already.
      <span
        style={{
          position: 'absolute',
          [tooltipPos.below ? 'bottom' : 'top']: '100%',
          left: tooltipPos.arrowLeft,
          marginLeft: '-5px',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          [tooltipPos.below ? 'borderBottom' : 'borderTop']: '5px solid #333',
        }}
      />
    </span>
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
          aria-describedby={visible ? tooltipId : undefined}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onFocus={() => setVisible(true)}
          onBlur={() => setVisible(false)}
          style={{
            backgroundColor: '#e0f7f7',
            color: '#0b6369',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: 'Bitter',
            cursor: 'default',
            userSelect: 'none',
            outline: 'none',
          }}
        >
          Shared
        </span>
      </span>

      {visible && createPortal(tooltipElement, document.body)}
    </>
  );
}