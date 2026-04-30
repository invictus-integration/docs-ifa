describe('Release notes', () => {

  const url = '/support/release-notes';

  beforeEach(() => {
    cy.visit(url);
  });

  describe('initial state', () => {

    it('shows the series filter dropdown', () => {
      cy.get('#rn-series-filter').should('be.visible');
      cy.get('#rn-series-filter').should('contain', 'All versions');
    });

    it('has the dropdown closed', () => {
      cy.get('[role=listbox]').should('not.exist');
      cy.get('#rn-series-filter').should('have.attr', 'aria-expanded', 'false');
    });

    it('shows the latest version expanded with the Latest badge', () => {
      cy.get('.rn-latest-badge').should('be.visible');
      cy.get('.rn-latest-badge').closest('h2').should('contain', 'v6.3');
    });

    it('shows older versions collapsed with section pills', () => {
      cy.get('.rn-version-block--collapsed').should('have.length.greaterThan', 0);
      cy.get('.rn-pill').should('be.visible');
    });

    it('does not show section pills on the latest expanded version', () => {
      cy.get('.rn-latest-badge').parents('div').first().find('.rn-pill').should('not.exist');
    });

  });

  describe('series dropdown', () => {

    it('opens when clicked', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=listbox]').should('be.visible');
      cy.get('#rn-series-filter').should('have.attr', 'aria-expanded', 'true');
    });

    it('lists All versions and one option per minor series', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').should('have.length.greaterThan', 1);
      cy.get('[role=option]').first().should('contain', 'All versions');
    });

    it('marks All versions as selected by default', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option][aria-selected=true]').should('contain', 'All versions');
    });

    it('closes when an option is selected', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('[role=listbox]').should('not.exist');
    });

    it('closes when clicking outside', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=listbox]').should('be.visible');
      cy.get('h1').click();
      cy.get('[role=listbox]').should('not.exist');
    });

    it('closes on Escape', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=listbox]').should('be.visible');
      cy.get('#rn-series-filter').trigger('keydown', { key: 'Escape' });
      cy.get('[role=listbox]').should('not.exist');
    });

    it('toggles open and closed with Enter', () => {
      cy.get('#rn-series-filter').focus();
      cy.focused().trigger('keydown', { key: 'Enter' });
      cy.get('[role=listbox]').should('be.visible');
      cy.focused().trigger('keydown', { key: 'Enter' });
      cy.get('[role=listbox]').should('not.exist');
    });

  });

  describe('version filtering', () => {

    it('shows only the selected series when a version is picked', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('h2').filter(':visible').should('have.length', 1);
      cy.get('h2').filter(':visible').should('contain', 'v6.2');
    });

    it('force-expands the filtered version', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('.rn-version-block--collapsed').should('not.exist');
    });

    it('hides section pills when a version is force-expanded by filter', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('.rn-pill').should('not.exist');
    });

    it('restores all versions when All versions is selected', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('All versions').click();
      cy.get('h2').filter(':visible').should('have.length.greaterThan', 1);
    });

    it('updates the URL with ?minor= when a version is selected', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.location('search').should('include', 'minor=6.2');
    });

    it('removes ?minor= from the URL when All versions is selected', () => {
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('v6.2').click();
      cy.get('#rn-series-filter').click();
      cy.get('[role=option]').contains('All versions').click();
      cy.location('search').should('not.include', 'minor=');
    });

    it('applies the filter from a ?minor= URL parameter on load', () => {
      cy.visit(`${url}?minor=6.1`);
      cy.get('#rn-series-filter').should('contain', 'v6.1');
      cy.get('h2').filter(':visible').should('have.length', 1);
      cy.get('h2').filter(':visible').should('contain', 'v6.1');
    });

  });

  describe('version block expand and collapse', () => {

    it('expands a collapsed version block when clicked', () => {
      cy.get('.rn-version-block--collapsed').its('length').then((count) => {
        cy.get('.rn-version-block--collapsed').first().click();
        cy.get('.rn-version-block--collapsed').should('have.length', count - 1);
      });
    });

    it('shows section content after expanding a collapsed block', () => {
      cy.get('.rn-version-block--collapsed').first().click();
      cy.get('.rn-version-collapsible').first().next().find('.alert').should('exist');
    });

    it('hides section pills after expanding a collapsed block', () => {
      cy.get('.rn-version-block--collapsed').first().find('.rn-pill').should('be.visible');
      cy.get('.rn-version-block--collapsed').first().click();
      cy.get('.rn-version-collapsible').first().find('.rn-pill').should('not.exist');
    });

    it('collapses an expanded block when its header is clicked', () => {
      cy.get('.rn-version-block--collapsed').first().click();
      cy.get('.rn-version-collapsible').first().click();
      cy.get('.rn-pill').should('be.visible');
    });

    it('expands a collapsed block with Enter key', () => {
      cy.get('.rn-version-block--collapsed').its('length').then((count) => {
        cy.get('.rn-version-block--collapsed').first().focus();
        cy.focused().trigger('keydown', { key: 'Enter' });
        cy.get('.rn-version-block--collapsed').should('have.length', count - 1);
      });
    });

  });

});
