import React from 'react';
import { useUserType } from './UserTypeContext';
import { useHistory } from '@docusaurus/router';

const toggleItems = [
  { key: 'business', label: 'Business users' },
  { key: 'technical', label: 'Technical users' },
];

export default function UserTypeSwitcher() {
  const { userType, setUserType } = useUserType();
  const history = useHistory();

  const handleChange = (type) => {
    setUserType(type);
    if (type === 'business') history.push('/');
    else history.push('/technical');
  };

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        borderRadius: '999px',
        background: 'var(--toggle-track-bg)',
        padding: '2px',
        cursor: 'pointer',
        fontSize: '0.85rem',
      }}
    >
      {/* Active slider */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          bottom: 2,
          left: userType === 'business' ? 2 : '50%',
          right: userType === 'business' ? '50%' : 2,
          background: 'var(--ifm-color-primary)',
          borderRadius: '999px',
          transition: 'all 0.25s ease',
        }}
      />

      {toggleItems.map((item) => (
        <div
          key={item.key}
          className="toggle-item"
          data-cy-toggle={`${item.key}`}
          data-cy-toggle-active={userType === item.key}
          onClick={() => handleChange(item.key)}
          style={{
            flex: 1,
            textAlign: 'center',
            zIndex: 1,
            padding: '6px 8px',
            fontWeight: userType === item.key ? '600' : 'normal',
            color: userType === item.key ? 'white' : 'var(--toggle-inactive-color)',
            transition: 'color 0.25s ease',
            whiteSpace: 'nowrap',
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleChange(item.key);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}