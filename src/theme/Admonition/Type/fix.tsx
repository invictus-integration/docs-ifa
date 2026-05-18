import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type { Props } from '@theme/Admonition/Type/Tip';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';

const infimaClassName = 'alert alert--fix';

const defaultProps = {
  icon: <FontAwesomeIcon icon={faBug} />,
  title: (
    <Translate id="theme.admonition.fix" description="The default label for the Fix admonition (:::fix)">
      Bug fixes
    </Translate>
  ),
};

/* light: #92400e on #fff7ed → 7.1:1  |  dark: #ff970f on #1c1106 → 8.8:1 */
const css = `
  .alert--fix {
    --ifm-alert-background-color: #fff7ed;
    --ifm-alert-background-color-highlight: #fed7aa;
    --ifm-alert-foreground-color: #92400e;
    --ifm-alert-border-color: #92400e;
  }
  html[data-theme='dark'] .alert--fix {
    --ifm-alert-background-color: #1c1106;
    --ifm-alert-background-color-highlight: #2a1a09;
    --ifm-alert-foreground-color: #ff970f;
    --ifm-alert-border-color: #ff970f;
  }
`;

export default function AdmonitionTypeFix(props: Props): JSX.Element {
  return (
    <>
      <style>{css}</style>
      <AdmonitionLayout {...defaultProps} {...props} className={clsx(infimaClassName, props.className)}>
        {props.children}
      </AdmonitionLayout>
    </>
  );
}
