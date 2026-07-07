import React, { useState, useCallback, useRef, useEffect, useId } from "react";
import DocusaurusCodeBlock from "@theme/CodeBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ApiPlayground.module.css";
import rowStyles from "./resultRow.module.css";

// Renders a markdown string while applying an existing CSS class to the
// wrapping paragraph and ensuring links open in a new tab safely.
function MarkdownText({ children, className }: { children: string; className: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children: kids }) => <p className={className}>{kids}</p>,
        a: ({ href, children: kids }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {kids}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApiParameter = {
  name: string;
  type: string;
  required?: boolean;
  description: string | React.ReactNode;
  /** Optional React nodes (e.g. <NewSinceBadge />) rendered after the required badge. */
  badges?: React.ReactNode;
};

export type ApiResponse = {
  status: number;
  label: string;
  description?: React.ReactNode;
  body: unknown;
};

export type ApiPlaygroundProps = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: React.ReactNode;
  parametersTitle?: string;
  parameters?: ApiParameter[];
  request?: unknown;
  responses: ApiResponse[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type StatusGroup = "success" | "warning" | "error" | "info";

function getStatusGroup(status: number): StatusGroup {
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "info";
  if (status >= 400 && status < 500) return "warning";
  return "error";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function typeBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case "string": return rowStyles.typeBadgeString;
    case "int":
    case "integer": return rowStyles.typeBadgeInt;
    case "bool":
    case "boolean": return rowStyles.typeBadgeBool;
    case "object": return rowStyles.typeBadgeObject;
    case "array": return rowStyles.typeBadgeArray;
    default: return rowStyles.typeBadgeDefault;
  }
}

// ─── ApiPlayground ───────────────────────────────────────────────────────────

export default function ApiPlayground({
  method,
  path,
  description,
  parametersTitle,
  parameters,
  request,
  responses,
}: ApiPlaygroundProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Stable IDs for the ARIA tabs/tabpanel relationship.
  // useId generates a unique prefix per component instance so multiple
  // playgrounds on the same page never share IDs.
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const selectedResponse = responses[selectedIdx];

  // Re-trigger the CSS animation on the panel when the selection changes,
  // without unmounting the DOM node (which would break the aria-controls link
  // and cause screen readers to lose reading position).
  const prevIdxRef = useRef(selectedIdx);
  useEffect(() => {
    if (prevIdxRef.current === selectedIdx) return;
    prevIdxRef.current = selectedIdx;
    const el = panelRef.current;
    if (!el) return;
    el.classList.remove(styles.responseBody);
    // Force a reflow so removing+re-adding the class restarts the animation.
    void el.offsetHeight;
    el.classList.add(styles.responseBody);
  }, [selectedIdx]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      let next = idx;
      if (e.key === "ArrowRight") next = (idx + 1) % responses.length;
      else if (e.key === "ArrowLeft") next = (idx - 1 + responses.length) % responses.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = responses.length - 1;
      else return;
      e.preventDefault();
      setSelectedIdx(next);
      tabRefs.current[next]?.focus();
    },
    [responses.length]
  );

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, responses.length);
  }, [responses.length]);

  return (
    <div className={styles.playground} role="region" aria-label={`API reference: ${method} ${path}`}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <span
          className={`${styles.methodBadge} ${styles[`method${method}`]}`}
          aria-label={`HTTP method: ${method}`}
        >
          {method}
        </span>
        <code className={styles.path}>{path}</code>
        {/* aria-description is the modern way to expose tooltip text to ATs;
            title is the fallback for older browsers and hover-only UAs. */}
        <span
          className={styles.simulatedBadge}
          role="note"
          title="Responses shown are static examples — no live requests are made."
          aria-description="Responses shown are static examples — no live requests are made."
        >
          Simulated
        </span>
      </div>

      {/* ── Description ── */}
      {description && (
        typeof description === "string"
          ? <MarkdownText className={styles.description}>{description}</MarkdownText>
          : <div className={styles.description}>{description}</div>
      )}

      {/* ── Two-panel grid ── */}
      <div className={styles.grid}>

        {/* ── Request panel ── */}
        <section className={styles.panel} aria-label="Request details">
          <p className={styles.panelTitle} aria-hidden="true">Request</p>

          {request !== undefined && (
            <div className={styles.section}>
              <p className={styles.sectionLabel} aria-hidden="true">Body</p>
              <DocusaurusCodeBlock language="json">
                {JSON.stringify(request, null, 2)}
              </DocusaurusCodeBlock>
            </div>
          )}

          {parameters && parameters.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel} aria-hidden="true">{parametersTitle || "Body Parameters"}</p>
              <ul className={styles.paramList} role="list">
                {parameters.map((p) => (
                  <li key={p.name} className={styles.param}>
                    <div className={styles.paramMeta}>
                      <code className={styles.paramName}>{p.name}</code>
                      <span className={`${rowStyles.typeBadge} ${typeBadgeClass(p.type)}`}>{p.type}</span>
                      {p.required && (
                        <span className={styles.requiredBadge}>required</span>
                      )}
                      {p.badges && (
                        <span className={styles.paramBadgeSlot}>{p.badges}</span>
                      )}
                    </div>
                    {typeof p.description === "string"
                      ? <MarkdownText className={styles.paramDesc}>{p.description}</MarkdownText>
                      : <div className={styles.paramDesc}>{p.description}</div>
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ── Response panel ── */}
        <section className={styles.panel} aria-label="Response examples">
          <p className={styles.panelTitle} aria-hidden="true">Response</p>

          {/* Status tabs — roving tabindex pattern per WAI-ARIA tabs widget */}
          <div className={styles.statusTabs} role="tablist" aria-label="Response scenarios">
            {responses.map((r, i) => {
              const group = getStatusGroup(r.status);
              const isActive = selectedIdx === i;
              return (
                <button
                  key={i}
                  id={tabId(i)}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  className={[
                    styles.statusTab,
                    styles[`status${capitalize(group)}`],
                    isActive ? styles.statusTabActive : "",
                  ].join(" ")}
                  onClick={() => setSelectedIdx(i)}
                  onKeyDown={(e) => handleTabKeyDown(e, i)}
                >
                  <span className={styles.statusCode}>{r.status}</span>
                  <span className={styles.statusLabel}>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* tabpanel: NOT remounted on selection change (keeps DOM node stable for
              screen readers). The animation is retriggered by the useEffect above
              that removes and re-adds the CSS class via a forced reflow.
              tabIndex="0" ensures keyboard users can Tab into the panel to reach
              the copy button inside the CodeBlock. */}
          <div
            id={panelId}
            ref={panelRef}
            role="tabpanel"
            aria-labelledby={tabId(selectedIdx)}
            tabIndex={0}
            className={styles.responseBody}
          >
            {selectedResponse.description && (
              typeof selectedResponse.description === "string"
                ? <MarkdownText className={styles.responseDesc}>{selectedResponse.description}</MarkdownText>
                : <div className={styles.responseDesc}>{selectedResponse.description}</div>
            )}
            <DocusaurusCodeBlock language="json">
              {JSON.stringify(selectedResponse.body, null, 2)}
            </DocusaurusCodeBlock>
          </div>
        </section>

      </div>
    </div>
  );
}
