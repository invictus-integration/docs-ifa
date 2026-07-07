import React, { ReactNode, useState } from 'react';
import styles from './Walkthrough.module.css';

type WalkthroughProps = { children: ReactNode; label?: string };
type StepProps = { title: string; children: ReactNode; number?: number; headingLevel?: 2 | 3 | 4 };
type TaskProps = { title: string; children: ReactNode; string?: number; id?: string };

/** Ordered list wrapper for Step and Collapsible components. Injects step numbers. */
export function Walkthrough({ children, label = 'Steps' }: WalkthroughProps) {
  return (
    <ol className={styles.walkthrough} aria-label={label}>
      {React.Children.map(children, (child: any, index: number) =>
        React.isValidElement(child) ? React.cloneElement(child, { number: child.props.number ?? index + 1 } as any) : child
      )}
    </ol>
  );
}

/** Full-size always-expanded step. Use in installation guides. */
export function Step({ title, children, number, headingLevel = 2 }: StepProps) {
  const titleId = `walkthrough-step-${number}-title`;
  const HeadingTag = `h${headingLevel}` as React.ElementType;
  return (
    <li className={styles.walkthroughStepItem}>
      <section className={styles.walkthroughStep} aria-labelledby={titleId}>
        <div className={styles.walkthroughStepHeader}>
          <div className={styles.walkthroughStepCircle} aria-hidden="true">
            {number}
          </div>
          <HeadingTag id={titleId} className={styles.walkthroughStepTitle}>{title}</HeadingTag>
        </div>
        <div className={styles.walkthroughStepContent}>{children}</div>
      </section>
    </li>
  );
}

/** Compact collapsible step. Use in feature walkthroughs. */
export function Collapsible({ title, children, number, id, open: initialOpen = false }: TaskProps) {
  const [open, setOpen] = useState(initialOpen);
  const contentId = `walkthrough-task-${number}-content`;

  return (
    <li id={id} className={`${styles.walkthroughTaskItem}${open ? ` ${styles.walkthroughTaskOpen}` : ''}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
        className={styles.walkthroughTaskHeader}
      >
        <div className={styles.walkthroughTaskCircle} aria-hidden="true">
          {number}
        </div>
        <h3 className={styles.walkthroughTaskTitle}>{title}</h3>
        <svg
          className={styles.walkthroughTaskChevron}
          aria-hidden="true"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          id={contentId}
          className={styles.walkthroughTaskContent}
        >
          {children}
        </div>
      )}
    </li>
  );
}
