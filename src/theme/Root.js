import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { UserTypeProvider } from '../components/UserTypeContext';
import { MobileNavProvider } from '../components/MobileNavContext';

// ── SearchHighlighter ──────────────────────────────────────────────────────
// Reads ?highlight=<term> from the URL after a search-result navigation,
// strips it from the visible URL immediately (keeps URLs clean), then walks
// the page's text nodes to wrap matches in <mark data-search-highlight> tags.

/** Element tags whose text content must not be highlighted. */
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'MARK', 'TEXTAREA', 'INPUT']);

/** Returns true if `node` has a SKIP_TAGS ancestor up to (not including) `root`. */
function insideSkipTag(node, root) {
  let el = node.parentNode;
  while (el && el !== root) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    el = el.parentNode;
  }
  return false;
}

/** Singleton visually-hidden live region for screen reader announcements. */
function getLiveRegion() {
  let el = document.getElementById('search-highlight-live');
  if (!el) {
    el = document.createElement('div');
    el.id = 'search-highlight-live';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    // Visually hidden but accessible to screen readers.
    el.style.cssText =
      'position:absolute;width:1px;height:1px;padding:0;overflow:hidden;' +
      'clip:rect(0,0,0,0);white-space:nowrap;border:0';
    document.body.appendChild(el);
  }
  return el;
}

/** Module-level Escape listener ref so it can be reliably removed. */
let escapeListener = null;

function removeSearchHighlights() {
  for (const mark of document.querySelectorAll('mark[data-search-highlight]')) {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  }

  // Notify SearchBar to clear its highlight state.
  window.dispatchEvent(new CustomEvent('searchhighlight', { detail: { term: '' } }));

  // Remove Escape listener.
  if (escapeListener) {
    document.removeEventListener('keydown', escapeListener);
    escapeListener = null;
  }

  // Clear any pending SR announcement so stale messages don't linger.
  const lr = document.getElementById('search-highlight-live');
  if (lr) lr.textContent = '';
}

function applySearchHighlights(highlight, hash) {
  removeSearchHighlights();

  // Prefer the article element Docusaurus wraps doc content in; fall back to main.
  const content =
    document.querySelector('article.theme-doc-markdown') ??
    document.querySelector('.theme-doc-markdown') ??
    document.querySelector('article') ??
    document.querySelector('main');
  if (!content) return;

  // Build a regex from each non-trivial search token (≥2 chars, deduped).
  const terms = [...new Set(
    highlight.trim().split(/\s+/).filter(t => t.length >= 2)
  )];
  if (!terms.length) return;

  const pattern = terms
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  // Collect all eligible text nodes first (must not mutate while walking).
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    regex.lastIndex = 0; // reset before each test — global regex advances lastIndex on match
    if (!insideSkipTag(node, content) && regex.test(node.textContent)) {
      textNodes.push(node);
    }
  }

  let firstMark = null;

  for (const textNode of textNodes) {
    regex.lastIndex = 0;
    const text = textNode.textContent;
    if (!regex.test(text)) continue;
    regex.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    let m;

    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));

      const mark = document.createElement('mark');
      mark.setAttribute('data-search-highlight', '');
      mark.textContent = m[0];

      if (!firstMark) {
        mark.setAttribute('data-search-highlight-first', '');
        mark.setAttribute('tabindex', '-1'); // programmatically focusable
        firstMark = mark;
      }

      frag.appendChild(mark);
      last = m.index + m[0].length;
    }

    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  }

  // Scroll to and focus the first match only when there is no hash anchor
  // already being handled by HashScrollHandler.
  if (firstMark && !hash) {
    const totalMarks = document.querySelectorAll('mark[data-search-highlight]').length;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setTimeout(() => {
      firstMark.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      // Don't steal focus if the user has since focused something else (e.g.
      // reopened the search modal) while this timer was pending — only take
      // focus when nothing else meaningfully claimed it in the meantime.
      const active = document.activeElement;
      if (!active || active === document.body) {
        // preventScroll: true because we just initiated a scroll above.
        firstMark.focus({ preventScroll: true });
      }
    }, 80);

    // Announce match count to screen readers via the live region.
    getLiveRegion().textContent =
      `${totalMarks} match${totalMarks === 1 ? '' : 'es'} found for "${highlight.trim()}"`;

    // Notify SearchBar to show the highlight state inside its trigger button.
    window.dispatchEvent(new CustomEvent('searchhighlight', {
      detail: { term: highlight.trim(), count: totalMarks },
    }));

    // Register Escape to dismiss (re-register on every highlight application).
    if (escapeListener) document.removeEventListener('keydown', escapeListener);
    escapeListener = (e) => {
      if (e.key === 'Escape') {
        removeSearchHighlights();
        document.querySelector('[data-cy="search-trigger"]')?.focus();
      }
    };
    document.addEventListener('keydown', escapeListener);
  }
}

function SearchHighlighter() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlight = params.get('highlight');

    if (!highlight) {
      removeSearchHighlights();
      return;
    }

    // Strip the param from the visible URL without triggering React Router.
    // window.history.replaceState bypasses the history library's listener so
    // the effect does not re-run with the cleaned-up URL.
    params.delete('highlight');
    const cleanSearch = params.toString();
    window.history.replaceState(
      null,
      '',
      location.pathname + (cleanSearch ? `?${cleanSearch}` : '') + location.hash,
    );

    let applied = false;
    let debounceTimer;
    let stableTimer;

    function doApply() {
      if (applied) return;
      const content =
        document.querySelector('article.theme-doc-markdown') ??
        document.querySelector('.theme-doc-markdown') ??
        document.querySelector('article') ??
        document.querySelector('main');
      if (!content) return;
      applied = true;
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(stableTimer);
      applySearchHighlights(highlight, location.hash);
    }

    // MutationObserver + debounce: waits for React to finish rendering the new
    // page before applying marks. This handles SPA navigation where the content
    // area is still showing the old page when this effect first fires.
    const observer = new MutationObserver(() => {
      if (applied) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doApply, 80);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback for SSR/reload where page content is already in the DOM before
    // any mutations are observed (no MutationObserver notification expected).
    stableTimer = setTimeout(doApply, 500);

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(stableTimer);
    };
  // location.href is undefined in React Router's location object — use the
  // individual parts that actually change on navigation as dependencies.
  }, [location.pathname, location.search, location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// ── HashScrollHandler ──────────────────────────────────────────────────────

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
  }, [location.pathname, location.hash]);

  return null;
}

export default function Root({ children }) {
  return (
    <UserTypeProvider>
      <MobileNavProvider>
        <HashScrollHandler />
        <SearchHighlighter />
        {children}
      </MobileNavProvider>
    </UserTypeProvider>
  );
}
