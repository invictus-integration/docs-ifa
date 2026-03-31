import { useState, useId, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export function SharedNote() {
  const [visible, setVisible] = useState(false);
  const [usePortal, setUsePortal] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const badgeRef = useRef(null);
  const tooltipId = useId();

  useLayoutEffect(() => {
    if (visible && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const navHeight = 60; // adjust to match your nav height
      const spaceAbove = rect.top - navHeight;

      if (spaceAbove < 50) {
        // Tooltip would be hidden under nav → use portal
        setUsePortal(true);
        setTooltipPos({
          top: rect.top - 40,
          left: rect.left + rect.width / 2,
        });
      } else {
        setUsePortal(false);
      }
    }
  }, [visible]);

  const tooltipElement = (
    <span
      id={tooltipId}
      role="tooltip"
      style={{
        position: usePortal ? 'fixed' : 'absolute',
        bottom: usePortal ? 'auto' : '125%',
        top: usePortal ? tooltipPos.top : 'auto',
        left: usePortal ? tooltipPos.left : '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '6px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        fontSize: '0.9rem',
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
          top: '100%',
          left: '50%',
          marginLeft: '-5px',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #333',
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
        {!usePortal && visible && tooltipElement}
      </span>

      {visible && usePortal && createPortal(tooltipElement, document.body)}
    </>
  );
}