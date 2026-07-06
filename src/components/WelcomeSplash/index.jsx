import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useUserType, STORAGE_KEY } from '../UserTypeContext';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCogs } from '@fortawesome/free-solid-svg-icons';

const ROLES = [
  {
    key: 'business',
    path: '/',
    icon: <FontAwesomeIcon icon={faBuilding} />,
    title: 'Business user',
    description:
      'I work in management or operations and want to understand what Invictus can do for my organization.',
  },
  {
    key: 'technical',
    path: '/technical',
    icon: <FontAwesomeIcon icon={faCogs} />,
    title: 'Technical user',
    description:
      "I'm a developer or architect and want to build integrations using the Invictus product.",
  },
];

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function WelcomeSplash() {
  const { siteConfig } = useDocusaurusContext();
  const [visible, setVisible] = useState(false);
  const { setUserType } = useUserType();
  const history = useHistory();
  const firstCardRef = useRef(null);
  const dialogRef = useRef(null);

  // Only check localStorage on the client (SSR safety)
  useEffect(() => {
    // Skip splash entirely on Netlify preview/branch deploys so reviewers
    // land directly on content. Defaults to business user silently.
    if (siteConfig.customFields?.isPreviewDeploy) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — skip splash
    }
  }, []);

  // Lock scroll and move focus into dialog when it opens
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    firstCardRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  // Focus trap: keep Tab cycling within the dialog (WCAG 2.1.1, 2.4.3)
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE);
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function choose(role) {
    setUserType(role.key);
    setVisible(false);
    history.replace(role.path);
  }

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-desc"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.panel}>
        <img src="/img/invictus-logo_negative_white.png" alt="Invictus for Azure" className={styles.logo} />

        <h1 id="welcome-title" className={styles.heading}>
          Welcome to the <span className={styles.highlight}>Invictus for Azure</span> documentation
        </h1>

        <p id="welcome-desc" className={styles.intro}>
          Invictus is an enterprise integration framework built by <a href="https://www.codit.eu/" target="_blank" rel="noopener noreferrer">Codit</a> on Microsoft Azure to help organizations interact with their business processes in an intuitive way.
          <br /><br />This documentation site is tailored for two audiences — choose the one that fits you best.
          You can always change your selection later.
        </p>

        <p className={styles.prompt}>Who are you?</p>

        <div className={styles.cards}>
          {ROLES.map((role, i) => (
            <button
              key={role.key}
              ref={i === 0 ? firstCardRef : undefined}
              className={styles.card}
              onClick={() => choose(role)}
            >
              <span className={styles.cardIcon} aria-hidden="true">{role.icon}</span>
              <span className={styles.cardTitle}>{role.title}</span>
              <span className={styles.cardDesc}>{role.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
