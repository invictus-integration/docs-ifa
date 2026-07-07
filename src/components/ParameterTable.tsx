import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronDown, faXmark, faFileCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useHistory } from "@docusaurus/router";
import highlightStyles from "./highlight.module.css";
import inputStyles from "./tableSearchInput.module.css";
import rowStyles from "./resultRow.module.css";
import { NewSinceBadge, DeprecatedSinceBadge } from "./Badges";

export type Parameter = {
  name: string;
  type?: string;
  tags: string[];
  description?: string;
  properties?: Parameter[];
  required?: boolean;
  default?: any;
  deprecatedSince?: { version: string; note: string };
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

  // Stable instance ID for aria-controls / aria-describedby relationships.
  // useRef ensures it never changes across re-renders.
  const panelId = useRef(`param-table-${Math.random().toString(36).slice(2)}`).current;

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

  const [showAll, setShowAll] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (name: string) => {
    setExpandedRows((prev: Set<string>): Set<string> => {
      const newSet = new Set(prev);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      return newSet;
    });
  };

  // Focus management: when the disclosure button is clicked it unmounts, so we
  // explicitly move focus to the first tag button (or the search input as fallback)
  // to prevent focus from dropping to <body>.
  const tagGroupRef = useRef<HTMLDivElement>(null);
  const prevShowAllRef = useRef(false);
  useEffect(() => {
    if (showAll && !prevShowAllRef.current) {
      const firstBtn = tagGroupRef.current?.querySelector<HTMLElement>("button");
      if (firstBtn) firstBtn.focus();
      else searchInputRef.current?.focus();
    }
    prevShowAllRef.current = showAll;
  }, [showAll]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    const collectTags = (params: Parameter[]) => {
      params.forEach((p) => {
        p.tags?.forEach((tag) => tagSet.add(tag));
        if (Array.isArray(p.properties)) collectTags(p.properties);
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

  // Tags whose names include the current search text — used to visually suggest
  // the user could activate them as a filter instead of (or in addition to) text search.
  const suggestedTags = useMemo(() => {
    if (!normalizedSearch) return [];
    return allTags.filter(
      (tag) =>
        tag.toLowerCase().includes(normalizedSearch) &&
        !activeTags.includes(tag) &&
        !fixedTags.includes(tag)
    );
  }, [normalizedSearch, allTags, activeTags, fixedTags]);

  const matchesSearchRecursive = (p: Parameter): boolean => {
    if (!normalizedSearch) return true;

    const selfMatch = p.name.toLowerCase().includes(normalizedSearch);

    const childMatch =
      (Array.isArray(p.properties) ? p.properties : []).some((sub) => matchesSearchRecursive(sub));

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

      // When the parent itself matches the search and has children, expand it so
      // all sub-properties are immediately visible. Without this, the effect would
      // replace any manual-click expansion with an empty set (race condition between
      // the async useEffect and the onClick handler).
      if (selfMatch && p.properties?.length) {
        newExpanded.add(p.name);
      }

      return selfMatch || childMatched;
    };

    parameters.forEach((p) => expandMatching(p));

    setExpandedRows(newExpanded);
  }, [search, parameters]);

  // Flat ordered list of all currently visible rows (top-level + expanded children).
  const flatVisibleRows = useMemo(() => {
    const result: Array<{ name: string; depth: number }> = [];
    const flatten = (params: Parameter[], depth: number) => {
      for (const p of params) {
        result.push({ name: p.name, depth });
        if (expandedRows.has(p.name) && p.properties?.length) {
          flatten(p.properties, depth + 1);
        }
      }
    };
    flatten(filtered, 0);
    return result;
  }, [filtered, expandedRows]);

  // Reset active row when the visible set changes.
  useEffect(() => { setActiveIndex(-1); }, [filtered]);

  // Focus the active row whenever activeIndex changes.
  useEffect(() => {
    if (activeIndex >= 0 && flatVisibleRows[activeIndex]) {
      const { name, depth } = flatVisibleRows[activeIndex];
      const el = rowRefs.current.get(`${name}-${depth}`);
      if (el && document.activeElement !== el) el.focus();
    }
  }, [activeIndex]);

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

  // Maps a Bicep parameter type string to its CSS module class for the pill badge.
  const typeBadgeClass = (type: string): string => {
    switch (type.toLowerCase()) {
      case "string": return rowStyles.typeBadgeString;
      case "int":
      case "integer": return rowStyles.typeBadgeInt;
      case "bool":
      case "boolean": return rowStyles.typeBadgeBool;
      case "object": return rowStyles.typeBadgeObject;
      case "array": return rowStyles.typeBadgeArray;
      case "securestring": return rowStyles.typeBadgeSecureString;
      case "secureobject": return rowStyles.typeBadgeSecureObject;
      default: return rowStyles.typeBadgeDefault;
    }
  };

  const renderRow = (p: Parameter, depth = 0, posInSet = 1, setSize = 1) => {
    const isExpanded = expandedRows.has(p.name);
    const hasChildren = (p.properties?.length ?? 0) > 0;
    const rowKey = `${p.name}-${depth}`;
    const flatIdx = flatVisibleRows.findIndex(r => r.name === p.name && r.depth === depth);
    const isFocused = flatIdx === activeIndex;
    const isTabStop = flatIdx === activeIndex || (activeIndex === -1 && flatIdx === 0);

    return (
      <React.Fragment key={rowKey}>
        <tr
          role="row"
          tabIndex={isTabStop ? 0 : -1}
          ref={el => { if (el) rowRefs.current.set(rowKey, el); else rowRefs.current.delete(rowKey); }}
          className={[
            rowStyles.tableRow,
            isExpanded ? rowStyles.rowActive : "",
            isFocused ? rowStyles.rowFocused : "",
            p.deprecatedSince ? rowStyles.rowDeprecated : "",
            p.newSince ? rowStyles.rowNew : "",
          ].filter(Boolean).join(" ")}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
          data-tags={p.tags?.join(',') ?? ''}
          aria-level={depth + 1}
          aria-setsize={setSize}
          aria-posinset={posInSet}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={hasChildren ? `${p.name}, ${isExpanded ? "collapse" : "expand"}` : p.name}
          onClick={() => hasChildren && toggleRow(p.name)}
          onFocus={() => { if (activeIndex !== flatIdx) setActiveIndex(flatIdx); }}
          onKeyDown={(e) => {
            if (hasChildren && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              toggleRow(p.name);
            }
            if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatVisibleRows.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => { if (i <= 0) { searchInputRef.current?.focus(); return -1; } return i - 1; }); }
            else if (e.key === "ArrowRight" && hasChildren && !isExpanded) { e.preventDefault(); toggleRow(p.name); }
            else if (e.key === "ArrowLeft" && hasChildren && isExpanded) { e.preventDefault(); toggleRow(p.name); }
          }}
        >
          {/* Name + badges column */}
          <td role="gridcell" className={rowStyles.nameCell} style={{ paddingLeft: `calc(${depth} * var(--param-indent, 1.5rem) + 14px)` }}>
            <div className={rowStyles.rowTitle}>
              {/* id only on depth-0 to avoid duplicate IDs when the same property name
                  appears under multiple parent objects. Depth-0 names are unique top-level
                  anchors; nested ones have no safe stable anchor to offer. */}
              <code id={depth === 0 ? p.name : undefined} style={codeStyle}>
                {highlightText(p.name, search)}
              </code>
              {p.newSince && <NewSinceBadge version={p.newSince} style={{ fontSize: '0.72rem', marginLeft: '0px', padding: '4px 6px' }} />}
              {p.deprecatedSince && <DeprecatedSinceBadge version={p.deprecatedSince.version} note={p.deprecatedSince.note} style={{ fontSize: '0.72rem', marginLeft: '0px', padding: '4px 6px' }} />}
            </div>
            {(p.type || p.required || p.default !== undefined || p.newSince || p.deprecatedSince) && (
              <div className={rowStyles.badgeRow}>
                {p.type && (
                  <span className={`${rowStyles.typeBadge} ${typeBadgeClass(p.type)}`}>
                    {p.type}
                  </span>
                )}
                {p.required && <span className={rowStyles.badgeRequired}>required</span>}
                {p.default !== undefined && (
                  <span className={rowStyles.badgeDefault}>default: <code>{p.default.toString()}</code></span>
                )}
              </div>
            )}
          </td>

          {/* Description column */}
          <td role="gridcell" className={rowStyles.descCell}>
            {p.description && (
              <ReactMarkdown
                children={p.description}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      {props.children}
                      <span className={rowStyles.srOnly}> (opens in new tab)</span>
                    </a>
                  ),
                }}
              />
            )}
          </td>

          {/* Chevron column — far-right end of row, mirrors the FAQ/help-center pattern */}
          <td role="gridcell" className={rowStyles.chevronCell}>
            {hasChildren && (
              <span className={rowStyles.expandChevron} aria-hidden="true">
                <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
              </span>
            )}
          </td>
        </tr>

        {isExpanded && Array.isArray(p.properties) && p.properties.map((sub, i) => renderRow(sub, depth + 1, i + 1, p.properties!.length))}
      </React.Fragment>
    );
  };

  return (
    <div style={containerStyle}>
      {/* Always-mounted live region: ensures SRs have registered it before any
          content changes, so announcements are reliable on both initial reveal
          and subsequent filter updates. Hidden visually; exposed only to AT. */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="text"
        className={rowStyles.srOnly}
      >
        {(() => {
          const showResults = search !== "" || activeTags.length > 0 || showAll;
          if (!showResults) return null;
          if (filtered.length === 0) return `No parameters match ${search ? `"${search}"` : "the selected filters"}`;
          return `Showing ${filtered.length} parameter${filtered.length !== 1 ? "s" : ""}`;
        })()}
      </div>

      {/* Visually-hidden description for the treegrid: tells keyboard users how to
          navigate rows without relying on visual hints in the footer. */}
      <p id={`${panelId}-table-hint`} className={rowStyles.srOnly}>
        Use arrow keys to navigate rows. Press Enter or Space to expand a row with sub-properties. Press / to focus the search field.
      </p>

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
          onKeyDown={(e) => {
            if (e.key === "Escape") { setSearch(""); searchInputRef.current?.blur(); }
            if (e.key === "ArrowDown" && flatVisibleRows.length > 0) { e.preventDefault(); setActiveIndex(0); }
          }}
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

      {(() => {
        const showResults = search !== "" || activeTags.length > 0 || showAll;

        if (!showResults) {
          return (
            <button
              data-cy="disclosure-button"
              className={rowStyles.disclosureRow}
              onClick={() => setShowAll(true)}
              aria-expanded={false}
              aria-controls={panelId}
              aria-label={`Show all ${parameters.length} parameters`}
            >
              <FontAwesomeIcon icon={faChevronRight} className={rowStyles.disclosureChevron} aria-hidden="true" />
              <span className={rowStyles.disclosureCount}>
                {parameters.length} parameter{parameters.length !== 1 ? "s" : ""}
              </span>
            </button>
          );
        }

        return (
          <div id={panelId}>
            <div ref={tagGroupRef} className={rowStyles.tagWrapper} role="group" aria-label="Filter by tag">
              {allTags
                .filter((tag) => !fixedTags.includes(tag))
                .map((tag) => {
                  const tagActive = activeTags.includes(tag);
                  const tagSuggested = !tagActive && suggestedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      data-cy={tag}
                      onClick={() => toggleTag(tag)}
                      aria-pressed={tagActive}
                      className={`${rowStyles.tagButton} ${tagActive ? rowStyles.tagButtonActive : ""} ${tagSuggested ? rowStyles.tagButtonSuggested : ""}`}
                    >
                      {tag}
                      {/* Visually-hidden hint replaces the unreliable `title` attribute.
                          Screen readers will announce this as part of the button's label. */}
                      {tagSuggested && (
                        <span className={rowStyles.srOnly}> (matches your search)</span>
                      )}
                    </button>
                  );
                })}
            </div>

            {filtered.length > 0 && (
              <div
                data-cy="search-results-summary"
                aria-hidden="true"
                style={resultCountStyle}
              >
                Showing {filtered.length} parameter{filtered.length !== 1 ? "s" : ""}
              </div>
            )}

            {filtered.length === 0 ? (
              <div aria-hidden="true" className={rowStyles.empty}>
                <FontAwesomeIcon icon={faFileCircleXmark} aria-hidden="true" />
                <div className={rowStyles.emptyText}>
                  <span className={rowStyles.emptyTitle}>
                    No parameters match {search ? `"${search}"` : "the selected filters"}
                  </span>
                  <span className={rowStyles.emptyHint}>
                    Try a different search term or adjust your filters
                  </span>
                </div>
              </div>
            ) : (
              <div
                data-cy="search-results"
                className={rowStyles.tableWrapper}
                style={{ maxHeight, overflowY: "auto" }}
              >
                <table
                  role="treegrid"
                  aria-label="Parameters"
                  aria-describedby={`${panelId}-table-hint`}
                  className={rowStyles.table}
                >
                  <thead className={rowStyles.srOnly}>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Expand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => renderRow(p, 0, i + 1, filtered.length))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={rowStyles.faqFooter} aria-hidden="true">
              <span className={rowStyles.footerHint}><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span className={rowStyles.footerHint}><kbd><span className={rowStyles.kbdRotateLeft}>↑</span></kbd><kbd><span className={rowStyles.kbdRotateRight}>↑</span></kbd> expand</span>
              <span className={rowStyles.footerHint}><kbd>/</kbd> filter</span>
              <span className={rowStyles.footerHint}><kbd>Esc</kbd> clear</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const containerStyle: React.CSSProperties = { marginTop: "1rem" };
const resultCountStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  opacity: 0.7,
  color: "var(--ifm-font-color-base)",
};

const codeStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "var(--ifm-color-primary)",
  backgroundColor: "var(--ifm-background-color)"
};

const tagBadgeStyle: React.CSSProperties = {
  marginRight: "6px",
  fontSize: "0.75rem",
  backgroundColor: "var(--ifm-color-emphasis-200)",
  padding: "2px 6px",
  borderRadius: "4px",
};

const linkStyle: React.CSSProperties = { color: "var(--ifm-color-primary)" };

