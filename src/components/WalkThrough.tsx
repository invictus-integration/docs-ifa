import React, { ReactNode, useState, KeyboardEvent } from 'react';

type WalkthroughProps = { children: ReactNode };
type TaskProps = { title: string; children: ReactNode; number?: number };

export function Walkthrough({ children }: WalkthroughProps) {
  return (
    <div className="walkthrough-container">
      <div className="walkthrough-line">
        {React.Children.map(children, (child: any, index: number) =>
          React.isValidElement(child) ? React.cloneElement(child, { number: index + 1 }) : child
        )}
      </div>
    </div>
  );
}

export function Task({ title, children, number }: TaskProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className={`task-container${open ? ' open' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="task-header"
      >
        <div className="task-circle" aria-hidden="true">
          {number}
        </div>
        {title}
      </div>

      {open && <div className="task-content">{children}</div>}
    </div>
  );
}
