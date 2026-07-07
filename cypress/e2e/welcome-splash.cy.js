/**
 * Welcome splash screen tests.
 *
 * The splash renders when `invictus-user-type` is absent from localStorage
 * (genuine first visit). It must never appear for returning visitors.
 */
describe('Welcome splash screen', () => {

  // Helper: get the dialog element
  const splash = () => cy.get('[role="dialog"][aria-labelledby="welcome-title"]');

  beforeEach(() => {
    // Simulate a genuine first visit — no stored user type.
    cy.clearLocalStorage();
    cy.wait(100);
  });

  // ── Visibility ─────────────────────────────────────────────────────────────

  it('appears on first visit', () => {
    cy.visit('/');
    splash().should('be.visible');
  });

  it('does not appear when a user type is already stored', () => {
    cy.visit('/', { onBeforeLoad: bypassSplash });
    splash().should('not.exist');
  });

  it('appears on any page, not only the root', () => {
    cy.visit('/dashboard/flows');
    splash().should('be.visible');
  });

  // ── Content ─────────────────────────────────────────────────────────────────

  it('shows the welcome heading', () => {
    cy.visit('/');
    cy.get('#welcome-title')
      .should('contain.text', 'Welcome')
      .should('contain.text', 'Invictus for Azure');
  });

  it('shows a Business user card and a Technical user card', () => {
    cy.visit('/');
    splash().within(() => {
      cy.contains('button', 'Business user').should('be.visible');
      cy.contains('button', 'Technical user').should('be.visible');
    });
  });

  // ── Business user selection ─────────────────────────────────────────────────

  it('dismisses the splash when Business user is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').click();
    splash().should('not.exist');
  });

  it('stores "business" in localStorage when Business user is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').click();
    cy.getAllLocalStorage().then((storage) => {
      const site = storage['http://localhost:3000'] ?? storage[Object.keys(storage)[0]];
      expect(site?.['invictus-user-type']).to.equal('business');
    });
  });

  it('navigates to the business root after choosing Business user', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').click();
    cy.url().should('eq', Cypress.config('baseUrl'));
  });

  // ── Technical user selection ────────────────────────────────────────────────

  it('dismisses the splash when Technical user is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Technical user').click();
    splash().should('not.exist');
  });

  it('stores "technical" in localStorage when Technical user is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Technical user').click();
    cy.getAllLocalStorage().then((storage) => {
      const site = storage['http://localhost:3000'] ?? storage[Object.keys(storage)[0]];
      expect(site?.['invictus-user-type']).to.equal('technical');
    });
  });

  it('navigates to /technical after choosing Technical user', () => {
    cy.visit('/');
    cy.contains('button', 'Technical user').click();
    cy.url().should('include', '/technical');
  });

  // ── Persistence ─────────────────────────────────────────────────────────────

  it('does not reappear after a choice has been made', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').click();
    cy.visit('/');
    splash().should('not.exist');
  });

  // ── Accessibility ───────────────────────────────────────────────────────────

  it('focuses the first card on open for keyboard users', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').should('be.focused');
  });

  it('Business user card is selectable via keyboard Enter', () => {
    cy.visit('/');
    cy.contains('button', 'Business user').should('be.focused');
    cy.contains('button', 'Business user').focus().type('{enter}');
    splash().should('not.exist');
  });

  it('Technical user card is selectable via keyboard Enter', () => {
    cy.visit('/');
    cy.contains('button', 'Technical user').should('be.focused');
    cy.contains('button', 'Technical user').focus().type('{enter}');
    splash().should('not.exist');
  });

});
