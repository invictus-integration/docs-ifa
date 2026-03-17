describe('Bicep parameter search', () => {

  const routes = ['/framework/installation', '/dashboard/installation'];
  const searchTerms = ['ser', 'use'];
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

          cy.get('[data-cy=search-results] tbody tr').each(($row) => {

            cy.wrap($row)
              .find('td:first-child')
              .should(($cell) => {
                expect($cell.text().toLowerCase()).to.contain(term);
              })
              .find('mark')
              .should('exist')
              .and(($mark) => {
                expect($mark.text().toLowerCase()).to.contain(term);
              });

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