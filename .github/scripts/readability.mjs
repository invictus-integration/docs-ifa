#!/usr/bin/env node
/**
 * Readability checker for MDX documentation.
 *
 * Validates readability separately for:
 *   - Primary content  (always visible to the reader)
 *   - Collapsed content (<details>, <Collapsible>) per section
 *
 * Thresholds mirror vale.ini audience segments:
 *   Business docs  → FK ≤ 8,  FRE ≥ 70
 *   Technical docs → FK ≤ 14, FRE ≥ 30
 *
 * Additional neurodiverse-friendly checks (both sections):
 *   - Average sentence length ≤ 20 words
 *
 * Each failure includes:
 *   - GitHub annotation with file path and line number
 *   - A preview of the most problematic sentence
 *   - A concrete suggestion for how to fix it
 *
 * Usage: node readability.mjs [target-dir]
 *        Defaults to 'versioned_docs'.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import process from 'process';

// ── Thresholds ───────────────────────────────────────────────────────────────

const TECH_FILE_PATTERNS = [
  /versioned_docs\/.*\/framework\//,
  /versioned_docs\/.*\/dashboard\/installation\//,
  /versioned_docs\/.*\/(technical|architecture-diagram)\.mdx?$/,
  /versioned_docs\/.*\/support\/(migrate|release-notes)/,
];

const THRESHOLDS = {
  business: { fkMax: 8,  freMin: 70 },
  tech:     { fkMax: 14, freMin: 30 },
};

function getThresholds(filePath) {
  const p = filePath.replace(/\\/g, '/');
  return TECH_FILE_PATTERNS.some(pattern => pattern.test(p))
    ? THRESHOLDS.tech
    : THRESHOLDS.business;
}

// ── Section extraction ───────────────────────────────────────────────────────

/**
 * Splits MDX content into primary (always visible) and collapsed sections.
 * <summary> content inside <details> is treated as primary — it's always shown.
 *
 * Returns:
 *   primary:  { text: string, startLine: number }
 *   collapsed: Array<{ text: string, startLine: number }>
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
  let inSummary = false;
  let primaryStartLine = 1;
  let firstPrimaryLine = true;

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

    const opensCollapsible = /<(details|Collapsible)[\s>]/.test(line);
    const closesCollapsible = /<\/(details|Collapsible)>/.test(line);

    if (currentCollapsed === null) {
      if (opensCollapsible) {
        currentCollapsed = [];
        currentCollapsedStartLine = lineNumber;
        collapsibleDepth = 1;
        // A <summary> opening on the same line as <details> is visible
        if (/<summary/.test(line)) {
          inSummary = true;
          primaryLines.push(line.replace(/<[^>]+>/g, ' ').trim());
          if (/<\/summary>/.test(line)) inSummary = false;
        }
        continue;
      }
      if (firstPrimaryLine && line.trim()) {
        primaryStartLine = lineNumber;
        firstPrimaryLine = false;
      }
      primaryLines.push(line);
    } else {
      // Inside a collapsible block
      if (opensCollapsible) collapsibleDepth++;

      if (closesCollapsible) {
        collapsibleDepth--;
        if (collapsibleDepth === 0) {
          collapsedSections.push({ text: currentCollapsed.join('\n'), startLine: currentCollapsedStartLine });
          currentCollapsed = null;
          continue;
        }
      }

      // <summary> at depth 1 is always visible — redirect to primary
      if (/<summary/.test(line) && collapsibleDepth === 1) inSummary = true;
      if (inSummary) {
        primaryLines.push(line.replace(/<[^>]+>/g, ' ').trim());
        if (/<\/summary>/.test(line)) inSummary = false;
        continue;
      }

      currentCollapsed.push(line);
    }
  }

  // Unclosed collapsible block (malformed MDX) — treat remainder as primary
  if (currentCollapsed !== null) primaryLines.push(...currentCollapsed);

  return {
    primary: { text: primaryLines.join('\n'), startLine: primaryStartLine },
    collapsed: collapsedSections,
  };
}

// ── Text cleaning ────────────────────────────────────────────────────────────

function toPlainText(raw) {
  return raw
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')            // JSX comments {/* ... */}
    .replace(/import\s[^;]+;/g, '')                  // import statements
    .replace(/:::[\w-]+[^\n]*/g, '')                 // admonition type markers
    .replace(/`{3}[^\n]*\n[\s\S]*?`{3}/g, '')        // fenced code blocks
    .replace(/`[^`\n]+`/g, 'code')                   // inline code → neutral word
    .replace(/<[^>]+>/g, ' ')                        // HTML/JSX tags
    .replace(/\{[^}]+\}/g, ' ')                      // JSX expressions
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')            // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')         // links → label text only
    .replace(/^#{1,6}\s+/gm, '')                     // heading markers
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, '$1')      // bold/italic markers
    .replace(/^[-*+]\s+/gm, '')                      // unordered list markers
    .replace(/^\d+\.\s+/gm, '')                      // ordered list markers
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Readability metrics ──────────────────────────────────────────────────────

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const groups = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length > 2);
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
 * Calculates Flesch-Kincaid grade level, Flesch Reading Ease,
 * and average words per sentence.
 * Returns null when there is not enough text to produce a meaningful score.
 */
function analyzeText(text) {
  const sentences = getSentences(text);
  const words = text.match(/\b[a-zA-Z'-]{2,}\b/g) ?? [];

  if (sentences.length < 2 || words.length < 15) return null;

  const syllables = words.reduce((n, w) => n + countSyllables(w), 0);
  const avgWords     = words.length / sentences.length;
  const avgSyllables = syllables / words.length;

  return {
    fk:           Math.round((0.39 * avgWords + 11.8 * avgSyllables - 15.59) * 10) / 10,
    fre:          Math.round((206.835 - 1.015 * avgWords - 84.6 * avgSyllables) * 10) / 10,
    wordCount:    words.length,
    sentenceCount: sentences.length,
    avgWords:     Math.round(avgWords * 10) / 10,
    sentences,
  };
}

// ── Reporting ────────────────────────────────────────────────────────────────

const SUGGESTIONS = {
  fk:  'Split long sentences at conjunctions (and, but, which, that), or replace multi-syllable words with shorter alternatives.',
  fre: 'Use shorter, more common words. Aim for 1–2 syllable words in most sentences.',
  len: 'Look for "which", "that", "and", "but", "because" as natural split points to break this into two sentences.',
};

function annotate(filePath, startLine, label, checkName, stats, preview) {
  const messages = {
    fk:  `[${label}] Flesch-Kincaid grade ${stats.fk} exceeds target of ≤${stats.fkMax} ` +
         `(${stats.wordCount} words, ${stats.sentenceCount} sentences, avg ${stats.avgWords} words/sentence).`,
    fre: `[${label}] Flesch Reading Ease ${stats.fre} is below target of ≥${stats.freMin}.`,
    len: `[${label}] Average sentence length is ${stats.avgWords} words (target: ≤20).`,
  };

  const parts = [
    messages[checkName],
    preview ? `Longest sentence: "${preview}"` : null,
    `Suggestion: ${SUGGESTIONS[checkName]}`,
  ].filter(Boolean).join(' | ');

  console.log(`::warning file=${filePath},line=${startLine}::${parts}`);
}

// ── Issue tracking (for summary) ─────────────────────────────────────────────

const issueLog = [];

function recordIssue(filePath, label, checkName, startLine) {
  issueLog.push({ filePath, label, checkName, startLine });
}

// ── Section checker ──────────────────────────────────────────────────────────

function checkSection(label, text, filePath, startLine, thresholds) {
  const plain = toPlainText(text);
  const stats = analyzeText(plain);
  if (!stats) return true;

  const { fk, fre, avgWords, sentences } = stats;
  const preview = longestSentencePreview(sentences);
  const enriched = { ...stats, fkMax: thresholds.fkMax, freMin: thresholds.freMin };
  let passed = true;

  if (fk > thresholds.fkMax) {
    annotate(filePath, startLine, label, 'fk', enriched, preview);
    recordIssue(filePath, label, 'fk', startLine);
    passed = false;
  }

  if (fre < thresholds.freMin) {
    annotate(filePath, startLine, label, 'fre', enriched, preview);
    recordIssue(filePath, label, 'fre', startLine);
    passed = false;
  }

  if (avgWords > 20) {
    annotate(filePath, startLine, label, 'len', enriched, preview);
    recordIssue(filePath, label, 'len', startLine);
    passed = false;
  }

  return passed;
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
  fk:  'Flesch-Kincaid grade too high',
  fre: 'Flesch Reading Ease too low  ',
  len: 'Avg sentence length > 20 words',
};

function printSummary(totalFiles, allPassed) {
  const LINE = '─'.repeat(62);
  const filesWithIssues = [...new Set(issueLog.map(i => i.filePath))];
  const countByType = { fk: 0, fre: 0, len: 0 };
  for (const issue of issueLog) countByType[issue.checkName]++;

  const issuesByFile = {};
  for (const issue of issueLog) {
    (issuesByFile[issue.filePath] ??= []).push(issue);
  }

  console.log('\n::group::Readability Check — Summary');
  console.log(LINE);
  console.log(`  Files checked       : ${totalFiles}`);
  console.log(`  Files with issues   : ${filesWithIssues.length}`);
  console.log(`  Total warnings      : ${issueLog.length}`);
  console.log(LINE);
  console.log('  By check type:');
  for (const [key, label] of Object.entries(CHECK_LABELS)) {
    const n = countByType[key];
    if (n > 0) console.log(`    ${label} : ${n}`);
  }

  if (filesWithIssues.length > 0) {
    console.log(LINE);
    console.log('  Files needing attention (sorted by issue count):');
    const sorted = filesWithIssues
      .map(f => ({ f, n: issuesByFile[f].length }))
      .sort((a, b) => b.n - a.n);

    for (const { f, n } of sorted) {
      const sections = [...new Set(issuesByFile[f].map(i => i.label))].join(', ');
      const flag = n >= 3 ? '✗✗' : '✗ ';
      console.log(`    ${flag} ${f}`);
      console.log(`       ${n} warning${n > 1 ? 's' : ''} in: ${sections}`);
    }
  }

  console.log(LINE);
  console.log(allPassed ? '  ✓ All checks passed.' : '  ✗ Readability check failed. See warnings above.');
  console.log(LINE);
  console.log('::endgroup::');
}

// ── Main ─────────────────────────────────────────────────────────────────────

const targetDir = process.argv[2] ?? 'versioned_docs';
const files = findMdxFiles(targetDir);
let allPassed = true;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const { primary, collapsed } = extractSections(content);
  const thresholds = getThresholds(file);
  const relPath = relative(process.cwd(), file).replace(/\\/g, '/');

  if (!checkSection('Primary content', primary.text, relPath, primary.startLine, thresholds)) {
    allPassed = false;
  }

  for (let i = 0; i < collapsed.length; i++) {
    const { text, startLine } = collapsed[i];
    if (!checkSection(`Collapsed section ${i + 1}`, text, relPath, startLine, thresholds)) {
      allPassed = false;
    }
  }
}

printSummary(files.length, allPassed);

if (!allPassed) {
  console.log('::error::Readability check failed. See warnings above for details.');
  process.exit(1);
}
