import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import PraiseAdmonition from './Type/praise';

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  'praise': PraiseAdmonition,
};

export default AdmonitionTypes;