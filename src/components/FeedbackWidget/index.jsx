import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentDots,
  faThumbsUp,
  faThumbsDown,
  faCircleQuestion,
  faBug,
  faLightbulb,
  faXmark,
  faChevronLeft,
  faHeart,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import styles from './FeedbackWidget.module.css';

const ENDPOINT = '/api/feedback';
const STORAGE_PREFIX = 'inv-feedback-submitted';
const SHORTCUT_KEY = '?';

const TYPES = [
  { id: 'helpful', icon: faThumbsUp, label: 'Helpful', placeholder: 'What did you find most useful?', commentRequired: false },
  { id: 'not-helpful', icon: faThumbsDown, label: 'Not helpful', placeholder: 'What were you looking for?', commentRequired: false },
  { id: 'question', icon: faCircleQuestion, label: 'I have a question', placeholder: 'What would you like to know?', commentRequired: true },
  { id: 'issue', icon: faBug, label: 'Found an issue', placeholder: 'What seems incorrect or broken on this page?', commentRequired: true },
  { id: 'suggestion', icon: faLightbulb, label: 'Suggestion', placeholder: 'What would make this page better?', commentRequired: true },
];

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isInFormElement() {
  const el = document.activeElement;
  if (!el) return false;
  return ['input', 'textarea', 'select'].includes(el.tagName.toLowerCase()) || el.isContentEditable;
}

export default function FeedbackWidget({ embedded = false }) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const promptId = `${uid}-prompt`;
  const commentId = `${uid}-comment`;
  const hintId = `${uid}-hint`;
  const liveId = `${uid}-live`;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [issueUrl, setIssueUrl] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [liveMsg, setLiveMsg] = useState('');

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const doneRef = useRef(null);

  // Hide widget if feedback was already submitted for this page
  useEffect(() => {
    const key = `${STORAGE_PREFIX}:${window.location.pathname}`;
    if (!localStorage.getItem(key)) setHidden(false);
  }, []);

  // Move focus into panel when it opens, and when the view changes
  useEffect(() => {
    if (open && panelRef.current) {
      const first = panelRef.current.querySelector(FOCUSABLE);
      first?.focus({ preventScroll: true });
    }
  }, [open, type]);

  // Move focus to done message and announce via live region
  useEffect(() => {
    if (status === 'done') {
      setLiveMsg('Thank you for your feedback!');
      doneRef.current?.focus();
    }
  }, [status]);

  // Keyboard: 'f' shortcut (outside form fields), Escape closes, Tab trapped inside
  const handleKeyDown = useCallback((e) => {
    if (e.key === SHORTCUT_KEY && !e.ctrlKey && !e.metaKey && !e.altKey && !isInFormElement()) {
      e.preventDefault();
      setOpen(o => !o);
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selected = TYPES.find(t => t.id === type);

  function handleTypeListKeyDown(e) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const buttons = Array.from(e.currentTarget.querySelectorAll('[role="menuitem"]'));
    const idx = buttons.indexOf(document.activeElement);
    if (idx === -1) return;
    let next;
    if (e.key === 'ArrowDown') next = (idx + 1) % buttons.length;
    else if (e.key === 'ArrowUp') next = (idx - 1 + buttons.length) % buttons.length;
    else if (e.key === 'Home') next = 0;
    else next = buttons.length - 1;
    buttons[next].focus({ preventScroll: true });
  }

  function reset() {
    setType(null);
    setComment('');
    setStatus('idle');
  }

  function handleClose() {
    setOpen(false);
    reset();
    triggerRef.current?.focus();
  }

  async function handleSubmit() {
    if (!type) return;
    setStatus('submitting');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType: type,
          comment: comment.trim(),
          pageUrl: window.location.href,
          pageTitle: document.title,
        }),
      });
      if (res.ok) {
        const { issueUrl } = await res.json();
        setIssueUrl(issueUrl);
        setStatus('done');
        localStorage.setItem(`${STORAGE_PREFIX}:${window.location.pathname}`, '1');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (hidden) return null;

  const canSubmit = status !== 'submitting' && (!selected?.commentRequired || comment.trim().length > 0);

  return (
    <>
      {/* Persistent live region — always in DOM so announcements are reliable */}
      <div id={liveId} role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {liveMsg}
      </div>
      {!embedded && <hr className={styles.divider} aria-hidden="true" />}
      <section className={`${styles.root} ${embedded ? styles.rootEmbedded : ''}`} aria-label="Page feedback">
        {!embedded && <p className={styles.preFooterLabel}>Was this page helpful?</p>}
        <div className={styles.triggerWrap}>
          <button
            ref={triggerRef}
            className={embedded
              ? `${styles.embeddedTrigger} ${open ? styles.embeddedTriggerOpen : ''}`
              : `${styles.trigger} ${open ? styles.triggerOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close feedback panel' : 'Open feedback panel'}
            title={`Page feedback — press ${SHORTCUT_KEY} to toggle`}
          >
            {embedded ? (
              <>
                <FontAwesomeIcon icon={open ? faXmark : faCommentDots} className={styles.embeddedIcon} aria-hidden="true" />
                <span className={styles.embeddedLabel}>
                  Feedback
                  <kbd className={styles.shortcut} aria-hidden="true">{SHORTCUT_KEY}</kbd>
                </span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={open ? faXmark : faCommentDots} aria-hidden="true" />
                <span className={styles.triggerLabel}>Feedback</span>
                <kbd className={styles.shortcut} aria-hidden="true">{SHORTCUT_KEY}</kbd>
              </>
            )}
          </button>

          {open && (
            <div
              ref={panelRef}
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className={styles.header}>
                <span id={titleId} className={styles.title}>Page feedback</span>
                <button className={styles.close} onClick={handleClose} aria-label="Close feedback panel">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                </button>
              </div>

              {status === 'done' ? (
                <div
                  ref={doneRef}
                  className={styles.done}
                  tabIndex={-1}
                  aria-label="Feedback submitted"
                >
                  <p><FontAwesomeIcon icon={faHeart} className={styles.thankYouHeart} aria-hidden="true" /> Thank you for your feedback!</p>
                  {issueUrl && (
                    <a href={issueUrl} target="_blank" rel="noopener noreferrer" className={styles.trackLink}>
                      Track your feedback <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                    </a>
                  )}
                </div>
              ) : !type ? (
                <div className={styles.typeSelect}>
                  <p className={styles.prompt} id={promptId}>How can we improve this page?</p>
                  <ul
                    className={styles.typeList}
                    role="menu"
                    aria-labelledby={promptId}
                    onKeyDown={handleTypeListKeyDown}
                  >
                    {TYPES.map(t => (
                      <li key={t.id} role="none">
                        <button className={styles.typeBtn} role="menuitem" onClick={() => setType(t.id)}>
                          <FontAwesomeIcon icon={t.icon} className={styles.typeIcon} fixedWidth aria-hidden="true" />
                          <span>{t.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className={styles.form}>
                  <div className={styles.formNav}>
                    <button className={styles.back} onClick={reset}>
                      <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" /> Pick other feedback
                    </button>
                    <span className={styles.typeLabel} aria-hidden="true">
                      <FontAwesomeIcon icon={selected.icon} />
                      {selected.label}
                    </span>
                  </div>
                  <label htmlFor={commentId} className={styles.textareaLabel}>
                    {selected.placeholder}
                    {selected.commentRequired && (
                      <span className={styles.required} aria-label="(required)"> *</span>
                    )}
                  </label>
                  <textarea
                    id={commentId}
                    className={styles.textarea}
                    rows={4}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    aria-required={selected.commentRequired}
                    aria-describedby={selected.commentRequired && !comment.trim() ? hintId : undefined}
                  />
                  {selected.commentRequired && !comment.trim() && (
                    <p id={hintId} className={styles.hint}>
                      Please describe your {type === 'question' ? 'question' : 'issue'}.
                    </p>
                  )}
                  <div className={styles.formRow}>
                    <button className={styles.submit} onClick={handleSubmit} disabled={!canSubmit}>
                      {status === 'submitting' ? 'Sending…' : 'Send'}
                    </button>
                    {!selected.commentRequired && (
                      <button className={styles.skip} onClick={handleSubmit} disabled={status === 'submitting'}>
                        Send without comment
                      </button>
                    )}
                  </div>
                  {status === 'error' && (
                    <p className={styles.error} role="alert">Something went wrong — please try again.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
