import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { UserTypeProvider } from '../components/UserTypeContext';

function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));

    // Try scrolling immediately — the tab may already be rendered (e.g. from queryString).
    // Also poll briefly in case the element isn't in the DOM yet.
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      const el = document.getElementById(id);
      if (el) {
        clearInterval(interval);
        el.scrollIntoView();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [location.href]);

  return null;
}

export default function Root({ children }) {
  return (
    <UserTypeProvider>
      <HashScrollHandler />
      {children}
    </UserTypeProvider>
  );
}