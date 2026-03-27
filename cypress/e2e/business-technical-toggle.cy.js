describe('Business/Technical user toggle', () => {

  const Audience = { BUSINESS: 'business', TECHNICAL: 'technical' };

  beforeEach(() => {
    cy.visit('/');

    Cypress.Commands.add('getToggle', (audience) => cy.get(`[data-cy-toggle=${audience}]`));

    Cypress.Commands.add('assertToggleState', (activeAudience) => {
      cy.getToggle(activeAudience)
        .should('have.attr', 'data-cy-toggle-active', 'true')
        .and('have.css', 'color', 'rgb(255, 255, 255)');
      const inactiveAudience = activeAudience === Audience.BUSINESS ? Audience.TECHNICAL : Audience.BUSINESS;
      cy.getToggle(inactiveAudience)
        .should('have.attr', 'data-cy-toggle-active', 'false')
        .and('have.css', 'color', 'rgb(0, 0, 0)');
    });

    Cypress.Commands.add('clickFooterLink', (linkName) => {
      cy.get(`[data-cy-footer-link=${linkName}]`).click();
    });
  });

  it('defaults to business users', () => {
    cy.assertToggleState(Audience.BUSINESS);
  });

  it('switches to technical users when clicked', () => {
    cy.getToggle(Audience.TECHNICAL).click();
    cy.assertToggleState(Audience.TECHNICAL);
  });

  it('switches back to business users when clicked again', () => {
    cy.getToggle(Audience.TECHNICAL).click();
    cy.getToggle(Audience.BUSINESS).click();
    cy.assertToggleState(Audience.BUSINESS);
  });

  it('toggle is keyboard accessible', () => {
    cy.getToggle(Audience.TECHNICAL).focus().press('Enter');
    cy.assertToggleState(Audience.TECHNICAL);
    cy.getToggle(Audience.BUSINESS).focus().press('Enter');
    cy.assertToggleState(Audience.BUSINESS);
  });

  it('switches to correct audience when navigating directly', () => {
    cy.visit('/dashboard/flows');
    cy.assertToggleState(Audience.BUSINESS);
    cy.visit('/dashboard/installation');
    cy.assertToggleState(Audience.TECHNICAL);
  });

  const footerLinks = [
    { linkName: 'view-flows', audience: Audience.BUSINESS },
    { linkName: 'create-flows', audience: Audience.BUSINESS },
    { linkName: 'search-flows', audience: Audience.BUSINESS },
    { linkName: 'dashboard-installation', audience: Audience.TECHNICAL },
    { linkName: 'framework-installation', audience: Audience.TECHNICAL },
    { linkName: 'v6-migration', audience: Audience.TECHNICAL }];

  footerLinks.forEach(({ linkName, audience }) => {
    it(`switches to correct audience when clicking ${linkName} footer link`, () => {
      cy.clickFooterLink(linkName);
      cy.assertToggleState(audience);
    });
  });
});