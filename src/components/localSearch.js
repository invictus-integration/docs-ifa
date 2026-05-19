/**
 * Local search fallback — used when Azure Search is unavailable.
 *
 * Lazily fetches /search-index.json (a static copy of the knowledge base)
 * on first use and caches it in memory. Scores documents by simple
 * case-insensitive substring matching, weighted by field importance.
 */

const TOP_N = 8;

/** Module-level cache so the index is only fetched once per page session. */
let indexCache = null;
let indexPromise = null;

async function loadIndex() {
  if (indexCache) return indexCache;
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load local search index (${r.status})`);
        return r.json();
      })
      .then(data => {
        indexCache = data.value ?? [];
        return indexCache;
      })
      .catch(err => {
        // Reset so the next call retries instead of hanging forever.
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}

/**
 * Score a single document against the query terms.
 * Weights: title (5), sidebar_label (2), content (1), all-terms-in-title bonus (4).
 */
function scoreDoc(doc, terms) {
  const title   = (doc.title        ?? '').toLowerCase();
  const label   = (doc.sidebar_label ?? '').toLowerCase();
  const content = (doc.content       ?? '').toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (title.includes(term))   score += 5;
    if (label.includes(term))   score += 2;
    if (content.includes(term)) score += 1;
  }
  // Bonus when every term appears in the title — strong relevance signal.
  if (terms.every(t => title.includes(t))) score += 4;

  return score;
}

/**
 * Run a local search against the cached index.
 * Returns up to TOP_N results in the same shape as Azure Search documents
 * (no @search.highlights — getSnippet() already has a raw-content fallback).
 */
export async function localSearch(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const docs = await loadIndex();

  return docs
    .map(doc => ({ ...doc, _localScore: scoreDoc(doc, terms) }))
    .filter(doc => doc._localScore > 0)
    .sort((a, b) => b._localScore - a._localScore)
    .slice(0, TOP_N);
}
