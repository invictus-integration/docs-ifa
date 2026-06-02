import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCircleQuestion, faMagnifyingGlass, faXmark, faFileCircleXmark, faChevronLeft, faFileLines } from "@fortawesome/free-solid-svg-icons";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import highlightStyles from "./highlight.module.css";
import inputStyles from "./tableSearchInput.module.css";
import rowStyles from "./resultRow.module.css";
import { streamAiResponse } from "./streamAiResponse";

export type FaqEntry = {
  question: string;
  answer: string;
  tags: string[];
  version?: string;
};

const rehypeHighlightSearch = (search: string) => (tree: any) => {
  if (!search) return;
  const escaped = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  const visit = (node: any) => {
    if (!node.children) return;
    const newChildren: any[] = [];
    for (const child of node.children) {
      if (child.type === "text") {
        const parts = child.value.split(regex).filter(Boolean);
        if (parts.length > 1) {
          for (const part of parts) {
            if (part.toLowerCase() === search) {
              newChildren.push({
                type: "element",
                tagName: "mark",
                properties: { className: [highlightStyles.mark] },
                children: [{ type: "text", value: part }],
              });
            } else {
              newChildren.push({ type: "text", value: part });
            }
          }
        } else {
          newChildren.push(child);
        }
      } else {
        visit(child);
        newChildren.push(child);
      }
    }
    node.children = newChildren;
  };

  visit(tree);
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
};

export default function Faq({ data, maxHeight = "300px" }: { data: FaqEntry[]; maxHeight?: string }) {
  const { siteConfig } = useDocusaurusContext();
  const aiEnabled = !!(siteConfig.customFields?.aiEnabled);
  const reducedMotion = usePrefersReducedMotion();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.toLowerCase();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const noTransition: React.CSSProperties = reducedMotion ? { transition: "none" } : {};

  // AI state
  const [aiActive, setAiActive] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiCitations, setAiCitations] = useState<any[]>([]);
  const [aiError, setAiError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)) {
      setIsMac(true);
    }
  }, []);

  function askAi() {
    if (!search.trim() || !aiEnabled) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAiActive(true);
    setAiAnswer("");
    setAiCitations([]);
    setAiError("");
    setIsStreaming(true);
    streamAiResponse({
      question: search,
      signal: controller.signal,
      onChunk: (chunk: string) => setAiAnswer((prev) => prev + chunk),
      onCitations: (citations: any[]) => setAiCitations(citations),
      onDone: () => setIsStreaming(false),
      onError: (err: any) => {
        if (err?.name !== "AbortError" && err?.message !== "BodyStreamBuffer was aborted") {
          setAiError(err.message ?? "Something went wrong.");
        }
        setIsStreaming(false);
      },
    });
  }

  function dismissAi() {
    abortRef.current?.abort();
    setAiActive(false);
  }

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!search) dismissAi();
    setActiveIndex(-1);
  }, [search]);

  useEffect(() => {
    if (activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    data.forEach((item) => item.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [data]);

  const parseVersion = (version?: string): number => {
    if (!version) return -1;
    const match = version.match(/v(\d+)\.(\d+)/);
    if (!match) return -1;
    return parseInt(match[1]) * 100 + parseInt(match[2]);
  };

  const filtered = useMemo(() => {
    const byTags = activeTags.length === 0
      ? data
      : data.filter((item) => activeTags.every((tag) => item.tags?.includes(tag)));

    const bySearch = normalizedSearch
      ? byTags.filter((item) => {
        const inQuestion = item.question.toLowerCase().includes(normalizedSearch);
        const inAnswer = item.answer.toLowerCase().includes(normalizedSearch);
        return inQuestion || inAnswer;
      })
      : byTags;

    return [...bySearch].sort((a, b) => parseVersion(b.version) - parseVersion(a.version));
  }, [data, activeTags, search]);

  const answerOnlyMatchIndexes = useMemo(() => {
    if (!normalizedSearch) return new Set<number>();
    return new Set(
      filtered
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
          !item.question.toLowerCase().includes(normalizedSearch) &&
          item.answer.toLowerCase().includes(normalizedSearch)
        )
        .map(({ index }) => index)
    );
  }, [filtered, normalizedSearch]);

  useEffect(() => {
    setOpenIndex(null);
  }, [search]);

  const highlightText = (text: string) => {
    if (!normalizedSearch) return <>{text}</>;
    const escaped = normalizedSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === normalizedSearch ? (
            <mark key={i} className={highlightStyles.mark}>{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderQuestion = (text: string) => {
    const segments = text.split(/(`[^`]+`)/g);
    return segments.map((segment, i) =>
      segment.startsWith("`") && segment.endsWith("`") ? (
        <code key={i}>{highlightText(segment.slice(1, -1))}</code>
      ) : (
        <React.Fragment key={i}>{highlightText(segment)}</React.Fragment>
      )
    );
  };

  return (
    <div style={containerStyle}>

      {/* Visually hidden description for screen readers — announced when focus lands on the search input */}
      <span
        id="faq-search-description"
        style={srOnlyStyle}
      >
        Frequently asked questions. If you cannot find an answer, you can{" "}
        <a href={`${GITHUB_REPO}/discussions/new?category=q-a`} target="_blank" rel="noopener noreferrer">
          create a support ticket on GitHub
        </a>.
      </span>

      {/* Search input */}
      <div className={inputStyles.wrapper}>
        <span className={inputStyles.icon} aria-hidden={true}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          data-cy="search-input"
          type="text"
          placeholder="Search questions and answers..."
          value={search}
          ref={searchInputRef}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setSearch(""); return; }
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && aiEnabled && search.trim()) {
              askAi(); return;
            }
            if (e.key === "ArrowDown" && filtered.length > 0) {
              e.preventDefault();
              setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
              return;
            }
            if (e.key === "ArrowUp" && activeIndex >= 0) {
              e.preventDefault();
              setActiveIndex(i => i <= 0 ? -1 : i - 1);
              if (activeIndex === 0) searchInputRef.current?.focus();
              return;
            }
            if (e.key === "Enter" && filtered.length === 0 && search) {
              window.open(newDiscussionUrl(search), "_blank", "noopener,noreferrer");
            }
          }}
          className={inputStyles.input}
          aria-label="Search FAQ questions and answers"
          aria-describedby="faq-search-description"
          aria-controls="faq-results-list"
          aria-expanded={!aiActive && filtered.length > 0}
          aria-autocomplete="list"
        />
        {search ? (
          <span className={inputStyles.rightSlot}>
            <button
              onClick={() => { setSearch(""); searchInputRef.current?.focus(); }}
              className={inputStyles.clear}
              aria-label="Clear search input"
            >
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
            <button
              onClick={() => { setSearch(""); searchInputRef.current?.blur(); }}
              className={inputStyles.escBadge}
              aria-label="Clear and dismiss"
            >
              <kbd>Esc</kbd>
            </button>
          </span>
        ) : (
          <span className={inputStyles.shortcut}>Press <kbd>/</kbd> to filter</span>
        )}
      </div>

      {/* Tag filter buttons */}
      {!aiActive && <div className={rowStyles.tagWrapper} role="group" aria-label="Filter by tag">
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              data-cy={tag}
              onClick={() => toggleTag(tag)}
              aria-pressed={isActive}
              className={`${rowStyles.tagButton} ${isActive ? rowStyles.tagButtonActive : ""}`}
            >
              {tag}
            </button>
          );
        })}
      </div>}

      {/* AI answer panel */}
      {aiActive && (
        <div
          role="region"
          aria-label="AI Answer"
          aria-live="polite"
          aria-busy={isStreaming}
          className={rowStyles.aiPanel}
        >
          <div className={rowStyles.aiHeader}>
            <button className={rowStyles.aiBack} onClick={dismissAi} aria-label="Back to results">
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              Back to results
            </button>
            <span className={rowStyles.aiLabel}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
              </svg>
              AI Answer
              {isStreaming && <span className={rowStyles.streamingDot} aria-hidden="true" />}
            </span>
          </div>

          <p className={rowStyles.aiQuestion}>&ldquo;{search}&rdquo;</p>

          {aiError
            ? <p className={rowStyles.aiError}>{aiError}</p>
            : aiAnswer
              ? (
                <>
                  <div className={rowStyles.aiAnswer}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {aiAnswer.replace(/\[doc\d+\]/g, '')}
                    </ReactMarkdown>
                  </div>
                  {aiCitations.length > 0 && (
                    <div className={rowStyles.aiSources}>
                      <p className={rowStyles.aiSourcesLabel}>Related pages</p>
                      <ul className={rowStyles.aiSourcesList}>
                        {aiCitations.map((c: any, i: number) => {
                          const segments = c.filepath
                            ?.replace(/\.mdx?$/, '')
                            .split('/')
                            .map((s: string) => s.replace(/^\d+_/, '').replace(/-/g, ' '))
                            .filter((s: string) => s && s !== 'index')
                            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1));
                          const breadcrumb = segments?.join(' › ');
                          const title = c.title || segments?.[segments.length - 1] || c.filepath;
                          const url = `/${c.filepath?.replace(/\.mdx?$/, '').split('/').map((s: string) => s.replace(/^\d+_/, '')).filter(Boolean).join('/')}`;
                          return (
                            <li key={i}>
                              <a href={url} className={rowStyles.aiSourceLink} target="_blank" rel="noopener noreferrer">
                                <span className={rowStyles.aiSourceIconWrap} aria-hidden="true">
                                  <FontAwesomeIcon icon={faFileLines} />
                                </span>
                                <span className={rowStyles.aiSourceContent}>
                                  <span className={rowStyles.aiSourceTitle}>{title}</span>
                                  {breadcrumb && <span className={rowStyles.aiSourcePath}>{breadcrumb}</span>}
                                </span>
                                <FontAwesomeIcon icon={faChevronRight} className={rowStyles.aiSourceChevron} aria-hidden="true" />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {!isStreaming && (
                    <p className={rowStyles.aiDisclaimer}>
                      AI answers may be inaccurate — always verify against the documentation.
                    </p>
                  )}
                </>
              )
              : <p className={rowStyles.aiPlaceholder}>Thinking…</p>
          }
        </div>
      )}

      {/* Results count */}
      {!aiActive && filtered.length > 0 && (
        <div data-cy="search-results-summary" style={resultCountStyle} aria-live="polite" aria-atomic="true">
          Showing {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* FAQ list / empty state */}
      {!aiActive && <div>
        {filtered.length > 0 ? (
          <>
            <div id="faq-results-list" data-cy="faq-list" role="list" className={rowStyles.rowList} style={{ ...faqListWrapperStyle, maxHeight: `min(${maxHeight}, 50dvh)` }}>
            {filtered.map((item, index) => {
              const isOpen = openIndex === index || answerOnlyMatchIndexes.has(index);
              const isActive = activeIndex === index;

              return (
                <div key={index} role="listitem" data-cy="faq-item" data-tags={item.tags?.join(',') ?? ''}>
                  <button
                    ref={el => { itemRefs.current[index] = el; }}
                    className={`${rowStyles.row} ${isOpen ? rowStyles.rowActive : ""} ${isActive ? rowStyles.rowFocused : ""}`}
                    style={noTransition}
                    onClick={() => toggleOpen(index)}
                    aria-expanded={isOpen}
                    aria-label={item.question}
                    aria-setsize={filtered.length}
                    aria-posinset={index + 1}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)); }
                      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => { if (i <= 0) { searchInputRef.current?.focus(); return -1; } return i - 1; }); }
                      else if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && aiEnabled && search.trim()) { e.preventDefault(); askAi(); }
                    }}
                  >
                    {/* Left icon wrap */}
                    <span className={rowStyles.iconWrap} aria-hidden={true}>
                      <FontAwesomeIcon icon={faCircleQuestion} />
                    </span>

                    {/* Middle: question + version */}
                    <span className={rowStyles.rowContent}>
                      <span className={rowStyles.rowTitle}>
                        {renderQuestion(item.question)}
                      </span>
                      {item.version && (
                        <span className={rowStyles.badgeRow}>
                          <span className={rowStyles.versionBadge} aria-label={`Applies to version ${item.version}`}>
                            {item.version}
                          </span>
                        </span>
                      )}
                    </span>

                    {/* Right: expand chevron */}
                    <span className={rowStyles.chevron} aria-hidden={true}>
                      <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      data-cy="faq-answer"
                      aria-label={`Answer: ${item.question}`}
                      className={`${rowStyles.answerPanel} ${rowStyles.answerPanelOpen}`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeHighlightSearch, normalizedSearch]]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                              {props.children}
                              <span style={srOnlyStyle}>(opens in new tab)</span>
                            </a>
                          ),
                        }}
                      >
                        {item.answer}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={rowStyles.faqFooter}>
            <span className={rowStyles.footerHint} aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span className={rowStyles.footerHint} aria-hidden="true"><kbd>↵</kbd> open</span>
            <span className={rowStyles.footerHint} aria-hidden="true"><kbd>Esc</kbd> clear</span>
            {aiEnabled && search.trim() && (
              <button className={rowStyles.footerAskAi} onClick={askAi} aria-label={`Ask AI: ${search}`}>
                <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                </svg>
                Ask AI <kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>↵</kbd>
              </button>
            )}
          </div>
        </>
        ) : (
          search && !aiActive && (
            <div className={rowStyles.empty} role="status">
              <FontAwesomeIcon icon={faFileCircleXmark} aria-hidden="true" />
              <div className={rowStyles.emptyText}>
                <span className={rowStyles.emptyTitle}>
                  No questions match <strong>"{search}"</strong>
                </span>
                <span className={rowStyles.emptyHint}>
                  Can't find what you're looking for?
                </span>
                <div className={rowStyles.emptyActions}>
                  {aiEnabled && (
                    <button className={rowStyles.emptyActionButton} onClick={askAi}>
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                      </svg>
                      Ask AI <kbd>{isMac ? "⌘" : "Ctrl"}↵</kbd>
                    </button>
                  )}
                  <a
                    href={newDiscussionUrl(search)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowStyles.emptyActionLink}
                  >
                    Open a GitHub discussion <kbd>Enter</kbd>
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      </div>}
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = { marginTop: "1rem" };

const resultCountStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  opacity: 0.7,
};

const faqListWrapperStyle: React.CSSProperties = {
  overflowY: "auto",
};

const linkStyle: React.CSSProperties = { color: "var(--ifm-color-primary)" };

const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

const GITHUB_REPO = "https://github.com/invictus-integration/docs-ifa";
const newDiscussionUrl = (title: string) =>
  `${GITHUB_REPO}/discussions/new?category=q-a&title=${encodeURIComponent(title)}`;