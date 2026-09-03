import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faChevronLeft, faChevronRight, faFileLines, faClock, faFileCircleXmark, faBook, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';
import highlightStyles from '../../components/highlight.module.css';

function filepathToUrl(filepath) {
  const parts = filepath
    .replace(/\.mdx?$/, '')
    .split('/')
    .map(seg => seg.replace(/^\d+_/, ''));
  if (parts[parts.length - 1] === 'index') parts.pop();
  return '/' + parts.filter(Boolean).join('/');
}

function filepathToBreadcrumb(filepath, sidebarLabel, title) {
  const segments = filepath
    .replace(/\.mdx?$/, '')
    .split('/')
    .map(seg => seg.replace(/^\d+_/, '').replace(/-/g, ' '))
    .filter(seg => seg !== 'index' && seg)
    .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1));
  const lastSegmentOverride = sidebarLabel || title;
  if (lastSegmentOverride && segments.length > 0) {
    segments[segments.length - 1] = lastSegmentOverride;
  }
  return segments.join(' › ');
}

function BreadcrumbPath({ path, className }) {
  if (!path) return null;
  const segments = path.split(' › ');
  return (
    <span className={className}>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>}
          {seg}
        </React.Fragment>
      ))}
    </span>
  );
}

function stripMarkdown(text) {
  return text
    .replace(/^---[\s\S]*?^---\s*/m, '')                         // frontmatter
    .replace(/^import\s.+$/gm, '')                               // MDX import statements
    .replace(/^:::[a-zA-Z]*(?:\[.*?\])?\s*$/gm, '')             // admonition markers (:::info[title], :::)
    .replace(/```[\s\S]*?```/g, '')                              // fenced code blocks
    .replace(/`([^`]+)`/g, '$1')                                 // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')                             // images
    .replace(/\[([^\]]+)\]\([^)]*\)?/g, '$1')                   // inline links, complete or truncated
    .replace(/\[([^\]]+)\]\[[^\]]*\]?/g, '$1')                  // reference-style links, complete or truncated
    .replace(/^\[[^\]]+\]:\s*\S+.*$/gm, '')                     // reference-style link definitions
    .replace(/\[([^\]]*)\]/g, '$1')                              // any remaining bare [text] brackets
    .replace(/^\|(?:[\s:]*-+[\s:]*\|)+\s*$/gm, '')             // table separator rows (| --- | :---: |)
    .replace(/^\|(.+)\|$/gm, (_, cells) =>                      // table content rows → space-separated cells
      cells.split('|').map(c => c.trim()).filter(Boolean).join('  '))
    .replace(/<[^>]+>/g, '')                                     // HTML/JSX tags
    .replace(/^#{1,6}\s+/gm, '')                                 // headings
    .replace(/(\*\*|__)([^*_]+?)\1/g, '$2')                     // bold
    .replace(/(\*|_)([^*_]+?)\1/g, '$2')                        // italic
    .replace(/^[-*+]\s+/gm, '')                                  // unordered list markers
    .replace(/^\d+\.\s+/gm, '')                                  // ordered list markers
    .replace(/^>\s*/gm, '')                                      // blockquotes
    .replace(/^[-*_]{3,}$/gm, '')                                // horizontal rules
    .replace(/\s+/g, ' ');
  // Note: intentionally no .trim() here — callers that process per-segment
  // (e.g. getSnippet splitting on <mark> tags) must preserve leading/trailing
  // spaces so highlighted words don't collide with surrounding text.
}

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const RECENT_KEY = 'invictus-recent-searches';
const MAX_RECENT = 5;

function useRecentSearches() {
  const [recents, setRecents] = useState([]);

  // SSR-safe: read from localStorage only on the client
  useEffect(() => {
    try { setRecents(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')); } catch { }
  }, []);

  function add(item) {
    setRecents(prev => {
      const filtered = prev.filter(r => r.filepath !== item.filepath);
      const next = [item, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function remove(filepath) {
    setRecents(prev => {
      const next = prev.filter(r => r.filepath !== filepath);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clear() {
    localStorage.removeItem(RECENT_KEY);
    setRecents([]);
  }

  return { recents, add, remove, clear };
}

import { streamAiResponse } from '../../components/streamAiResponse';
import { localSearch } from '../../components/localSearch';
import { searchKnowledge, stripMarkdownSimple } from '../../components/localSearchKnowledge';
import { useUserType } from '../../components/UserTypeContext';

/** Sort results so current-context docs float to the top within each category group. */
function buildSearchQuery(query) {
  return query.trim().split(/\s+/).map(w => `${w}~1`).join(' ');
}

/** True for any doc living under a `.../deprecated/...` folder. */
function isDeprecatedFilepath(filepath) {
  return /(^|\/)deprecated\//i.test(filepath ?? '');
}

function sortByUserType(results, userType) {
  const priority = (ut) => ut === userType ? 0 : (!ut || ut === 'both') ? 1 : 2;
  const groups = new Map();
  for (const r of results) {
    const cat = r.category ?? '';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(r);
  }
  return [...groups.values()].flatMap(g =>
    // Deprecated docs frequently out-score their replacement (same title,
    // more legacy body text) even though they're never the "right" answer —
    // push them below everything else in the group regardless of relevance
    // score, then fall back to the existing user-type priority.
    [...g].sort((a, b) => {
      const depDiff = Number(isDeprecatedFilepath(a.filepath)) - Number(isDeprecatedFilepath(b.filepath));
      if (depDiff !== 0) return depDiff;
      return priority(a.user_type) - priority(b.user_type);
    })
  );
}

/** Badge shown for results that live under a deprecated docs folder. */
function DeprecatedBadge({ filepath }) {
  if (!isDeprecatedFilepath(filepath)) return null;
  return (
    <span className={`${styles.audienceBadge} ${styles.deprecatedBadge}`} aria-label="Deprecated documentation">
      Deprecated
    </span>
  );
}


export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  const { azureSearch } = siteConfig.customFields;
  const aiEnabled = !!(siteConfig.customFields.aiEnabled);
  const history = useHistory();
  const recentSearches = useRecentSearches();
  const { userType } = useUserType();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isKnowledgeSearching, setIsKnowledgeSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // activeIndex: 0..results.length-1 = doc results, results.length = Ask AI row
  const [activeIndex, setActiveIndex] = useState(-1);
  // Single source of truth for display order — both the rendered list and
  // keyboard navigation (Enter) must index into this same sorted array, or
  // the row that looks highlighted can differ from the one that gets opened.
  const sortedResults = useMemo(() => sortByUserType(results, userType), [results, userType]);

  // AI state
  const [aiActive, setAiActive] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiCitations, setAiCitations] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiError, setAiError] = useState('');

  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const [termResults, setTermResults] = useState([]);
  const [faqResults, setFaqResults] = useState([]);

  // Mobile two-column tab: 'pages' | 'knowledge' — pages always default
  const [mobileKnowledgeTab, setMobileKnowledgeTab] = useState('pages');

  // Highlight state — driven by Root.js via custom events
  const [highlightTerm, setHighlightTerm] = useState('');
  useEffect(() => {
    const handler = (e) => setHighlightTerm(e.detail.term);
    window.addEventListener('searchhighlight', handler);
    return () => window.removeEventListener('searchhighlight', handler);
  }, []);

  function clearHighlight() {
    // Remove marks from the page (Root.js also dispatches searchhighlight with term:'')
    for (const mark of document.querySelectorAll('mark[data-search-highlight]')) {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      }
    }
    setHighlightTerm('');
    const lr = document.getElementById('search-highlight-live');
    if (lr) lr.textContent = '';
  }

  // Platform-aware shortcut label (SSR-safe)
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)) {
      setShortcutLabel('⌘K');
    }
  }, []);

  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const abortRef = useRef(null);
  const triggerRef = useRef(null);
  const skipSearchResetRef = useRef(false);
  const refocusInputAfterClearRef = useRef(false);
  const listboxId = 'search-listbox';
  const debouncedQuery = useDebounce(query, 300);

  // Reset mobile tab to pages on each new search so pages are always shown first
  useEffect(() => { setMobileKnowledgeTab('pages'); }, [debouncedQuery]);

  // Re-focus the search input once the "Clear all" click has actually
  // committed and removed the recents section from the DOM. Doing this in a
  // layout effect (rather than synchronously inside the click handler)
  // guarantees the browser has finished the unmount/reflow before we grab
  // focus, which avoids a race in some headless CI browsers where a focus()
  // call issued mid-render can be lost once the surrounding subtree finishes
  // committing.
  useLayoutEffect(() => {
    if (refocusInputAfterClearRef.current) {
      refocusInputAfterClearRef.current = false;
      inputRef.current?.focus();
    }
  });

  // Search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTermResults([]);
      setFaqResults([]);
      setIsKnowledgeSearching(false);
      setIsLocalFallback(false);
      if (!skipSearchResetRef.current) setAiActive(false);
      return;
    }

    if (skipSearchResetRef.current) {
      skipSearchResetRef.current = false;
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    setIsKnowledgeSearching(true);
    setIsLocalFallback(false);
    setAiActive(false);

    // Always run local knowledge search — instant, no network dependency, but
    // it does lazy-load its data via a dynamic import (localSearchKnowledge.js),
    // so on the first search of a session it can resolve *after* the page
    // results below. isKnowledgeSearching lets us hold off deciding between the
    // single-/two-column layout until both are known, so the two-column layout
    // never appears out from under an already-interactable single-column result
    // (which would otherwise unmount the row a user is about to click).
    searchKnowledge(debouncedQuery, userType).then(({ termResults: tr, faqResults: fr }) => {
      setTermResults(tr);
      setFaqResults(fr);
      setIsKnowledgeSearching(false);
    });

    const baseParams = {
      'api-version': '2024-07-01',
      searchFields: 'title,content',
      select: 'id,title,filepath,anchor,category,content,sidebar_label,user_type',
      highlight: 'content',
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      top: '8',
    };

    const params = new URLSearchParams({
      ...baseParams,
      // Field-boosted Lucene query: title matches rank 4×, sidebar_label 2×, content baseline.
      // ~1 gives 1-char edit-distance fuzzy matching per term for typo tolerance.
      queryType: 'full',
      search: buildSearchQuery(debouncedQuery),
    });

    fetch(`${azureSearch.endpoint}/indexes/${azureSearch.index}/docs?${params}`, {
      headers: { 'api-key': azureSearch.apiKey },
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => { throw e; });
        return res.json();
      })
      .then(data => { setResults(data.value ?? []); setActiveIndex(-1); })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        console.warn('[Azure Search] falling back to local search:', err);
        localSearch(debouncedQuery).then(localResults => {
          setResults(localResults);
          setIsLocalFallback(true);
          setActiveIndex(-1);
        });
      })
      .finally(() => setIsSearching(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function onGlobalKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    document.addEventListener('keydown', onGlobalKeyDown);
    return () => document.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Sync body class so other sticky elements (e.g. audience bar) can lower
  // their z-index while the search modal is open, ensuring the backdrop blur
  // covers them correctly.
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('search-modal-open');
    } else {
      document.body.classList.remove('search-modal-open');
    }
    return () => document.body.classList.remove('search-modal-open');
  }, [isOpen]);

  // Focus trap — keep Tab/Shift+Tab inside the modal
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key !== 'Tab') return;
      const modal = document.querySelector('[data-search-modal]');
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function askAi(queryToAsk = query) {
    if (!queryToAsk.trim() || !aiEnabled) return;
    skipSearchResetRef.current = true;
    setQuery(queryToAsk);
    recentSearches.add({ query: queryToAsk, title: 'AI Answer', filepath: `__ai__:${queryToAsk}`, isAi: true, type: 'ai' });
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsOpen(true);
    setAiActive(true);
    setAiAnswer('');
    setAiCitations([]);
    setAiError('');
    setIsStreaming(true);

    streamAiResponse({
      question: queryToAsk,
      signal: controller.signal,
      onChunk: chunk => setAiAnswer(prev => prev + chunk),
      onCitations: citations => setAiCitations(citations),
      onDone: () => setIsStreaming(false),
      onError: err => {
        if (err?.name !== 'AbortError' && err?.message !== 'BodyStreamBuffer was aborted') {
          setAiError(err.message ?? 'Something went wrong.');
        }
        setIsStreaming(false);
      },
    });
  }

  // Legacy/stale search-index entries (from an older generator run, possibly
  // still live in the Azure index) model glossary terms as fake doc pages
  // with filepaths like support/glossary-technical.mdx — there's no such
  // route, so following them 404s. Detect that pattern and redirect to the
  // real help-center term view instead, exactly like a live knowledge-term
  // result would.
  const GLOSSARY_STUB_RE = /^support\/glossary-(technical|business)\.mdx$/;

  // Bicep-parameter results (anchor ends in #bicep-template-parameters) already
  // pre-fill and filter the destination page's ParameterTable via their own
  // ?q= param — the same way term/FAQ results manage their own highlighting.
  // Appending the generic ?highlight= param on top would wrap the (already
  // filtered-to-one-row) parameter name in <mark> for no benefit.
  const BICEP_PARAM_ANCHOR_RE = /#bicep-template-parameters$/;

  // Single source of truth for a result's destination URL — used both as the
  // rendered <a href> (so hovering a result shows the real target in the
  // browser's status bar, and Ctrl/Cmd-click / "open in new tab" just work)
  // and by navigate()'s actual history.push(). Keeping one function means the
  // displayed URL can never drift from where a click actually goes.
  function resolveResultHref(result) {
    const glossaryMatch = GLOSSARY_STUB_RE.exec(result.filepath ?? '');
    if (glossaryMatch) {
      const audience = glossaryMatch[1];
      const qMatch = /\?q=([^#&]+)/.exec(result.anchor ?? '');
      const term = qMatch ? decodeURIComponent(qMatch[1]) : result.title;
      return `/support/help-center-${audience}?q=${encodeURIComponent(term)}`;
    }

    // Resolve the term the same way navigate() does, so the previewed href
    // matches the ?highlight= param that actually gets appended on click.
    const term = query.trim() || (result.query ?? '').trim();
    const raw = result.url ?? (filepathToUrl(result.filepath) + (result.anchor ?? ''));
    if (!term || BICEP_PARAM_ANCHOR_RE.test(result.anchor ?? '')) return raw;

    const hashIdx = raw.indexOf('#');
    const base = hashIdx >= 0 ? raw.slice(0, hashIdx) : raw;
    const hash = hashIdx >= 0 ? raw.slice(hashIdx) : '';
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}highlight=${encodeURIComponent(term)}${hash}`;
  }

  function navigate(result) {
    const glossaryMatch = GLOSSARY_STUB_RE.exec(result.filepath ?? '');
    if (glossaryMatch) {
      const qMatch = /\?q=([^#&]+)/.exec(result.anchor ?? '');
      const term = qMatch ? decodeURIComponent(qMatch[1]) : result.title;
      navigateKnowledge(resolveResultHref(result), term, 'term');
      return;
    }

    // Resolve the term *before* re-adding to recents — falling back to
    // result.query so replaying a recent search still knows what to highlight.
    // (Re-adding must reuse this resolved term rather than the live `query`
    // state, otherwise replaying a recent — where `query` is empty — would
    // overwrite its stored term with '' and break highlighting on every
    // subsequent replay.)
    const term = query.trim() || (result.query ?? '').trim();
    recentSearches.add({ query: term, title: result.title, filepath: result.filepath, anchor: result.anchor, type: 'page' });
    history.push(resolveResultHref(result));

    setQuery('');
    setIsOpen(false);
  }

  // `kind` distinguishes term/FAQ recents from regular page results so the
  // recents list can label them correctly and — critically — so replaying
  // them never runs them through the generic ?highlight= content-highlighter.
  // Term/FAQ destinations (the help center) render their own React-driven
  // ?q= match highlighting; wrapping their text nodes in <mark> externally
  // fights React's reconciliation and can throw DOM-mutation errors.
  function navigateKnowledge(url, entryTitle, kind = 'term') {
    if (query && entryTitle) {
      const urlPath = url.split('?')[0].split('#')[0].replace(/^\//, '');
      const syntheticFilepath = `${urlPath}.mdx#${encodeURIComponent(entryTitle)}`;
      recentSearches.add({ query, title: entryTitle, filepath: syntheticFilepath, url, type: kind });
    }
    history.push(url);
    setQuery('');
    setIsOpen(false);
  }

  // Same "single source of truth" approach as resolveResultHref: these back
  // both the rendered <a href> and the actual navigateKnowledge() calls (in
  // JSX onClick and in handleKeyDown's Enter branch) so the previewed URL
  // can never drift from where the click/Enter actually navigates.
  function resolveTermHref(t) {
    return `/support/help-center-${t.userType}?q=${encodeURIComponent(t.term)}`;
  }
  function resolveFaqHref(f) {
    return `/support/help-center-${f.userType}?q=${encodeURIComponent(f.question)}#faq`;
  }

  /** Replay a recent search entry the same way it originally navigated. */
  function replayRecent(r) {
    if (r.isAi) { askAi(r.query); return; }
    if (r.type === 'term' || r.type === 'faq') {
      // Knowledge destinations manage their own highlighting via ?q= —
      // navigate directly instead of routing through navigate()'s
      // ?highlight= logic, which would fight React on that page.
      recentSearches.add(r);
      history.push(r.url);
      setQuery('');
      setIsOpen(false);
      return;
    }
    navigate(r);
  }

  function getSnippet(result) {
    // Prefer Azure Search highlights — already contain <mark> tags around matches
    const highlights = result['@search.highlights']?.content;
    if (highlights?.length) {
      // Split on <mark> tags so stripMarkdown only runs on text segments
      const parts = highlights[0].split(/(<\/?mark>)/gi);
      const html = parts.map(part => /^<\/?mark>$/i.test(part) ? part : stripMarkdown(part)).join('');
      return html.trim().replace(/<mark>/gi, `<mark class="${highlightStyles.mark}">`);
    }

    // Fallback: extract from raw content
    const content = result.content;
    if (!content) return null;
    const q = debouncedQuery.toLowerCase().trim();
    const idx = content.toLowerCase().indexOf(q);
    const start = Math.max(0, idx === -1 ? 0 : idx - 40);
    const end = Math.min(content.length, start + 150);
    const raw = (start > 0 ? '…' : '') + content.slice(start, end).replace(/\s+/g, ' ').trim() + (end < content.length ? '…' : '');
    const stripped = stripMarkdown(raw).trim();
    if (idx === -1) return stripped;
    return stripped.replace(
      new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
      `<mark class="${highlightStyles.mark}">$1</mark>`,
    );
  }

  const showingRecents = !query && recentSearches.recents.length > 0;
  const aiAtTop = aiEnabled && !!query && (() => {
    const q = query.trim().toLowerCase();
    return q.endsWith('?')
      || /^(how|what|why|when|where|who|which|can|does|do|is|are|will|should|could|would)\b/.test(q)
      || q.split(/\s+/).length >= 5;
  })();

  // True when results exist but none contain the exact query term — indicates fuzzy-only matches
  const isApproximateMatch = results.length > 0 && (() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return false;
    return !results.some(r =>
      r.title?.toLowerCase().includes(q) || r.content?.toLowerCase().includes(q)
    );
  })();

  // While either the page search or the local knowledge search is still in
  // flight, hold off finalizing the single-/two-column layout choice — see
  // the comment above the searchKnowledge() call for why this matters.
  const resultsPending = isSearching || isKnowledgeSearching;
  const hasKnowledgeResults = !resultsPending && !!query && !aiActive && (termResults.length > 0 || faqResults.length > 0);

  // Flat ordered list of all navigable items: page results → Ask AI → terms → FAQ.
  // Used to drive arrow-key navigation across both columns.
  const pageItemCount = results.length;
  const askAiIndex = pageItemCount; // virtual index for Ask AI row
  const termStartIndex = pageItemCount + (aiEnabled && query ? 1 : 0);
  const faqStartIndex = termStartIndex + termResults.length;

  const totalItems = showingRecents
    ? recentSearches.recents.length
    : pageItemCount + (aiEnabled && query ? 1 : 0) + (hasKnowledgeResults ? termResults.length + faqResults.length : 0);

  // Derive the active descendant ID for aria-activedescendant
  const activeDescendantId = activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined;

  // Scroll active item into view when navigating with arrow keys
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = document.getElementById(`search-opt-${activeIndex}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Live region announcement
  const liveMessage = (() => {
    if (isSearching) return '';
    if (!query) return showingRecents ? `${recentSearches.recents.length} recent searches` : '';
    if (results.length === 0) return `No results for ${query}`;
    return `${results.length} result${results.length === 1 ? '' : 's'} for ${query}`;
  })();

  function handleKeyDown(e) {
    // Let ArrowLeft / ArrowRight always move the cursor inside the input
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;

    // Ctrl+Enter / Cmd+Enter → Ask AI directly, from anywhere in the input
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && aiEnabled && query.trim()) {
      e.preventDefault();
      askAi(query);
      return;
    }

    if (!isOpen) return;

    if (aiActive) {
      if (e.key === 'Escape') { setAiActive(false); abortRef.current?.abort(); }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        setAiActive(false);
        inputRef.current?.blur();
        break;
      case 'ArrowDown':
        if (totalItems > 0) {
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, totalItems - 1));
        }
        break;
      case 'ArrowUp':
        if (activeIndex >= 0) {
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, -1));
        }
        break;
      case 'Enter':
        if (showingRecents && activeIndex >= 0) {
          const r = recentSearches.recents[activeIndex];
          // Enter must replay the recent exactly like clicking it — term/faq
          // entries navigate straight to their help-center destination, page
          // entries navigate straight to their doc. Previously this only
          // handled the AI case and fell back to re-populating the query for
          // everything else, so pressing Enter on a term recent looked like
          // it "searched a page" instead of jumping to the term.
          if (r) replayRecent(r);
        } else if (activeIndex === askAiIndex && aiEnabled && query) {
          askAi();
        } else if (hasKnowledgeResults && activeIndex >= termStartIndex && activeIndex < faqStartIndex) {
          const t = termResults[activeIndex - termStartIndex];
          if (t) navigateKnowledge(resolveTermHref(t), t.term, 'term');
        } else if (hasKnowledgeResults && activeIndex >= faqStartIndex) {
          const f = faqResults[activeIndex - faqStartIndex];
          if (f) navigateKnowledge(resolveFaqHref(f), f.question, 'faq');
        } else if (activeIndex >= 0 && sortedResults[activeIndex]) {
          navigate(sortedResults[activeIndex]);
        }
        break;
    }
  }

  function closeModal() {
    setIsOpen(false);
    setQuery('');
    setAiActive(false);
    abortRef.current?.abort();
    setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      {/* ── Navbar trigger — search button + optional highlight clear, as one unit ── */}
      <div className={`${styles.triggerWrapper}${highlightTerm ? ` ${styles.triggerWrapperActive}` : ''}`}>
        <button
          ref={triggerRef}
          className={styles.triggerButton}
          onClick={() => setIsOpen(true)}
          data-cy="search-trigger"
          aria-label={highlightTerm
            ? `Highlighted: ${highlightTerm}. Press Enter to search again.`
            : `Search or ask AI, press ${shortcutLabel} to open`}
          aria-keyshortcuts={shortcutLabel.includes('⌘') ? 'Meta+k' : 'Control+k'}
          aria-haspopup="dialog"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} aria-hidden="true" />
          {highlightTerm ? (
            <span className={styles.triggerHighlightLabel}>
              <span className={styles.triggerHighlightPrefix}>Highlighted:</span>
              <strong className={styles.triggerHighlightTerm} data-cy="search-highlight-chip-label">{highlightTerm}</strong>
            </span>
          ) : (
            <>
              <span className={styles.triggerText}>Search or ask…</span>
              <span className={styles.shortcutBadge} aria-hidden="true">
                {shortcutLabel.includes('⌘')
                  ? <kbd>⌘K</kbd>
                  : <><kbd>Ctrl</kbd><kbd>K</kbd></>
                }
              </span>
            </>
          )}
        </button>
        {highlightTerm && (
          <button
            className={styles.highlightClearButton}
            data-cy="search-highlight-chip"
            onClick={clearHighlight}
            aria-label={`Clear search highlights for "${highlightTerm}". Press Escape to dismiss.`}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            <span className={styles.highlightClearText}>Clear</span>
          </button>
        )}
      </div>

      {/* ── Modal overlay ── */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}
          role="presentation"
        >
          <div
            className={`${styles.modal}${hasKnowledgeResults ? ` ${styles.wideModal}` : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            data-search-modal
          >
            {/* Live region — announces result count to screen readers */}
            <div role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly}>
              {liveMessage}
            </div>

            {/* Input row */}
            <div className={`${styles.inputWrapper} ${isFocused ? styles.inputWrapperFocused : ''}`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} aria-hidden="true" />

              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search or ask…"
                data-cy="search-modal-input"
                aria-label="Search or ask AI"
                role="combobox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={activeDescendantId}
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-busy={isSearching || isStreaming}
                value={query}
                onChange={e => { setQuery(e.target.value); setAiActive(false); }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="off"
                spellCheck={false}
              />

              {isStreaming
                ? <span className={styles.spinner} aria-hidden="true" />
                : query
                  ? (
                    <button
                      className={styles.clearButton}
                      aria-label="Clear search"
                      onClick={() => { setQuery(''); setAiActive(false); inputRef.current?.focus(); }}
                    >
                      <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                    </button>
                  )
                  : null
              }

              <button className={styles.escBadge} onClick={closeModal} aria-label="Close search">
                <kbd>Esc</kbd>
              </button>
            </div>

            {/* Results / AI / Recents area.
                ARIA: when two-column mode is active the outer panel becomes a region so it
                can legally contain non-option children. The listbox id moves inside to the
                page-results column so aria-controls on the combobox still points correctly. */}
            <div
              ref={panelRef}
              id={hasKnowledgeResults ? undefined : listboxId}
              className={styles.panel}
              role={aiActive ? 'region' : hasKnowledgeResults ? 'region' : 'listbox'}
              aria-label={aiActive ? 'AI Answer' : 'Search results'}
              aria-live={aiActive ? 'polite' : undefined}
              aria-busy={aiActive ? isStreaming : isSearching}
            >

              {/* ── AI answer view ── */}
              {aiActive ? (
                <div className={styles.aiPanel}>
                  <div className={styles.aiHeader}>
                    <button
                      className={styles.aiBack}
                      onClick={() => { setAiActive(false); abortRef.current?.abort(); }}
                      aria-label="Back to results"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
                      Back to results
                    </button>
                    <span className={styles.aiLabel}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                      </svg>
                      AI Answer
                      {isStreaming && <span className={styles.streamingDot} aria-hidden="true" />}
                    </span>
                  </div>

                  <p className={styles.aiQuestion}>&ldquo;{query}&rdquo;</p>

                  {aiError
                    ? <p className={styles.aiError}>{aiError}</p>
                    : aiAnswer
                      ? (
                        <>
                          <div className={styles.aiAnswer}>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, class: classProp, className, children, ...props }) {
                                  return <code className={className ?? classProp} {...props}>{children}</code>;
                                },
                                li({ node, class: classProp, className, children, ...props }) {
                                  return <li className={className ?? classProp} {...props}>{children}</li>;
                                },
                              }}
                            >
                              {aiAnswer.replace(/\[doc\d+\]/g, '')}
                            </ReactMarkdown>
                          </div>

                          {aiCitations.length > 0 && (
                            <div className={styles.aiSources} role="group" aria-labelledby="search-related-label">
                              <p id="search-related-label" className={styles.aiSourcesLabel}>Related pages</p>
                              <ul className={styles.aiSourcesList}>
                                {aiCitations.map((c, i) => (
                                  <li key={i}>
                                    <a
                                      href={filepathToUrl(c.filepath)}
                                      className={`${styles.result} ${styles.resultSmall}`}
                                      onClick={e => { e.preventDefault(); navigate({ title: c.title, filepath: c.filepath }); }}
                                    >
                                      <span className={styles.resultIconWrap} aria-hidden="true">
                                        <FontAwesomeIcon icon={faFileLines} />
                                      </span>
                                      <span className={styles.resultContent}>
                                        <span className={styles.resultTitle}>{c.title || filepathToBreadcrumb(c.filepath)}</span>
                                        <BreadcrumbPath path={filepathToBreadcrumb(c.filepath, null, c.title)} className={styles.resultPath} />
                                      </span>
                                      <FontAwesomeIcon icon={faChevronRight} className={styles.resultChevron} aria-hidden="true" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {!isStreaming && (
                            <p className={styles.aiDisclaimer}>
                              AI answers may be inaccurate — always verify against the documentation.
                            </p>
                          )}
                        </>
                      )
                      : <p className={styles.aiPlaceholder}>Thinking…</p>
                  }
                </div>
              ) : !query && recentSearches.recents.length > 0 ? (
                /* ── Recent searches ── */
                <div className={styles.recentSection} role="group" aria-labelledby="search-recents-label">
                  <div className={styles.recentHeader}>
                    <span id="search-recents-label" className={styles.recentLabel}>Recent searches</span>
                    <button
                      className={styles.recentClearAll}
                      data-cy="recent-clear-all"
                      onClick={() => {
                        recentSearches.clear();
                        // The recents section (including this button) unmounts once
                        // the list is empty, which drops focus to <body> for keyboard
                        // users. Flag it so the layout effect above re-focuses the
                        // search input after the unmount has actually committed,
                        // instead of racing it with a focus() call here.
                        refocusInputAfterClearRef.current = true;
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.recents.map((r, i) => (
                    <div key={r.filepath} className={styles.recentItemRow} onMouseEnter={() => setActiveIndex(i)}>
                      <div
                        id={`search-opt-${i}`}
                        data-cy="recent-result"
                        className={`${styles.result} ${i === activeIndex ? styles.active : ''} ${r.type === 'page' && isDeprecatedFilepath(r.filepath) ? styles.resultDeprecated : ''}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        tabIndex={0}
                        onFocus={() => setActiveIndex(i)}
                        onClick={() => replayRecent(r)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            replayRecent(r);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className={styles.resultIconWrap} aria-hidden="true">
                          {r.isAi ? (
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                            </svg>
                          ) : r.type === 'term' ? (
                            <FontAwesomeIcon icon={faBook} />
                          ) : r.type === 'faq' ? (
                            <FontAwesomeIcon icon={faCircleQuestion} />
                          ) : (
                            <FontAwesomeIcon icon={faClock} />
                          )}
                        </span>
                        <span className={styles.resultContent}>
                          <span className={styles.resultTitle}>
                            {r.query}
                            {r.type === 'page' && <DeprecatedBadge filepath={r.filepath} />}
                          </span>
                          {r.isAi
                            ? <span className={styles.resultPath}>AI Answer</span>
                            : (
                              <span className={styles.resultPath}>
                                <span className={styles.recentTypeLabel} data-cy="recent-result-type">
                                  {r.type === 'term' ? 'Term · ' : r.type === 'faq' ? 'FAQ · ' : 'Page · '}
                                </span>
                                <BreadcrumbPath path={r.title || filepathToBreadcrumb(r.filepath)} className={styles.resultPath} />
                              </span>
                            )
                          }
                        </span>
                      </div>
                      <button
                        className={styles.recentRemove}
                        aria-label={`Remove "${r.query}" from recent searches`}
                        onClick={e => { e.stopPropagation(); recentSearches.remove(r.filepath); }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* ── Ask AI — prominent card at top for question-like queries ── */}
                  {aiEnabled && query && aiAtTop && !isSearching && (
                    <div className={styles.askAiPromo}>
                      <button
                        role="option"
                        aria-selected={activeIndex === askAiIndex}
                        className={`${styles.askAiPromoBtn} ${activeIndex === askAiIndex ? styles.active : ''}`}
                        onMouseEnter={() => setActiveIndex(askAiIndex)}
                        onClick={() => askAi()}
                      >
                        <span className={styles.askAiPromoIcon} aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                          </svg>
                        </span>
                        <span className={styles.askAiPromoText}>
                          <span className={styles.askAiPromoTitle}>Ask AI</span>
                          <span className={styles.askAiPromoQuery}>&ldquo;{query}&rdquo;</span>
                        </span>
                        <kbd className={styles.askAiPromoKbd}>
                          {shortcutLabel.includes('⌘') ? '⌘' : 'Ctrl'}&thinsp;↵
                        </kbd>
                      </button>
                    </div>
                  )}

                  {/* ── Search results — single column or two-column layout ── */}
                  {hasKnowledgeResults ? (
                    <div className={styles.twoColBody}>
                      {/* Mobile-only tab bar: switches between Pages and Terms & FAQ */}
                      <div className={styles.mobileTabs} role="tablist" aria-label="Result sections">
                        <button
                          role="tab"
                          aria-selected={mobileKnowledgeTab === 'pages'}
                          className={`${styles.mobileTab} ${mobileKnowledgeTab === 'pages' ? styles.mobileTabActive : ''}`}
                          onClick={() => setMobileKnowledgeTab('pages')}
                        >
                          <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
                          Pages
                          {results.length > 0 && <span className={styles.mobileTabBadge}>{results.length}</span>}
                        </button>
                        <button
                          role="tab"
                          aria-selected={mobileKnowledgeTab === 'knowledge'}
                          className={`${styles.mobileTab} ${mobileKnowledgeTab === 'knowledge' ? styles.mobileTabActive : ''}`}
                          onClick={() => setMobileKnowledgeTab('knowledge')}
                        >
                          <FontAwesomeIcon icon={faBook} aria-hidden="true" />
                          Terms &amp; FAQ
                          <span className={styles.mobileTabBadge}>{termResults.length + faqResults.length}</span>
                        </button>
                      </div>
                      {/* Left: page results — owns the listbox in two-column mode */}
                      <div
                        id={listboxId}
                        role="listbox"
                        aria-label="Page results"
                        className={`${styles.pageCol}${mobileKnowledgeTab !== 'pages' ? ` ${styles.mobileTabHidden}` : ''}`}
                      >
                        <div className={styles.knowledgeSectionHeader} role="presentation" aria-hidden="true">
                          <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
                          Pages
                        </div>
                        {isLocalFallback && (
                          <div className={styles.localFallbackHint} data-cy="local-fallback-hint">
                            Search service unavailable · showing local results
                          </div>
                        )}
                        {isApproximateMatch && (
                          <div className={styles.approximateHint}>
                            Showing approximate matches for &ldquo;{debouncedQuery}&rdquo;
                          </div>
                        )}
                        {isSearching ? (
                          <div className={styles.skeletonList} aria-hidden="true">
                            {[88, 72, 95, 65].map((w, i) => (
                              <div key={i} className={styles.skeletonItem}>
                                <div className={styles.skeletonIcon} />
                                <div className={styles.skeletonContent}>
                                  <div className={styles.skeletonTitle} style={{ width: `${w}%` }} />
                                  <div className={styles.skeletonSnippet} style={{ width: `${Math.max(w - 15, 50)}%` }} />
                                  <div className={styles.skeletonPath} style={{ width: '30%' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : results.length === 0 && query ? (
                          <div className={styles.empty}>
                            <FontAwesomeIcon icon={faFileCircleXmark} aria-hidden="true" />
                            <span>No page results for &ldquo;{query}&rdquo;</span>
                          </div>
                        ) : (() => {
                          let lastCategory = null;
                          return sortedResults.map((result, i) => {
                            const showHeader = result.category && result.category !== lastCategory;
                            lastCategory = result.category;
                            const breadcrumb = filepathToBreadcrumb(result.filepath, result.sidebar_label, result.title);
                            return (
                              <React.Fragment key={result.id}>
                                {showHeader && (
                                  <div className={styles.groupHeader} role="presentation" aria-label={result.category}>
                                    {toPascalCase(result.category)}
                                  </div>
                                )}
                                <a
                                  id={`search-opt-${i}`}
                                  role="option"
                                  aria-selected={i === activeIndex}
                                  aria-label={`${result.title}${breadcrumb ? `, ${breadcrumb}` : ''}`}
                                  className={`${styles.result} ${i === activeIndex ? styles.active : ''} ${isDeprecatedFilepath(result.filepath) ? styles.resultDeprecated : ''}`}
                                  data-cy="search-result"
                                  href={resolveResultHref(result)}
                                  onMouseEnter={() => setActiveIndex(i)}
                                  onClick={e => { e.preventDefault(); navigate(result); }}
                                >
                                  <span className={styles.resultIconWrap} aria-hidden="true">
                                    <FontAwesomeIcon icon={faFileLines} />
                                  </span>
                                  <span className={styles.resultContent}>
                                    <span className={styles.resultTitle}>
                                      {result.title}
                                      <DeprecatedBadge filepath={result.filepath} />
                                    </span>
                                    {(() => { const s = getSnippet(result); return s ? <span className={styles.resultSnippet} dangerouslySetInnerHTML={{ __html: s }} /> : null; })()}
                                    {breadcrumb && <BreadcrumbPath path={breadcrumb} className={styles.resultPath} />}
                                  </span>
                                  <FontAwesomeIcon icon={faChevronRight} className={styles.resultChevron} aria-hidden="true" />
                                </a>
                              </React.Fragment>
                            );
                          });
                        })()}
                      </div>

                      {/* Right: terms + FAQ */}
                      <div
                        role="region"
                        aria-label="Glossary terms and FAQ"
                        className={`${styles.knowledgeCol}${mobileKnowledgeTab !== 'knowledge' ? ` ${styles.mobileTabHidden}` : ''}`}
                      >

                        {termResults.length > 0 && (
                          <div className={styles.knowledgeSection}>
                            <div className={styles.knowledgeSectionHeader}>
                              <FontAwesomeIcon icon={faBook} aria-hidden="true" />
                              Terms
                            </div>
                            {termResults.map((t, ki) => {
                              const itemIdx = termStartIndex + ki;
                              return (
                                <a
                                  key={`${t.term}-${t.userType}`}
                                  id={`search-opt-${itemIdx}`}
                                  role="option"
                                  aria-selected={activeIndex === itemIdx}
                                  className={`${styles.knowledgeItem} ${activeIndex === itemIdx ? styles.knowledgeItemActive : ''}`}
                                  data-cy="knowledge-term-result"
                                  href={resolveTermHref(t)}
                                  onMouseEnter={() => setActiveIndex(itemIdx)}
                                  onClick={e => { e.preventDefault(); navigateKnowledge(resolveTermHref(t), t.term, 'term'); }}
                                >
                                  <span className={styles.knowledgeItemTitle}>
                                    <span>{t.term}</span>
                                  </span>
                                  <span className={styles.knowledgeItemSnippet}>
                                    {stripMarkdownSimple(t.definition).slice(0, 90)}{t.definition.length > 90 ? '…' : ''}
                                  </span>
                                </a>
                              );
                            })}
                            <a
                              className={styles.knowledgeSeeAll}
                              href={`/support/help-center-${userType}`}
                              onClick={e => { e.preventDefault(); navigateKnowledge(`/support/help-center-${userType}`, null); }}
                            >
                              View all terms →
                            </a>
                          </div>
                        )}

                        {faqResults.length > 0 && (
                          <div className={styles.knowledgeSection}>
                            <div className={styles.knowledgeSectionHeader}>
                              <FontAwesomeIcon icon={faCircleQuestion} aria-hidden="true" />
                              FAQ
                            </div>
                            {faqResults.map((f, ki) => {
                              const itemIdx = faqStartIndex + ki;
                              return (
                                <a
                                  key={ki}
                                  id={`search-opt-${itemIdx}`}
                                  role="option"
                                  aria-selected={activeIndex === itemIdx}
                                  className={`${styles.knowledgeItem} ${activeIndex === itemIdx ? styles.knowledgeItemActive : ''}`}
                                  data-cy="knowledge-faq-result"
                                  href={resolveFaqHref(f)}
                                  onMouseEnter={() => setActiveIndex(itemIdx)}
                                  onClick={e => { e.preventDefault(); navigateKnowledge(resolveFaqHref(f), f.question, 'faq'); }}
                                >
                                  <span className={styles.knowledgeItemTitle}>
                                    <span>{f.question}</span>
                                  </span>
                                  <span className={styles.knowledgeItemSnippet}>
                                    {stripMarkdownSimple(f.answer).slice(0, 90)}{f.answer.length > 90 ? '…' : ''}
                                  </span>
                                </a>
                              );
                            })}
                            <a
                              className={styles.knowledgeSeeAll}
                              href={`/support/help-center-${userType}#faq`}
                              onClick={e => { e.preventDefault(); navigateKnowledge(`/support/help-center-${userType}#faq`, null); }}
                            >
                              View all FAQ →
                            </a>
                          </div>
                        )}

                      </div>
                    </div>
                  ) : (
                    <div className={styles.resultsList}>
                      {isLocalFallback && (
                        <div className={styles.localFallbackHint} data-cy="local-fallback-hint">
                          Search service unavailable · showing local results
                        </div>
                      )}
                      {isApproximateMatch && (
                        <div className={styles.approximateHint}>
                          Showing approximate matches for &ldquo;{debouncedQuery}&rdquo;
                        </div>
                      )}
                      {resultsPending ? (
                        <div className={styles.skeletonList} aria-hidden="true">
                          {[88, 72, 95, 65].map((w, i) => (
                            <div key={i} className={styles.skeletonItem}>
                              <div className={styles.skeletonIcon} />
                              <div className={styles.skeletonContent}>
                                <div className={styles.skeletonTitle} style={{ width: `${w}%` }} />
                                <div className={styles.skeletonSnippet} style={{ width: `${Math.max(w - 15, 50)}%` }} />
                                <div className={styles.skeletonPath} style={{ width: '30%' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : results.length === 0 && query ? (
                        <div className={styles.empty}>
                          <FontAwesomeIcon icon={faFileCircleXmark} aria-hidden="true" />
                          <span>No results for &ldquo;{query}&rdquo;</span>
                        </div>
                      ) : (() => {
                        let lastCategory = null;
                        return sortedResults.map((result, i) => {
                          const showHeader = result.category && result.category !== lastCategory;
                          lastCategory = result.category;
                          const breadcrumb = filepathToBreadcrumb(result.filepath, result.sidebar_label, result.title);
                          return (
                            <React.Fragment key={result.id}>
                              {showHeader && (
                                <div className={styles.groupHeader} role="presentation" aria-label={result.category}>
                                  {toPascalCase(result.category)}
                                </div>
                              )}
                              <a
                                id={`search-opt-${i}`}
                                role="option"
                                aria-selected={i === activeIndex}
                                aria-label={`${result.title}${breadcrumb ? `, ${breadcrumb}` : ''}`}
                                className={`${styles.result} ${i === activeIndex ? styles.active : ''} ${isDeprecatedFilepath(result.filepath) ? styles.resultDeprecated : ''}`}
                                data-cy="search-result"
                                  href={resolveResultHref(result)}
                                  onMouseEnter={() => setActiveIndex(i)}
                                  onClick={e => { e.preventDefault(); navigate(result); }}
                                >
                                  <span className={styles.resultIconWrap} aria-hidden="true">
                                    <FontAwesomeIcon icon={faFileLines} />
                                  </span>
                                  <span className={styles.resultContent}>
                                    <span className={styles.resultTitle}>
                                      {result.title}
                                      <DeprecatedBadge filepath={result.filepath} />
                                    </span>
                                    {(() => { const s = getSnippet(result); return s ? <span className={styles.resultSnippet} dangerouslySetInnerHTML={{ __html: s }} /> : null; })()}
                                    {breadcrumb && <BreadcrumbPath path={breadcrumb} className={styles.resultPath} />}
                                  </span>
                                  <FontAwesomeIcon icon={faChevronRight} className={styles.resultChevron} aria-hidden="true" />
                                </a>
                              </React.Fragment>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {/* ── Ask AI row — shown at bottom for keyword (non-question) queries ── */}
                  {aiEnabled && query && !aiAtTop && (
                    <div className={styles.askAiSection}>
                      <button
                        id={`search-opt-${askAiIndex}`}
                        role="option"
                        aria-selected={activeIndex === askAiIndex}
                        aria-label={`Ask AI: ${query}`}
                        className={`${styles.askAiRow} ${activeIndex === askAiIndex ? styles.active : ''}`}
                        onMouseEnter={() => setActiveIndex(askAiIndex)}
                        onClick={() => askAi()}
                      >
                        <svg className={styles.askAiIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                        </svg>
                        <span className={styles.askAiText}>
                          <span className={styles.askAiLabel}>Ask AI</span>
                          <span className={styles.askAiQuery}>&ldquo;{query}&rdquo;</span>
                        </span>
                        <kbd className={styles.askAiKbd}>
                          {shortcutLabel.includes('⌘') ? '⌘' : 'Ctrl'} ↵
                        </kbd>
                      </button>
                    </div>
                  )}

                  {/* ── Panel footer with keyboard hints ── */}
                  {(results.length > 0 || showingRecents) && (
                    <div className={styles.panelFooter}>
                      <span className={styles.footerHint} aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                      <span className={styles.footerHint} aria-hidden="true"><kbd>↵</kbd> select</span>
                      {aiEnabled && <span className={styles.footerHint} aria-hidden="true"><kbd>{shortcutLabel.includes('⌘') ? '⌘' : 'Ctrl'}</kbd><kbd>↵</kbd> ask AI</span>}
                      <span className={styles.footerHint} aria-hidden="true"><kbd>Esc</kbd> close</span>
                    </div>
                  )}
                </>
              )}

              {/* ── Panel footer for recents view ── */}
              {!aiActive && showingRecents && (
                <div className={styles.panelFooter}>
                  <span className={styles.footerHint} aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                  <span className={styles.footerHint} aria-hidden="true"><kbd>↵</kbd> select</span>
                  <span className={styles.footerHint} aria-hidden="true"><kbd>Esc</kbd> close</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
