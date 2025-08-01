import { useState } from 'react'

export function OnlyAdminsBadge() {
  return OnlyBadge({ title: "Only Admins", tooltip: "This section describes functionality that's only available for users with a System Admin role." });
}

export function OnlyOperatorsBadge() {
  return OnlyBadge({ title: "Requires Operator", tooltip: "This section describes functionality that requires at least Operator permissions on the flow" });
}

export function OnlyFolderAdminsBadge() {
  return OnlyBadge({ title: "Only Admins", tooltip: "This section describes functionality that's only available for users with a Folder or System Admin role."});
}

export function OnlyBadge({title, tooltip}) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: '8px', textTransform: 'none', fontWeight: 'bold' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        style={{
          backgroundColor: '#FDECEA',
          color: '#D93025 ',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          fontFamily: 'Bitter',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {title}
      </span>
      {visible && (
        <span
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
          {tooltip}
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