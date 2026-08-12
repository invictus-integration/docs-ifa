import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useCollapsible, Collapsible } from '@docusaurus/theme-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

/**
 * Re-implementation (not just a re-theme) of the upstream `<details>` block,
 * restyled to match ParameterTable's muted disclosure-row pattern (see
 * resultRow.module.css's disclosureRow/expandChevron) instead of Infima's
 * colored alert box. We stopped delegating to
 * `@docusaurus/theme-common`'s `Details` because two of its behaviors can't
 * be fixed with CSS overrides alone:
 *
 *  - It puts the alert box's own padding on the outer `<details>` element,
 *    wrapping *around* `<summary>`. That padding is visually part of the
 *    block (background/border cover it) but isn't part of `<summary>`, so
 *    clicks landing there don't toggle it — only clicks inside the actual
 *    `<summary>` content do. We put all of the header padding on `<summary>`
 *    itself instead, so the entire visible header is genuinely clickable.
 *  - Its ▸/▾ marker is a CSS pseudo-element that isn't reliably centered
 *    against the summary text and doesn't match the site's FontAwesome
 *    glyphs. We render a real `FontAwesomeIcon`, swapping
 *    faChevronRight/faChevronDown exactly like ParameterTable's
 *    expandChevron/disclosureChevron.
 *
 * `useCollapsible`/`Collapsible` are still reused from theme-common for the
 * smooth expand/collapse animation.
 */
export default function Details({ summary, children, ...props }) {
  useBrokenLinks().collectAnchor(props.id);
  const isBrowser = useIsBrowser();
  const detailsRef = useRef(null);
  const { collapsed, setCollapsed } = useCollapsible({
    initialState: !props.open,
  });
  // Separate state for the actual `open` attribute: it must only be cleared
  // after the collapse animation finishes, otherwise the close animation
  // can't play.
  const [open, setOpen] = useState(props.open);

  const summaryContent = React.isValidElement(summary) ? summary.props.children : (summary ?? 'Details');

  const toggle = () => {
    if (collapsed) {
      setCollapsed(false);
      setOpen(true);
    } else {
      setCollapsed(true);
      // Don't set `open` to false here, it breaks the close animation.
    }
  };

  return (
    <details
      {...props}
      ref={detailsRef}
      open={open}
      data-collapsed={collapsed}
      className={clsx(styles.details, isBrowser && styles.isBrowser, props.className)}
    >
      <summary
        className={styles.summary}
        onMouseDown={(e) => {
          // Prevent a double-click from highlighting the summary text.
          if (e.detail > 1) e.preventDefault();
        }}
        onClick={(e) => {
          // We manage the `open` state ourselves (for the collapse
          // animation), so stop the browser's native toggle.
          e.preventDefault();
          toggle();
        }}
      >
        <FontAwesomeIcon
          icon={collapsed ? faChevronRight : faChevronDown}
          className={styles.chevron}
          aria-hidden="true"
        />
        <span className={styles.summaryText}>{summaryContent}</span>
      </summary>

      <Collapsible
        lazy={false} // Content might matter for SEO in this case
        collapsed={collapsed}
        onCollapseTransitionEnd={(newCollapsed) => {
          setCollapsed(newCollapsed);
          setOpen(!newCollapsed);
        }}
      >
        <div className={styles.content}>{children}</div>
      </Collapsible>
    </details>
  );
}
