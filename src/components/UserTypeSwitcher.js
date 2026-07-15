import React from 'react';
import { useHistory } from '@docusaurus/router';
import { useUserType } from './UserTypeContext';
import styles from './UserTypeSwitcher.module.css';

const TABS = [
  { key: 'business', label: 'User guides', path: '/' },
  { key: 'technical', label: 'Setup & maintenance', path: '/technical' },
];

export default function UserTypeSwitcher() {
  const { userType, setUserType } = useUserType();
  const history = useHistory();

  function handleSelect(tab) {
    setUserType(tab.key);
    history.push(tab.path);
  }

  return (
    <div className={styles.switcher} role="tablist" aria-label="Documentation audience">
      {TABS.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={userType === tab.key}
          className={styles.tab}
          data-cy-toggle={tab.key}
          data-cy-toggle-active={String(userType === tab.key)}
          onClick={() => handleSelect(tab)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(tab); }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}