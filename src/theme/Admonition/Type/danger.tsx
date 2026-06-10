import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type { Props } from '@theme/Admonition/Type/Danger';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import styles from './danger.module.css';

const infimaClassName = 'alert alert--danger';

const defaultProps = {
  icon: <FontAwesomeIcon icon={faFire} />,
  title: (
    <Translate
      id="theme.admonition.danger"
      description="The default label used for the Danger admonition (:::danger)">
      danger
    </Translate>
  ),
};

export default function AdmonitionTypeDanger(props: Props): JSX.Element {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, styles.admonition, props.className)}>
      {props.children}
    </AdmonitionLayout>
  );
}
