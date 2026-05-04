describe('TermHighlight Tooltip', () => {

  // ─── Commands ────────────────────────────────────────────────────────────

  // Trigger React's onMouseEnter via a bubbling mouseover event.
  // React simulates mouseenter/mouseleave from mouseover/mouseout
  // at its root listener, so bubbling is required.
  Cypress.Commands.add('hoverBadge', { prevSubject: 'element' }, (subject) =>
    cy.wrap(subject).trigger('mouseover', { bubbles: true })
  );

  const tooltip = () => cy.get('.invictus-tooltip');
  const tooltipNav = () => cy.get('.invictus-tooltip__nav');
  const navBtn = () => cy.get('.invictus-tooltip__nav-btn');
  const pager = () => cy.get('.invictus-tooltip__nav-pager');
  const navLabel = () => cy.get('.invictus-tooltip__nav-label');
  const termLink = () => cy.get('.invictus-tooltip .invictus-tooltip__term-link');

  // ─── Technical tooltip (architecture page) ───────────────────────────────

  describe('Technical tooltip', () => {

    beforeEach(() => {
      cy.visit('/architecture-diagram');
      cy.get('.term-highlight--flow').first().as('badge');
    });

    describe('on hover', () => {
      beforeEach(() => cy.get('@badge').hoverBadge());

      it('shows the tooltip', () => {
        tooltip().should('be.visible');
      });

      it('includes carousel navigation with two buttons', () => {
        tooltipNav().should('be.visible');
        navBtn().should('have.length', 2);
      });

      it('starts at page 1 of 3', () => {
        pager().should('have.text', '1 / 3');
      });

      it('shows "flow traces" as a navigable cross-reference', () => {
        tooltip().should('contain.text', 'flow traces');
        termLink().should('exist');
      });
    });

    describe('when pinned', () => {
      beforeEach(() => cy.get('@badge').click());

      it('advances to the next term on › click', () => {
        navBtn().last().click();
        pager().should('have.text', '2 / 3');
        navLabel().should('contain.text', 'flow trace');
      });

      it('wraps backward to the last term on ‹ click from page 1', () => {
        navBtn().first().click();
        pager().should('have.text', '3 / 3');
        navLabel().should('contain.text', 'flow trace importing');
      });

      it('navigates directly to a term via a cross-reference link', () => {
        termLink().first().click();
        pager().should('have.text', '2 / 3');
      });

      it('closes when clicking outside', () => {
        tooltip().should('be.visible');
        cy.get('body').click(0, 0);
        tooltip().should('not.exist');
      });

      it('closes when pressing Escape', () => {
        tooltip().should('be.visible');
        cy.get('body').trigger('keydown', { key: 'Escape', bubbles: true });
        tooltip().should('not.exist');
      });
    });

    it('resets to page 1 when the tooltip is closed and reopened', () => {
      cy.get('@badge').click();
      navBtn().last().click();
      pager().should('have.text', '2 / 3');

      cy.get('body').click(0, 0);
      tooltip().should('not.exist');

      cy.get('@badge').hoverBadge();
      pager().should('have.text', '1 / 3');
    });

  });

  // ─── Business tooltip (flows page) ───────────────────────────────────────

  describe('Business tooltip', () => {

    beforeEach(() => {
      cy.visit('/dashboard/flows');
      cy.get('.term-highlight--flow').first().as('badge');
      cy.get('@badge').hoverBadge();
    });

    it('shows the tooltip', () => tooltip().should('be.visible'));
    it('does not show carousel navigation', () => tooltipNav().should('not.exist'));
    it('contains "mapping messages"', () => tooltip().should('contain.text', 'mapping messages'));
    it('does not mention "flow traces"', () => tooltip().should('not.contain.text', 'flow traces'));
    it('does not contain cross-reference links', () => termLink().should('not.exist'));

  });

  // ─── Single tooltip exclusivity ──────────────────────────────────────────

  describe('Single tooltip exclusivity', () => {

    beforeEach(() => cy.visit('/architecture-diagram'));

    it('closes a pinned tooltip when hovering a different badge', () => {
      cy.get('.term-highlight--flow').first().click();
      tooltip().should('be.visible');

      cy.get('.term-highlight--flow-trace').first().hoverBadge();

      tooltip().should('have.length', 1);
      navLabel().should('contain.text', 'flow trace');
    });

    it('never shows more than one tooltip at a time', () => {
      cy.get('.term-highlight--flow').first().hoverBadge();
      tooltip().should('have.length', 1);
      navLabel().should('contain.text', 'flow');

      cy.get('.term-highlight--flow-trace').first().hoverBadge();
      tooltip().should('have.length', 1);
      navLabel().should('contain.text', 'flow trace');
    });

  });

});
