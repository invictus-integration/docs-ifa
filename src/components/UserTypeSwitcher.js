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

  function handleSelect(e, tab) {
    e.preventDefault();
    if (tab.key === userType) return;
    setUserType(tab.key);
    // Always navigate for real — this guarantees the destination sidebar is
    // always the live, current one, never a stale cached snapshot.
    history.push(tab.path);
  }

  return (
    <nav className={styles.switcher} aria-label="Documentation audience">
      {TABS.map(tab => {
        const isActive = userType === tab.key;
        return (
          <a
            key={tab.key}
            href={tab.path}
            aria-current={isActive ? 'page' : undefined}
            className={styles.tab}
            data-cy-toggle={tab.key}
            data-cy-toggle-active={String(isActive)}
            onClick={(e) => handleSelect(e, tab)}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}