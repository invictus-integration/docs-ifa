import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import FeedbackWidget from '@site/src/components/FeedbackWidget';
import styles from './styles.module.css';

export default function DocPaginator({ previous, next }) {
  const { frontMatter } = useDoc();
  const showFeedback = !frontMatter.hide_feedback_widget;
  const hasNav = !!(previous || next);

  // No prev/next — still use the three-col grid so feedback stays centered
  if (!hasNav) {
    return showFeedback ? (
      <nav className={`${styles.paginationNav} ${styles.threeCol}`} aria-label="Docs pages navigation">
        <div className={styles.prev} />
        <div className={styles.center}>
          <FeedbackWidget embedded />
        </div>
        <div className={styles.next} />
      </nav>
    ) : null;
  }

  return (
    <nav
      className={`${styles.paginationNav} ${showFeedback ? styles.threeCol : ''}`}
      aria-label="Docs pages navigation"
    >
      <div className={styles.prev}>
        {previous && (
          <PaginatorNavLink
            {...previous}
            subLabel={
              <span className={styles.sublabel}>
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                <Translate id="theme.docs.paginator.previous" description="The label used to navigate to the previous doc">
                  Previous
                </Translate>
              </span>
            }
          />
        )}
      </div>

      {showFeedback && (
        <div className={styles.center}>
          <FeedbackWidget embedded />
        </div>
      )}

      <div className={styles.next}>
        {next && (
          <PaginatorNavLink
            {...next}
            subLabel={
              <span className={styles.sublabel}>
                <Translate id="theme.docs.paginator.next" description="The label used to navigate to the next doc">
                  Next
                </Translate>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </span>
            }
            isNext
          />
        )}
      </div>
    </nav>
  );
}
