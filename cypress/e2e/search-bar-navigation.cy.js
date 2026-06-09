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

    it('does not append a query string or hash for plain doc results', () => {
      // "release notes" only matches static doc pages — none have an anchor field.
      openSearchAndType('release notes');
      cy.get('[data-cy=search-result]')
        .contains(/release notes/i)
        .first()
        .click();
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
      cy.get('[data-cy=search-results] tbody tr td:nth-child(2) code')
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

});
