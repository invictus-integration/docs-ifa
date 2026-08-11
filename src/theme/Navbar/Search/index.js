import React from 'react';
import clsx from 'clsx';

// Overrides @docusaurus/theme-classic NavbarSearch to remove the
// `position: absolute` on mobile that caused the search to float on top of
// adjacent navbar items (e.g. the color mode toggle).
export default function NavbarSearch({ children, className }) {
  return (
    <div className={clsx(className, 'navbar__search')}>
      {children}
    </div>
  );
}
