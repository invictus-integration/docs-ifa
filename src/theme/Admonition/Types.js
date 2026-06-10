import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import PraiseAdmonition from './Type/praise';
import TipAdmonition from './Type/tip';
import InfoAdmonition from './Type/info';
import WarningAdmonition from './Type/warning';
import DangerAdmonition from './Type/danger';
import NoteAdmonition from './Type/note';

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  'praise': PraiseAdmonition,
  'tip': TipAdmonition,
  'info': InfoAdmonition,
  'warning': WarningAdmonition,
  'danger': DangerAdmonition,
  'note': NoteAdmonition
};

export default AdmonitionTypes;