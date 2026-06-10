/**
 * Local knowledge search — searches glossary terms and FAQ entries without any
 * network dependency. Lazy-loads data on first use and caches in memory.
 *
 * Runs in parallel with page search so users get term + FAQ matches even when
 * Azure Search is unavailable.
 */

const MAX_TERMS = 5;
const MAX_FAQ   = 4;

let glossaryCache = null;
let faqCache      = null;

async function loadGlossary() {
  if (glossaryCache) return glossaryCache;
  const mod    = await import('../data/glossary.v6.json');
  glossaryCache = mod.default ?? mod;
  return glossaryCache;
}

async function loadFaq() {
  if (faqCache) return faqCache;
  const mod = await import('../data/faq.v6.json');
  faqCache  = mod.default ?? mod;
  return faqCache;
}

/**
 * Score a glossary term against query terms.
 * Weights: term name (5), alias (3), definition (1), all-terms-in-name bonus (4).
 */
function scoreTerm(entry, terms) {
  const name    = entry.term.toLowerCase();
  const def     = entry.definition.toLowerCase();
  const aliases = (entry.aliases ?? []).map(a => a.toLowerCase());

  let score = 0;
  for (const t of terms) {
    if (name.includes(t))               score += 5;
    if (aliases.some(a => a.includes(t))) score += 3;
    if (def.includes(t))                score += 1;
  }
  if (terms.every(t => name.includes(t))) score += 4;
  return score;
}

/**
 * Score an FAQ entry against query terms.
 * Weights: question (4), answer (1), all-terms-in-question bonus (3).
 */
function scoreFaq(entry, terms) {
  const q = entry.question.toLowerCase();
  const a = entry.answer.toLowerCase();

  let score = 0;
  for (const t of terms) {
    if (q.includes(t)) score += 4;
    if (a.includes(t)) score += 1;
  }
  if (terms.every(t => q.includes(t))) score += 3;
  return score;
}

/**
 * Strip common Markdown constructs to produce a plain-text snippet.
 * Intentionally lightweight — for display purposes only.
 */
export function stripMarkdownSimple(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)([^*_]+?)\1/g, '$2')
    .replace(/(\*|_)([^*_]+?)\1/g, '$2')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Search glossary terms and FAQ entries for the given query.
 *
 * @param {string} query     - raw search query
 * @param {string} userType  - 'business' | 'technical'
 * @returns {{ termResults: object[], faqResults: object[] }}
 */
export async function searchKnowledge(query, userType) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return { termResults: [], faqResults: [] };

  const [glossary, faq] = await Promise.all([loadGlossary(), loadFaq()]);

  const termResults = glossary
    .map(t => ({ ...t, _score: scoreTerm(t, terms) }))
    .filter(t => t._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      // On equal score, prefer the current user's audience
      if (a.userType === userType && b.userType !== userType) return -1;
      if (b.userType === userType && a.userType !== userType) return 1;
      return 0;
    })
    // Deduplicate by term name — first occurrence wins (highest score / preferred audience)
    .filter((t, _, arr) => arr.findIndex(x => x.term === t.term) === arr.indexOf(t))
    .slice(0, MAX_TERMS);

  const faqResults = faq
    .map(f => ({ ...f, _score: scoreFaq(f, terms) }))
    .filter(f => f._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_FAQ);

  return { termResults, faqResults };
}
