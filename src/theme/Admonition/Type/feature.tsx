import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type { Props } from '@theme/Admonition/Type/Tip';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const infimaClassName = 'alert alert--feature';

const defaultProps = {
  icon: <FontAwesomeIcon icon={faStar} />,
  title: (
    <Translate id="theme.admonition.feature" description="The default label for the Feature admonition (:::feature)">
      New features
    </Translate>
  ),
};

/* light: #166534 on #ecfdf5 → 6.7:1  |  dark: #4ade80 on #0a1f14 → 5.7:1 */
const css = `
  .alert--feature {
    --ifm-alert-background-color: #ecfdf5;
    --ifm-alert-background-color-highlight: #d1fae5;
    --ifm-alert-foreground-color: #166534;
    --ifm-alert-border-color: #1a8c3a;
  }
  html[data-theme='dark'] .alert--feature {
    --ifm-alert-background-color: #0a1f14;
    --ifm-alert-background-color-highlight: #0f2e1d;
    --ifm-alert-foreground-color: #4ade80;
    --ifm-alert-border-color: #4ade80;
  }
`;

export default function AdmonitionTypeFeature(props: Props): JSX.Element {
  return (
    <>
      <style>{css}</style>
      <AdmonitionLayout {...defaultProps} {...props} className={clsx(infimaClassName, props.className)}>
        {props.children}
      </AdmonitionLayout>
    </>
  );
}
