import React from 'react';
import styles from './Breadcrumb.module.css';

type BreadcrumbProps = {
  /** Array of string segments; the last is active */
  paths?: string[];
  /** Array of React nodes — each becomes one item; the last is active by default */
  items?: React.ReactNode[];
  /** When false, no item receives the active style. Defaults to true. */
  activeLast?: boolean;
};

function Chevron() {
  return (
    <span className={styles.separator} aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Breadcrumb({ paths, items, activeLast = true }: BreadcrumbProps) {
  const segments: React.ReactNode[] = paths ?? items ?? [];

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <span className={styles.logo}>
        <img src="/img/favicon.ico" alt="" />
      </span>
      <ol className={styles.list}>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          const isActive = activeLast && isLast;
          return (
            <li key={i} className={styles.listItem}>
              {i > 0 && <Chevron />}
              <span
                className={`${styles.item}${isActive ? ` ${styles.active}` : ''}`}
                {...(isActive ? { 'aria-current': 'page' } : {})}
              >
                {segment}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
