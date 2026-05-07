import React from 'react';
import OriginalContent from '@theme-original/DocSidebar/Desktop/Content';
import UserTypeSwitcher from '../../../components/UserTypeSwitcher';

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
