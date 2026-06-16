import React from 'react';
import OriginalDocSidebarItemLink from '@theme-original/DocSidebarItem/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate,
  faShareNodes,
  faTriangleExclamation,
  faListOl,
  faClock,
  faCode,
  faRightLeft,
  faShieldHalved,
  faPlus,
  faHashtag,
  faLanguage,
  faRetweet,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const ICON_MAP = {
  'arrows-rotate': faArrowsRotate,
  'share-nodes': faShareNodes,
  'triangle-exclamation': faTriangleExclamation,
  'list-ol': faListOl,
  'clock': faClock,
  'code': faCode,
  'retweet': faRetweet,
  'shield-halved': faShieldHalved,
  'plus': faPlus,
  'hashtag': faHashtag,
  'language': faLanguage,
  'envelope': faEnvelope,
  'check': faCheck
};

export default function DocSidebarItemLink({ item, ...props }) {
  const iconKey = item.customProps?.icon;
  const icon = iconKey ? ICON_MAP[iconKey] : null;

  const modifiedItem = icon
    ? {
      ...item,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--ifm-color-primary)',
            flexShrink: 0,
          }}>
            <FontAwesomeIcon icon={icon} style={{ width: '0.7rem', height: '0.7rem', color: 'white' }} aria-hidden="true" />
          </span>
          {item.label}
        </span>
      ),
    }
    : item;

  return <OriginalDocSidebarItemLink item={modifiedItem} {...props} />;
}
