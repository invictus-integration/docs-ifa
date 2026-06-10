/**
 * FAQ tests — Help Center page.
 *
 * Filtering is URL-driven (?q= param) because the FAQ component on the Help
 * Center page has no standalone search input — users filter via the global
 * search bar (Ctrl+K) which deep-links here with a pre-populated query.
 */
describe('FAQ — Help Center', () => {

  const PAGE = '/support/help-center-technical';

  beforeEach(() => {
    cy.visit(PAGE);
  });

  // ── Initial state ─────────────────────────────────────────────────────────

  describe('initial state', () => {

    it('shows all questions on load', () => {
      cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0);
    });

    it('starts with no answer expanded', () => {
      cy.get('[data-cy=faq-answer]').should('not.exist');
    });

  });

  // ── Accordion ─────────────────────────────────────────────────────────────

  describe('accordion', () => {

    it('opens an answer when clicking a question', () => {
      cy.get('[data-cy=faq-item]').first().find('button').first().click();
      cy.get('[data-cy=faq-item]').first().find('[data-cy=faq-answer]').should('be.visible');
    });

    it('closes the answer on a second click', () => {
      cy.get('[data-cy=faq-item]').first().find('button').first().click();
      cy.get('[data-cy=faq-item]').first().find('[data-cy=faq-answer]').should('be.visible');
      cy.get('[data-cy=faq-item]').first().find('button').first().click();
      cy.get('[data-cy=faq-item]').first().find('[data-cy=faq-answer]').should('not.exist');
    });

    it('only one answer can be open at a time', () => {
      cy.get('[data-cy=faq-item]').eq(0).find('button').first().click();
      cy.get('[data-cy=faq-item]').eq(1).find('button').first().click();

      cy.get('[data-cy=faq-answer]').should('have.length', 1);
      cy.get('[data-cy=faq-item]').eq(0).find('[data-cy=faq-answer]').should('not.exist');
      cy.get('[data-cy=faq-item]').eq(1).find('[data-cy=faq-answer]').should('be.visible');
    });

  });

  // ── URL-driven filtering (?q=) ────────────────────────────────────────────

  describe('URL-driven filtering (?q=)', () => {

    it('filters questions matching a term', () => {
      cy.visit(`${PAGE}?q=pubsub`);
      cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0);
    });

    it('shows fewer results when filtered than unfiltered', () => {
      cy.get('[data-cy=faq-item]').its('length').then((total) => {
        cy.visit(`${PAGE}?q=pubsub`);
        cy.get('[data-cy=faq-item]').should('have.length.lessThan', total);
      });
    });

    it('highlights the search term in matching question text', () => {
      // "502" appears only in the Transco question title
      cy.visit(`${PAGE}?q=502`);
      cy.get('[data-cy=faq-item]').first().find('button mark')
        .should('exist')
        .and(($marks) => {
          expect($marks.text().toLowerCase()).to.contain('502');
        });
    });

    it('auto-opens items where only the answer matches', () => {
      cy.visit(`${PAGE}?q=cosmosdb`);
      cy.get('[data-cy=faq-answer]').should('be.visible').invoke('text').then((text) => {
        expect(text.toLowerCase()).to.contain('cosmosdb');
      });
    });

    it('highlights the search term inside the answer', () => {
      cy.visit(`${PAGE}?q=cosmosdb`);
      cy.get('[data-cy=faq-answer]').find('mark').should('exist').and(($marks) => {
        expect($marks.text().toLowerCase()).to.contain('cosmosdb');
      });
    });

    it('shows the empty state for no matches', () => {
      cy.visit(`${PAGE}?q=xyznonexistent`);
      cy.get('[data-cy=faq-item]').should('not.exist');
      cy.contains('No questions match').should('be.visible');
      cy.contains('Open a GitHub discussion').should('be.visible');
    });

  });

  // ── Tag filtering ─────────────────────────────────────────────────────────

  describe('tag filtering', () => {

    ['pubsub', 'transco', 'migration'].forEach((tag) => {

      it(`filters questions by tag "${tag}"`, () => {
        cy.get(`[data-cy=${tag}]`).click();
        cy.get('[data-cy=faq-item]')
          .should('have.length.greaterThan', 0)
          .each(($item) => {
            cy.wrap($item).should('have.attr', 'data-tags').and('include', tag);
          });
      });

      it(`deactivating tag "${tag}" restores more results`, () => {
        cy.get(`[data-cy=${tag}]`).click();
        cy.get('[data-cy=faq-item]').its('length').then((filteredCount) => {
          cy.get(`[data-cy=${tag}]`).click();
          cy.get('[data-cy=faq-item]').should('have.length.greaterThan', filteredCount);
        });
      });

    });

    it('applies multiple tags as an AND filter', () => {
      cy.get('[data-cy=migration]').click();
      cy.get('[data-cy=faq-item]').its('length').then((migrationCount) => {
        cy.get('[data-cy=entra-id]').click();
        cy.get('[data-cy=faq-item]').should('have.length.lessThan', migrationCount);
      });
    });

  });

  // ── Combined ?q= and tag filter ───────────────────────────────────────────

  describe('combined URL filter and tag filter', () => {

    it('applies both filters simultaneously', () => {
      cy.visit(`${PAGE}?q=lock`);
      cy.get('[data-cy=pubsub]').click();
      cy.get('[data-cy=faq-item]')
        .should('have.length.greaterThan', 0)
        .each(($item) => {
          cy.wrap($item).should('have.attr', 'data-tags').and('include', 'pubsub');
        });
    });

    it('shows empty state when combined filters match nothing', () => {
      cy.visit(`${PAGE}?q=xyznonexistent`);
      cy.get('[data-cy=transco]').click();
      cy.get('[data-cy=faq-item]').should('not.exist');
    });

  });

});
