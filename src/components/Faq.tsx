import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export type FaqEntry = {
  question: string;
  answer: string;
  tags: string[];
  version?: string;
};

export default function Faq({ data, maxHeight = "600px" }: { data: FaqEntry[]; maxHeight?: string }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.toLowerCase();

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
        const inAnswer = item.answer.replace(/<[^>]*>/g, "").toLowerCase().includes(normalizedSearch);
        return inQuestion || inAnswer;
      })
      : byTags;

    return [...bySearch].sort((a, b) => parseVersion(b.version) - parseVersion(a.version));
  }, [data, activeTags, search]);

  const highlightText = (text: string) => {
    if (!normalizedSearch) return text;
    const escaped = normalizedSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === normalizedSearch ? (
        <mark key={i} style={highlightStyle}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const highlightHtml = (html: string): string => {
    if (!normalizedSearch) return html;
    const escaped = normalizedSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Replace matches in text nodes only — skip content inside HTML tags
    return html.replace(
      new RegExp(`(<[^>]*>)|(${escaped})`, "gi"),
      (match, tag, text) =>
        tag ? tag : `<mark style="background-color:var(--ifm-color-primary);color:white">${text}</mark>`
    );
  };

  return (
    <div style={containerStyle}>

      {/* Search input */}
      <div style={searchWrapperStyle}>
        <span style={searchIconStyle}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          placeholder="Search questions and answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length === 0 && search) {
              window.open(newDiscussionUrl(search), "_blank", "noopener,noreferrer");
            }
          }}
          style={searchInputStyle}
          aria-label="Search FAQ questions and answers"
          onFocus={(e) => (e.currentTarget.style.boxShadow = focusBoxShadowStyle)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = defaultBoxShadowStyle)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={clearButtonStyle}
            aria-label="Clear search input"
          >
            &times;
          </button>
        )}
      </div>

      {/* Tag filter buttons */}
      <div style={tagWrapperStyle} role="group" aria-label="Filter by tag">
        {allTags
          .map((tag) => {
            const isActive = activeTags.includes(tag);
            const [hover, setHover] = useState(false);

            const style: React.CSSProperties = {
              ...tagButtonStyle,
              ...(isActive ? tagButtonActiveStyle : {}),
              ...(hover
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
                onClick={() => toggleTag(tag)}
                aria-pressed={isActive}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={style}
              >
                {tag}
              </button>
            );
          })}
      </div>

      {/* Results count */}
      <div style={resultCountStyle} aria-live="polite" aria-atomic="true">
        Showing {filtered.length} question
        {filtered.length !== 1 ? "s" : ""}
      </div>

      {/* FAQ list / empty state */}
      <div style={{ ...faqListWrapperStyle, maxHeight }}>
        {filtered.length > 0 ? (
          <div style={faqListStyle}>
            {filtered.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  style={{
                    ...faqItemStyle,
                    ...(isOpen ? faqItemOpenStyle : {}),
                    ...((hoveredIndex === index || focusedIndex === index) && !isOpen ? faqItemHoverStyle : {}),
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    style={{
                      ...questionHeaderStyle,
                      ...(hoveredIndex === index && !isOpen ? questionHeaderHoverStyle : {}),
                      ...(focusedIndex === index ? questionHeaderFocusStyle : {}),
                    }}
                    onClick={() => toggleOpen(index)}
                    aria-expanded={isOpen}
                    aria-label={item.question}
                    onFocus={() => {
                      setFocusedIndex(index);
                    }}
                    onBlur={() => {
                      setFocusedIndex(null);
                    }}
                  >
                    <div style={questionStyle}>
                      <div style={questionRowStyle}>
                        <FontAwesomeIcon
                          icon={isOpen ? faChevronDown : faChevronRight}
                          style={iconStyle}
                          aria-hidden={true}
                        />
                        <span>{highlightText(item.question)}</span>
                      </div>

                      {item.version && (
                        <span style={versionStyle} aria-label={`Applies to version ${item.version}`}>
                          {item.version}
                        </span>
                      )}
                    </div>

                    <div
                      style={tagContainerStyle}
                      aria-label={`Tags: ${item.tags?.join(", ")}`}
                    >
                      {item.tags?.map((tag) => (
                        <span key={tag} style={tagBadgeStyle} aria-hidden={true}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>

                  <div aria-live="polite">
                    {isOpen && (
                      <div
                        role="region"
                        aria-label={`Answer: ${item.question}`}
                        style={answerStyle}
                        dangerouslySetInnerHTML={{ __html: highlightHtml(item.answer) }}
                      />
                    )}
                  </div>
                </div>
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

const searchWrapperStyle: React.CSSProperties = { marginBottom: "1rem", position: "relative" };

const searchInputStyle: React.CSSProperties = {
  padding: "0.5rem 2.5rem 0.5rem 2.2rem",
  width: "100%",
  borderRadius: "0.5rem",
  border: "2px solid var(--ifm-color-primary)",
  background: "var(--ifm-navbar-search-input-background-color)",
  color: "var(--ifm-color-gray-900)",
  fontSize: "1rem",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--ifm-color-primary)",
  pointerEvents: "none",
};

const clearButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.5rem",
  color: "var(--ifm-color-primary)",
};

const focusBoxShadowStyle = "0 0 0 3px var(--ifm-color-primary)";
const defaultBoxShadowStyle = "0 2px 6px rgba(0,0,0,0.1)";

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
  borderRadius: "8px",
  padding: "0.75rem",
};

const faqListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const faqItemStyle: React.CSSProperties = {
  border: "1px solid var(--ifm-color-emphasis-300)",
  borderRadius: "8px",
  overflow: "hidden",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  backgroundColor: "var(--ifm-background-surface-color)",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
};

const faqItemOpenStyle: React.CSSProperties = {
  borderColor: "var(--ifm-color-primary)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
};

const faqItemHoverStyle: React.CSSProperties = {
  borderColor: "var(--ifm-color-primary-light)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const questionHeaderStyle: React.CSSProperties = {
  width: "100%",
  display: "block",
  textAlign: "left",
  padding: 0,
  border: "none",
  cursor: "pointer",
  background: "var(--ifm-color-emphasis-200)",
  transition: "background 0.15s ease",
  outline: "2px solid transparent",
  outlineOffset: "-2px",
};

const questionHeaderHoverStyle: React.CSSProperties = {
  background: "var(--ifm-color-emphasis-300)",
};

const questionHeaderFocusStyle: React.CSSProperties = {
  outline: "2px solid var(--ifm-color-primary)",
  outlineOffset: "-2px",
};

const questionStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 600,
  fontSize: "1rem",
  color: "var(--ifm-font-color-base)",
};

const questionRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flex: 1,
  minWidth: 0,
};

const iconStyle: React.CSSProperties = {
  color: "var(--ifm-color-primary)",
};

const versionStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  opacity: 0.6,
  flexShrink: 0,
  whiteSpace: "nowrap",
  marginLeft: "0.75rem",
};

const answerStyle: React.CSSProperties = {
  padding: "1rem 1.25rem 0.5rem 1.25rem",
  lineHeight: 1.6,
  borderTop: "1px solid var(--ifm-form-border-color)",
};

const tagContainerStyle: React.CSSProperties = {
  padding: "0 1.25rem 0.75rem 1.25rem",
};

const tagBadgeStyle: React.CSSProperties = {
  marginRight: "6px",
  fontSize: "0.75rem",
  backgroundColor: "var(--ifm-color-emphasis-200)",
  padding: "2px 6px",
  borderRadius: "4px",
};

const highlightStyle: React.CSSProperties = {
  backgroundColor: "var(--ifm-color-primary)",
  color: "white",
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