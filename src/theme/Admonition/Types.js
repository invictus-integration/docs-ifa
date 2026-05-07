import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import PraiseAdmonition from './Type/praise';
import FeatureAdmonition from './Type/feature';
import TechAdmonition from './Type/tech';
import FixAdmonition from './Type/fix';

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  'praise': PraiseAdmonition,
  'feature': FeatureAdmonition,
  'tech': TechAdmonition,
  'fix': FixAdmonition,
};

export default AdmonitionTypes;