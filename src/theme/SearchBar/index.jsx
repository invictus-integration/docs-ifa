import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

function filepathToUrl(filepath) {
  const parts = filepath
    .replace(/\.mdx?$/, '')
    .split('/')
    .map(seg => seg.replace(/^\d+_/, ''));
  if (parts[parts.length - 1] === 'index') parts.pop();
  return '/' + parts.filter(Boolean).join('/');
}

function filepathToBreadcrumb(filepath) {
  return filepath
    .replace(/\.mdx?$/, '')
    .split('/')
    .map(seg => seg.replace(/^\d+_/, '').replace(/-/g, ' '))
    .filter(seg => seg !== 'index' && seg)
    .join(' › ');
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

async function streamAiResponse({ openAI, search, question, onChunk, onCitations, onDone, onError, signal }) {
  const url = `${openAI.endpoint}/openai/deployments/${openAI.deployment}/chat/completions?api-version=2024-02-01`;

  const body = JSON.stringify({
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant for the Invictus for Azure documentation. Answer questions accurately and concisely based only on the provided documentation. If the answer is not in the docs, say so.',
      },
      { role: 'user', content: question },
    ],
    data_sources: [
      {
        type: 'azure_search',
        parameters: {
          endpoint: search.endpoint,
          index_name: search.index,
          authentication: { type: 'api_key', key: search.adminKey },
        },
      },
    ],
  });

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'api-key': openAI.apiKey, 'Content-Type': 'application/json' },
      body,
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
  const { azureSearch, azureOpenAI } = siteConfig.customFields;
  const history = useHistory();
  const aiEnabled = !!(azureOpenAI?.endpoint && azureOpenAI?.deployment && azureOpenAI?.apiKey);
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

    const params = new URLSearchParams({
      'api-version': '2024-07-01',
      search: debouncedQuery,
      searchFields: 'title,content',
      select: 'id,title,filepath,category',
      top: '8',
    });

    fetch(`${azureSearch.endpoint}/indexes/${azureSearch.index}/docs?${params}`, {
      headers: { 'api-key': azureSearch.apiKey },
      signal: controller.signal,
    })
      .then(res => { if (!res.ok) return res.json().then(e => { throw e; }); return res.json(); })
      .then(data => { setResults(data.value ?? []); setActiveIndex(-1); })
      .catch(err => console.error('[Azure Search]', err))
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
      openAI: azureOpenAI,
      search: azureSearch,
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

  // Total navigable items: results + (1 Ask AI row if aiEnabled)
  const totalItems = results.length + (aiEnabled ? 1 : 0);
  const askAiIndex = results.length; // virtual index for the Ask AI row

  function handleKeyDown(e) {
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
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        if (activeIndex === askAiIndex && aiEnabled) { askAi(); }
        else if (activeIndex >= 0 && results[activeIndex]) { navigate(results[activeIndex]); }
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
        aria-label="Search documentation"
      >
        <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
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
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Search documentation">

            {/* Input row */}
            <div className={`${styles.inputWrapper} ${isFocused ? styles.inputWrapperFocused : ''}`}>
              <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>

              <input
                ref={inputRef}
                type="search"
                className={styles.input}
                placeholder="Search docs…"
                aria-label="Search documentation"
                value={query}
                onChange={e => { setQuery(e.target.value); setAiActive(false); }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="off"
                spellCheck={false}
              />

              {(isSearching || isStreaming)
                ? <span className={styles.spinner} aria-hidden="true" />
                : query
                  ? (
                    <button
                      className={styles.clearButton}
                      aria-label="Clear search"
                      onClick={() => { setQuery(''); setAiActive(false); inputRef.current?.focus(); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                      </svg>
                    </button>
                  )
                  : null
              }

              <button className={styles.escBadge} onClick={closeModal} aria-label="Close search">
                <kbd>Esc</kbd>
              </button>
            </div>

            {/* Results / AI / Recents area */}
            <div ref={panelRef} className={styles.panel} role="listbox" aria-label="Search results">

              {/* ── AI answer view ── */}
              {aiActive ? (
                <div className={styles.aiPanel}>
                  <div className={styles.aiHeader}>
                    <button
                      className={styles.aiBack}
                      onClick={() => { setAiActive(false); abortRef.current?.abort(); }}
                      aria-label="Back to results"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
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
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <polyline points="14 2 14 8 20 8" />
                                          <line x1="16" y1="13" x2="8" y2="13" />
                                          <line x1="16" y1="17" x2="8" y2="17" />
                                          <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                      </span>
                                      <span className={styles.resultContent}>
                                        <span className={styles.resultTitle}>{c.title || filepathToBreadcrumb(c.filepath)}</span>
                                        <span className={styles.resultPath}>{filepathToBreadcrumb(c.filepath)}</span>
                                      </span>
                                      <svg className={styles.resultChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
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
                  {recentSearches.recents.map(r => (
                    <div
                      key={r.filepath}
                      className={styles.result}
                      role="option"
                      onClick={() => r.isAi ? askAi(r.query) : navigate(r)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.resultIconWrap} aria-hidden="true">
                        {r.isAi ? (
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
                          </svg>
                        )}
                      </span>
                      <span className={styles.resultContent}>
                        <span className={styles.resultTitle}>{r.query}</span>
                        <span className={styles.resultPath}>{r.isAi ? 'AI Answer' : (r.title || filepathToBreadcrumb(r.filepath))}</span>
                      </span>
                      <button
                        className={styles.recentRemove}
                        aria-label={`Remove "${r.query}" from recent searches`}
                        onClick={e => { e.stopPropagation(); recentSearches.remove(r.filepath); }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* ── Search results ── */}
                  <div className={styles.resultsList}>
                    {results.length === 0 && query ? (
                      <div className={styles.empty}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <circle cx="9" cy="9" r="6" /><path d="M15 15l3 3" strokeLinecap="round" />
                        </svg>
                        <span>No results for &ldquo;{query}&rdquo;</span>
                      </div>
                    ) : (() => {
                      let lastCategory = null;
                      return results.map((result, i) => {
                        const showHeader = result.category && result.category !== lastCategory;
                        lastCategory = result.category;
                        const breadcrumb = filepathToBreadcrumb(result.filepath);
                        return (
                          <React.Fragment key={result.id}>
                            {showHeader && (
                              <div className={styles.groupHeader} aria-hidden="true">
                                {result.category}
                              </div>
                            )}
                            <button
                              role="option"
                              aria-selected={i === activeIndex}
                              className={`${styles.result} ${i === activeIndex ? styles.active : ''}`}
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => navigate(result)}
                            >
                              <span className={styles.resultIconWrap} aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                  <polyline points="10 9 9 9 8 9" />
                                </svg>
                              </span>
                              <span className={styles.resultContent}>
                                <span className={styles.resultTitle}>{result.title}</span>
                                {breadcrumb && <span className={styles.resultPath}>{breadcrumb}</span>}
                              </span>
                              <svg className={styles.resultChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          </React.Fragment>
                        );
                      });
                    })()}
                  </div>

                  {/* ── Ask AI row ── */}
                  {aiEnabled && query && (
                    <div className={styles.askAiSection}>
                      <button
                        role="option"
                        aria-selected={activeIndex === askAiIndex}
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