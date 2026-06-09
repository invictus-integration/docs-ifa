import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCircleQuestion, faFileCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation, useHistory } from "@docusaurus/router";
import highlightStyles from "./highlight.module.css";
import rowStyles from "./resultRow.module.css";

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

export default function Faq({
  data,
  maxHeight = "300px",
  showSearch = true,
  unconstrained = false,
}: {
  data: FaqEntry[];
  maxHeight?: string;
  /** Hide the search input — URL ?q= param still applies the filter. Default: true. */
  showSearch?: boolean;
  /** Remove the max-height scroll cap — for full-page layouts. Default: false. */
  unconstrained?: boolean;
}) {
  const { siteConfig } = useDocusaurusContext();
  const reducedMotion = usePrefersReducedMotion();
  const location = useLocation();
  const history = useHistory();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [search, setSearch] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") ?? "";
  });
  const normalizedSearch = search.toLowerCase();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const noTransition: React.CSSProperties = reducedMotion ? { transition: "none" } : {};

  // Sync search state when the URL changes without a full remount (SPA navigation).
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") ?? "";
    setSearch(prev => prev !== q ? q : prev);
  }, [location.search]);

  // Only auto-focus the search when it exists in the layout
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
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

  // When arriving with a pre-filled ?q= (e.g. from global search), automatically open
  // the first matching item. Tracks the last opened query so it re-fires on new searches.
  const lastAutoOpenedQuery = useRef("");
  useEffect(() => {
    if (search && search !== lastAutoOpenedQuery.current && filtered.length > 0) {
      lastAutoOpenedQuery.current = search;
      setOpenIndex(0);
    }
    if (!search) lastAutoOpenedQuery.current = "";
  }, [filtered, search]);

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

      {/* Tag filter buttons */}
      {<div className={rowStyles.tagWrapper} role="group" aria-label="Filter by tag">
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

      {/* FAQ list / empty state */}
      {<div id="faq">
        {filtered.length > 0 ? (
          <>
            <div id="faq-results-list" data-cy="faq-list" role="list" className={rowStyles.rowList} style={unconstrained ? faqListWrapperStyle : { ...faqListWrapperStyle, maxHeight: `min(${maxHeight}, 50dvh)` }}>
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
            </div>
          </>
        ) : (
          search && (
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
                  <a
                    href={newDiscussionUrl(search)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowStyles.emptyActionLink}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true" width="16" height="16" fill="currentColor">
                      <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z" />
                    </svg>
                    Open a GitHub discussion
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

const faqListWrapperStyle: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "300px",
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