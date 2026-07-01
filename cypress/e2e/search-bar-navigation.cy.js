/**
 * SearchBar navigation tests — local search variant only.
 *
 * Azure Search is intercepted and forced to fail so that every test
 * exercises the local fallback path deterministically, regardless of
 * whether live credentials are present in the environment.
 */
describe('SearchBar navigation (local search)', () => {

  beforeEach(() => {
    // Block all Azure Search requests so local fallback always activates.
    cy.intercept('GET', '**/indexes/*/docs*', { forceNetworkError: true }).as('azureSearch');
    cy.visit('/');
  });

  /**
   * Opens the search modal and types a query, then waits for the local
   * fallback indicator to confirm we are in the offline/local search path.
   */
  function openSearchAndType(term) {
    cy.get('[data-cy=search-trigger]').click();
    cy.get('[data-cy=search-modal-input]').type(term);
    cy.get('[data-cy=local-fallback-hint]', { timeout: 6000 }).should('be.visible');
  }

  // ── Local search fallback indicator ─────────────────────────────────────

  describe('local search fallback', () => {

    it('shows the fallback banner when Azure Search is unavailable', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=local-fallback-hint]')
        .should('contain', 'local results');
    });

    it('returns at least one result for a known term', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').should('have.length.greaterThan', 0);
    });

    it('shows no results for a nonsense term', () => {
      openSearchAndType('xyznonexistentterm');
      cy.get('[data-cy=search-result]').should('not.exist');
    });

  });

  // ── Regular doc result navigation ────────────────────────────────────────

  describe('regular doc result navigation', () => {

    it('closes the modal and navigates to a doc page after clicking a result', () => {
      openSearchAndType('release notes');
      cy.get('[data-cy=search-result]').first().click();
      // Modal must close
      cy.get('[data-search-modal]').should('not.exist');
      // Must have left the root page
      cy.location('pathname').should('not.eq', '/');
    });

    it('strips the transient ?highlight= param so the final URL has no query string', () => {
      // navigate() appends ?highlight=<term> so SearchHighlighter can mark the page,
      // then SearchHighlighter immediately calls replaceState to clean up the URL.
      // "release notes" only matches static doc pages — none have an anchor field.
      openSearchAndType('release notes');
      cy.get('[data-cy=search-result]')
        .contains(/release notes/i)
        .first()
        .click();
      // Cypress retries until replaceState has run (within 4 s default timeout).
      cy.location('search').should('eq', '');
      cy.location('hash').should('eq', '');
    });

  });

  // ── Knowledge term result navigation ─────────────────────────────────────

  describe('knowledge term result navigation', () => {

    it('shows term matches in the knowledge column', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').should('have.length.greaterThan', 0);
    });

    it('navigates to the help center when clicking a term result', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('pathname').should('match', /\/support\/help-center-(technical|business)/);
    });

    it('appends ?q= so the help center scrolls to the matching term', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('search').should('match', /[?&]q=.+/);
    });

  });

  // ── Knowledge FAQ result navigation ──────────────────────────────────────

  describe('knowledge FAQ result navigation', () => {

    it('shows FAQ matches in the knowledge column', () => {
      openSearchAndType('cosmosdb');
      cy.get('[data-cy=knowledge-faq-result]').should('have.length.greaterThan', 0);
    });

    it('navigates to the help center when clicking a FAQ result', () => {
      openSearchAndType('cosmosdb');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('pathname').should('match', /\/support\/help-center-(technical|business)/);
    });

    it('appends ?q= so the help center pre-filters to the matching question', () => {
      openSearchAndType('cosmosdb');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('search').should('match', /[?&]q=.+/);
    });

    it('appends #faq hash to land on the FAQ section', () => {
      openSearchAndType('cosmosdb');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('hash').should('eq', '#faq');
    });

    it('auto-opens the first matching answer after navigating', () => {
      openSearchAndType('cosmosdb');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.get('[data-cy=faq-answer]').should('be.visible');
    });

  });

  // ── Bicep parameter result navigation ────────────────────────────────────

  describe('Bicep parameter result navigation', () => {

    it('navigates to the installation page when clicking a parameter result', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('pathname').should('match', /\/(framework|dashboard)\/installation/);
    });

    it('appends ?q=<paramName> so the ParameterTable pre-filters to that row', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('search').should('include', 'q=resourcePrefix');
    });

    it('appends #bicep-template-parameters so the page scrolls to that section', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('hash').should('eq', '#bicep-template-parameters');
    });

    it('pre-fills the ParameterTable search input after deep-link navigation', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.get('[data-cy=search-input]').should('have.value', 'resourcePrefix');
    });

    it('filters the ParameterTable to show only the matching row', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.get('[data-cy=search-results] tbody tr').should('have.length.greaterThan', 0);
      cy.get('[data-cy=search-results] tbody tr td:nth-child(1) code')
        .first()
        .should('contain', 'resourcePrefix');
    });

  });

  // ── Keyboard navigation ──────────────────────────────────────────────────

  describe('keyboard navigation', () => {

    it('highlights the first result when pressing ArrowDown', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]').type('{downarrow}');
      cy.get('[data-cy=search-result]').first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('navigates to the selected result when pressing Enter', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]')
        .type('{downarrow}{enter}');
      cy.get('[data-search-modal]').should('not.exist');
      cy.location('pathname').should('not.eq', '/');
    });

    it('closes the modal when pressing Escape', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]').type('{esc}');
      cy.get('[data-search-modal]').should('not.exist');
    });

  });

  // ── Search term highlighting ──────────────────────────────────────────────
  //
  // Verifies that SearchHighlighter (Root.js) correctly injects
  // <mark data-search-highlight> elements on the destination page after the
  // search modal navigates via history.push(?highlight=<term>).

  describe('search term highlighting', () => {

    it('injects <mark data-search-highlight> elements on the destination page', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      // SearchHighlighter waits for the MutationObserver to see DOM settle
      // (80 ms debounce) before injecting marks — allow 4 s for new page + marks.
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('marks exactly the first occurrence with data-search-highlight-first', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight-first]', { timeout: 4000 })
        .should('have.length', 1);
    });

    it('cleans up ?highlight= from the URL while still injecting marks', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      // URL must be clean ...
      cy.location('search', { timeout: 3000 }).should('not.include', 'highlight=');
      // ... but marks must still be present (replaceState must not re-trigger the effect)
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('applies highlights via SPA navigation — the previously broken path', () => {
      // Regression guard for the original bug: [location.href] was always
      // undefined, so the useEffect only fired on mount (= page reload).
      // Fixed by using [location.pathname, location.search, location.hash].
      // All history.push() calls here are SPA navigations (no full reload).
      openSearchAndType('release');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('removes highlights when subsequently navigating without a ?highlight= param', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);

      // Plain navigation — SearchHighlighter should call removeSearchHighlights().
      cy.visit('/');
      cy.get('mark[data-search-highlight]').should('not.exist');
    });

    it('highlights using the stored query when replaying a recent search', () => {
      // First search — creates a recent search entry with query='installation'.
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);

      // Go back to the home page so we can open the modal in "recents" mode.
      cy.visit('/');

      // Open the modal without typing — recents list should appear.
      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=local-fallback-hint]').should('not.exist'); // no query = no search
      cy.get('[data-cy=search-result]').first().click(); // click the recent entry

      // navigate() must use result.query ('installation') as the highlight term
      // because the live input query is empty when replaying from recents.
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

  });

  // ── Dismiss chip ──────────────────────────────────────────────────────────
  //
  // Verifies the amber filter chip that appears while highlights are active
  // and the two ways to dismiss it: clicking the Clear button and pressing Escape.

  describe('dismiss chip', () => {

    it('shows the chip with the search term in the label when highlights are active', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('#search-highlight-chip').should('be.visible');
      cy.get('#search-highlight-chip-label').should('contain', 'installation');
    });

    it('clicking the Clear button removes all marks and hides the chip', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('#search-highlight-dismiss').click();

      cy.get('mark[data-search-highlight]').should('not.exist');
      cy.get('#search-highlight-chip').should('not.be.visible');
    });

    it('pressing Escape removes all marks and hides the chip', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('body').type('{esc}');

      cy.get('mark[data-search-highlight]').should('not.exist');
      cy.get('#search-highlight-chip').should('not.be.visible');
    });

    it('hides the chip when navigating to a page without highlights', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('#search-highlight-chip', { timeout: 4000 }).should('be.visible');

      cy.visit('/');
      cy.get('#search-highlight-chip').should('not.be.visible');
    });

  });

});
