const versionFilter = () => cy.get('#rn-series-filter');
const dropdownList = () => cy.get('[role=listbox]');
const collapsedBlocks = () => cy.get('.rn-version-block--collapsed');
const latestBadge = () => cy.get('.rn-latest-badge');
const visibleHeadings = () => cy.get('h2').filter(':visible');

const selectVersion = (label) => { versionFilter().click(); cy.get('[role=option]').contains(label).click(); };

describe('Release notes', () => {

  const url = '/support/release-notes';

  beforeEach(() => {
    cy.visit(url);
  });

  describe('initial state', () => {

    it('shows the version filter dropdown', () => {
      versionFilter().should('be.visible');
      versionFilter().should('contain', 'All versions');
    });

    it('has the dropdown closed', () => {
      dropdownList().should('not.exist');
      versionFilter().should('have.attr', 'aria-expanded', 'false');
    });

    it('shows the latest version expanded with the Latest badge', () => {
      latestBadge().should('be.visible');
      cy.get('[data-version]').first().find('.rn-latest-badge').should('exist');
    });

    it('shows older versions collapsed', () => {
      collapsedBlocks().should('have.length.greaterThan', 0);
    });

  });

  describe('series dropdown', () => {

    it('opens when clicked', () => {
      versionFilter().click();
      dropdownList().should('be.visible');
      versionFilter().should('have.attr', 'aria-expanded', 'true');
    });

    it('lists All versions and one option per minor series', () => {
      versionFilter().click();
      cy.get('[role=option]').should('have.length.greaterThan', 1);
      cy.get('[role=option]').first().should('contain', 'All versions');
    });

    it('marks All versions as selected by default', () => {
      versionFilter().click();
      cy.get('[role=option][aria-selected=true]').should('contain', 'All versions');
    });

    it('closes when an option is selected', () => {
      collapsedBlocks().first().invoke('attr', 'data-version').then(v => {
        selectVersion(`v${v}`);
        dropdownList().should('not.exist');
      });
    });

    it('closes when clicking outside', () => {
      versionFilter().click();
      dropdownList().should('be.visible');
      cy.get('h1').click();
      dropdownList().should('not.exist');
    });

    it('closes on Escape', () => {
      versionFilter().click();
      dropdownList().should('be.visible');
      versionFilter().trigger('keydown', { key: 'Escape' });
      dropdownList().should('not.exist');
    });

    it('toggles open and closed with Enter', () => {
      versionFilter().focus();
      cy.focused().trigger('keydown', { key: 'Enter' });
      dropdownList().should('be.visible');
      cy.focused().trigger('keydown', { key: 'Enter' });
      dropdownList().should('not.exist');
    });

  });

  describe('version filtering', () => {

    beforeEach(() => {
      collapsedBlocks().first().invoke('attr', 'data-version').as('filterVersion');
    });

    it('updates the URL with ?minor= when a version is selected via the dropdown', function () {
      selectVersion(`v${this.filterVersion}`);
      cy.location('search').should('include', `minor=${this.filterVersion}`);
    });

    describe('when a version is pre-selected via ?minor= URL parameter', () => {

      beforeEach(function () {
        cy.visit(`${url}?minor=${this.filterVersion}`);
      });

      it('reflects the active series in the dropdown', function () {
        versionFilter().should('contain', `v${this.filterVersion}`);
      });

      it('shows only the selected series', function () {
        visibleHeadings().should('have.length', 1);
        visibleHeadings().should('contain', `v${this.filterVersion}`);
      });

      it('force-expands the filtered version', () => {
        collapsedBlocks().should('not.exist');
      });

      it('restores all versions when All versions is selected', () => {
        selectVersion('All versions');
        visibleHeadings().should('have.length.greaterThan', 1);
      });

      it('removes ?minor= from the URL when All versions is selected', () => {
        selectVersion('All versions');
        cy.location('search').should('not.include', 'minor=');
      });

    });

    it('applies the filter for a different version on load', () => {
      collapsedBlocks().eq(1).invoke('attr', 'data-version').then(v => {
        cy.visit(`${url}?minor=${v}`);
        versionFilter().should('contain', `v${v}`);
        visibleHeadings().should('have.length', 1);
        visibleHeadings().should('contain', `v${v}`);
      });
    });

  });

  describe('version block expand and collapse', () => {

    beforeEach(() => {
      collapsedBlocks().then($blocks => {
        cy.wrap($blocks.eq(Math.floor(Math.random() * $blocks.length))).as('block');
      });
    });

    it('expands a collapsed version block when clicked', () => {
      collapsedBlocks().its('length').then((count) => {
        cy.get('@block').click();
        collapsedBlocks().should('have.length', count - 1);
      });
    });

    it('shows section content after expanding a collapsed block', () => {
      cy.get('@block').click();
      cy.get('@block').find('.alert').should('exist');
    });

    it('expands a collapsed block with Enter key', () => {
      collapsedBlocks().its('length').then((count) => {
        cy.get('@block').focus();
        cy.focused().trigger('keydown', { key: 'Enter' });
        collapsedBlocks().should('have.length', count - 1);
      });
    });

  });

});