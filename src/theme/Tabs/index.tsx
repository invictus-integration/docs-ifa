import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useScrollPositionBlocker,
  useTabsContextValue,
  useTabs,
  sanitizeTabsChildren,
  TabsProvider,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props} from '@theme/Tabs';
import {TabsA11yProvider, useTabId, useTabPanelId} from './a11yContext';
import styles from './styles.module.css';

type TabValue = ReturnType<typeof useTabs>['tabValues'][number];

// Docusaurus's own TabsProps doesn't expose a way to name the tablist for
// assistive tech. We accept these as extra, optional props so MDX authors
// can give each <Tabs> instance a distinct accessible name — this matters
// most when a page has more than one <Tabs> (e.g. two tab groups both
// offering "Consumption"/"Standard" choices), where AT users jumping
// between tab widgets would otherwise hear an indistinguishable "tab list"
// for each one. See WAI-ARIA APG Tabs Pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
type TabsA11yProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

function TabListItem({
  value,
  label,
  attributes,
  isSelected,
  onKeydown,
  onClick,
  innerRef,
}: {
  value: string;
  label?: string;
  attributes?: TabValue['attributes'];
  isSelected: boolean;
  onKeydown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
  onClick: (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => void;
  innerRef: (ref: HTMLLIElement | null) => void;
}) {
  // Links this tab to its panel via aria-controls/id/aria-labelledby so
  // assistive tech can announce which panel a tab controls (and vice versa),
  // per the WAI-ARIA Tabs Pattern.
  const tabId = useTabId(value);
  const panelId = useTabPanelId(value);

  return (
    <li
      role="tab"
      id={tabId}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      aria-selected={isSelected}
      ref={innerRef}
      onKeyDown={onKeydown}
      onClick={onClick}
      {...attributes}
      className={clsx(
        'tabs__item',
        styles.tabItem,
        attributes?.className as string,
        {
          'tabs__item--active': isSelected,
        },
      )}>
      {label ?? value}
    </li>
  );
}

function TabList({
  className,
  ariaLabel,
  ariaLabelledby,
}: {
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}) {
  const {selectedValue, selectValue, tabValues, block} = useTabs();

  const tabRefs: (HTMLLIElement | null)[] = [];
  const {blockElementScrollPositionUntilNextRender} =
    useScrollPositionBlocker();

  const handleTabChange = (
    event:
      | React.FocusEvent<HTMLLIElement>
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex]!.value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement: HTMLLIElement | null = null;

    switch (event.key) {
      case 'Enter':
      case ' ': {
        // WAI-ARIA manual activation model: both Enter and Space should
        // activate the currently focused tab.
        event.preventDefault();
        handleTabChange(event);
        break;
      }
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0]!;
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1]!;
        break;
      }
      case 'Home': {
        event.preventDefault();
        focusElement = tabRefs[0]!;
        break;
      }
      case 'End': {
        event.preventDefault();
        focusElement = tabRefs[tabRefs.length - 1]!;
        break;
      }
      default:
        break;
    }

    focusElement?.focus();
  };

  return (
    <ul
      role="tablist"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={clsx(
        'tabs',
        {
          'tabs--block': block,
        },
        className,
      )}>
      {tabValues.map(({value, label, attributes}) => (
        <TabListItem
          key={value}
          value={value}
          label={label}
          attributes={attributes}
          isSelected={selectedValue === value}
          onKeydown={handleKeydown}
          onClick={handleTabChange}
          innerRef={(ref) => {
            tabRefs.push(ref);
          }}
        />
      ))}
    </ul>
  );
}

function TabContent({children}: {children: ReactNode}) {
  return <div className="margin-top--md">{children}</div>;
}

function TabsContainer({
  className,
  children,
  ariaLabel,
  ariaLabelledby,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  ariaLabelledby?: string;
}): ReactNode {
  return (
    <div
      className={clsx(
        ThemeClassNames.tabs.container,
        // former name kept for backward compatibility
        // see https://github.com/facebook/docusaurus/pull/4086
        'tabs-container',
        styles.tabList,
      )}>
      <TabList
        // Surprising but historical
        // className is applied on TabList, not on TabsContainer
        className={className}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
      />
      <TabContent>{children}</TabContent>
    </div>
  );
}

export default function Tabs(props: Props & TabsA11yProps): ReactNode {
  const isBrowser = useIsBrowser();
  const value = useTabsContextValue(props);
  const ariaLabel = props['aria-label'];
  const ariaLabelledby = props['aria-labelledby'];
  return (
    <TabsA11yProvider>
      <TabsProvider
        value={value}
        // Remount tabs after hydration
        // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
        key={String(isBrowser)}>
        <TabsContainer
          className={props.className}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}>
          {sanitizeTabsChildren(props.children)}
        </TabsContainer>
      </TabsProvider>
    </TabsA11yProvider>
  );
}
