import React from 'react';
import OriginalContent from '@theme-original/DocSidebar/Desktop/Content';
import UserTypeSwitcher from '../../../components/UserTypeSwitcher';

// Switching sections now always navigates for real (see UserTypeSwitcher),
// so this always shows the real sidebar for whatever page is being viewed —
// no cross-section caching/preview to keep in sync or go stale.
export default function DocSidebarDesktopContent(props) {
  return (
    <>
      <div className="sidebar-switcher">
        <UserTypeSwitcher />
      </div>
      <OriginalContent {...props} />
    </>
  );
}
