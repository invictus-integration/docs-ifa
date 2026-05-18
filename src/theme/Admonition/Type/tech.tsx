import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type { Props } from '@theme/Admonition/Type/Tip';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const infimaClassName = 'alert alert--tech';

const defaultProps = {
  icon: <FontAwesomeIcon icon={faGear} />,
  title: (
    <Translate id="theme.admonition.tech" description="The default label for the Tech admonition (:::tech)">
      Technical changes
    </Translate>
  ),
};

/* light: #014550 on #f0f9fa → 10.4:1  |  dark: #36b1c5 on #061619 → 7.4:1 */
const css = `
  .alert--tech {
    --ifm-alert-background-color: #f0f9fa;
    --ifm-alert-background-color-highlight: #d4eef1;
    --ifm-alert-foreground-color: #014550;
    --ifm-alert-border-color: #014550;
  }
  html[data-theme='dark'] .alert--tech {
    --ifm-alert-background-color: #061619;
    --ifm-alert-background-color-highlight: #0b2227;
    --ifm-alert-foreground-color: #36b1c5;
    --ifm-alert-border-color: #36b1c5;
  }
`;

export default function AdmonitionTypeTech(props: Props): JSX.Element {
  return (
    <>
      <style>{css}</style>
      <AdmonitionLayout {...defaultProps} {...props} className={clsx(infimaClassName, props.className)}>
        {props.children}
      </AdmonitionLayout>
    </>
  );
}
