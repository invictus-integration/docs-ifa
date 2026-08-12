import React, { useEffect } from 'react';
import { NavbarSecondaryMenuFiller } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useMobileNav } from '../../../components/MobileNavContext';

// Populates MobileNavContext so the overlay in Navbar/Layout can render sidebar
// items for either section without needing to navigate first.
function DocSidebarMobileSecondaryMenu({ sidebar, path, sidebarName }) {
  const { setSidebarForType } = useMobileNav();

  useEffect(() => {
    // Use the sidebar's explicit name (from DocsSidebarProvider in DocPage context)
    // as the ground truth for which section this sidebar belongs to.
    // This avoids all URL-path parsing and race conditions.
    const type = sidebarName === 'technical_users' ? 'technical' : 'business';
    setSidebarForType(type, { items: sidebar, path });
  }, [sidebar, path, sidebarName, setSidebarForType]);

  return null;
}

function DocSidebarMobile(props) {
  // useDocsSidebar() works here because DocSidebarMobile is rendered inside
  // DocPage which wraps children with DocsSidebarProvider.
  const docsSidebar = useDocsSidebar();
  const extendedProps = { ...props, sidebarName: docsSidebar?.name ?? '' };

  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={extendedProps}
    />
  );
}

export default React.memo(DocSidebarMobile);
