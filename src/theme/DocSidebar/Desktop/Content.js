import React, { useEffect } from 'react';
import OriginalContent from '@theme-original/DocSidebar/Desktop/Content';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import UserTypeSwitcher from '../../../components/UserTypeSwitcher';
import { useUserType } from '../../../components/UserTypeContext';
import { useMobileNav } from '../../../components/MobileNavContext';

export default function DocSidebarDesktopContent(props) {
  const { sidebars, setSidebarForType } = useMobileNav();
  const { userType } = useUserType();
  const docsSidebar = useDocsSidebar();
  const sidebarName = docsSidebar?.name ?? '';
  const currentType = sidebarName === 'technical_users' ? 'technical' : 'business';

  // Populate the shared cache whenever this page's sidebar is available.
  // This mirrors what DocSidebar/Mobile does on mobile, so both desktop and
  // mobile sessions always have both sidebars cached after first visit.
  useEffect(() => {
    if (!props.sidebar?.length || !sidebarName) return;
    setSidebarForType(currentType, { items: props.sidebar, path: props.path });
  }, [props.sidebar, props.path, sidebarName, currentType, setSidebarForType]);

  // When the user switched to the other section (without navigating), show
  // the cached items for that section. activePath stays as the real page
  // permalink — no items will highlight, which is correct until they navigate.
  const cachedItems = sidebars[userType]?.items;
  const displayItems = (userType !== currentType && cachedItems) ? cachedItems : props.sidebar;

  return (
    <>
      <div className="sidebar-switcher">
        <UserTypeSwitcher />
      </div>
      <OriginalContent {...props} sidebar={displayItems} />
    </>
  );
}
