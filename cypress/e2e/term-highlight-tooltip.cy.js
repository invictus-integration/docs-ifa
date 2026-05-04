describe('TermHighlight Tooltip', () => {

  // Trigger React's onMouseEnter via a bubbling mouseover event.
  // React simulates mouseenter/mouseleave from mouseover/mouseout
  // at its root listener, so bubbling is required.
  Cypress.Commands.add('hoverBadge', { prevSubject: 'element' }, (subject) =>
    cy.wrap(subject).trigger('mouseover', { bubbles: true })
  );

  // ─── Technical tooltip (architecture page) ───────────────────────────────

  describe('Technical tooltip', () => {

    beforeEach(() => {
      cy.visit('/architecture-diagram');
      cy.get('.term-highlight--flow').first().as('badge');
    });

    it('shows the tooltip on hover', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip').should('be.visible');
    });

    it('includes carousel navigation', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip__nav').should('be.visible');
      cy.get('.invictus-tooltip__nav-btn').should('have.length', 2);
    });

    it('starts at page 1 of 3', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '1 / 3');
    });

    it('shows "flow traces" as a navigable cross-reference', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip').should('contain.text', 'flow traces');
      cy.get('.invictus-tooltip .invictus-tooltip__term-link').should('exist');
    });

    it('advances to the next term on › click', () => {
      cy.get('@badge').click(); // pin so tooltip stays during interaction
      cy.get('.invictus-tooltip__nav-btn').last().click();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '2 / 3');
      cy.get('.invictus-tooltip__nav-label').should('contain.text', 'flow trace');
    });

    it('wraps backward to the last term on ‹ click from page 1', () => {
      cy.get('@badge').click();
      cy.get('.invictus-tooltip__nav-btn').first().click();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '3 / 3');
      cy.get('.invictus-tooltip__nav-label').should('contain.text', 'flow trace importing');
    });

    it('navigates directly to a term via a cross-reference link', () => {
      cy.get('@badge').click();
      cy.get('.invictus-tooltip .invictus-tooltip__term-link').first().click();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '2 / 3');
    });

    it('resets to page 1 when the tooltip is closed and reopened', () => {
      cy.get('@badge').click();
      cy.get('.invictus-tooltip__nav-btn').last().click();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '2 / 3');

      cy.get('body').click(0, 0); // click outside to close
      cy.get('.invictus-tooltip').should('not.exist');

      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip__nav-pager').should('have.text', '1 / 3');
    });

    it('closes when clicking outside', () => {
      cy.get('@badge').click();
      cy.get('.invictus-tooltip').should('be.visible');
      cy.get('body').click(0, 0);
      cy.get('.invictus-tooltip').should('not.exist');
    });

    it('closes when pressing Escape', () => {
      cy.get('@badge').click();
      cy.get('.invictus-tooltip').should('be.visible');
      cy.get('body').trigger('keydown', { key: 'Escape', bubbles: true });
      cy.get('.invictus-tooltip').should('not.exist');
    });

  });

  // ─── Business tooltip (flows page) ───────────────────────────────────────

  describe('Business tooltip', () => {

    beforeEach(() => {
      cy.visit('/dashboard/flows');
      cy.get('.term-highlight--flow').first().as('badge');
    });

    it('shows the tooltip on hover', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip').should('be.visible');
    });

    it('does not show carousel navigation', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip__nav').should('not.exist');
    });

    it('contains "mapping messages"', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip').should('contain.text', 'mapping messages');
    });

    it('does not mention "flow traces"', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip').should('not.contain.text', 'flow traces');
    });

    it('does not contain cross-reference term links', () => {
      cy.get('@badge').hoverBadge();
      cy.get('.invictus-tooltip .invictus-tooltip__term-link').should('not.exist');
    });

  });

  // ─── Single tooltip exclusivity ──────────────────────────────────────────

  describe('Single tooltip exclusivity', () => {

    beforeEach(() => {
      cy.visit('/architecture-diagram');
    });

    it('closes a pinned tooltip when hovering a different badge', () => {
      cy.get('.term-highlight--flow').first().click(); // pin first tooltip
      cy.get('.invictus-tooltip').should('be.visible');

      cy.get('.term-highlight--flow-trace').first().hoverBadge(); // activate second

      cy.get('.invictus-tooltip').should('have.length', 1);
      cy.get('.invictus-tooltip__nav-label').should('contain.text', 'flow trace');
    });

    it('never shows more than one tooltip at a time', () => {
      cy.get('.term-highlight--flow').first().hoverBadge();
      cy.get('.invictus-tooltip').should('have.length', 1);
      cy.get('.invictus-tooltip__nav-label').should('contain.text', 'flow');

      cy.get('.term-highlight--flow-trace').first().hoverBadge();
      cy.get('.invictus-tooltip').should('have.length', 1);
      cy.get('.invictus-tooltip__nav-label').should('contain.text', 'flow trace');
    });

  });

});
