describe('Bicep parameter search', () => {

  ['/framework/installation', '/dashboard/installation'].forEach((route) => {
    describe(route, () => {
      beforeEach(() => {
        cy.visit(route);
        cy.contains('li', 'Deploy').click();
        cy.get('[data-cy=search-input]').as('searchInput');
        cy.get('[data-cy=search-results] tbody tr').as('searchResults');
        cy.get('@searchResults').should('have.length.greaterThan', 0);
      })

      const searchTerms = ['ser', 'use'];
      searchTerms.forEach((term) => {
        it(`filters table rows for "${term}"`, () => {
          cy.get('@searchInput')
            .clear()
            .type(term);

          cy.get('@searchResults').each(($row) => {
            cy.wrap($row)
              .find('td:first-child')
              .should('exist')
              .as('firstCell')
              .then((cell) => {
                expect(cell.text().toLowerCase()).to.contain(term);

                cy.wrap(cell)
                  .find('mark')
                  .should('exist')
                  .then(($mark) => {
                    expect(term).to.equal($mark.text().toLowerCase());
                  });
              });
          });

          cy.get('@searchInput').clear();
          cy.get('@searchResults').should('have.length.greaterThan', 0);
        });
      });

      const tags = ['vnet', 'scaling', 'container-apps']
      tags.forEach((tag) => {
        it(`filters table rows for tag "${tag}"`, () => {
          cy.get(`[data-cy=${tag}`)
            .as(tag)
            .should('exist')
            .click();

          cy.get('@searchResults').each(($row) => {
            cy.wrap($row)
              .find('td:last-child')
              .should('contain', tag);
          });

          cy.get(`@${tag}`).click();
          cy.get('@searchResults').should('have.length.greaterThan', 0);

          cy.get('@searchResults')
            .filter(($row) => !$row.text().find('td:last-child').text().includes(tag))
            .should('have.length.greaterThan', 0);
        });
      });
    });
  });
});