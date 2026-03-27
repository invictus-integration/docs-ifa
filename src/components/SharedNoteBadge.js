import { useState, useId } from 'react';

export function SharedNote() {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
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
          fontSize: '0.75rem',
          fontWeight: '600',
          fontFamily: 'Bitter',
          cursor: 'default',
          userSelect: 'none',
          outline: 'none',
        }}
      >
        Shared
      </span>

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            fontFamily: 'Bitter',
            fontWeight: 'normal',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          This section is the same for both Dashboard and Framework. Can be skipped if done already.
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
      )}
    </span>
  );
}