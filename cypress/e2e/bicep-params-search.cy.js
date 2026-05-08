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

      it('auto-expands a parent parameter when its own name matches the search, and allows clicking to collapse and re-expand', () => {

        // 'Scaling' matches parent-level parameters (e.g. timeSequencerScaling) but
        // not their children (e.g. cpuResources). The parent must be auto-expanded so
        // children are visible immediately, and the user must still be able to toggle.
        cy.get('@searchInput').clear().type('Scaling');

        cy.get('[data-cy=search-results] tbody tr')
          .should('have.length.greaterThan', 0);

        // Children (non-matching rows) are visible without any click because the
        // parent was auto-expanded when it self-matched the search term.
        cy.get('[data-cy=search-results] tbody tr td:first-child code')
          .then(($codes) => {
            const texts = $codes.toArray().map((el) => el.textContent.toLowerCase());
            expect(
              texts.some((t) => !t.includes('scaling')),
              'child rows should be visible immediately after parent matches search'
            ).to.be.true;
          });

        // Click the first matched (auto-expanded) row to collapse it.
        cy.get('[data-cy=search-results] tbody tr').first().click();

        cy.get('[data-cy=search-results] tbody tr td:first-child code')
          .then(($codes) => {
            const texts = $codes.toArray().map((el) => el.textContent.toLowerCase());
            expect(
              texts.every((t) => t.includes('scaling')),
              'child rows should be hidden after clicking to collapse'
            ).to.be.true;
          });

        // Click again to re-expand.
        cy.get('[data-cy=search-results] tbody tr').first().click();

        cy.get('[data-cy=search-results] tbody tr td:first-child code')
          .then(($codes) => {
            const texts = $codes.toArray().map((el) => el.textContent.toLowerCase());
            expect(
              texts.some((t) => !t.includes('scaling')),
              'child rows should be visible again after clicking to re-expand'
            ).to.be.true;
          });

        cy.get('@searchInput').clear();

        cy.get('[data-cy=search-results] tbody tr')
          .should('have.length.greaterThan', 0);

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

      describe('query string behavior', () => {

        it('restores search text from ?q= on load', () => {
          cy.visit(`${route}?step=deploy&q=prefix`);
          cy.get('[data-cy=search-input]').should('have.value', 'prefix');
          cy.get('[data-cy=search-results] tbody tr').should('have.length.greaterThan', 0);
        });

        it('updates ?q= in the URL when typing in the search input', () => {
          cy.visit(`${route}?step=deploy`);
          cy.get('[data-cy=search-input]').type('prefix');
          cy.location('search').should('include', 'q=prefix');
        });

        it('removes ?q= from the URL when the search input is cleared', () => {
          cy.visit(`${route}?step=deploy&q=prefix`);
          cy.get('[data-cy=search-input]').clear();
          cy.location('search').should('not.include', 'q=');
        });

        it('restores an active tag from ?tags= on load', () => {
          cy.visit(`${route}?step=deploy&tags=vnet`);
          cy.get('[data-cy=vnet]').should('have.attr', 'aria-pressed', 'true');
          cy.get('[data-cy=search-results] tbody tr').each(($row) => {
            cy.wrap($row).find('td:last-child').should('contain', 'vnet');
          });
        });

        it('restores multiple tags from a comma-separated ?tags= on load', () => {
          cy.visit(`${route}?step=deploy&tags=vnet,scaling`);
          cy.get('[data-cy=vnet]').should('have.attr', 'aria-pressed', 'true');
          cy.get('[data-cy=scaling]').should('have.attr', 'aria-pressed', 'true');
        });

        it('updates ?tags= in the URL when activating a tag', () => {
          cy.visit(`${route}?step=deploy`);
          cy.get('[data-cy=vnet]').click();
          cy.location('search').should('include', 'tags=vnet');
        });

        it('includes multiple active tags comma-separated in ?tags=', () => {
          cy.visit(`${route}?step=deploy`);
          cy.get('[data-cy=vnet]').click();
          cy.get('[data-cy=scaling]').click();
          cy.location('search')
            .should('include', 'tags=')
            .and('include', 'vnet')
            .and('include', 'scaling');
        });

        it('removes ?tags= from the URL when all tags are deactivated', () => {
          cy.visit(`${route}?step=deploy&tags=vnet`);
          cy.get('[data-cy=vnet]').click();
          cy.location('search').should('not.include', 'tags=');
        });

        it('restores both search and tags from the URL on load', () => {
          cy.visit(`${route}?step=deploy&q=prefix&tags=governance`);
          cy.get('[data-cy=search-input]').should('have.value', 'prefix');
          cy.get('[data-cy=governance]').should('have.attr', 'aria-pressed', 'true');
        });

        it('preserves the step param when updating the search', () => {
          cy.visit(`${route}?step=deploy`);
          cy.get('[data-cy=search-input]').type('prefix');
          cy.location('search').should('include', 'step=deploy').and('include', 'q=prefix');
        });

        it('preserves the step param when toggling a tag', () => {
          cy.visit(`${route}?step=deploy`);
          cy.get('[data-cy=vnet]').click();
          cy.location('search').should('include', 'step=deploy').and('include', 'tags=vnet');
        });

      });

    });

  });

});