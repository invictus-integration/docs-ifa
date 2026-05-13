import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faChevronLeft, faChevronRight, faFileLines, faClock, faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

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
    .replace(/\s+/g, ' ')
    .trim();
}

function toPascalCase(str) {  return str
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

async function streamAiResponse({ question, onChunk, onCitations, onDone, onError, signal }) {
  let res;
  try {
    res = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (e) {
    onError(e);
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    onError(new Error(err?.error?.message ?? res.statusText));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) onChunk(delta.content);
          if (delta?.context?.citations?.length) onCitations(delta.context.citations);
        } catch { /* skip malformed lines */ }
      }
    }
    onDone();
  } catch (e) {
    if (e?.name !== 'AbortError' && e?.message !== 'BodyStreamBuffer was aborted') {
      onError(e);
    } else {
      onDone();
    }
  }
}

export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  const { azureSearch } = siteConfig.customFields;
  const aiEnabled = !!(siteConfig.customFields.aiEnabled);
  const history = useHistory();
  const recentSearches = useRecentSearches();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // activeIndex: 0..results.length-1 = doc results, results.length = Ask AI row
  const [activeIndex, setActiveIndex] = useState(-1);

  // AI state
  const [aiActive, setAiActive] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiCitations, setAiCitations] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiError, setAiError] = useState('');

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
  const skipSearchResetRef = useRef(false);
  const listboxId = 'search-listbox';
  const debouncedQuery = useDebounce(query, 300);

  // Search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      if (!skipSearchResetRef.current) setAiActive(false);
      return;
    }

    if (skipSearchResetRef.current) {
      skipSearchResetRef.current = false;
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    setAiActive(false);

    const baseParams = {
      'api-version': '2024-07-01',
      searchFields: 'title,content',
      select: 'id,title,filepath,category,content,sidebar_label',
      highlight: 'content',
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      top: '8',
    };

    // Try semantic search first (handles typos + intent); fall back to simple fuzzy on error.
    const doSearch = (query, semantic) => {
      const params = new URLSearchParams({
        ...baseParams,
        search: semantic ? query : query.trim().split(/\s+/).map(w => `${w}~`).join(' '),
        ...(semantic ? {
          queryType: 'semantic',
          semanticConfiguration: 'default',
          speller: 'lexicon',
          queryLanguage: 'en-us',
        } : {
          queryType: 'simple',
        }),
      });

      return fetch(`${azureSearch.endpoint}/indexes/${azureSearch.index}/docs?${params}`, {
        headers: { 'api-key': azureSearch.apiKey },
        signal: controller.signal,
      }).then(res => {
        if (!res.ok) return res.json().then(e => { throw Object.assign(e, { status: res.status }); });
        return res.json();
      });
    };

    doSearch(debouncedQuery, true)
      .catch(err => {
        // Semantic search unavailable (index not configured or service tier) — fall back to fuzzy
        if (err?.status === 400 || err?.status === 404) return doSearch(debouncedQuery, false);
        throw err;
      })
      .then(data => { setResults(data.value ?? []); setActiveIndex(-1); })
      .catch(err => { if (err?.name !== 'AbortError') console.error('[Azure Search]', err); })
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
      const last  = focusable[focusable.length - 1];
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
    recentSearches.add({ query: queryToAsk, title: 'AI Answer', filepath: `__ai__:${queryToAsk}`, isAi: true });
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

  function navigate(result) {
    recentSearches.add({ query, title: result.title, filepath: result.filepath });
    history.push(filepathToUrl(result.filepath));
    setQuery('');
    setIsOpen(false);
  }

  function getSnippet(result) {
    // Prefer Azure Search highlights — already contain <mark> tags around matches
    const highlights = result['@search.highlights']?.content;
    if (highlights?.length) return stripMarkdown(highlights[0]);

    // Fallback: extract from raw content
    const content = result.content;
    if (!content) return null;
    const q = debouncedQuery.toLowerCase().trim();
    const idx = content.toLowerCase().indexOf(q);
    const start = Math.max(0, idx === -1 ? 0 : idx - 40);
    const end   = Math.min(content.length, start + 150);
    const raw   = (start > 0 ? '…' : '') + content.slice(start, end).replace(/\s+/g, ' ').trim() + (end < content.length ? '…' : '');
    const stripped = stripMarkdown(raw);
    if (idx === -1) return stripped;
    return stripped.replace(
      new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
      '<mark>$1</mark>',
    );
  }

  const showingRecents = !query && recentSearches.recents.length > 0;
  const aiAtTop = aiEnabled && !!query && (() => {
    const q = query.trim().toLowerCase();
    return q.endsWith('?')
      || /^(how|what|why|when|where|who|which|can|does|do|is|are|will|should|could|would)\b/.test(q)
      || q.split(/\s+/).length >= 5;
  })();
  const totalItems = showingRecents
    ? recentSearches.recents.length
    : results.length + (aiEnabled && query ? 1 : 0);
  const askAiIndex = results.length; // virtual index for the Ask AI row (only valid when !showingRecents)

  // Derive the active descendant ID for aria-activedescendant
  const activeDescendantId = activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined;

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
          if (r) {
            if (r.isAi) { askAi(r.query); }
            else { setQuery(r.query); }
          }
        } else if (activeIndex === askAiIndex && aiEnabled && query) {
          askAi();
        } else if (activeIndex >= 0 && results[activeIndex]) {
          navigate(results[activeIndex]);
        }
        break;
    }
  }

  function closeModal() {
    setIsOpen(false);
    setQuery('');
    setAiActive(false);
    abortRef.current?.abort();
  }

  return (
    <>
      {/* ── Navbar trigger button ── */}
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(true)}
        aria-label={`Search documentation, press ${shortcutLabel} to open`}
        aria-keyshortcuts={shortcutLabel.includes('⌘') ? 'Meta+k' : 'Control+k'}
        aria-haspopup="dialog"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} aria-hidden="true" />
        <span className={styles.triggerText}>Search docs…</span>
        <span className={styles.shortcutBadge} aria-hidden="true">
          {shortcutLabel.includes('⌘')
            ? <kbd>⌘K</kbd>
            : <><kbd>Ctrl</kbd><kbd>K</kbd></>
          }
        </span>
      </button>

      {/* ── Modal overlay ── */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}
          role="presentation"
        >
          <div
            className={styles.modal}
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
                placeholder="Search docs…"
                aria-label="Search documentation"
                role="combobox"
                aria-expanded={isOpen && (results.length > 0 || showingRecents)}
                aria-controls={listboxId}
                aria-activedescendant={activeDescendantId}
                aria-autocomplete="list"
                aria-haspopup="listbox"
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

            {/* Results / AI / Recents area */}
            <div ref={panelRef} id={listboxId} className={styles.panel} role="listbox" aria-label="Search results">

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
                            <div className={styles.aiSources}>
                              <p className={styles.aiSourcesLabel}>Related pages</p>
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
                        </>
                      )
                      : <p className={styles.aiPlaceholder}>Thinking…</p>
                  }
                </div>
              ) : !query && recentSearches.recents.length > 0 ? (
                /* ── Recent searches ── */
                <div className={styles.recentSection}>
                  <div className={styles.recentHeader}>
                    <span className={styles.recentLabel}>Recent searches</span>
                    <button className={styles.recentClearAll} onClick={recentSearches.clear}>
                      Clear all
                    </button>
                  </div>
                  {recentSearches.recents.map((r, i) => (
                    <div
                      key={r.filepath}
                      id={`search-opt-${i}`}
                      className={`${styles.result} ${i === activeIndex ? styles.active : ''}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      tabIndex={0}
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      onClick={() => r.isAi ? askAi(r.query) : navigate(r)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          r.isAi ? askAi(r.query) : navigate(r);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.resultIconWrap} aria-hidden="true">
                        {r.isAi ? (
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                          </svg>
                        ) : (
                          <FontAwesomeIcon icon={faClock} />
                        )}
                      </span>
                      <span className={styles.resultContent}>
                        <span className={styles.resultTitle}>{r.query}</span>
                        {r.isAi
                          ? <span className={styles.resultPath}>AI Answer</span>
                          : <BreadcrumbPath path={r.title || filepathToBreadcrumb(r.filepath)} className={styles.resultPath} />
                        }
                      </span>
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

                  {/* ── Search results ── */}
                  <div className={styles.resultsList}>
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
                        <span>No results for &ldquo;{query}&rdquo;</span>
                      </div>
                    ) : (() => {
                      let lastCategory = null;
                      return results.map((result, i) => {
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
                            <button
                              id={`search-opt-${i}`}
                              role="option"
                              aria-selected={i === activeIndex}
                              aria-label={`${result.title}${breadcrumb ? `, ${breadcrumb}` : ''}`}
                              className={`${styles.result} ${i === activeIndex ? styles.active : ''}`}
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => navigate(result)}
                            >
                              <span className={styles.resultIconWrap} aria-hidden="true">
                                <FontAwesomeIcon icon={faFileLines} />
                              </span>
                              <span className={styles.resultContent}>
                                <span className={styles.resultTitle}>{result.title}</span>
                                {(() => { const s = getSnippet(result); return s ? <span className={styles.resultSnippet} dangerouslySetInnerHTML={{ __html: s }} /> : null; })()}
                                {breadcrumb && <BreadcrumbPath path={breadcrumb} className={styles.resultPath} />}
                              </span>
                              <FontAwesomeIcon icon={faChevronRight} className={styles.resultChevron} aria-hidden="true" />
                            </button>
                          </React.Fragment>
                        );
                      });
                    })()}
                  </div>

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
                  {results.length > 0 && (
                    <div className={styles.panelFooter}>
                      <span className={styles.footerHint}><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                      <span className={styles.footerHint}><kbd>↵</kbd> select</span>
                      {aiEnabled && <span className={styles.footerHint}><kbd>{shortcutLabel.includes('⌘') ? '⌘' : 'Ctrl'}</kbd><kbd>↵</kbd> ask AI</span>}
                      <span className={styles.footerHint}><kbd>Esc</kbd> close</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}