import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useTabs} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/TabItem';
import {useTabId, useTabPanelId} from '../Tabs/a11yContext';

import styles from './styles.module.css';

function TabItemPanel({
  children,
  className,
  hidden,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  hidden?: boolean;
  id: string;
  labelledBy: string;
}) {
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      // Focusable so keyboard users can Tab into panel content that has no
      // focusable elements of its own, per the WAI-ARIA Tabs Pattern.
      tabIndex={0}
      className={clsx(styles.tabItem, className)}
      {...{hidden}}>
      {children}
    </div>
  );
}

export default function TabItem({
  children,
  className,
  value,
}: Props): ReactNode {
  const {selectedValue, lazy} = useTabs();
  const isSelected = value === selectedValue;
  // Mirrors the id linking set up on the corresponding tab in Tabs/index.tsx.
  const panelId = useTabPanelId(value);
  const tabId = useTabId(value);

  // TODO Docusaurus v4: use <Activity> ?
  if (!isSelected && lazy) {
    return null;
  }

  return (
    <TabItemPanel
      className={className}
      hidden={!isSelected}
      id={panelId}
      labelledBy={tabId}>
      {children}
    </TabItemPanel>
  );
}
