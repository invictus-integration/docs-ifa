import React, {createContext, useContext, useId, type ReactNode} from 'react';

/**
 * Provides a unique, stable id prefix per <Tabs> instance so that each tab
 * button and its associated tabpanel can be linked with matching
 * `aria-controls` / `id` / `aria-labelledby` attributes, per the WAI-ARIA
 * Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * @docusaurus/theme-common's tab context does not expose such an id, so we
 * track it in a small sibling context shared between the ejected
 * `Tabs` and `TabItem` components.
 */
const TabsA11yContext = createContext<string | null>(null);

export function TabsA11yProvider({children}: {children: ReactNode}) {
  const instanceId = useId();
  return (
    <TabsA11yContext.Provider value={instanceId}>
      {children}
    </TabsA11yContext.Provider>
  );
}

function useTabsInstanceId(): string {
  const instanceId = useContext(TabsA11yContext);
  if (instanceId === null) {
    throw new Error('useTabsInstanceId() must be used within a <Tabs> component');
  }
  return instanceId;
}

export function useTabId(value: string): string {
  return `${useTabsInstanceId()}-tab-${value}`;
}

export function useTabPanelId(value: string): string {
  return `${useTabsInstanceId()}-panel-${value}`;
}
