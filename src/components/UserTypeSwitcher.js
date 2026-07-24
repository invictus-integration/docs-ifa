import React from 'react';
import { useHistory } from '@docusaurus/router';
import { useUserType } from './UserTypeContext';
import { useMobileNav } from './MobileNavContext';
import styles from './UserTypeSwitcher.module.css';

const TABS = [
  { key: 'business', label: 'User guides', path: '/' },
  { key: 'technical', label: 'Setup & maintenance', path: '/technical' },
];

export default function UserTypeSwitcher() {
  const { userType, setUserType } = useUserType();
  const { sidebars } = useMobileNav();
  const history = useHistory();

  function handleSelect(e, tab) {
    e.preventDefault();
    setUserType(tab.key);
    // Only navigate when the target sidebar hasn't been cached yet.
    // Once both sidebars are in the cache, switching just swaps the items
    // in place — no page navigation.
    if (!sidebars[tab.key]) {
      history.push(tab.path);
    }
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