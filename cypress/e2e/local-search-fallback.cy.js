/**
 * Local search fallback tests.
 *
 * Two concerns:
 *   1. Index contract — src/data/search-index.json has the shape that
 *      localSearch.js and SearchBar expect. Guards against field renames
 *      in refresh-search-index.ps1 before a broken index ships to prod.
 *   2. Fallback behaviour — when Azure Search fails the UI falls back to
 *      local results and shows the "Search service unavailable" hint.
 */

// Fields that localSearch.js scores on and SearchBar renders.
// If refresh-search-index.ps1 renames any of these, this test fails in CI.
const REQUIRED_FIELDS = ['id', 'title', 'content', 'filepath', 'category', 'sidebar_label'];

describe('Local search index contract', () => {

  // Read the source file directly — no HTTP request, no public endpoint needed.
  before(function () {
    cy.readFile('src/data/search-index.json').then((raw) => {
      const body = typeof raw === 'string' ? JSON.parse(raw) : raw;
      this.docs = body.value;
    });
  });

  it('has a "value" array with at least one document', function () {
    expect(this.docs).to.be.an('array').with.length.greaterThan(0);
  });

  it('contains no @search.action field (upload artifact must not leak into the bundled index)', function () {
    this.docs.forEach((doc) => {
      expect(doc).not.to.have.property('@search.action');
    });
  });

  REQUIRED_FIELDS.forEach((field) => {
    it(`every document has a "${field}" field`, function () {
      this.docs.forEach((doc) => {
        expect(doc, `document "${doc.id ?? '?'}" is missing "${field}"`).to.have.property(field);
      });
    });
  });

  it('every document has a non-empty id and filepath', function () {
    this.docs.forEach((doc) => {
      expect(doc.id,       `id must be a non-empty string`).to.be.a('string').and.not.be.empty;
      expect(doc.filepath, `filepath must be a non-empty string`).to.be.a('string').and.not.be.empty;
    });
  });

  it('user_type is one of: business, technical, both, or null', function () {
    const allowed = ['business', 'technical', 'both', null];
    this.docs.forEach((doc) => {
      expect(allowed, `unexpected user_type "${doc.user_type}" on "${doc.id}"`).to.include(doc.user_type ?? null);
    });
  });

});

describe('Local search fallback behaviour', () => {

  beforeEach(() => {
    // Force every Azure Search request to return a server error so the catch
    // block in SearchBar triggers localSearch() instead.
    cy.intercept('GET', '**/indexes/**/docs**', {
      statusCode: 500,
      body: { error: { message: 'Simulated Azure Search failure' } },
    }).as('azureSearch');

    cy.visit('/');
  });

  it('shows the "Search service unavailable" hint when Azure Search fails', () => {
    cy.get('button[aria-label*="Search or ask AI"]').click();
    cy.get('[role=combobox]').type('installation');

    cy.get('[data-cy=local-fallback-hint]')
      .should('be.visible')
      .and('contain', 'Search service unavailable');
  });

  it('still returns results from the local index when Azure Search fails', () => {
    cy.get('button[aria-label*="Search or ask AI"]').click();
    cy.get('[role=combobox]').type('installation');

    cy.get('[data-cy=local-fallback-hint]').should('be.visible');
    cy.get('[role=option]').should('have.length.greaterThan', 0);
  });

  it('does not show the fallback hint before any search is made', () => {
    cy.get('button[aria-label*="Search or ask AI"]').click();
    cy.get('[data-cy=local-fallback-hint]').should('not.exist');
  });

});
