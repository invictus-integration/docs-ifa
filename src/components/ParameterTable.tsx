import React, { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export type Parameter = {
  name: string;
  tags: string[];
  description?: string;
  properties?: Parameter[];
  required?: boolean;
  default?: any;
  deprecatedSince?: string;
  newSince?: string;
};

type ParameterTableProps = {
  parameters: Parameter[];
  maxHeight?: string;
};

export default function ParameterTable({ parameters, maxHeight = "400px" }: ParameterTableProps) {
  parameters = parameters.sort((p1, p2) => p1.name.localeCompare(p2.name));
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (name: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      return newSet;
    });
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    const collectTags = (params: Parameter[]) => {
      params.forEach((p) => {
        p.tags?.forEach((tag) => tagSet.add(tag));
        if (p.properties) collectTags(p.properties);
      });
    };
    collectTags(parameters);
    return Array.from(tagSet).sort();
  }, [parameters]);

  const [search, setSearch] = useState("");
  const normalizedSearch = search.toLowerCase();
  const matchesSearchRecursive = (p: Parameter): boolean => {
    if (!normalizedSearch) return true;

    const selfMatch = p.name.toLowerCase().includes(normalizedSearch);

    const childMatch =
      p.properties?.some((sub) => matchesSearchRecursive(sub)) ?? false;

    return selfMatch || childMatch;
  };

  const matchesTags = (p: Parameter) =>
    activeTags.length === 0 || activeTags.every((tag) => p.tags.includes(tag));

  const filtered = useMemo(() => {
    return parameters.filter(
      (p) => matchesSearchRecursive(p) && matchesTags(p)
    );
  }, [parameters, search, activeTags]);

  useEffect(() => {
    if (!search) return;

    const newExpanded = new Set<string>();

    const expandMatching = (p: Parameter): boolean => {
      const selfMatch = p.name.toLowerCase().includes(normalizedSearch);
      let childMatched = false;

      if (p.properties) {
        for (const sub of p.properties) {
          const matched = expandMatching(sub);
          if (matched) {
            childMatched = true;
            newExpanded.add(p.name);
          }
        }
      }

      return selfMatch || childMatched;
    };

    parameters.forEach((p) => expandMatching(p));

    setExpandedRows(newExpanded);
  }, [search, parameters]);

  const highlightText = (text: string, search: string) => {
    if (!search) return text;

    const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} style={highlightStyle}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const renderRow = (p: Parameter, depth = 0) => {
    const isExpanded = expandedRows.has(p.name);

    return (
      <React.Fragment key={`${p.name}-${depth}`}>
        <tr
          tabIndex={0}
          style={{ ...getRowStyle(depth, p.properties?.length) }}
          onClick={() => p.properties?.length && toggleRow(p.name)}
          onKeyDown={(e) => {
            if (p.properties?.length && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              toggleRow(p.name);
            }
          }}
          aria-expanded={p.properties?.length ? isExpanded : undefined}
          aria-label={p.properties?.length ? `${p.name} expandable` : p.name}
          onFocus={(e) => (e.currentTarget.style.outline = focusOutlineStyle.outline)}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >
          <td style={{ ...tdStyle, paddingLeft: `${0.5 + depth * 2}rem` }}>
            <div style={nameContainerStyle}>
              <div style={nameRowStyle}>
                {p.properties?.length && (
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronDown : faChevronRight}
                    style={arrowIconStyle}
                  />
                )}
                <code id={p.name} style={codeStyle}>
                  {highlightText(p.name, search)}
                </code>
              </div>

              {(p.required || p.default !== undefined || p.newSince) && (
                <div style={badgesContainerStyle}>
                  {p.required && (
                    <span style={requiredBadgeStyle}>required</span>
                  )}
                  {p.default !== undefined && (
                    <span style={defaultBadgeStyle}>
                      default: <code>{p.default.toString()}</code>
                    </span>
                  )}
                  {p.newSince && (
                    <span style={sinceBadgeStyle}>
                      new since {p.newSince}
                    </span>
                  )}
                </div>
              )}

              {p.deprecatedSince && (
                <div style={badgesContainerStyle}>
                  <span style={deprecatedBadgeStyle}>
                    deprecated since: {p.deprecatedSince}
                  </span>
                </div>
              )}
            </div>
          </td>

          <td style={tdStyle}>
            {p.description && (
              <ReactMarkdown
                children={p.description}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" style={linkStyle} />
                  ),
                }}
              />
            )}
          </td>

          <td style={tdStyle}>
            {p.tags?.map((tag) => (
              <span key={tag} style={tagBadgeStyle}>{tag}</span>
            ))}
          </td>
        </tr>

        {isExpanded && p.properties?.map((sub) => renderRow(sub, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={searchWrapperStyle}>
        <span style={searchIconStyle}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          data-cy="search-input"
          type="text"
          placeholder="Search Bicep parameters by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
          aria-label="Search parameters by name"
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

      <div style={tagWrapperStyle}>
        {allTags.map((tag) => (
          <button
            data-cy={tag}
            key={tag}
            onClick={() => toggleTag(tag)}
            aria-pressed={activeTags.includes(tag)}
            style={{
              ...tagButtonStyle,
              ...(activeTags.includes(tag) ? tagButtonActiveStyle : {}),
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div data-cy="search-results-summary" style={resultCountStyle}>
        Showing {filtered.length} parameter{filtered.length !== 1 ? "s" : ""}
      </div>

      <div style={{ ...tableWrapperStyle, maxHeight }}>
        <table data-cy="search-results" style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Tags</th>
            </tr>
          </thead>
          <tbody>{filtered.map((p) => renderRow(p))}</tbody>
        </table>
      </div>
    </div>
  );
}

const getRowStyle = (depth: number, hasChildren?: boolean) => ({
  cursor: hasChildren ? "pointer" : "default",
  outline: "none",
  backgroundColor: depth > 0 ? "var(--ifm-color-emphasis-200)" : "inherit",
  borderLeft: depth > 0 ? "4px solid var(--ifm-color-primary)" : undefined,
  transition: "background-color 0.2s ease",
});

const containerStyle: React.CSSProperties = { marginTop: "1rem" };
const searchWrapperStyle: React.CSSProperties = { marginBottom: "1rem", position: "relative" };
const tagWrapperStyle: React.CSSProperties = { marginBottom: "1rem" };
const tableWrapperStyle: React.CSSProperties = {
  overflowY: "auto",
  border: `1px solid var(--ifm-form-border-color)`,
  borderRadius: "6px",
  overflow: "auto"
};
const resultCountStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  opacity: 0.7,
  color: "var(--ifm-font-color-base)",
};

const searchInputStyle: React.CSSProperties = {
  padding: "0.5rem 2.5rem 0.5rem 2.2rem",
  width: "100%",
  borderRadius: "0.5rem",
  border: `2px solid var(--ifm-color-primary)`,
  background: "var(--ifm-navbar-search-input-background-color)",
  color: "var(--ifm-font-color-base)",
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
const focusOutlineStyle = { outline: "2px solid var(--ifm-color-primary)" };

const thStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  backgroundColor: "var(--ifm-background-color)",
  zIndex: 5,
  textAlign: "left",
  borderBottom: "1px solid var(--ifm-form-border-color)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid var(--ifm-form-border-color)",
  color: "var(--ifm-font-color-base)",
};

const nameContainerStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const nameRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.5rem" };
const codeStyle: React.CSSProperties = { color: "var(--ifm-color-primary)" };
const arrowIconStyle: React.CSSProperties = { color: "var(--ifm-color-primary)" };
const badgesContainerStyle: React.CSSProperties = { marginTop: "2px", display: "flex", gap: "4px", flexWrap: "wrap" };

const requiredBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  backgroundColor: "var(--ifm-color-danger)",
  color: "white",
  borderRadius: "3px",
};

const deprecatedBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  backgroundColor: "#b55d00",
  color: "white",
  borderRadius: "3px",
};

const sinceBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  backgroundColor: "#008800",
  color: "white",
  borderRadius: "3px",
};

const defaultBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  backgroundColor: "var(--ifm-color-emphasis-200)",
  borderRadius: "3px",
};

const tagBadgeStyle: React.CSSProperties = {
  marginRight: "6px",
  fontSize: "0.75rem",
  backgroundColor: "var(--ifm-color-emphasis-200)",
  padding: "2px 6px",
  borderRadius: "4px",
};

const tagButtonStyle: React.CSSProperties = {
  margin: "0.25rem",
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid var(--ifm-form-border-color)",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const tagButtonActiveStyle: React.CSSProperties = {
  border: "2px solid var(--ifm-color-primary)",
  backgroundColor: "var(--ifm-color-primary)",
  color: "white",
};

const linkStyle: React.CSSProperties = { color: "var(--ifm-color-primary)" };

const highlightStyle: React.CSSProperties = {
  backgroundColor: "var(--ifm-color-primary)",
  color: "white",
};
