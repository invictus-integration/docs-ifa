import React from 'react';

type DetailsLinkProps = {
  /** The `id` of the target Docusaurus `<details>` element (without `#`) */
  targetId: string;
  children: React.ReactNode;
};

/**
 * A link that opens a Docusaurus `<details>` block and scrolls to it.
 * Docusaurus manages details open/close state internally via React, so direct
 * DOM manipulation (el.open, setAttribute) does not work. Clicking the summary
 * element is the only way to trigger its internal toggle handler.
 */
export default function DetailsLink({ targetId, children }: DetailsLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;

    const isOpen = el.hasAttribute('open') && el.getAttribute('data-collapsed') !== 'true';
    if (!isOpen) {
      const summary = el.querySelector('summary');
      summary?.click();
    }

    // Let the DOM settle before scrolling so the expanded content is rendered
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    window.history.pushState(null, '', `#${targetId}`);
  }

  return (
    <a href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  );
}
