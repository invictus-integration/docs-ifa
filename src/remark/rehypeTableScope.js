/**
 * Rehype plugin that adds a `scope` attribute to `<th>` elements produced by
 * GFM markdown tables (compiled to plain HAST `element` nodes) AND to `<th>`
 * tags authored directly as raw HTML/JSX inside `.md`/`.mdx` files (which MDX
 * keeps as `mdxJsxFlowElement`/`mdxJsxTextElement` nodes instead of HAST
 * `element` nodes — a different node shape that must be handled separately).
 *
 * WCAG 1.3.1 (Info and Relationships) / H63: header cells must programmatically
 * indicate whether they label a column or a row so screen readers can announce
 * cell/header associations when navigating a data table cell by cell.
 *
 * Rule of thumb applied here:
 *   - `<th>` inside `<thead>`  -> scope="col" (column header)
 *   - `<th>` inside `<tbody>`  -> scope="row" (row header)
 * Existing `scope` attributes (e.g. set explicitly in hand-authored JSX/HTML)
 * are left untouched.
 *
 * Applied centrally via docusaurus.config.js `docs.rehypePlugins`, so every
 * markdown/MDX table across the whole site gets this fix without needing to
 * touch individual doc files.
 */
const JSX_TYPES = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

function getTagName(node) {
  if (node.type === 'element') return node.tagName;
  if (JSX_TYPES.has(node.type)) return node.name;
  return undefined;
}

function hasScopeAttribute(node) {
  if (node.type === 'element') {
    return Boolean(node.properties && node.properties.scope);
  }
  return (node.attributes || []).some((attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'scope');
}

function setScopeAttribute(node, scope) {
  if (node.type === 'element') {
    node.properties = node.properties || {};
    node.properties.scope = scope;
    return;
  }
  node.attributes = node.attributes || [];
  node.attributes.push({ type: 'mdxJsxAttribute', name: 'scope', value: scope });
}

function visit(node, ancestors, callback) {
  if (node && Array.isArray(node.children)) {
    for (const child of node.children) {
      callback(child, ancestors);
      visit(child, [...ancestors, node], callback);
    }
  }
}

function rehypeTableScope() {
  return (tree) => {
    visit(tree, [], (node, ancestors) => {
      if (getTagName(node) !== 'th' || hasScopeAttribute(node)) {
        return;
      }

      const closestSection = [...ancestors]
        .reverse()
        .find((ancestor) => ['thead', 'tbody'].includes(getTagName(ancestor)));

      setScopeAttribute(node, getTagName(closestSection) === 'tbody' ? 'row' : 'col');
    });
  };
}

module.exports = rehypeTableScope;

