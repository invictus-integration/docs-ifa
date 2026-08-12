import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import { splitNavbarItems } from '@docusaurus/theme-common/internal';
import {
  useVersions,
  useDocsVersionCandidates,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import { useHistory } from '@docusaurus/router';
import { useHistorySelector } from '@docusaurus/theme-common';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';

import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';
import styles from './styles.module.css';

// Props mirroring the removed docsVersionDropdown navbar item.
const VERSION_ITEM_PROPS = {
  type: 'docsVersionDropdown',
  position: 'right',
  dropdownItemsBefore: [],
  dropdownItemsAfter: [],
  dropdownActiveClassDisabled: true,
  docsPluginId: 'default',
};

// Click/tap-based version dropdown for the mobile navbar bar.
// Visually matches the desktop version dropdown (infima dropdown CSS) but opens
// on click rather than CSS :hover, which doesn't work reliably on touch devices.
function MobileVersionBadge() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const history = useHistory();
  const search = useHistorySelector((h) => h.location.search);
  const hash = useHistorySelector((h) => h.location.hash);
  const versions = useVersions('default');
  const candidates = useDocsVersionCandidates('default');
  const activeDocContext = useActiveDocContext('default');

  // Close when tapping/clicking outside the dropdown.
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [open]);

  // Also close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!versions || versions.length <= 1) return null;

  const currentVersion = candidates[0] ?? versions[0];

  function getVersionPath(version) {
    const targetDoc =
      activeDocContext.alternateDocVersions[version.name] ??
      version.docs.find((d) => d.id === version.mainDocId);
    return `${targetDoc?.path ?? ''}${search}${hash}`;
  }

  return (
    <div className={styles.mobileVersion}>
      <div
        ref={containerRef}
        className={clsx('dropdown', { 'dropdown--show': open })}
      >
        {/* Using <a href="#"> matches the exact pattern Docusaurus uses internally */}
        <a
          href="#"
          className="navbar__link"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={(e) => { e.preventDefault(); setOpen((s) => !s); }}
        >
          {currentVersion.label}
        </a>
        <ul className="dropdown__menu" role="listbox" aria-label="Select documentation version">
          {versions.map((v) => (
            <li key={v.name}>
              <a
                href={getVersionPath(v)}
                className={clsx('dropdown__link', {
                  'dropdown__link--active': v.name === currentVersion.name,
                })}
                role="option"
                aria-selected={v.name === currentVersion.name}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  history.push(getVersionPath(v));
                }}
              >
                {v.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NavbarItems({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.\nPlease double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:\n${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({ left, right }) {
  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items')}>
        {left}
      </div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent() {
  const items = useThemeConfig().navbar.items;
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <NavbarContentLayout
      left={
        <>
          <NavbarLogo />
          {/* Mobile-only version badge — sits inline after logo, hidden on desktop */}
          <MobileVersionBadge />
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />
          {/* Desktop-only version dropdown (hidden on mobile via CSS) */}
          <div className={styles.desktopVersion}>
            <ErrorCauseBoundary
              onError={(e) => new Error('Version dropdown failed to render', { cause: e })}
            >
              <NavbarItem {...VERSION_ITEM_PROPS} />
            </ErrorCauseBoundary>
          </div>
          {/* Search sits in its own wrapper — flex-shrinks if needed */}
          {!searchBarItem && (
            <div className={styles.rightActions}>
              <NavbarSearch>
                <SearchBar />
              </NavbarSearch>
            </div>
          )}
          {/* Moon toggle is the last item in the right group so it is always
              flush with the right edge and can never be painted over by the
              search chip, on any screen width. */}
          <NavbarColorModeToggle />
        </>
      }
    />
  );
}
