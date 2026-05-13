import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCircleQuestion, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import highlightStyles from "./highlight.module.css";
import inputStyles from "./tableSearchInput.module.css";
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

export default function Faq({ data, maxHeight = "600px" }: { data: FaqEntry[]; maxHeight?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.toLowerCase();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const noTransition: React.CSSProperties = reducedMotion ? { transition: "none" } : {};

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

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
            if (e.key === "Enter" && filtered.length === 0 && search) {
              window.open(newDiscussionUrl(search), "_blank", "noopener,noreferrer");
            }
          }}
          className={inputStyles.input}
          aria-label="Search FAQ questions and answers"
          aria-describedby="faq-search-description"
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
      <div style={tagWrapperStyle} role="group" aria-label="Filter by tag">
        {allTags
          .map((tag) => {
            const isActive = activeTags.includes(tag);
            const isHovered = hoveredTag === tag;

            const style: React.CSSProperties = {
              ...tagButtonStyle,
              ...noTransition,
              ...(isActive ? tagButtonActiveStyle : {}),
              ...(isHovered
                ? {
                  backgroundColor: isActive
                    ? "var(--ifm-color-primary-darkest)"
                    : "var(--ifm-color-emphasis-300)",
                }
                : {}),
            };

            return (
              <button
                key={tag}
                data-cy={tag}
                onClick={() => toggleTag(tag)}
                aria-pressed={isActive}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag(null)}
                style={style}
              >
                {tag}
              </button>
            );
          })}
      </div>

      {/* Results count */}
      <div data-cy="search-results-summary" style={resultCountStyle} aria-live="polite" aria-atomic="true">
        Showing {filtered.length} question
        {filtered.length !== 1 ? "s" : ""}
      </div>

      {/* FAQ list / empty state */}
      <div style={{ ...faqListWrapperStyle, maxHeight }}>
        {filtered.length > 0 ? (
          <div data-cy="faq-list" className={rowStyles.rowList}>
            {filtered.map((item, index) => {
              const isOpen = openIndex === index || answerOnlyMatchIndexes.has(index);

              return (
                <React.Fragment key={index}>
                  <button
                    data-cy="faq-item"
                    className={`${rowStyles.row} ${isOpen ? rowStyles.rowActive : ""}`}
                    style={noTransition}
                    onClick={() => toggleOpen(index)}
                    aria-expanded={isOpen}
                    aria-label={item.question}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
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
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          search && (
            <div style={emptyStateStyle} role="status">
              <p style={emptyStateTitleStyle}>No results found for <strong>"{search}"</strong>.</p>
              <p style={emptyStateSubtitleStyle}>
                Can't find what you're looking for? Press{" "}
                <kbd style={kbdStyle}>Enter</kbd>{" "}
                to open a new support ticket on GitHub with this question.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = { marginTop: "1rem" };

const tagWrapperStyle: React.CSSProperties = { marginBottom: "1rem" };

const tagButtonStyle: React.CSSProperties = {
  margin: "0.25rem",
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid var(--ifm-form-border-color)",
  cursor: "pointer",
  fontSize: "0.85rem",
  transition: "all 0.15s ease",
};

const tagButtonActiveStyle: React.CSSProperties = {
  border: "2px solid var(--ifm-color-primary)",
  backgroundColor: "var(--ifm-color-primary)",
  color: "white",
};

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

const emptyStateStyle: React.CSSProperties = {
  padding: "1.5rem",
  textAlign: "center",
  color: "var(--ifm-font-color-base)",
};

const emptyStateTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  marginBottom: "0.5rem",
};

const emptyStateSubtitleStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  opacity: 0.75,
  margin: 0,
};

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 6px",
  fontSize: "0.8rem",
  border: "1px solid var(--ifm-color-emphasis-400)",
  borderRadius: "4px",
  backgroundColor: "var(--ifm-color-emphasis-200)",
};