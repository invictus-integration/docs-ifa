#!/usr/bin/env node
/**
 * Readability checker for MDX documentation and dynamic data files.
 *
 * Validates readability separately for:
 *   - Primary content  (always visible to the reader)
 *   - Collapsed content (<details>, <Collapsible>, non-first <ReleaseVersion>) per section
 *   - Dynamic data files: FAQ (faq.v6.json), Glossary (glossary.v6.json),
 *     and Bicep parameters (framework/dashboard .v6.bicep.parameters.json)
 *
 * Thresholds mirror vale.ini audience segments:
 *   Business docs  → FK ≤ 8,  FRE ≥ 70, Dale-Chall ≤ 9.5
 *   Technical docs → FK ≤ 14, FRE ≥ 30, Dale-Chall not enforced (see THRESHOLDS comment)
 *
 * Additional neurodiverse-friendly checks (both sections):
 *   - Average sentence length ≤ 20 words
 *
 * Each failure includes:
 *   - GitHub annotation with file path and line number
 *   - A preview of the most problematic sentence
 *   - A concrete suggestion for how to fix it
 *
 * Usage:
 *   node readability.mjs [target]
 *
 *   target can be:
 *     - A directory (default: versioned_docs) → scans all files
 *     - A single .mdx or .md file            → checks only that file
 *     - A single .json data file             → checks only that file's entries
 *       (faq.v6.json, glossary.v6.json, *.bicep.parameters.json)
 */

import { readFileSync, readdirSync, statSync, appendFileSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { pathToFileURL } from 'url';
import process from 'process';

// ── Environment ──────────────────────────────────────────────────────────────

const IS_GH_ACTIONS = !!process.env.GITHUB_ACTIONS;

// ANSI codes — all no-ops in CI so annotations stay plain text
const c = IS_GH_ACTIONS ? Object.fromEntries(
  ['reset','bold','dim','italic','cyan','yellow','green','gray','red'].map(k => [k, ''])
) : {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  italic: '\x1b[3m',
  cyan:   '\x1b[36m',
  yellow: '\x1b[33m',
  green:  '\x1b[32m',
  gray:   '\x1b[90m',
  red:    '\x1b[31m',
};

// ── Thresholds ───────────────────────────────────────────────────────────────

const TECH_FILE_PATTERNS = [
  /versioned_docs\/.*\/framework\//,
  /versioned_docs\/.*\/dashboard\/installation\//,
  /versioned_docs\/.*\/dashboard\/flows\/04_import-flow-traces\//,
  /versioned_docs\/.*\/(technical|architecture-diagram)\.mdx?$/,
  /versioned_docs\/.*\/support\/(migrate|release-notes)/,
];

const THRESHOLDS = {
  // dcMax (Dale-Chall) is only enforced for business docs: the formula scores
  // any word outside a ~3,000-word list familiar to a 4th-grade reader as
  // "difficult", which unavoidably flags nearly all integration/technical
  // vocabulary (XPath, SQL, dependency, backend, Transco, …) regardless of
  // how simply a sentence is written. For a technical audience that already
  // knows this jargon, that's not a real readability problem — so tech docs
  // skip this check (dcMax: null) rather than produce corpus-wide noise.
  business: { fkMax: 8,  freMin: 70, clMax: 12, lixMax: 42, dcMax: 9.5,  lenMax: 20, maxLen: 35, paraMax: 4, listMax: 8  },
  tech:     { fkMax: 14, freMin: 30, clMax: 16, lixMax: 55, dcMax: null, lenMax: 25, maxLen: 40, paraMax: 6, listMax: 10 },
};

function getThresholds(filePath) {
  const p = filePath.replace(/\\/g, '/');
  return TECH_FILE_PATTERNS.some(pattern => pattern.test(p))
    ? THRESHOLDS.tech
    : THRESHOLDS.business;
}

// ── Section extraction ───────────────────────────────────────────────────────

/**
 * Converts a `<summary>...</summary>` line to plain text for primary-content
 * scoring. By HTML/ARIA semantics, `<summary>` is the clickable disclosure
 * label for a `<details>`/`<Collapsible>` block — a short title, not a
 * sentence of running prose (confirmed across the corpus: every `<summary>`
 * usage is a few-word label, e.g. "Add an Entra ID user", never multi-sentence
 * text). So — like a markdown `#` heading — it's excluded entirely from
 * prose analysis. Without this, short jargon-heavy labels get scored
 * alongside real sentences and skew Flesch Reading Ease/FK/CL/LIX even
 * though the actual paragraphs are simple and short.
 * Returns null (nothing to score).
 */
function summaryLineToPrimaryText(line) {
  return null;
}

/**
 * Splits MDX content into primary (always visible) and collapsed sections.
 * <summary> content inside <details> is treated as primary — it's always shown.
 *
 * Returns:
 *   primary:  { text: string, startLine: number, startCol: number }
 *   collapsed: Array<{ text: string, startLine: number, startCol: number }>
 */
function extractSections(content) {
  const lines = content.split('\n');
  const primaryLines = [];
  const collapsedSections = [];

  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;
  let collapsibleDepth = 0;
  let currentCollapsed = null;
  let currentCollapsedStartLine = 1;
  let currentCollapsedStartCol = 1;
  let inSummary = false;
  let primaryStartLine = 1;
  let primaryStartCol = 1;
  let firstPrimaryLine = true;
  // <ReleaseVersion> entries (src/components/ReleaseNotes) collapse by
  // default except the very first one in the file — it mirrors the
  // `isLatest = index === 0` UX in ReleaseNotes/index.tsx, where only the
  // newest version is expanded on load and every older one starts collapsed.
  let releaseVersionCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Strip frontmatter block
    if (!frontmatterDone) {
      if (line.trim() === '---') {
        if (!inFrontmatter) { inFrontmatter = true; continue; }
        else { frontmatterDone = true; continue; }
      }
      if (inFrontmatter) continue;
    }

    // Track fenced code blocks — skip their content entirely
    if (/^```/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    let collapsibleMatch = line.match(/<(details|Collapsible)[\s>]/);
    let opensCollapsible = collapsibleMatch !== null;
    let closesCollapsible = /<\/(details|Collapsible)>/.test(line);

    const releaseVersionOpenMatch = currentCollapsed === null ? line.match(/<ReleaseVersion[\s>]/) : null;
    if (releaseVersionOpenMatch) {
      releaseVersionCount++;
      if (releaseVersionCount > 1) {
        collapsibleMatch = releaseVersionOpenMatch;
        opensCollapsible = true;
      }
    }
    if (currentCollapsed !== null && /<\/ReleaseVersion>/.test(line)) closesCollapsible = true;

    if (currentCollapsed === null) {
      if (opensCollapsible) {
        currentCollapsed = [];
        currentCollapsedStartLine = lineNumber;
        currentCollapsedStartCol = line.indexOf(collapsibleMatch[0]) + 1;
        collapsibleDepth = 1;
        // A <summary> opening on the same line as <details> is visible
        if (/<summary/.test(line)) {
          inSummary = true;
          const summaryText = summaryLineToPrimaryText(line);
          if (summaryText) primaryLines.push(summaryText);
          if (/<\/summary>/.test(line)) inSummary = false;
        }
        continue;
      }
      if (firstPrimaryLine && line.trim()) {
        primaryStartLine = lineNumber;
        primaryStartCol = line.search(/\S/) + 1;
        firstPrimaryLine = false;
      }
      primaryLines.push(line);
    } else {
      // Inside a collapsible block
      if (opensCollapsible) collapsibleDepth++;

      if (closesCollapsible) {
        collapsibleDepth--;
        if (collapsibleDepth === 0) {
          collapsedSections.push({ text: currentCollapsed.join('\n'), startLine: currentCollapsedStartLine, startCol: currentCollapsedStartCol });
          currentCollapsed = null;
          continue;
        }
      }

      // <summary> at depth 1 is always visible — redirect to primary
      if (/<summary/.test(line) && collapsibleDepth === 1) inSummary = true;
      if (inSummary) {
        const summaryText = summaryLineToPrimaryText(line);
        if (summaryText) primaryLines.push(summaryText);
        if (/<\/summary>/.test(line)) inSummary = false;
        continue;
      }

      currentCollapsed.push(line);
    }
  }

  // Unclosed collapsible block (malformed MDX) — treat remainder as primary
  if (currentCollapsed !== null) primaryLines.push(...currentCollapsed);

  return {
    primary: { text: primaryLines.join('\n'), startLine: primaryStartLine, startCol: primaryStartCol },
    collapsed: collapsedSections,
  };
}

// ── Text cleaning ────────────────────────────────────────────────────────────

/**
 * Strips all brace-delimited JSX expressions {…} with full nesting support.
 * Each top-level {…} becomes a single space regardless of nesting depth.
 *
 * Must run BEFORE JSX tag removal: attributes like `icon={<Foo />}` contain
 * a `>` inside the braces which confuses `[^>]*` tag-matching regexes.
 * Removing brace content first leaves clean attribute-free tags that the
 * JSX self-closing and pair regexes can then reliably match.
 */
function removeBraceExpressions(text) {
  let result = '';
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      if (depth > 0) depth--;
      else result += ch; // stray `}` not opened — pass through unchanged
    } else if (depth === 0) {
      result += ch;
    }
  }
  return result;
}

function toPlainText(raw) {
  return removeBraceExpressions(raw
    .replace(/^\uFEFF/, '')                                              // BOM character
    .replace(/import\s[^;]+;/g, '')                                     // import statements
    .replace(/:::[\w-]*[^\n]*/g, '')                                    // admonition markers (opening :::note and closing :::)
    .replace(/`{3}[^\n]*\n[\s\S]*?`{3}/g, '')                          // fenced code blocks
    .replace(/<table[\s\S]*?<\/table>/gi, '')                           // HTML tables (structured data, not prose)
    .replace(/`[^`\n]+`/g, ' ')                                        // inline code → remove (don't score code tokens)
  )                                                                     // remove all {…} JSX expressions (balanced-brace, any depth)
    .replace(/<[A-Z][A-Za-z]*[^>]*\slabel\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*\/>/g, ' $1$2 ') // self-closing components with a `label` prop (InputControls: <TextInput label="Username" />, <Folder label="Invoices" />, etc.) render that label as real visible text — keep it instead of discarding the whole tag. Requires a space before "label" so "aria-label" (not visible text) isn't matched too.
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, ' ')                          // self-closing JSX components <Badge /> (no label — nothing visible to preserve)
    .replace(/<([A-Z][A-Za-z]*)[^>]*>([\s\S]*?)<\/\1>/g, ' $2 ') // JSX component pairs <Foo>...</Foo> — strip tags, keep inner text
    .replace(/<[^>]+>/g, ' ')                                           // remaining HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')                               // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')                            // inline links → label text only
    .replace(/\[[^\]]+\]:\s*\S+[^\n]*/gm, '')                          // reference-style link definitions
    .replace(/https?:\/\/\S+/g, '')                                     // bare URLs
    .replace(/^\s*\|.+$/gm, '')                                            // table rows (data + separator) — structured data, not prose
    .replace(/^[-_*]{3,}\s*$/gm, '')                                    // thematic breaks (--- ___ ***)
    .replace(/^#{1,6}\s+.+$/gm, '')                                    // headings → removed (navigation labels, not prose)
    .replace(/^(\s*(?:[-*+]|\d+\.)\s+)\*\*([^*\n]+):\*\*(\s*)(?=\S)/gm, '$1$2. ') // list item "**Label:**" prefix (e.g. release notes "- **Feature name:** description") acts like a mini-heading — split into its own sentence so it doesn't fuse with the description that follows
    .replace(/\*{1,2}([^*\n]*)\*{1,2}/g, '$1')                         // bold/italic markers (balanced)
    .replace(/^\s*[-*+]\s+(.+?)\.?\s*$/gm, '$1. ')                     // unordered list items (any indent, before * cleanup) → each becomes a sentence
    .replace(/^\s*\d+\.\s+(.+?)\.?\s*$/gm, '$1. ')                     // ordered list items (any indent) → each becomes a sentence
    .replace(/\*/g, '')                                                 // remaining unbalanced asterisks (after list processing)
    .replace(/\s+/g, ' ')
    .replace(/[`\[\]]/g, '')                                            // remaining bare backticks and brackets
    .trim();
}

// ── Readability metrics ──────────────────────────────────────────────────────

// Brand/product proper nouns that appear constantly across this docs site.
// Readers already recognize these instantly — they aren't sounded out
// syllable-by-syllable the way genuinely unfamiliar vocabulary is — so
// counting their literal phonetic syllables overstates reading difficulty
// and unfairly drags down Flesch Reading Ease / FK grade on short, simple
// sentences (e.g. "Invictus manages Local users." scores as hard due to
// "Invictus" alone, even though no reader actually struggles with it).
const FAMILIAR_PROPER_NOUNS = new Set(['invictus', 'microsoft', 'entra', 'azure', 'dashboard']);

// Multi-word product/domain terms that should be treated as a single
// familiar "word" rather than as separate tokens — e.g. "Entra ID" is one
// recognizable brand term to readers, but scoring it as two words ("Entra"
// + the bare word "ID") let the generic "ID" half get flagged as an
// unfamiliar Dale-Chall word on its own, and inflated the word count used
// for avgWords/percentDifficultWords. Listed lowercase, space-separated;
// joined with a hyphen before analysis so it's counted/matched as one token.
const MULTI_WORD_FAMILIAR_TERMS = ['entra id'];

function joinMultiWordFamiliarTerms(text) {
  let joined = text;
  for (const term of MULTI_WORD_FAMILIAR_TERMS) {
    const pattern = new RegExp('\\b' + term.replace(/\s+/g, '\\s+') + '\\b', 'gi');
    joined = joined.replace(pattern, m => m.replace(/\s+/g, '-'));
  }
  return joined;
}

// The joined (hyphenated) form of each MULTI_WORD_FAMILIAR_TERMS entry, so
// isFamiliarWord() recognizes "entra-id" as familiar once joinMultiWordFamiliarTerms()
// has merged it into a single token.
const MULTI_WORD_FAMILIAR_TERMS_JOINED = new Set(MULTI_WORD_FAMILIAR_TERMS.map(t => t.replace(/\s+/g, '-')));

function countSyllables(word) {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  if (FAMILIAR_PROPER_NOUNS.has(lower)) return 1;
  let word2 = lower;
  if (!word2) return 0;
  if (word2.length <= 3) return 1;
  word2 = word2.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '');
  word2 = word2.replace(/^y/, '');
  const groups = word2.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

// New Dale-Chall readability formula: text is "difficult" when it uses words
// outside a fixed list of ~3000 words familiar to most 4th-grade readers.
// The list itself (dale-chall-word-list.txt) is the public Dale-Chall word
// list, one word per line, lowercase.
const FAMILIAR_WORDS = new Set(
  readFileSync(new URL('./dale-chall-word-list.txt', import.meta.url), 'utf8')
    .split('\n')
    .map(w => w.trim())
    .filter(Boolean),
);

/**
 * A word counts as "familiar" for Dale-Chall purposes if it's on the list
 * itself, one of our known brand/product proper nouns (see
 * FAMILIAR_PROPER_NOUNS above — readers recognize these instantly, the same
 * reasoning used for syllable counting), or a simple inflected form (plural,
 * past tense, -ing) of a word that's on the list — the official Dale-Chall
 * rules treat these regular forms as familiar too, since a reader who knows
 * "use" also recognizes "used"/"uses"/"using".
 */
function isFamiliarWord(wordLower) {
  if (FAMILIAR_WORDS.has(wordLower) || FAMILIAR_PROPER_NOUNS.has(wordLower) || MULTI_WORD_FAMILIAR_TERMS_JOINED.has(wordLower)) return true;
  if (wordLower.endsWith('es') && FAMILIAR_WORDS.has(wordLower.slice(0, -2))) return true;
  if (wordLower.endsWith('s') && FAMILIAR_WORDS.has(wordLower.slice(0, -1))) return true;
  if (wordLower.endsWith('ed') && (FAMILIAR_WORDS.has(wordLower.slice(0, -2)) || FAMILIAR_WORDS.has(wordLower.slice(0, -1)))) return true;
  if (wordLower.endsWith('ing') && (FAMILIAR_WORDS.has(wordLower.slice(0, -3)) || FAMILIAR_WORDS.has(wordLower.slice(0, -3) + 'e'))) return true;
  return false;
}


function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    // Require 3+ real words — filters out JSX artifacts like `, } />` or `= true,`
    .filter(s => (s.match(/\b[a-zA-Z'-]{2,}\b/g) ?? []).length > 2);
}

const LIST_ITEM_LINE = /^\s*(?:[-*+]|\d+\.)\s+\S/;

/**
 * A "paragraph" block (raw text, before list-items-become-sentences conversion)
 * counts as a bullet/numbered list when every non-blank line is a list item.
 * Lists are already visually chunked one-idea-per-line, so they get their own
 * (higher) item-count threshold instead of being judged as dense prose.
 */
function isListBlock(rawPara) {
  // Ignore heading lines (e.g. "### Required deployment") that sit directly
  // above a list with no blank line in between — they're not part of the
  // list itself and shouldn't disqualify the block from list detection.
  // Also ignore standalone JSX wrapper tag lines (e.g. "<Features>",
  // "</Features>", "<ReleaseVersion version=\"6.4\">") that group list items
  // without being list content themselves.
  const lines = rawPara.split('\n')
    .filter(l => l.trim().length > 0)
    .filter(l => !/^\s*#{1,6}\s+/.test(l))
    .filter(l => !/^\s*<\/?[A-Za-z][A-Za-z0-9]*(?:\s[^>]*)?>\s*$/.test(l));
  return lines.length > 0 && lines.every(l => LIST_ITEM_LINE.test(l));
}

/**
 * Detects a block that is really a short prose lead-in immediately followed
 * by a real list (e.g. "Each flow shows how many messages are in each
 * state:" then a bulleted list, with no blank line separating them).
 * Announcing a list with a lead-in sentence like this is a standard,
 * recommended technical-writing pattern (chunking/Miller's Law) — once
 * rendered, the list markers create their own visually distinct block, so
 * the lead-in and the list should be scored as two separate units instead of
 * being fused into one "dense paragraph" with an inflated sentence count.
 * Returns { intro, list } if the block splits cleanly this way (a run of
 * plain prose lines followed by a run of pure list-item lines), or null
 * otherwise — e.g. a pure list, a pure paragraph, or a list interrupted by
 * more prose partway through, which should keep using the existing
 * single-block logic rather than risk masking a genuinely dense paragraph.
 */
function splitIntroAndList(rawPara) {
  const isHeading = l => /^\s*#{1,6}\s+/.test(l);
  const isWrapperTag = l => /^\s*<\/?[A-Za-z][A-Za-z0-9]*(?:\s[^>]*)?>\s*$/.test(l);
  // Headings and JSX wrapper-tag lines aren't real prose or list content —
  // drop them first (mirrors isListBlock()'s own filtering) so a heading
  // directly above a lead-in sentence (e.g. "### Required deployment" then
  // "An Azure Virtual Network" then a list) doesn't wrongly disqualify the
  // block from being recognised as lead-in-plus-list.
  const lines = rawPara.split('\n')
    .filter(l => l.trim().length > 0)
    .filter(l => !isHeading(l) && !isWrapperTag(l));
  const firstListIdx = lines.findIndex(l => LIST_ITEM_LINE.test(l));
  if (firstListIdx <= 0) return null; // no list, or list starts at line 0
  const introLines = lines.slice(0, firstListIdx);
  const listLines = lines.slice(firstListIdx);
  const introIsProse = introLines.every(l => !LIST_ITEM_LINE.test(l));
  const listIsPure = listLines.every(l => LIST_ITEM_LINE.test(l));
  if (!introIsProse || !listIsPure) return null;
  return { intro: introLines.join('\n'), list: listLines.join('\n') };
}

function wordCount(sentence) {
  return (sentence.match(/\b[a-zA-Z'-]{2,}\b/g) ?? []).length;
}

/** Returns the longest sentence truncated to maxLen characters. */
function longestSentencePreview(sentences, maxLen = 120) {
  if (!sentences.length) return null;
  const longest = sentences.slice().sort((a, b) => wordCount(b) - wordCount(a))[0];
  return longest.length > maxLen ? longest.slice(0, maxLen - 1) + '…' : longest;
}

/**
 * Returns the words in a sentence that Dale-Chall counts as "difficult"
 * (not on the familiar-word list, see isFamiliarWord()).
 */
function difficultWordsInSentence(sentence) {
  const words = joinMultiWordFamiliarTerms(sentence).match(/\b[a-zA-Z'-]{2,}\b/g) ?? [];
  return words.filter(w => !isFamiliarWord(w.toLowerCase()));
}

/**
 * Dale-Chall failures are about *which words* are unfamiliar, not sentence
 * length — showing the longest sentence (like the other checks do) doesn't
 * tell the reader anything about the actual problem. Instead, this picks the
 * sentence with the most difficult words and marks each one with asterisks
 * (e.g. "The *orchestrator* retries the *transaction*.") so the preview
 * points straight at the vocabulary to simplify.
 */
function dcSentencePreview(sentences, maxLen = 160) {
  if (!sentences.length) return null;
  let best = null;
  let bestDifficult = [];
  for (const s of sentences) {
    const difficult = difficultWordsInSentence(s);
    if (difficult.length > bestDifficult.length) {
      best = s;
      bestDifficult = difficult;
    }
  }
  if (!best || bestDifficult.length === 0) return longestSentencePreview(sentences, maxLen);

  let highlighted = best;
  for (const w of new Set(bestDifficult.map(w => w.toLowerCase()))) {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    highlighted = highlighted.replace(new RegExp(`\\b(${escaped})\\b`, 'gi'), '*$1*');
  }
  return highlighted.length > maxLen ? highlighted.slice(0, maxLen - 1) + '…' : highlighted;
}

/**
 * Calculates Flesch-Kincaid grade level, Flesch Reading Ease,
 * and average words per sentence.
 * Returns null when there is not enough text to produce a meaningful score.
 */
function analyzeText(text) {
  const sentences = getSentences(text);
  const words = joinMultiWordFamiliarTerms(text).match(/\b[a-zA-Z'-]{2,}\b/g) ?? [];

  if (sentences.length < 2 || words.length < 15) return null;

  // Below 50 words, corpus-wide metrics (FK, FRE, CL, LIX) are unreliable —
  // a single multi-syllable product name shifts the score by a full grade level.
  // Sentence-length and paragraph density checks still run (they work per-sentence).
  const tooSmallForCorpusMetrics = words.length < 50;

  const syllables  = words.reduce((n, w) => n + countSyllables(w), 0);
  const chars      = words.reduce((n, w) => n + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const longWords  = words.filter(w => w.length >= 7).length;
  const difficultWords = words.filter(w => !isFamiliarWord(w.toLowerCase())).length;
  const avgWords     = words.length / sentences.length;
  const avgSyllables = syllables / words.length;
  const percentDifficultWords = (difficultWords / words.length) * 100;
  const L = (chars / words.length) * 100;       // avg letters per 100 words
  const S = (sentences.length / words.length) * 100; // avg sentences per 100 words

  const sentenceWordCounts = sentences.map(s => wordCount(s));
  const maxSentenceWords   = Math.max(...sentenceWordCounts);
  const longestSentence    = sentences[sentenceWordCounts.indexOf(maxSentenceWords)] ?? '';

  // New Dale-Chall raw score: 0.1579 * (% difficult words) + 0.0496 *
  // (avg words/sentence), plus a 3.6365 penalty once difficult words exceed
  // 5% of the text (the standard "unfamiliar vocabulary" cutoff).
  const dcRaw = 0.1579 * percentDifficultWords + 0.0496 * avgWords
    + (percentDifficultWords > 5 ? 3.6365 : 0);

  return {
    fk:              tooSmallForCorpusMetrics ? null : Math.round((0.39 * avgWords + 11.8 * avgSyllables - 15.59) * 10) / 10,
    fre:             tooSmallForCorpusMetrics ? null : Math.round((206.835 - 1.015 * avgWords - 84.6 * avgSyllables) * 10) / 10,
    cl:              tooSmallForCorpusMetrics ? null : Math.round((0.0588 * L - 0.296 * S - 15.8) * 10) / 10,
    lix:             tooSmallForCorpusMetrics ? null : Math.round((avgWords + (longWords * 100 / words.length)) * 10) / 10,
    dc:              tooSmallForCorpusMetrics ? null : Math.round(dcRaw * 10) / 10,
    wordCount:       words.length,
    sentenceCount:   sentences.length,
    avgWords:        Math.round(avgWords * 10) / 10,
    longWordCount:   longWords,
    difficultWordCount: difficultWords,
    percentDifficultWords: Math.round(percentDifficultWords * 10) / 10,
    maxSentenceWords,
    longestSentence,
    sentences,
  };
}

// ── Suggestion builders ──────────────────────────────────────────────────────

const SPLIT_CONJUNCTIONS = [', which', ', that', ', and', ', but', ', because', ', however', ', although', ', while', ', whereas'];
const SPLIT_CONJUNCTIONS_SOFT = [' because ', ' however ', ' although ', ' while ', ' which ', ' whereas '];

function buildLenSuggestion(longest) {
  for (const conj of SPLIT_CONJUNCTIONS) {
    const idx = longest.toLowerCase().indexOf(conj);
    if (idx > 15 && idx < longest.length - 10) {
      const before = longest.slice(0, idx).trim().replace(/,\s*$/, '');
      const after  = longest.slice(idx + conj.length).trim();
      const cap    = after.charAt(0).toUpperCase() + after.slice(1);
      const b = before.length > 55 ? '…' + before.slice(-52) : before;
      const a = cap.length    > 55 ? cap.slice(0, 52) + '…'  : cap;
      return [`Split at "${conj.trim()}":`, `Before: "${b}."`, `After:  "${a}."`].join('\n     ');
    }
  }
  for (const conj of SPLIT_CONJUNCTIONS_SOFT) {
    const idx = longest.toLowerCase().indexOf(conj);
    if (idx > 20 && idx < longest.length - 15) {
      const before = longest.slice(0, idx).trim().replace(/,\s*$/, '');
      const after  = longest.slice(idx + conj.length).trim();
      const cap    = after.charAt(0).toUpperCase() + after.slice(1);
      const b = before.length > 55 ? '…' + before.slice(-52) : before;
      const a = cap.length    > 55 ? cap.slice(0, 52) + '…'  : cap;
      return [`Split at "${conj.trim()}":`, `Before: "${b}."`, `After:  "${a}."`].join('\n     ');
    }
  }
  const colonCount = (longest.match(/:/g)     ?? []).length;
  const codeCount  = (longest.match(/\bcode\b/g) ?? []).length;
  if (colonCount >= 3 || codeCount >= 3) {
    return 'This looks like multiple items in one sentence. Use a bullet list or table so each item is its own line.';
  }
  return 'Look for "which", "that", "and", "but", "because" as natural split points to break this into two sentences.';
}

const STATIC_SUGGESTIONS = {
  fk:  'Rewrite with shorter sentences and simpler word choices. Aim for words your audience uses in everyday conversation.',
  fre: 'Simplify by using shorter sentences and more common words. Avoid unnecessary multi-syllable vocabulary.',
  cl:  'Reduce average word length. Where two words mean the same thing, prefer the shorter one.',
  lix: 'Too many long words (7+ characters). Where possible, replace them with shorter alternatives.',
  dc:  'Replace uncommon or technical words with everyday alternatives your audience already knows, or briefly define jargon on first use.',
  para:'Split at a natural topic boundary. Each paragraph should cover one idea. Aim for 3–5 sentences.',
  list:'Split into two lists under separate sub-headings, or trim to the most important items.',
};


function buildSuggestion(checkName, sentences) {
  if (checkName === 'len' || checkName === 'max') {
    const longest = sentences.slice().sort((a, b) => wordCount(b) - wordCount(a))[0] ?? '';
    return buildLenSuggestion(longest);
  }
  return STATIC_SUGGESTIONS[checkName] ?? '';
}

// ── Warning factory ──────────────────────────────────────────────────────────

function createWarning(filePath, startLine, startCol, label, checkName, stats, preview) {
  const messages = {
    fk:  `Flesch-Kincaid grade ${stats.fk} exceeds target of ≤${stats.fkMax} ` +
         `(${stats.wordCount} words, ${stats.sentenceCount} sentences, avg ${stats.avgWords} words/sentence)`,
    fre: `Flesch Reading Ease ${stats.fre} is below target of ≥${stats.freMin}`,
    cl:  `Coleman-Liau index ${stats.cl} exceeds target of ≤${stats.clMax} (character density too high)`,
    lix: `LIX score ${stats.lix} exceeds target of ≤${stats.lixMax} (${stats.longWordCount} long words of ${stats.wordCount} total)`,
    dc:  `Dale-Chall score ${stats.dc} exceeds target of ≤${stats.dcMax} (${stats.difficultWordCount} unfamiliar words, ${stats.percentDifficultWords}% of ${stats.wordCount} total)`,
    len: `Average sentence length is ${stats.avgWords} words (target: ≤${stats.lenMax})`,
    max: `Longest sentence is ${stats.maxSentenceWords} words (target: ≤${stats.maxLen}) — breaks reading flow`,
    para:`Paragraph has ${stats.sentenceCount} sentences (target: ≤${stats.paraMax}) — may overwhelm working memory`,
    list:`List has ${stats.sentenceCount} items (target: ≤${stats.listMax}) — long lists are harder to scan and remember`,
  };
  const suggestion = buildSuggestion(checkName, stats.sentences);
  return { filePath, startLine, startCol, label, checkName, message: messages[checkName], preview, suggestion };
}

// ── Check explanations (CI "why" context) ───────────────────────────────────

const CHECK_WHY = {
  fk:  'Flesch-Kincaid grade level estimates the years of education needed to read this text comfortably. ' +
       'A lower grade means more readers can understand it without effort.',
  fre: 'Flesch Reading Ease scores text from 0 (very hard) to 100 (very easy). ' +
       'Business docs should score ≥70; technical docs ≥30. Below the target, readers have to work harder to follow the text.',
  cl:  'Coleman-Liau measures character density — the average length of words. ' +
       'Longer words increase cognitive load even when sentences are short. Prefer shorter words where meaning is the same.',
  lix: 'LIX measures the proportion of long words (7+ characters). ' +
       'A high ratio signals dense vocabulary that slows readers down, particularly non-native speakers and neurodiverse readers.',
  dc:  'Dale-Chall measures the share of words outside a list of ~3,000 words familiar to most 4th-grade readers. ' +
       'A high score signals unfamiliar or jargon-heavy vocabulary — even short, simple sentences are harder to read if they\'re full of uncommon words.',
  len: 'Long average sentence length forces readers to hold more information in working memory before reaching the end of a thought. ' +
       'This is especially taxing for readers with ADHD or working memory differences.',
  max: 'A single very long sentence disrupts reading flow even when the rest of the text is concise. ' +
       'Readers must hold the entire sentence in memory to understand its structure and meaning.',
  para:'Dense paragraphs without visual breaks overwhelm working memory. ' +
       'Paragraph breaks act as cognitive rest points — particularly important for neurodiverse readers who benefit from chunked information.',
  list:'Very long lists are hard to scan and remember, even though each item is already on its own line. ' +
       'Miller\'s Law suggests working memory holds about 4 chunks of novel information — split long lists under sub-headings or trim to the essentials.',
};

// ── Output rendering ─────────────────────────────────────────────────────────

const SEP = '  ' + '─'.repeat(66);

function renderCIAnnotation(w) {
  // Concise single-line annotation for the PR diff view
  const fix = w.suggestion.replace(/\n\s*/g, ' // ');
  return `::warning file=${w.filePath},line=${w.startLine},col=${w.startCol}::` +
    `[${w.label}] ${w.message}. Fix: ${fix}`;
}

function printFileWarningsCI(relPath, warnings) {
  console.log(`\n::group::${relPath}`);
  for (const w of warnings) {
    console.log('');
    console.log(`  ⚠  ${w.label}  ·  line ${w.startLine}, col ${w.startCol}`);
    console.log(SEP);
    console.log(`  Why    ${CHECK_WHY[w.checkName]}`);
    console.log(`  Score  ${w.message}`);
    if (w.preview) {
      console.log(`  Quote  "${w.preview}"`);
    }
    const suggLines = w.suggestion.split('\n');
    console.log(`  Fix    ${suggLines[0]}`);
    for (const line of suggLines.slice(1)) {
      console.log(`         ${line}`);
    }
    console.log('');
    console.log(renderCIAnnotation(w));
  }
  console.log('::endgroup::');
}

const COL_WIDTH = 68;

function printFileWarningsLocal(relPath, warnings) {
  const shortPath = relPath.replace(/^versioned_docs\/[^/]+\//, '');
  const titlePad = Math.max(2, COL_WIDTH - shortPath.length - 5);
  console.log(`\n${c.bold}${c.cyan}┌─ ${shortPath} ${'─'.repeat(titlePad)}${c.reset}`);

  for (const w of warnings) {
    const location = `${c.gray}line ${w.startLine}, col ${w.startCol}${c.reset}`;
    console.log(`${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  ${c.yellow}⚠${c.reset}  ${c.bold}${w.label}${c.reset}  ${c.gray}·${c.reset}  ${location}`);
    console.log(`${c.cyan}│${c.reset}     ${c.dim}${CHECK_WHY[w.checkName]}${c.reset}`);
    console.log(`${c.cyan}│${c.reset}     ${c.yellow}${w.message}${c.reset}`);
    if (w.preview) {
      console.log(`${c.cyan}│${c.reset}     ${c.dim}${c.italic}"${w.preview}"${c.reset}`);
    }
    const suggLines = w.suggestion.split('\n');
    console.log(`${c.cyan}│${c.reset}     ${c.green}→ ${suggLines[0]}${c.reset}`);
    for (const line of suggLines.slice(1)) {
      console.log(`${c.cyan}│${c.reset}       ${c.green}${line}${c.reset}`);
    }
  }

  console.log(`${c.cyan}│${c.reset}`);
  console.log(`${c.bold}${c.cyan}└${'─'.repeat(COL_WIDTH)}${c.reset}`);
}

function printFileWarnings(relPath, warnings) {
  if (IS_GH_ACTIONS) printFileWarningsCI(relPath, warnings);
  else printFileWarningsLocal(relPath, warnings);
}

// ── Issue tracking (for summary) ─────────────────────────────────────────────

const issueLog = [];

function recordIssue(filePath, label, checkName, startLine) {
  issueLog.push({ filePath, label, checkName, startLine });
}

// ── Section checker ──────────────────────────────────────────────────────────

function checkSection(label, text, filePath, startLine, startCol, thresholds, fileWarnings) {
  const plain = toPlainText(text);
  const stats = analyzeText(plain);
  if (!stats) return true;

  const { fk, fre, cl, lix, avgWords, maxSentenceWords, longestSentence, sentences } = stats;
  const preview = longestSentencePreview(sentences);
  const enriched = { ...stats, ...thresholds };
  let passed = true;

  if (fk !== null && fk > thresholds.fkMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'fk', enriched, preview));
    recordIssue(filePath, label, 'fk', startLine);
    passed = false;
  }

  if (fre !== null && fre < thresholds.freMin) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'fre', enriched, preview));
    recordIssue(filePath, label, 'fre', startLine);
    passed = false;
  }

  if (cl !== null && cl > thresholds.clMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'cl', enriched, preview));
    recordIssue(filePath, label, 'cl', startLine);
    passed = false;
  }

  if (lix !== null && lix > thresholds.lixMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'lix', enriched, preview));
    recordIssue(filePath, label, 'lix', startLine);
    passed = false;
  }

  if (stats.dc !== null && thresholds.dcMax !== null && stats.dc > thresholds.dcMax) {
    const dcPreview = dcSentencePreview(sentences);
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'dc', enriched, dcPreview));
    recordIssue(filePath, label, 'dc', startLine);
    passed = false;
  }

  if (avgWords > thresholds.lenMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'len', enriched, preview));
    recordIssue(filePath, label, 'len', startLine);
    passed = false;
  }

  if (maxSentenceWords > thresholds.maxLen) {
    const maxPreview = longestSentence.length > 120 ? longestSentence.slice(0, 119) + '…' : longestSentence;
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'max', enriched, maxPreview));
    recordIssue(filePath, label, 'max', startLine);
    passed = false;
  }

  // Paragraph density — uses raw text to preserve paragraph boundaries.
  // Strip whole HTML tables *before* splitting into paragraphs: tables can
  // contain their own internal blank lines (e.g. formatting inside nested
  // <Tabs>/<TabItem> cells), which would otherwise fragment the table across
  // multiple paragraph blocks and defeat the <table>...</table> stripping
  // regex (it only matches when a block still has both its opening and
  // closing tag intact).
  // Custom section-wrapper components (e.g. <Features>/<TechChanges>/<Fixes>
  // from ReleaseNotes) are often placed back-to-back with no blank line
  // between them, even though they render as visually distinct blocks
  // (separate admonition boxes). Left alone, this silently merges their
  // bullet lists into one giant list. A line containing only a JSX open or
  // close tag is forced into a paragraph break (turned blank) so each
  // wrapped block is judged on its own.
  // Lines containing only whitespace (trailing spaces left by an editor) are
  // normalized to truly empty first, so they still count as a blank-line
  // paragraph break — otherwise a stray trailing space silently merges two
  // unrelated blocks (e.g. a heading + list + next list) into one giant
  // "paragraph". Bullet/numbered lists are already chunked one-idea-per-line,
  // so they're judged against a separate, higher item-count threshold
  // (listMax) instead of being penalized as dense prose (paraMax).
  const paraSplitText = text
    .replace(/<table[\s\S]*?<\/table>/gi, m => '\n'.repeat((m.match(/\n/g) ?? []).length))
    .replace(/^\s*<\/?[A-Za-z][A-Za-z0-9]*(?:\s[^>]*)?>\s*$/gm, '')
    .replace(/^[ \t]+$/gm, '');
  // Scores one block (either a whole "paragraph"/"list" split-text chunk, or
  // one half of a lead-in-plus-list block) and pushes a warning if it's over
  // its threshold. Shared by both the normal per-chunk loop below and the
  // lead-in/list split case, so both paths apply identical density rules.
  function checkBlock(blockText, isList, lineNo) {
    const checkName = isList ? 'list' : 'para';
    const limit = isList ? thresholds.listMax : thresholds.paraMax;
    const blockSentences = getSentences(toPlainText(blockText));
    // List items are counted as raw list-item lines, not derived sentences:
    // a "**Label:**" prefix (see toPlainText) splits a single list item into
    // two sentences (label + description) so it scores correctly, but that
    // must not double the apparent item count against listMax.
    const itemCount = isList
      ? blockText.split('\n').filter(l => LIST_ITEM_LINE.test(l)).length
      : blockSentences.length;
    if (itemCount > limit) {
      const blockPreview = blockSentences.slice(0, 2).join(' ');
      const truncated = blockPreview.length > 120 ? blockPreview.slice(0, 119) + '…' : blockPreview;
      fileWarnings.push(createWarning(
        filePath, lineNo, 1, label, checkName,
        { ...enriched, sentenceCount: itemCount, sentences: blockSentences },
        truncated,
      ));
      recordIssue(filePath, label, checkName, lineNo);
      passed = false;
    }
  }

  let lineOffset = 0;
  for (const para of paraSplitText.split(/\n{2,}/)) {
    // A short prose lead-in directly above a list (no blank line between
    // them, e.g. "Each flow shows how many messages are in each state:"
    // followed by a bulleted list) is a standard way to announce a list, not
    // dense prose — score the lead-in and the list as two separate units
    // instead of fusing them into one inflated "paragraph" sentence count.
    const mixed = isListBlock(para) ? null : splitIntroAndList(para);
    if (mixed) {
      checkBlock(mixed.intro, false, startLine + lineOffset);
      checkBlock(mixed.list, true, startLine + lineOffset);
    } else {
      checkBlock(para, isListBlock(para), startLine + lineOffset);
    }
    lineOffset += (para.match(/\n/g) ?? []).length + 2;
  }

  return passed;
}

// ── Dynamic data file checking ───────────────────────────────────────────────

/**
 * Returns the 1-based line number of the first occurrence of `searchText`
 * within `rawText`. Searches by the first 60 characters of the text to avoid
 * long-string mismatches. Falls back to 1 if not found.
 */
function findLineNumber(rawText, searchText) {
  if (!searchText) return 1;
  const needle = searchText.slice(0, 60);
  const idx = rawText.indexOf(needle);
  if (idx === -1) return 1;
  return rawText.slice(0, idx).split('\n').length;
}

const DATA_FILES = [
  {
    path: 'src/data/faq.v6.json',
    extractItems: (data) => data.map(item => ({
      label: `FAQ: "${item.question?.length > 60 ? item.question.slice(0, 59) + '…' : item.question}"`,
      // Combine question + answer so the full reader-facing unit is scored
      text: [item.question, item.answer].filter(Boolean).join('\n\n'),
      audience: item.userType === 'technical' ? 'tech' : 'business',
      searchText: item.answer ?? item.question,
    })),
  },
  {
    path: 'src/data/glossary.v6.json',
    extractItems: (data) => data.map(item => ({
      label: `Glossary: "${item.term}"`,
      text: item.definition ?? '',
      audience: item.userType === 'technical' ? 'tech' : 'business',
      searchText: item.definition,
    })),
  },
  {
    path: 'src/data/framework.v6.bicep.parameters.json',
    extractItems: (data) => data.map(item => ({
      label: `Parameter: ${item.name}`,
      text: item.description ?? '',
      audience: 'tech',
      searchText: item.description,
    })),
  },
  {
    path: 'src/data/dashboard.v6.bicep.parameters.json',
    extractItems: (data) => data.map(item => ({
      label: `Parameter: ${item.name}`,
      text: item.description ?? '',
      audience: 'tech',
      searchText: item.description,
    })),
  },
];

/**
 * Runs readability checks on all dynamic data files (FAQ, glossary, Bicep
 * parameters). Accumulates warnings into `warningsByFile` and returns whether
 * all checks passed (no warnings found).
 *
 * Pass a subset of `DATA_FILES` to check a single data file in single-file mode.
 */
function processDataFiles(warningsByFile, dataFilesConfig = DATA_FILES) {
  let allPassed = true;

  for (const { path: filePath, extractItems } of dataFilesConfig) {
    let raw, data;
    try {
      raw = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
      data = JSON.parse(raw);
    } catch {
      continue; // file absent or malformed — skip silently
    }

    const fileWarnings = [];

    for (const { label, text, audience, searchText } of extractItems(data)) {
      if (!text || text.trim().length < 20) continue;
      const thresholds = THRESHOLDS[audience] ?? THRESHOLDS.tech;
      const lineNum = findLineNumber(raw, searchText);
      checkSection(label, text, filePath, lineNum, 1, thresholds, fileWarnings);
    }

    if (fileWarnings.length > 0) {
      allPassed = false;
      warningsByFile[filePath] = fileWarnings;
      printFileWarnings(filePath, fileWarnings);
    }
  }

  return allPassed;
}

// ── File discovery ───────────────────────────────────────────────────────────

const EXCLUDED_DIRS  = new Set(['deprecated']);
const EXCLUDED_FILES = /import.flow-via-fa\.mdx?$/;

function findMdxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry)) results.push(...findMdxFiles(full));
    } else if (['.md', '.mdx'].includes(extname(entry))) {
      if (!EXCLUDED_FILES.test(basename(entry))) results.push(full);
    }
  }
  return results;
}

// ── Summary report ───────────────────────────────────────────────────────────

const CHECK_LABELS = {
  fk:  'Flesch-Kincaid grade too high  ',
  fre: 'Flesch Reading Ease too low    ',
  cl:  'Coleman-Liau index too high    ',
  lix: 'LIX score too high (long words)',
  dc:  'Dale-Chall score too high      ',
  len: 'Avg sentence length > 25 words ',
  max: 'Single sentence > 40 words     ',
  para:'Paragraph density > 5 sentences',
  list:'List has too many items        ',
};

function printSummary(totalFiles, allPassed) {
  const LINE = '─'.repeat(COL_WIDTH);
  const filesWithIssues = [...new Set(issueLog.map(i => i.filePath))];
  const countByType = { fk: 0, fre: 0, cl: 0, lix: 0, dc: 0, len: 0, max: 0, para: 0, list: 0 };
  for (const issue of issueLog) countByType[issue.checkName]++;

  const issuesByFile = {};
  for (const issue of issueLog) {
    (issuesByFile[issue.filePath] ??= []).push(issue);
  }

  const header = `${c.bold}Readability Check — Summary${c.reset}`;

  if (IS_GH_ACTIONS) console.log('\n::group::Readability Check — Summary');
  else console.log(`\n${c.bold}${c.cyan}${LINE}${c.reset}`);

  console.log(IS_GH_ACTIONS ? LINE : `  ${header}`);
  if (!IS_GH_ACTIONS) console.log(`${c.bold}${c.cyan}${LINE}${c.reset}`);

  console.log(`  Files checked       : ${c.bold}${totalFiles}${c.reset}`);
  console.log(`  Files with issues   : ${filesWithIssues.length > 0 ? c.yellow : c.green}${c.bold}${filesWithIssues.length}${c.reset}`);
  console.log(`  Total warnings      : ${issueLog.length > 0 ? c.yellow : c.green}${c.bold}${issueLog.length}${c.reset}`);
  console.log(IS_GH_ACTIONS ? LINE : `${c.bold}${c.cyan}${LINE}${c.reset}`);
  console.log('  By check type:');

  for (const [key, label] of Object.entries(CHECK_LABELS)) {
    const n = countByType[key];
    if (n > 0) console.log(`    ${c.yellow}${label}${c.reset} : ${c.bold}${n}${c.reset}`);
  }

  if (filesWithIssues.length > 0) {
    console.log(IS_GH_ACTIONS ? LINE : `${c.bold}${c.cyan}${LINE}${c.reset}`);
    console.log('  Files needing attention (sorted by issue count):');

    const sorted = filesWithIssues
      .map(f => ({ f, n: issuesByFile[f].length }))
      .sort((a, b) => b.n - a.n);

    for (const { f, n } of sorted) {
      const shortPath = f.replace(/^versioned_docs\/[^/]+\//, '');
      const sections = [...new Set(issuesByFile[f].map(i => i.label))].join(', ');
      const flag = n >= 3 ? `${c.red}✗✗${c.reset}` : `${c.yellow}✗ ${c.reset}`;
      console.log(`    ${flag} ${c.bold}${shortPath}${c.reset}`);
      console.log(`       ${c.gray}${n} warning${n > 1 ? 's' : ''} in: ${sections}${c.reset}`);
    }
  }

  console.log(IS_GH_ACTIONS ? LINE : `${c.bold}${c.cyan}${LINE}${c.reset}`);
  if (allPassed) {
    console.log(`  ${c.green}${c.bold}✓ All checks passed.${c.reset}`);
  } else {
    console.log(`  ${c.red}${c.bold}✗ Readability check failed. See warnings above.${c.reset}`);
  }
  console.log(IS_GH_ACTIONS ? LINE : `${c.bold}${c.cyan}${LINE}${c.reset}`);

  if (IS_GH_ACTIONS) console.log('::endgroup::');
}

// ── Job summary (GitHub Actions step summary) ────────────────────────────────

function writeJobSummary(totalFiles, allPassed, warningsByFile) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const totalWarnings = Object.values(warningsByFile).reduce((n, ws) => n + ws.length, 0);
  const filesWithIssues = Object.keys(warningsByFile).length;
  const countByType = { fk: 0, fre: 0, cl: 0, lix: 0, dc: 0, len: 0, max: 0, para: 0, list: 0 };
  for (const ws of Object.values(warningsByFile)) {
    for (const w of ws) countByType[w.checkName] = (countByType[w.checkName] ?? 0) + 1;
  }

  const status = allPassed ? '✅ All checks passed' : '❌ Readability issues found';
  const lines = [];

  lines.push(`## 📖 Readability Check — ${status}`);
  lines.push('');
  lines.push('| | |');
  lines.push('|---|---|');
  lines.push(`| Files checked | ${totalFiles} |`);
  lines.push(`| Files with issues | ${filesWithIssues} |`);
  lines.push(`| Total warnings | ${totalWarnings} |`);
  lines.push('');

  if (totalWarnings > 0) {
    lines.push('### By check type');
    lines.push('');
    lines.push('| Check | Count |');
    lines.push('|---|---|');
    const checkLabels = {
      fk:  'Flesch-Kincaid grade too high',
      fre: 'Flesch Reading Ease too low',
      cl:  'Coleman-Liau index too high',
      lix: 'LIX score too high (long words)',
      dc:  'Dale-Chall score too high',
      len: 'Avg sentence length exceeded',
      max: 'Single sentence too long',
      para:'Paragraph density too high',
      list:'List has too many items',
    };
    for (const [key, label] of Object.entries(checkLabels)) {
      if (countByType[key] > 0) lines.push(`| ${label} | ${countByType[key]} |`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');

    for (const [filePath, warnings] of Object.entries(warningsByFile)) {
      const shortPath = filePath.replace(/^versioned_docs\/[^/]+\//, '');
      lines.push(`### ⚠ \`${shortPath}\` — ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`);
      lines.push('');
      for (const w of warnings) {
        const title = `${w.label} · line ${w.startLine} — ${w.message}`;
        lines.push(`<details><summary>${title}</summary>`);
        lines.push('');
        lines.push(`**Why:** ${CHECK_WHY[w.checkName]}`);
        lines.push('');
        if (w.preview) lines.push(`**Quote:** *"${w.preview}"*`);
        lines.push('');
        const fix = w.suggestion.replace(/\n\s*/g, '<br>');
        lines.push(`**Fix:** ${fix}`);
        lines.push('');
        lines.push('</details>');
        lines.push('');
      }
    }
  }

  appendFileSync(summaryPath, lines.join('\n') + '\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────
// Guarded so this module can be `import`ed (e.g. from readability.test.mjs)
// without immediately scanning the whole docs tree or calling process.exit().

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runCli();
}

function runCli() {
  const arg = process.argv[2] ?? 'versioned_docs';
  const argStat = statSync(arg, { throwIfNoEntry: false });

  if (!argStat) {
    console.error(`${c.red}Error: '${arg}' is not a valid file or directory.${c.reset}`);
    console.error('');
    console.error('Usage:');
    console.error('  node readability.mjs [target]');
    console.error('');
    console.error('  target can be:');
    console.error('    - A directory (default: versioned_docs) → scans all files');
    console.error('    - A single .mdx or .md file            → checks only that file');
    console.error('    - A single .json data file             → checks only that file\'s entries');
    process.exit(1);
  }

  const isSingleFile = argStat.isFile();
  let files = [];
  let dataFilesConfig = DATA_FILES;

  if (isSingleFile) {
    const ext = extname(arg);
    if (['.md', '.mdx'].includes(ext)) {
      files = [arg];
      dataFilesConfig = [];
    } else if (ext === '.json') {
      files = [];
      const normArg = arg.replace(/\\/g, '/');
      dataFilesConfig = DATA_FILES.filter(df => normArg.endsWith(df.path) || df.path.endsWith(normArg));
      if (dataFilesConfig.length === 0) {
        console.error(`${c.red}Error: '${arg}' is not a recognised data file.${c.reset}`);
        console.error('Supported data files: ' + DATA_FILES.map(df => df.path).join(', '));
        process.exit(1);
      }
    } else {
      console.error(`${c.red}Error: '${arg}' is not a .md, .mdx, or .json file.${c.reset}`);
      process.exit(1);
    }
  } else {
    files = findMdxFiles(arg);
  }

  let allPassed = true;
  const warningsByFile = {};

  for (const file of files) {
    const content = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const { primary, collapsed } = extractSections(content);
    const thresholds = getThresholds(file);
    const relPath = relative(process.cwd(), file).replace(/\\/g, '/');
    const fileWarnings = [];

    checkSection('Primary content', primary.text, relPath, primary.startLine, primary.startCol, thresholds, fileWarnings);

    for (let i = 0; i < collapsed.length; i++) {
      const { text, startLine, startCol } = collapsed[i];
      checkSection(`Collapsed section ${i + 1}`, text, relPath, startLine, startCol, thresholds, fileWarnings);
    }

    if (fileWarnings.length > 0) {
      allPassed = false;
      warningsByFile[relPath] = fileWarnings;
      printFileWarnings(relPath, fileWarnings);
    }
  }

  const dataFilesPassed = processDataFiles(warningsByFile, dataFilesConfig);
  if (!dataFilesPassed) allPassed = false;

  if (isSingleFile) {
    const totalWarnings = Object.values(warningsByFile).reduce((n, ws) => n + ws.length, 0);
    if (allPassed) {
      console.log(`\n${c.green}✅ No readability issues found.${c.reset}`);
    } else {
      const noun = totalWarnings === 1 ? 'warning' : 'warnings';
      console.log(`\n${c.yellow}✗ ${totalWarnings} ${noun} found — see above for details.${c.reset}`);
    }
  } else {
    const totalChecked = files.length + dataFilesConfig.length;
    printSummary(totalChecked, allPassed);
    writeJobSummary(totalChecked, allPassed, warningsByFile);
  }

  if (!allPassed) {
    if (!isSingleFile) {
      console.log('::error::Readability check failed. See warnings above for details.');
    }
    process.exit(1);
  }
}

// ── Exports for unit testing (readability.test.mjs) ─────────────────────────
// Importing this module for tests does not trigger runCli() — see the
// isMainModule guard above.

export {
  getThresholds,
  extractSections,
  toPlainText,
  countSyllables,
  getSentences,
  isListBlock,
  splitIntroAndList,
  analyzeText,
  checkSection,
  dcSentencePreview,
  difficultWordsInSentence,
};
