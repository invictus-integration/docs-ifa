import 'cypress-axe';

// One representative page per distinct template/component mix, rather than a
// full-site crawl: this keeps the check fast in CI while still exercising
// every reusable pattern (nav + prose, deprecated-content styling, migration
// tables, the interactive release-notes filter/collapse widgets).
const PAGES = [
  { path: '/', label: 'home / docs index' },
  { path: '/dashboard/security/users', label: 'dashboard doc page' },
  { path: '/framework/deprecated/pubsub', label: 'deprecated framework doc page' },
  { path: '/support/migrate-v5-to-v6', label: 'migration guide (tables + admonitions)' },
  { path: '/support/release-notes', label: 'release notes (version filter + collapsible sections)' },
];

// axe-core rule tags to run: WCAG 2.0/2.1/2.2 Level A + AA, which includes
// contrast, ARIA, labeling, heading order, and the 2.2 "target-size" (touch
// target) rule.
const RUN_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

// Only fail the build for violations a real user would actually hit.
const INCLUDED_IMPACTS = ['critical', 'serious'];

function logViolations(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected:`,
  );
  const summary = violations.map(({ id, impact, description, helpUrl, nodes }) => ({
    id,
    impact,
    description,
    helpUrl,
    affectedElements: nodes.map((n) => n.target.join(' ')),
  }));
  cy.task('log', JSON.stringify(summary, null, 2));
}

describe('Accessibility (axe-core)', () => {
  PAGES.forEach(({ path, label }) => {
    it(`has no critical/serious violations on ${label} (${path})`, () => {
      cy.visit(path);
      cy.injectAxe();
      cy.checkA11y(
        null,
        { runOnly: { type: 'tag', values: RUN_TAGS }, includedImpacts: INCLUDED_IMPACTS },
        logViolations,
      );
    });
  });
});
