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

import { readFileSync, readdirSync, statSync, appendFileSync } from 'fs';
import { join, relative, extname, basename } from 'path';
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
  /versioned_docs\/.*\/(technical|architecture-diagram)\.mdx?$/,
  /versioned_docs\/.*\/support\/(migrate|release-notes)/,
];

const THRESHOLDS = {
  business: { fkMax: 8,  freMin: 70, clMax: 9,  lixMax: 35, lenMax: 20, maxLen: 35, paraMax: 4 },
  tech:     { fkMax: 14, freMin: 30, clMax: 16, lixMax: 55, lenMax: 25, maxLen: 40, paraMax: 6 },
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

    const collapsibleMatch = line.match(/<(details|Collapsible)[\s>]/);
    const opensCollapsible = collapsibleMatch !== null;
    const closesCollapsible = /<\/(details|Collapsible)>/.test(line);

    if (currentCollapsed === null) {
      if (opensCollapsible) {
        currentCollapsed = [];
        currentCollapsedStartLine = lineNumber;
        currentCollapsedStartCol = line.indexOf(collapsibleMatch[0]) + 1;
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
    primary: { text: primaryLines.join('\n'), startLine: primaryStartLine, startCol: primaryStartCol },
    collapsed: collapsedSections,
  };
}

// ── Text cleaning ────────────────────────────────────────────────────────────

function toPlainText(raw) {
  return raw
    .replace(/^\uFEFF/, '')                                              // BOM character
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')                               // JSX comments {/* ... */}
    .replace(/import\s[^;]+;/g, '')                                     // import statements
    .replace(/:::[\w-]*[^\n]*/g, '')                                    // admonition markers (opening :::note and closing :::)
    .replace(/`{3}[^\n]*\n[\s\S]*?`{3}/g, '')                          // fenced code blocks
    .replace(/`[^`\n]+`/g, ' ')                                        // inline code → remove (don't score code tokens)
    .replace(/\{\{[^}]*\}\}/g, ' ')                                     // double-brace JSX expressions {{ }}
    .replace(/\{[^}]+\}/g, ' ')                                         // single-brace JSX expressions { }
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, ' ')                          // self-closing JSX components <Badge />
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, ' ') // JSX component pairs <Foo>...</Foo>
    .replace(/<[^>]+>/g, ' ')                                           // remaining HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')                               // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')                            // inline links → label text only
    .replace(/\[[^\]]+\]:\s*\S+[^\n]*/gm, '')                          // reference-style link definitions
    .replace(/https?:\/\/\S+/g, '')                                     // bare URLs
    .replace(/^\|[-:\s|]+\|$/gm, '')                                    // table separator rows
    .replace(/\|/g, ' ')                                                // table pipe characters
    .replace(/^[-_*]{3,}\s*$/gm, '')                                    // thematic breaks (--- ___ ***)
    .replace(/^#{1,6}\s+(.+)$/gm, '$1. ')                              // headings → sentence (prevents merging with next paragraph)
    .replace(/\*{1,2}([^*\n]*)\*{1,2}/g, '$1')                         // bold/italic markers (balanced)
    .replace(/\*/g, '')                                                 // remaining unbalanced asterisks
    .replace(/^[-*+]\s+(.+?)\.?\s*$/gm, '$1. ')                         // unordered list items → each becomes a sentence
    .replace(/^\d+\.\s+(.+?)\.?\s*$/gm, '$1. ')                         // ordered list items → each becomes a sentence
    .replace(/\s+/g, ' ')
    .replace(/[`\[\]]/g, '')                                            // remaining bare backticks and brackets
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

  const syllables  = words.reduce((n, w) => n + countSyllables(w), 0);
  const chars      = words.reduce((n, w) => n + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const longWords  = words.filter(w => w.length >= 7).length;
  const avgWords     = words.length / sentences.length;
  const avgSyllables = syllables / words.length;
  const L = (chars / words.length) * 100;       // avg letters per 100 words
  const S = (sentences.length / words.length) * 100; // avg sentences per 100 words

  const sentenceWordCounts = sentences.map(s => wordCount(s));
  const maxSentenceWords   = Math.max(...sentenceWordCounts);
  const longestSentence    = sentences[sentenceWordCounts.indexOf(maxSentenceWords)] ?? '';

  return {
    fk:              Math.round((0.39 * avgWords + 11.8 * avgSyllables - 15.59) * 10) / 10,
    fre:             Math.round((206.835 - 1.015 * avgWords - 84.6 * avgSyllables) * 10) / 10,
    cl:              Math.round((0.0588 * L - 0.296 * S - 15.8) * 10) / 10,
    lix:             Math.round((avgWords + (longWords * 100 / words.length)) * 10) / 10,
    wordCount:       words.length,
    sentenceCount:   sentences.length,
    avgWords:        Math.round(avgWords * 10) / 10,
    longWordCount:   longWords,
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
  para:'Split at a natural topic boundary. Each paragraph should cover one idea. Aim for 3–5 sentences.',
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
    len: `Average sentence length is ${stats.avgWords} words (target: ≤${stats.lenMax})`,
    max: `Longest sentence is ${stats.maxSentenceWords} words (target: ≤${stats.maxLen}) — breaks reading flow`,
    para:`Paragraph has ${stats.sentenceCount} sentences (target: ≤${stats.paraMax}) — may overwhelm working memory`,
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
  len: 'Long average sentence length forces readers to hold more information in working memory before reaching the end of a thought. ' +
       'This is especially taxing for readers with ADHD or working memory differences.',
  max: 'A single very long sentence disrupts reading flow even when the rest of the text is concise. ' +
       'Readers must hold the entire sentence in memory to understand its structure and meaning.',
  para:'Dense paragraphs without visual breaks overwhelm working memory. ' +
       'Paragraph breaks act as cognitive rest points — particularly important for neurodiverse readers who benefit from chunked information.',
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

  if (fk > thresholds.fkMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'fk', enriched, preview));
    recordIssue(filePath, label, 'fk', startLine);
    passed = false;
  }

  if (fre < thresholds.freMin) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'fre', enriched, preview));
    recordIssue(filePath, label, 'fre', startLine);
    passed = false;
  }

  if (cl > thresholds.clMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'cl', enriched, preview));
    recordIssue(filePath, label, 'cl', startLine);
    passed = false;
  }

  if (lix > thresholds.lixMax) {
    fileWarnings.push(createWarning(filePath, startLine, startCol, label, 'lix', enriched, preview));
    recordIssue(filePath, label, 'lix', startLine);
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

  // Paragraph density — uses raw text to preserve paragraph boundaries
  let lineOffset = 0;
  for (const para of text.split(/\n{2,}/)) {
    const paraSentences = getSentences(toPlainText(para));
    if (paraSentences.length > thresholds.paraMax) {
      const paraPreview = paraSentences.slice(0, 2).join(' ');
      const truncated = paraPreview.length > 120 ? paraPreview.slice(0, 119) + '…' : paraPreview;
      fileWarnings.push(createWarning(
        filePath, startLine + lineOffset, 1, label, 'para',
        { ...enriched, sentenceCount: paraSentences.length, sentences: paraSentences },
        truncated,
      ));
      recordIssue(filePath, label, 'para', startLine + lineOffset);
      passed = false;
    }
    lineOffset += (para.match(/\n/g) ?? []).length + 2;
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
  fk:  'Flesch-Kincaid grade too high  ',
  fre: 'Flesch Reading Ease too low    ',
  cl:  'Coleman-Liau index too high    ',
  lix: 'LIX score too high (long words)',
  len: 'Avg sentence length > 25 words ',
  max: 'Single sentence > 40 words     ',
  para:'Paragraph density > 5 sentences',
};

function printSummary(totalFiles, allPassed) {
  const LINE = '─'.repeat(COL_WIDTH);
  const filesWithIssues = [...new Set(issueLog.map(i => i.filePath))];
  const countByType = { fk: 0, fre: 0, cl: 0, lix: 0, len: 0, max: 0, para: 0 };
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

  const CHECK_LABELS = {
    fk:  'Flesch-Kincaid grade too high  ',
    fre: 'Flesch Reading Ease too low    ',
    cl:  'Coleman-Liau index too high    ',
    lix: 'LIX score too high (long words)',
    len: 'Avg sentence length > 25 words ',
    max: 'Single sentence > 40 words     ',
    para:'Paragraph density > 5 sentences',
  };
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
  const countByType = { fk: 0, fre: 0, cl: 0, lix: 0, len: 0, max: 0, para: 0 };
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
      len: 'Avg sentence length exceeded',
      max: 'Single sentence too long',
      para:'Paragraph density too high',
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

const targetDir = process.argv[2] ?? 'versioned_docs';
const files = findMdxFiles(targetDir);
let allPassed = true;
const warningsByFile = {};

for (const file of files) {
  const content = readFileSync(file, 'utf8');
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

printSummary(files.length, allPassed);
writeJobSummary(files.length, allPassed, warningsByFile);

if (!allPassed) {
  console.log('::error::Readability check failed. See warnings above for details.');
  process.exit(1);
}
