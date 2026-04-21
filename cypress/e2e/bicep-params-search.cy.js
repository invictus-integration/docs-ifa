describe('Bicep parameter search', () => {

  const routes = ['/framework/installation', '/dashboard/installation'];
  const searchTerms = ['ser', 'use', 'name', 'function', 'prefix', 'scaling'];
  const propertySearchTerms = ['cpu', 'memory', 'replicas', 'concurrent'];
  const tags = ['vnet', 'scaling', 'container-apps'];

  routes.forEach((route) => {

    describe(route, () => {

      beforeEach(() => {
        cy.visit(route);
        cy.contains('li', 'Deploy').click();
        cy.get('[data-cy=search-input]').as('searchInput');
        cy.get('[data-cy=search-results] tbody tr')
          .should('have.length.greaterThan', 0);
      });

      searchTerms.forEach((term) => {

        it(`filters table rows for "${term}"`, () => {

          cy.get('@searchInput').clear().type(term);

          cy.get('[data-cy=search-results] tbody tr')
            .should('have.length.greaterThan', 0);

          cy.get('[data-cy=search-results] tbody tr').then(($rows) => {
            const directMatches = $rows.filter((_, row) =>
              Cypress.$(row).find('td:first-child').text().toLowerCase().includes(term)
            );

            expect(directMatches.length).to.be.greaterThan(0);

            directMatches.each((_, row) => {
              const $mark = Cypress.$(row).find('td:first-child mark');
              expect($mark.length).to.be.greaterThan(0);
              expect($mark.text().toLowerCase()).to.contain(term);
            });
          });

          cy.get('@searchInput').clear();

          cy.get('[data-cy=search-results] tbody tr')
            .should('have.length.greaterThan', 0);
        });

      });

      propertySearchTerms.forEach((term) => {

        it(`filters table rows by property name for "${term}"`, () => {

          cy.get('@searchInput').clear().type(term);

          cy.get('[data-cy=search-results] tbody tr')
            .should('have.length.greaterThan', 0)
            .find('td:first-child code')
            .should(($codes) => {
              const texts = $codes.toArray().map((el) => el.textContent.toLowerCase());
              expect(texts.some((t) => !t.includes(term))).to.be.true;
            });

          cy.get('[data-cy=search-results] tbody tr td:first-child mark')
            .should('exist')
            .each(($mark) => {
              expect($mark.text().toLowerCase()).to.contain(term);
            });

          cy.get('@searchInput').clear();

          cy.get('[data-cy=search-results] tbody tr')
            .should('have.length.greaterThan', 0);
        });

      });

      tags.forEach((tag) => {

        it(`filters table rows for tag "${tag}"`, () => {

          cy.get(`[data-cy=${tag}]`).click();

          cy.get('[data-cy=search-results] tbody tr')
            .each(($row) => {
              cy.wrap($row)
                .find('td:last-child')
                .should('contain', tag);
            });

          cy.get(`[data-cy=${tag}]`).click();

          cy.get('[data-cy=search-results] tbody tr')
            .should('have.length.greaterThan', 0)
            .filter((_, row) => {
              const text = Cypress.$(row).find('td:last-child').text();
              return !text.includes(tag);
            })
            .should('have.length.greaterThan', 0);

        });

      });

    });

  });

});