describe('FAQ search', () => {

  beforeEach(() => {
    cy.visit('/support/faq');
    cy.get('[data-cy=search-input]').as('searchInput');
  });

  describe('initial state', () => {

    it('shows all questions on load', () => {
      cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0);
    });

    it('shows the correct results count', () => {
      cy.get('[data-cy=faq-item]').its('length').then((count) => {
        cy.get('[data-cy=search-results-summary]').should('contain', `${count} questions`);
      });
    });

    it('starts with no answer expanded', () => {
      cy.get('[data-cy=faq-answer]').should('not.exist');
    });

  });

  describe('accordion', () => {

    it('opens an answer when clicking a question', () => {
      cy.get('[data-cy=faq-item]').first().as('item');
      cy.get('@item').find('[data-cy=faq-answer]').should('not.exist');
      cy.get('@item').find('button').first().click();
      cy.get('@item').find('[data-cy=faq-answer]').should('be.visible');
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

  describe('search', () => {

    ['pubsub', 'http'].forEach((term) => {

      it(`filters questions matching "${term}"`, () => {
        cy.get('@searchInput').type(term);
        cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0);
      });

      it(`restores all questions after clearing "${term}"`, () => {
        cy.get('@searchInput').type(term);
        cy.get('[data-cy=faq-item]').its('length').then((filteredCount) => {
          cy.get('@searchInput').clear();
          cy.get('[data-cy=faq-item]').should('have.length.greaterThan', filteredCount);
        });
      });

    });

    it('highlights the search term in matching question text', () => {
      // "502" appears only in the Transco question title, guaranteeing the mark is in the question
      cy.get('@searchInput').type('502');
      cy.get('[data-cy=faq-item]').first().find('button mark')
        .should('exist')
        .and(($marks) => {
          expect($marks.text().toLowerCase()).to.contain('502');
        });
    });

    it('also matches questions where only the answer contains the search term', () => {
      cy.get('@searchInput').type('cosmosdb');
      cy.get('[data-cy=faq-item]').should('have.length', 1);

      cy.get('[data-cy=faq-item]').first().find('button').first().click();
      cy.get('[data-cy=faq-answer]').invoke('text').then((text) => {
        expect(text.toLowerCase()).to.contain('cosmosdb');
      });
    });

    it('auto-opens items where only the answer matches the search term', () => {
      cy.get('@searchInput').type('cosmosdb');
      cy.get('[data-cy=faq-answer]').should('be.visible').invoke('text').then((text) => {
        expect(text.toLowerCase()).to.contain('cosmosdb');
      });
    });

    it('highlights the search term inside the answer', () => {
      cy.get('@searchInput').type('cosmosdb');
      cy.get('[data-cy=faq-answer]').find('mark').should('exist').and(($marks) => {
        expect($marks.text().toLowerCase()).to.contain('cosmosdb');
      });
    });

    it('closes auto-opened answers when search is cleared', () => {
      cy.get('@searchInput').type('cosmosdb');
      cy.get('[data-cy=faq-answer]').should('be.visible');
      cy.get('@searchInput').clear();
      cy.get('[data-cy=faq-answer]').should('not.exist');
    });

    it('shows empty state for no matches', () => {
      cy.get('@searchInput').type('xyznonexistent');
      cy.get('[data-cy=faq-item]').should('not.exist');
      cy.contains('No results found').should('be.visible');
      cy.contains('Enter').should('be.visible');
    });

    it('updates the results count to match the filtered set', () => {
      cy.get('@searchInput').type('pubsub');
      cy.get('[data-cy=faq-item]').its('length').then((count) => {
        cy.get('[data-cy=search-results-summary]').should('contain', `${count} question`);
      });
    });

  });

  describe('tag filtering', () => {

    ['pubsub', 'transco', 'migration'].forEach((tag) => {

      it(`filters questions by tag "${tag}"`, () => {
        cy.get(`[data-cy=${tag}]`).click();

        cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0).each(($item) => {
          cy.wrap($item).should('contain', tag);
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

  describe('combined search and tag filter', () => {

    it('applies both filters simultaneously', () => {
      cy.get('[data-cy=pubsub]').click();
      cy.get('@searchInput').type('lock');

      cy.get('[data-cy=faq-item]').should('have.length.greaterThan', 0);
      cy.get('[data-cy=faq-item]').each(($item) => {
        cy.wrap($item).should('contain', 'pubsub');
      });
    });

    it('shows empty state when combined filters match nothing', () => {
      cy.get('[data-cy=transco]').click();
      cy.get('@searchInput').type('xyznonexistent');
      cy.get('[data-cy=faq-item]').should('not.exist');
    });

  });

});