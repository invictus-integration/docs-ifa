import React from 'react';
import clsx from 'clsx';
import { NavbarSecondaryMenuFiller, ThemeClassNames } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import UserTypeSwitcher from '../../../components/UserTypeSwitcher';

const DocSidebarMobileSecondaryMenu = ({ sidebar, path }) => {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
      <li className="sidebar-switcher">
        <UserTypeSwitcher />
      </li>
      <DocSidebarItems
        items={sidebar}
        activePath={path}
        onItemClick={(item) => {
          if (item.type === 'category' && item.href) {
            mobileSidebar.toggle();
          }
          if (item.type === 'link') {
            mobileSidebar.toggle();
          }
        }}
        level={1}
      />
    </ul>
  );
};

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
