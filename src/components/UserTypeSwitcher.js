import React from 'react';
import { useUserType } from './UserTypeContext';
import { useHistory } from '@docusaurus/router';

export default function UserTypeSwitcher() {
  const { userType, setUserType } = useUserType();
  const history = useHistory();

  const handleClick = (type) => {
    setUserType(type);
    if (type === 'business') history.push('/');
    else history.push('/technical');
  };

  const toggleItems = [
    { key: 'business', label: 'Business users' },
    { key: 'technical', label: 'Technical users' },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        position: 'relative',
        borderRadius: '999px',
        background: 'var(--ifm-color-secondary-light)',
        padding: '2px',
        minWidth: 'fit-content',
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
          background: 'var(--ifm-color-primary-dark)',
          borderRadius: '999px',
          transition: 'all 0.25s ease',
        }}
      />

      {/* Toggle items */}
      {toggleItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleClick(item.key)}
          style={{
            flex: 1,
            textAlign: 'center',
            zIndex: 1,
            padding: '4px 8px',
            fontWeight: 'normal',
            color: userType === item.key ? 'white' : 'black',
            transition: 'color 0.25s ease',
            whiteSpace: 'nowrap',
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClick(item.key);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}