// Unit tests for readability.mjs's text-structure detection logic.
//
// Run with:  node --test .github/scripts/readability.test.mjs
// (Node's built-in test runner — no extra dependency needed.)

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  isListBlock,
  splitIntroAndList,
  toPlainText,
  countSyllables,
  extractSections,
  analyzeText,
  getThresholds,
  dcSentencePreview,
  difficultWordsInSentence,
} from './readability.mjs';

describe('isListBlock()', () => {
  test('recognizes a pure bullet list', () => {
    const block = '* item one\n* item two\n* item three';
    assert.ok(isListBlock(block), 'expected a pure bullet list to be recognized as a list');
  });

  test('recognizes a pure numbered list', () => {
    const block = '1. item one\n2. item two';
    assert.ok(isListBlock(block), 'expected a pure numbered list to be recognized as a list');
  });

  test('a heading directly above a list does not disqualify it', () => {
    const block = '### Required deployment\n* item one\n* item two';
    assert.ok(isListBlock(block), 'expected a heading directly above a list to be recognized as a list');
  });

  test('a JSX wrapper tag directly above/around a list does not disqualify it', () => {
    const block = '<Features>\n* item one\n* item two\n</Features>';
    assert.ok(isListBlock(block), 'expected a JSX wrapper around a list to be recognized as a list');
  });

  test('a plain paragraph with no list items is not a list', () => {
    const block = 'This is one sentence. This is another sentence.';
    assert.ok(!isListBlock(block), 'expected a plain paragraph with no list items to not be recognized as a list');
  });

  test('a prose lead-in directly above a list is not itself a pure list', () => {
    const block = 'Each flow shows how many messages are in each state:\n* Active\n* Completed\n* Error';
    assert.ok(!isListBlock(block), 'expected a prose lead-in directly above a list to not be recognized as a pure list');
  });
});

describe('splitIntroAndList() — announcing a list with a lead-in sentence', () => {
  test('splits a short lead-in from an immediately-following pure list', () => {
    const block = [
      'The Dashboard home page shows the status of all your flows.',
      'Each flow shows how many messages are in each state:',
      '* **Active:** messages the flow is working on now.',
      '* **Completed:** messages the flow has done with no errors.',
      '* **Error:** messages the flow has paused, held, or stopped.',
    ].join('\n');

    const result = splitIntroAndList(block);
    assert.ok(result, 'expected the block to split into an intro and a list');
    assert.match(result.intro, /Each flow shows/);
    assert.doesNotMatch(result.intro, /Active/, 'list items must not leak into the intro half');
    assert.match(result.list, /Active/);
    assert.match(result.list, /Error/);
    assert.doesNotMatch(result.list, /Dashboard home page/, 'prose must not leak into the list half');
  });

  test('does not split a plain dense paragraph that has no list at all', () => {
    const block = 'This is one sentence. This is two. This is three. This is four. This is five.';
    assert.ok(!splitIntroAndList(block), 'expected a plain dense paragraph with no list to not be split');
  });

  test('does not split when prose interrupts the list partway through', () => {
    const block = '* item one\n* item two\nBut then more prose appears here.\n* item three';
    assert.ok(!splitIntroAndList(block), 'expected a list interrupted by prose to not be split');
  });

  test('does not split a pure list with no lead-in (already handled by isListBlock)', () => {
    const block = '* item one\n* item two\n* item three';
    assert.ok(!splitIntroAndList(block), 'expected a pure list with no lead-in to not be split');
  });

  test('still splits when a heading sits above the lead-in and list (dashboard/installation/index.mdx case)', () => {
    // Regression test: a heading directly above a lead-in-plus-list block
    // (no blank line separating any of them) used to make splitIntroAndList()
    // bail out entirely — because its intro-line check rejected headings —
    // silently falling back to scoring the whole block as "para" using a
    // near-meaningless derived sentence count (list items rarely end in a
    // period), so a too-long list here could slip past the list-item-count
    // check undetected. Headings must be dropped before the intro/list split,
    // the same way isListBlock() already ignores them.
    const block = [
      '### Required deployment',
      'An Azure Virtual Network',
      '- Including two subnets, one for each',
      '  - Private Endpoints',
      '  - Container App Environment',
      '- The subnets must have the following services enabled',
    ].join('\n');

    const result = splitIntroAndList(block);
    assert.ok(result, 'expected the block to split despite the leading heading');
    assert.match(result.intro, /Azure Virtual Network/);
    assert.doesNotMatch(result.intro, /Required deployment/, 'the heading itself must not leak into the intro text');
    assert.equal(result.list.split('\n').filter(l => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(l)).length, 4);
  });
});

describe('toPlainText() — label-bearing self-closing JSX components', () => {
  test('preserves a label="..." prop value instead of deleting the whole tag', () => {
    const raw = 'Fill in the <TextInput label="Username" /> field.';
    const plain = toPlainText(raw);
    assert.match(plain, /Username/);
  });

  test('does not confuse aria-label with label', () => {
    const raw = 'Go to <Button aria-label="Close dialog" /> to dismiss.';
    const plain = toPlainText(raw);
    assert.doesNotMatch(plain, /Close dialog/);
  });

  test('splits a bold "Label:" list-item prefix into its own sentence', () => {
    const raw = '- **Added:** support for dark mode.';
    const plain = toPlainText(raw);
    assert.match(plain, /Added\.\s+support for dark mode\./);
  });
});

describe('countSyllables() — familiar product/brand nouns', () => {
  test('scores allow-listed brand nouns as a single syllable', () => {
    assert.equal(countSyllables('Invictus'), 1);
    assert.equal(countSyllables('Microsoft'), 1);
    assert.equal(countSyllables('Azure'), 1);
  });

  test('still counts syllables normally for words not on the allowlist', () => {
    assert.ok(countSyllables('security') > 1);
  });
});

describe('analyzeText() — Dale-Chall difficult-word score', () => {
  test('scores plain, everyday vocabulary as easy (low dc)', () => {
    const text = 'You can add a new user. Then you can give the user a role. '
      + 'The user will see the page after they sign in. This is easy to do. '
      + 'You can also remove a user at any time. Just open the page and pick the user you want. '
      + 'Then click the button to remove them. It only takes a moment to finish.';
    const stats = analyzeText(text);
    assert.ok(stats?.dc !== null && stats?.dc !== undefined, 'expected enough words/sentences to produce a Dale-Chall score');
    assert.ok(stats.dc < 8, `expected a low Dale-Chall score for simple text, got ${stats.dc}`);
  });

  test('scores jargon-heavy technical vocabulary as harder (high dc)', () => {
    const text = 'The Transco component promotes properties from a relational database table. '
      + 'It transforms XML content using an XPath expression against the incoming payload. '
      + 'The subscription filters messages using a JPath predicate against the payload structure. '
      + 'The pipeline serializes the payload before it forwards the transaction to the downstream endpoint. '
      + 'A correlation identifier links the request to its corresponding acknowledgement message. '
      + 'The orchestrator retries the transaction whenever the destination system returns a transient error.';
    const stats = analyzeText(text);
    assert.ok(stats?.dc !== null && stats?.dc !== undefined, 'expected enough words/sentences to produce a Dale-Chall score');
    assert.ok(stats.dc > 8, `expected a high Dale-Chall score for jargon-heavy text, got ${stats.dc}`);
  });

  test('familiar brand nouns do not count as difficult words', () => {
    const text = 'Invictus works with Microsoft Azure. You can use the Dashboard to see your data. '
      + 'Each user can sign in and view their own flows. This makes the app easy to use for everyone. '
      + 'You do not need any special training to get started. Anyone on the team can learn it fast. '
      + 'The screens are simple and the steps are short.';
    const stats = analyzeText(text);
    assert.ok(stats?.dc !== null && stats?.dc !== undefined, 'expected enough words/sentences to produce a Dale-Chall score');
    assert.ok(stats.dc < 8, `expected brand nouns to not inflate the Dale-Chall score, got ${stats.dc}`);
  });
});

describe('getThresholds() — Dale-Chall enforcement scope', () => {
  test('business docs enforce a Dale-Chall ceiling', () => {
    const thresholds = getThresholds('versioned_docs/version-v6.0.0/dashboard/security/01_users.mdx');
    assert.equal(typeof thresholds.dcMax, 'number');
  });

  test('technical docs skip the Dale-Chall check entirely (jargon is expected)', () => {
    // Framework/technical docs are inherently full of domain vocabulary
    // (SQL, XPath, Transco, …) that will never appear in a familiar-word
    // list, regardless of how simply the sentences are written — enforcing
    // Dale-Chall there would just produce corpus-wide false positives.
    const thresholds = getThresholds('versioned_docs/version-v6.0.0/framework/transcoV2.mdx');
    assert.equal(thresholds.dcMax, null);
  });
});

describe('dcSentencePreview() — points at the actual unfamiliar words', () => {
  test('highlights the difficult words in the sentence that has the most of them', () => {
    // Regression test: the Dale-Chall preview used to reuse
    // longestSentencePreview() (the same "longest sentence" preview used by
    // FK/FRE/CL/LIX), which is meaningless for a difficult-*word* check —
    // it could show a short, simple-looking sentence while giving no clue
    // which words actually triggered the warning. The dc preview must
    // instead surface the sentence with the most unfamiliar words, with
    // those words marked so they're easy to spot.
    const sentences = [
      'You can sign in and see your data.',
      'Your tenant manages Microsoft Entra ID users.',
    ];
    const preview = dcSentencePreview(sentences);
    // "Microsoft" is an allow-listed familiar proper noun, and "Entra ID" is
    // recognized as a single familiar brand term (not "Entra" + bare "ID"),
    // so only the genuinely unfamiliar words get highlighted.
    assert.match(preview, /Your \*tenant\* \*manages\* Microsoft Entra ID \*users\*\./i);
  });

  test('falls back to the longest sentence when no sentence has difficult words', () => {
    const sentences = ['This is a simple sentence.', 'This one is also very simple and easy to read.'];
    const preview = dcSentencePreview(sentences);
    assert.equal(preview, 'This one is also very simple and easy to read.');
  });
});

describe('difficultWordsInSentence()', () => {
  test('returns only the words not on the familiar-word list', () => {
    const words = difficultWordsInSentence('Your tenant manages Microsoft Entra ID users.');
    assert.ok(words.includes('tenant'));
    assert.ok(!words.includes('Your'), '"Your" is a common familiar word and should not be flagged');
  });

  test('treats "Entra ID" as a single familiar term, not "Entra" + a bare "ID"', () => {
    // "ID" alone reads as an unfamiliar/ambiguous abbreviation, but "Entra ID"
    // together is a well-known product name readers instantly recognize —
    // it should never be split and partially flagged as difficult.
    const words = difficultWordsInSentence('Your Entra ID tenant manages users.');
    assert.ok(!words.includes('id'), '"Entra ID" should be recognized as one familiar term');
    assert.ok(!words.includes('entra'));
  });
});

describe('extractSections() — collapsible content detection', () => {
  test('only the first <ReleaseVersion> is treated as primary; the rest are collapsed', () => {
    const content = [
      '<ReleaseVersion version="6.4">',
      'Latest release notes text.',
      '</ReleaseVersion>',
      '<ReleaseVersion version="6.3">',
      'Older release notes text.',
      '</ReleaseVersion>',
    ].join('\n');

    const { primary, collapsed } = extractSections(content);
    assert.match(primary.text, /Latest release notes text/);
    assert.doesNotMatch(primary.text, /Older release notes text/);
    assert.equal(collapsed.length, 1);
    assert.match(collapsed[0].text, /Older release notes text/);
  });

  test('<summary> content is excluded from prose scoring entirely', () => {
    const content = '<details>\n<summary>**Add an Entra ID user**</summary>\nReal body text goes here.\n</details>';
    const { collapsed } = extractSections(content);
    assert.equal(collapsed.length, 1);
    assert.doesNotMatch(collapsed[0].text, /Add an Entra ID user/);
    assert.match(collapsed[0].text, /Real body text/);
  });
});
