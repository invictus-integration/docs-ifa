import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import NavbarLayout from '@theme-original/Navbar/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import { ErrorCauseBoundary } from '@docusaurus/theme-common';
import {
  useVersions,
  useDocsVersionCandidates,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import { useUserType } from '../../../components/UserTypeContext';
import { useMobileNav } from '../../../components/MobileNavContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate, faShareNodes, faTriangleExclamation, faListOl,
  faClock, faCode, faRightLeft, faShieldHalved, faPlus, faHashtag,
  faLanguage, faRetweet, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import styles from './styles.module.css';

const ICON_MAP = {
  'arrows-rotate': faArrowsRotate,
  'share-nodes': faShareNodes,
  'triangle-exclamation': faTriangleExclamation,
  'list-ol': faListOl,
  'clock': faClock,
  'code': faCode,
  'retweet': faRetweet,
  'shield-halved': faShieldHalved,
  'plus': faPlus,
  'hashtag': faHashtag,
  'language': faLanguage,
  'envelope': faEnvelope,
  'check': faCheck,
};

const TABS = [
  { key: 'business', label: 'User guides', path: '/' },
  { key: 'technical', label: 'Setup & maintenance', path: '/technical' },
];

// Shows a ▾ indicator when the scroller has hidden content below.
function ScrollOverflowIndicator({ scrollerRef, deps }) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scroller = scrollerRef?.current;
    if (!sentinel || !scroller) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHasOverflow(!entry.isIntersecting),
      { root: scroller, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollerRef, ...deps]);

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      {hasOverflow && (
        <div className={styles.scrollIndicator} aria-hidden="true">▾</div>
      )}
    </>
  );
}

// Single link row (leaf item).
function OverlayLink({ item, activePath, onClose }) {
  const isActive = item.href &&
    (activePath === item.href || activePath.startsWith(item.href + '/'));
  const icon = item.customProps?.icon ? ICON_MAP[item.customProps.icon] : null;

  return (
    <li>
      <Link
        to={item.href}
        className={clsx(styles.overlayLink, { [styles.overlayLinkActive]: isActive })}
        onClick={onClose}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon && (
          <span className={styles.overlayLinkIcon} aria-hidden="true">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        {item.label}
      </Link>
    </li>
  );
}

// Nested category within a column: shows as a sub-header + flat links.
function OverlaySubCategory({ item, activePath, onClose }) {
  return (
    <>
      {item.href ? (
        <li>
          <Link
            to={item.href}
            className={clsx(styles.overlaySubHead, styles.overlaySubHeadLink)}
            onClick={onClose}
          >
            {item.label}
          </Link>
        </li>
      ) : (
        <li className={styles.overlaySubHead}>{item.label}</li>
      )}
      {item.items?.map((child, i) => {
        if (child.type === 'link') {
          return <OverlayLink key={i} item={child} activePath={activePath} onClose={onClose} />;
        }
        return null;
      })}
    </>
  );
}

// Two-column mega-menu grid. Top-level categories → columns; top-level links → quick-links row.
function OverlayColumns({ items, activePath, onClose }) {
  const topLinks = items.filter(i => i.type === 'link');
  const categories = items.filter(i => i.type === 'category');

  return (
    <nav aria-label="Page navigation">
      {topLinks.length > 0 && (
        <ul className={styles.quickLinks}>
          {topLinks.map((item, i) => (
            <li key={i}>
              <Link
                to={item.href}
                className={clsx(styles.overlayLink, styles.quickLink, {
                  [styles.overlayLinkActive]: activePath === item.href,
                })}
                onClick={onClose}
                aria-current={activePath === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.columnGrid}>
        {categories.map((cat, i) => (
          <div key={i} className={styles.column}>
            {cat.href ? (
              <Link
                to={cat.href}
                className={clsx(styles.columnTitle, styles.columnTitleLink)}
                onClick={onClose}
              >
                {cat.label}
              </Link>
            ) : (
              <span className={styles.columnTitle}>{cat.label}</span>
            )}
            <ul className={styles.columnList}>
              {cat.items?.map((child, j) => {
                if (child.type === 'link') {
                  return <OverlayLink key={j} item={child} activePath={activePath} onClose={onClose} />;
                }
                if (child.type === 'category') {
                  return <OverlaySubCategory key={j} item={child} activePath={activePath} onClose={onClose} />;
                }
                return null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

// Custom navigation overlay — renders below the secondary audience bar,
// slides top-to-bottom, shows the current doc sidebar via MobileNavContext.
function MobileNavOverlay({ isOpen, onClose }) {
  const { sidebar } = useMobileNav();
  const location = useLocation();
  const scrollerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Trap Tab focus inside the overlay while open. This is a defense-in-depth
  // fallback for browsers that don't support `inert` (see the sibling-inert
  // effect in NavbarLayoutWrapper, which is the primary fix) — without it,
  // Tab/Shift+Tab can walk focus out of the overlay into the page content
  // hidden behind the backdrop.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      const overlay = document.getElementById('audience-overlay');
      if (!overlay) return;
      const focusables = overlay.querySelectorAll('a[href], button:not([disabled])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
          data-cy="audience-overlay-backdrop"
        />
      )}
      <div
        id="audience-overlay"
        className={clsx(styles.overlay, { [styles.overlayOpen]: isOpen })}
        aria-hidden={!isOpen}
      >
        <div ref={scrollerRef} className={styles.overlayScroller}>
          {sidebar ? (
            <OverlayColumns
              items={sidebar.items}
              activePath={location.pathname}
              onClose={onClose}
            />
          ) : (
            <p className={styles.noSidebar}>Select a section to browse pages.</p>
          )}
          <ScrollOverflowIndicator scrollerRef={scrollerRef} deps={[sidebar, isOpen]} />
        </div>
      </div>
    </>
  );
}

function VersionBlock() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const versions = useVersions('default');
  const candidates = useDocsVersionCandidates('default');
  const activeDocContext = useActiveDocContext('default');

  // Close on outside click/tap.
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
      activeDocContext?.alternateDocVersions?.[version.name] ??
      version.docs?.find((d) => d.id === version.mainDocId);
    return `${targetDoc?.path ?? ''}${location.search}${location.hash}`;
  }

  return (
    <div ref={containerRef} className={styles.versionBlock}>
      <button
        className={styles.versionTrigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((s) => !s)}
      >
        {currentVersion.label}
        <span
          className={clsx(styles.versionArrow, { [styles.versionArrowOpen]: open })}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          className={styles.versionDropdown}
          role="listbox"
          aria-label="Select documentation version"
        >
          {versions.map((v) => (
            <li key={v.name}>
              <a
                href={getVersionPath(v)}
                className={clsx(styles.versionOption, {
                  [styles.versionOptionActive]: v.name === currentVersion.name,
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
      )}
    </div>
  );
}


function AudienceBlocks({ overlayOpen, onToggleOwnSection, onNavigateAway }) {
  const { userType, setUserType } = useUserType();
  const history = useHistory();

  function handleClick(e, tab) {
    e.preventDefault();

    if (tab.key === userType) {
      // Tapping your own current section toggles the overlay to browse it.
      onToggleOwnSection(e.currentTarget);
      return;
    }

    // Switching to the other section always navigates for real — no cached
    // preview, so the destination sidebar is always guaranteed fresh.
    onNavigateAway();
    setUserType(tab.key);
    history.push(tab.path);
  }

  return (
    <>
      {TABS.map((tab) => {
        const isActive = tab.key === userType;
        return (
          <a
            key={tab.key}
            href={tab.path}
            className={clsx(styles.audienceBlock, {
              [styles.audienceBlockActive]: isActive,
            })}
            aria-current={isActive ? 'page' : undefined}
            aria-expanded={isActive ? overlayOpen : false}
            aria-haspopup="true"
            aria-controls="audience-overlay"
            onClick={(e) => handleClick(e, tab)}
          >
            <span className={styles.blockLabel}>{tab.label}</span>
            <span
              className={clsx(styles.blockArrow, {
                [styles.blockArrowOpen]: isActive && overlayOpen,
                [styles.blockArrowDim]: !isActive,
              })}
              aria-hidden="true"
            />
          </a>
        );
      })}
    </>
  );
}

export default function NavbarLayoutWrapper(props) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const triggerRef = useRef(null);

  // Auto-close when the viewport crosses above the mobile breakpoint (e.g.
  // rotating to landscape on a tablet, or resizing a desktop window). The
  // audience bar/overlay are hidden by CSS above 996px, but React state
  // wouldn't otherwise reset — leaving the body scroll lock stuck permanently.
  useEffect(() => {
    if (!overlayOpen) return;
    const mql = window.matchMedia('(min-width: 997px)');
    const handleChange = (e) => { if (e.matches) setOverlayOpen(false); };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [overlayOpen]);

  // Move focus into the overlay when it opens; return it to the triggering tab
  // when it closes. This is required for keyboard and screen reader users.
  useEffect(() => {
    if (overlayOpen) {
      const overlay = document.getElementById('audience-overlay');
      const first = overlay?.querySelector('a[href], button');
      first?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [overlayOpen]);

  // Lock body scroll while the overlay is open, using the position:fixed
  // technique rather than plain `overflow: hidden`. iOS Safari is known to
  // still rubber-band/scroll the background through touch with overflow
  // hidden alone; pinning the body in place and restoring the scroll
  // position on close avoids that on all platforms.
  useEffect(() => {
    if (!overlayOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    // Compensate for the scrollbar disappearing so page content doesn't
    // shift sideways while the overlay is open.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [overlayOpen]);

  // Make the page content and footer behind the backdrop inert while the
  // overlay is open, so keyboard/screen-reader users can't wander into
  // stale background content that looks hidden but otherwise stays focusable
  // and in the accessibility tree. `inert` also removes them from the tab
  // order (the Tab-trap effect in MobileNavOverlay is a fallback for
  // browsers without `inert` support).
  useEffect(() => {
    const overlayEl = document.getElementById('audience-overlay');
    if (!overlayEl) return;
    const siblings = [];
    for (let node = overlayEl.nextElementSibling; node; node = node.nextElementSibling) {
      siblings.push(node);
    }
    if (overlayOpen) {
      siblings.forEach((el) => {
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
      });
    } else {
      siblings.forEach((el) => {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      });
    }
    return () => {
      siblings.forEach((el) => {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      });
    };
  }, [overlayOpen]);

  function handleToggleOwnSection(triggerEl) {
    triggerRef.current = triggerEl;
    setOverlayOpen((open) => !open);
  }

  function handleNavigateAway() {
    setOverlayOpen(false);
  }

  const closeOverlay = () => setOverlayOpen(false);

  return (
    <>
      <NavbarLayout {...props} />
      <nav className={styles.audienceBar} aria-label="Documentation section">
        <AudienceBlocks
          overlayOpen={overlayOpen}
          onToggleOwnSection={handleToggleOwnSection}
          onNavigateAway={handleNavigateAway}
        />
        <ErrorCauseBoundary onError={() => null}>
          <VersionBlock />
        </ErrorCauseBoundary>
      </nav>
      <MobileNavOverlay isOpen={overlayOpen} onClose={closeOverlay} />
    </>
  );
}
