import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import AdmonitionLayout from '@theme/Admonition/Layout';
import type { Props } from '@theme/Admonition/Layout';

type CreateAdmonitionTypeOptions = {
  /** e.g. 'alert alert--danger' */
  infimaClassName: string;
  icon: ReactNode;
  title: ReactNode;
  /** `styles.admonition` from the type's own CSS module, if it has one. */
  admonitionClassName?: string;
};

/**
 * Builds a swizzled `@theme/Admonition/Type/*` component. Every admonition
 * type only differs in its Infima class, icon, default title, and CSS
 * module — this factory holds the boilerplate they'd otherwise all repeat.
 */
export default function createAdmonitionType({
  infimaClassName,
  icon,
  title,
  admonitionClassName,
}: CreateAdmonitionTypeOptions) {
  const defaultProps = { icon, title };

  return function AdmonitionType(props: Props): ReactNode {
    return (
      <AdmonitionLayout
        {...defaultProps}
        {...props}
        className={clsx(infimaClassName, admonitionClassName, props.className)}>
        {props.children}
      </AdmonitionLayout>
    );
  };
}
