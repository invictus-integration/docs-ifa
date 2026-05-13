import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronDown, faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useHistory } from "@docusaurus/router";
import highlightStyles from "./highlight.module.css";
import inputStyles from "./tableSearchInput.module.css";
import rowStyles from "./resultRow.module.css";

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
  fixedTags?: string[];
  maxHeight?: string;
};

const EMPTY_TAGS: string[] = [];

export default function ParameterTable({ parameters: rawParameters, fixedTags = EMPTY_TAGS, maxHeight = "400px" }: ParameterTableProps) {
  const parameters = useMemo(
    () => rawParameters.filter((p) => fixedTags.every((tag: string) => p.tags.includes(tag))).sort((p1, p2) => p1.name.localeCompare(p2.name)),
    [rawParameters, fixedTags]
  );

  const location = useLocation();
  const history = useHistory();

  const [activeTags, setActiveTags] = useState<string[]>(() => {
    const params = new URLSearchParams(location.search);
    const tagsParam = params.get("tags");
    return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  });

  const toggleTag = (tag: string) => {
    setActiveTags((prev: string[]): string[] =>
      prev.includes(tag) ? prev.filter((t: string): boolean => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeTags.length > 0) {
      params.set("tags", activeTags.join(","));
    } else {
      params.delete("tags");
    }
    const newSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      history.replace({ ...location, search: newSearch ? `?${newSearch}` : "" });
    }
  }, [activeTags]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (name: string) => {
    setExpandedRows((prev: Set<string>): Set<string> => {
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

  const [search, setSearch] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") ?? "";
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    const newSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      history.replace({ ...location, search: newSearch ? `?${newSearch}` : "" });
    }
  }, [search]);
  const normalizedSearch = search.toLowerCase();
  const matchesSearchRecursive = (p: Parameter): boolean => {
    if (!normalizedSearch) return true;

    const selfMatch = p.name.toLowerCase().includes(normalizedSearch);

    const childMatch =
      p.properties?.some((sub) => matchesSearchRecursive(sub)) ?? false;

    return selfMatch || childMatch;
  };

  const matchesTags = (p: Parameter): boolean => {
    const allActive = [...fixedTags, ...activeTags];
    return allActive.length === 0 || allActive.every((tag: string): boolean => p.tags.includes(tag));
  };

  const filtered = useMemo(() => {
    return parameters.filter(
      (p) => matchesSearchRecursive(p) && matchesTags(p)
    );
  }, [parameters, search, activeTags, fixedTags]);

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

        // When the parent itself matches the search and has children, expand it so
        // all sub-properties are immediately visible. Without this, the effect would
        // replace any manual-click expansion with an empty set (race condition between
        // the async useEffect and the onClick handler).
        if (selfMatch) {
          newExpanded.add(p.name);
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
        <mark key={i} className={highlightStyles.mark}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const renderRow = (p: Parameter, depth = 0) => {
    const isExpanded = expandedRows.has(p.name);
    const hasChildren = (p.properties?.length ?? 0) > 0;

    return (
      <React.Fragment key={`${p.name}-${depth}`}>
        <tr
          tabIndex={0}
          className={`${rowStyles.tableRow} ${isExpanded ? rowStyles.rowActive : ""}`}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
          onClick={() => hasChildren && toggleRow(p.name)}
          onKeyDown={(e) => {
            if (hasChildren && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              toggleRow(p.name);
            }
          }}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={hasChildren ? `${p.name} expandable` : p.name}
          onFocus={(e) => (e.currentTarget.style.outline = focusOutlineStyle.outline)}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >
          {/* Icon column — chevron for models, grip lines for direct params */}
          <td className={rowStyles.iconCell}>
            <span className={rowStyles.iconWrap} aria-hidden={true}>
              <FontAwesomeIcon icon={hasChildren ? (isExpanded ? faChevronDown : faChevronRight) : faGripLines} />
            </span>
          </td>

          {/* Name + badges column */}
          <td className={rowStyles.nameCell} style={{ paddingLeft: `${depth * 1.5}rem` }}>
            <div className={rowStyles.rowTitle}>
              <code id={p.name} style={codeStyle}>
                {highlightText(p.name, search)}
              </code>
            </div>
            {(p.required || p.default !== undefined || p.newSince || p.deprecatedSince) && (
              <div className={rowStyles.badgeRow}>
                {p.required && <span style={requiredBadgeStyle}>required</span>}
                {p.default !== undefined && (
                  <span style={defaultBadgeStyle}>default: <code>{p.default.toString()}</code></span>
                )}
                {p.newSince && <span style={sinceBadgeStyle}>new since {p.newSince}</span>}
                {p.deprecatedSince && <span style={deprecatedBadgeStyle}>deprecated since: {p.deprecatedSince}</span>}
              </div>
            )}
          </td>

          {/* Description column */}
          <td className={rowStyles.descCell}>
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
        </tr>

        {isExpanded && p.properties?.map((sub) => renderRow(sub, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div style={containerStyle}>
      <div className={inputStyles.wrapper}>
        <span className={inputStyles.icon}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          data-cy="search-input"
          type="text"
          placeholder="Search Bicep parameters by name..."
          value={search}
          ref={searchInputRef}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") { setSearch(""); searchInputRef.current?.blur(); } }}
          className={inputStyles.input}
          aria-label="Search parameters by name"
        />
        {search ? (
          <span className={inputStyles.rightSlot}>
            <button
              onClick={() => setSearch("")}
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

      <div style={tagWrapperStyle}>
        {allTags
          .filter((tag) => !fixedTags.includes(tag))
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
                data-cy={tag}
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

      <div data-cy="search-results-summary" style={resultCountStyle}>
        Showing {filtered.length} parameter{filtered.length !== 1 ? "s" : ""}
      </div>

      <div
        data-cy="search-results"
        className={rowStyles.tableWrapper}
        style={{ maxHeight, overflowY: "auto" }}
      >
        <table className={rowStyles.table}>
          <tbody>
            {filtered.map((p) => renderRow(p))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { marginTop: "1rem" };
const tagWrapperStyle: React.CSSProperties = { marginBottom: "1rem" };
const resultCountStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  opacity: 0.7,
  color: "var(--ifm-font-color-base)",
};

const codeStyle: React.CSSProperties = { color: "var(--ifm-color-primary)", backgroundColor: "var(--ifm-background-color)" };

const requiredBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  backgroundColor: "#b10006",
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
const focusOutlineStyle = { outline: "2px solid var(--ifm-color-primary)" };

