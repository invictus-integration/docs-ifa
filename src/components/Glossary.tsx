import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faFileCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useHistory } from "@docusaurus/router";
import highlightStyles from "./highlight.module.css";
import inputStyles from "./tableSearchInput.module.css";
import rowStyles from "./resultRow.module.css";
import styles from "./Glossary.module.css";

export type GlossaryTerm = {
  term: string;
  definition: string;
  userType: string;
  aliases?: string[];
};

type GlossaryProps = {
  terms: GlossaryTerm[];
  userType: string;
  /** Hide the search input — URL ?q= param still applies the filter. Default: true. */
  showSearch?: boolean;
  /** Remove the max-height scroll cap — for full-page layouts. Default: false. */
  unconstrained?: boolean;
};

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function Glossary({ terms, userType, showSearch = true, unconstrained = false }: GlossaryProps) {
  const location = useLocation();
  const history = useHistory();

  const byUserType = useMemo(
    () => terms.filter((t) => t.userType === userType),
    [terms, userType]
  );

  const [search, setSearch] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") ?? "";
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync search state when the URL changes without a full remount (SPA navigation).
  // This covers the case where the user is already on the help-center page and the
  // global search bar navigates to the same path with a different ?q= value.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") ?? "";
    setSearch(prev => prev !== q ? q : prev);
  }, [location.search]);

  // Sync ?q= in URL to match search state.
  // Always clears ?q= when search is empty; only writes a value when showSearch is active
  // (i.e. the user typed into the visible input). This lets the filter chip on the help-center
  // clear the URL param even though there's no visible search box.
  useEffect(() => {
    if (search && !showSearch) return; // don't write new values when input is hidden
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

  // Global "/" shortcut to focus the search input
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

  const normalizedSearch = search.toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedSearch) return byUserType;
    return byUserType.filter(
      (t) =>
        t.term.toLowerCase().includes(normalizedSearch) ||
        t.aliases?.some((a) => a.toLowerCase().includes(normalizedSearch))
    );
  }, [byUserType, normalizedSearch]);

  // Map from normalised text (term name + aliases) → canonical term name.
  // Used by the cross-reference renderer to detect clickable bold phrases.
  const termLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of byUserType) {
      map.set(t.term.toLowerCase(), t.term);
      t.aliases?.forEach((a) => map.set(a.toLowerCase(), t.term));
    }
    return map;
  }, [byUserType]);

  // When a cross-reference is clicked: fill the search input with that term
  // and scroll its entry into view after the filtered list has re-rendered.
  function handleTermRef(canonicalTerm: string) {
    setSearch(canonicalTerm);
    requestAnimationFrame(() => {
      const id = canonicalTerm.toLowerCase().replace(/\s+/g, "-");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Alphabetical grouping, sorted within each letter
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    const sorted = [...filtered].sort((a, b) => a.term.localeCompare(b.term));
    for (const t of sorted) {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return map;
  }, [filtered]);

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

  // Letters that have at least one term in the UNFILTERED set (for the full alphabet strip)
  const presentLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of byUserType) set.add(t.term[0].toUpperCase());
    return set;
  }, [byUserType]);

  // Auto-scroll to the first matched term when arriving with ?q= (e.g. from global search).
  // Tracks the last scrolled query so it re-fires if the user navigates with a different term.
  const lastScrolledQuery = useRef("");
  useEffect(() => {
    if (search && search !== lastScrolledQuery.current && filtered.length > 0) {
      lastScrolledQuery.current = search;
      requestAnimationFrame(() => {
        const id = filtered[0].term.toLowerCase().replace(/\s+/g, "-");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    if (!search) lastScrolledQuery.current = "";
  }, [filtered, search]);

  function scrollToLetter(letter: string) {
    document.getElementById(`glossary-letter-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={containerStyle}>

      {/* Skip link for keyboard/screen-reader users */}
      <a href="#glossary-list" className={styles.skipLink}>Skip to glossary list</a>

      {/* Active filter chip when showSearch=false but URL has ?q= */}
      {!showSearch && search && (
        <div className={styles.filterChip} role="status" aria-live="polite">
          <span>Filtered by: <strong>{search}</strong></span>
          <button
            className={styles.filterChipClear}
            onClick={() => setSearch("")}
            aria-label={`Clear filter "${search}"`}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            Clear
          </button>
        </div>
      )}

      {/* ── Alphabet jump navigation ── */}
      {!search && (
        <nav aria-label="Jump to letter" className={styles.alphaNav}>
          {ALL_LETTERS.map((letter) => {
            const present = presentLetters.has(letter);
            return (
              <button
                key={letter}
                className={`${styles.alphaBtn} ${present ? styles.alphaBtnActive : styles.alphaBtnInactive}`}
                onClick={() => present && scrollToLetter(letter)}
                aria-label={present ? `Jump to terms starting with ${letter}` : `No terms starting with ${letter}`}
                aria-disabled={!present}
                tabIndex={present ? 0 : -1}
              >
                {letter}
              </button>
            );
          })}
        </nav>
      )}

      {(
        <dl
          id="glossary-list"
          data-cy="glossary-terms"
          className={`${styles.list}${unconstrained ? ` ${styles.listUnconstrained}` : ''}`}
          tabIndex={0}
          aria-label={`Glossary — ${filtered.length} term${filtered.length !== 1 ? "s" : ""}`}
        >
          {(Array.from(grouped.entries()) as [string, GlossaryTerm[]][]).map(([letter, groupTerms]) => (
            <div key={letter} id={`glossary-letter-${letter}`} className={styles.group}>
              <div
                className={styles.letterHeader}
                aria-label={`Terms starting with ${letter}`}
              >
                {letter}
              </div>
              {groupTerms.map((t) => (
                <div
                  key={`${t.term}-${t.userType}`}
                  data-cy="glossary-item"
                  className={styles.item}
                >
                  <dt
                    className={styles.term}
                    id={t.term.toLowerCase().replace(/\s+/g, "-")}
                    tabIndex={0}
                  >
                    <span>{highlightText(t.term)}</span>
                    {t.aliases && t.aliases.length > 0 && (
                      <span className={styles.aliases}>
                        also:{" "}
                        {t.aliases.map((a, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && ", "}
                            <em className={styles.alias}>{highlightText(a)}</em>
                          </React.Fragment>
                        ))}
                      </span>
                    )}
                  </dt>
                  <dd className={styles.definition}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" />
                        ),
                        strong: ({ node, children, ...props }) => {
                          const text = typeof children === "string" ? children : String(children ?? "");
                          const canonical = termLookup.get(text.toLowerCase());
                          if (canonical) {
                            return (
                              <button
                                className={styles.termRef}
                                data-cy="glossary-term-ref"
                                onClick={() => handleTermRef(canonical)}
                              >
                                {text}
                              </button>
                            );
                          }
                          return <strong {...props}>{children}</strong>;
                        },
                      }}
                    >
                      {t.definition}
                    </ReactMarkdown>
                  </dd>
                </div>
              ))}
            </div>
          ))}
        </dl>
      )}

    </div>
  );
}

export default Glossary;

const containerStyle: React.CSSProperties = { marginTop: "1rem" };
const resultCountStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  opacity: 0.7,
  color: "var(--ifm-font-color-base)",
};
