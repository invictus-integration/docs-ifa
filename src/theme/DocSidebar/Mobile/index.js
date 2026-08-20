import React, { useEffect } from 'react';
import { NavbarSecondaryMenuFiller } from '@docusaurus/theme-common';
import { useMobileNav } from '../../../components/MobileNavContext';

// Populates MobileNavContext with the CURRENT page's real sidebar, so the
// audience overlay in Navbar/Layout (rendered outside the doc page's
// DocsSidebarProvider tree) can display it.
function DocSidebarMobileSecondaryMenu({ sidebar, path }) {
  const { setSidebar } = useMobileNav();

  useEffect(() => {
    setSidebar({ items: sidebar, path });
  }, [sidebar, path, setSidebar]);

  return null;
}

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
