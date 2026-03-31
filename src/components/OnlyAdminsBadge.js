import { useState, useId, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export function OnlyAdminsBadge() {
  return Badge({
    title: "Only Admins",
    tooltip: "Only available for users with a System Admin role."
  });
}

export function OnlyOperatorsBadge() {
  return Badge({
    title: "Requires Operator",
    tooltip: "Only available for users with at least Operator permissions on the flow."
  });
}

export function OnlyFolderAdminsBadge() {
  return Badge({
    title: "Only Admins",
    tooltip: "Only available for users with a Folder or System Admin role."
  });
}

export function NewSinceBadge({ version }) {
  return Badge({
    title: `New since ${version}`,
    tooltip: `Feature included since Invictus ${version}.`,
    backgroundColor: '#008800',
    color: 'white',
  });
}

export function Badge({ title, tooltip, backgroundColor = '#b55d00', color = 'white' }) {
  const [visible, setVisible] = useState(false);
  const [usePortal, setUsePortal] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const badgeRef = useRef(null);
  const tooltipId = useId();

  useLayoutEffect(() => {
    if (visible && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const navHeight = 60; // adjust to your nav height
      const spaceAbove = rect.top - navHeight;

      // Decide if we need portal (tooltip is hidden under nav)
      if (spaceAbove < 50) {
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
        transform: usePortal ? 'translateX(-50%)' : 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
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
      {tooltip}
      <span
        style={{
          position: 'absolute',
          top: usePortal ? '100%' : '100%',
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
        style={{ position: 'relative', display: 'inline-block', marginLeft: '8px', textTransform: 'none', fontWeight: 'bold' }}
        role="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <span
          tabIndex={0}
          style={{
            backgroundColor: backgroundColor,
            color: color,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: 'Bitter',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          {title}
        </span>
        {!usePortal && visible && tooltipElement}
      </span>

      {visible && usePortal && createPortal(tooltipElement, document.body)}
    </>
  );
}