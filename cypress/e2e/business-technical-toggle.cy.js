describe('Business/Technical user toggle', () => {

  const Audience = { BUSINESS: 'business', TECHNICAL: 'technical' };
  const Mobile = 'Mobile';
  const Desktop = 'Desktop';
  const Devices = [
    { name: Desktop, viewport: [1280, 720] },
    { name: Mobile, viewport: [375, 667] }
  ];

  before(() => {

    Cypress.Commands.add('getToggle', (audience) =>
      cy.get(`[data-cy-toggle=${audience}]`).filter(':visible').first());

    Cypress.Commands.add('openSidebar', (deviceName, audience) => {
      if (deviceName === Mobile) {
        cy.get('body').then(($body) => {
          const sidebarOpen = $body.find('.navbar-sidebar--show').length > 0;
          const toggleVisible = $body.find(`[data-cy-toggle=${audience}]:visible`).length > 0;
          if (!sidebarOpen && !toggleVisible) {
            cy.scrollTo('top');
            cy.get('[aria-label="Toggle navigation bar"]').click();
          }
          cy.getToggle(audience).should('be.visible');
        });
      }
    });

    Cypress.Commands.add('closeSidebar', (deviceName) => {
      if (deviceName === Mobile && sidebarOpen) {
        cy.get('body').then(($body) => {
          if ($body.find('.navbar-sidebar--show').length) {
            cy.get('.navbar-sidebar__close').click();
          }
        });
      }
    });

    Cypress.Commands.add('assertToggleState', (deviceName, activeAudience) => {
      const inactive = activeAudience === Audience.BUSINESS ? Audience.TECHNICAL : Audience.BUSINESS;
      cy.openSidebar(deviceName, activeAudience);
      cy.getToggle(activeAudience).should('have.attr', 'data-cy-toggle-active', 'true');
      cy.getToggle(inactive).should('have.attr', 'data-cy-toggle-active', 'false');
    });

    Cypress.Commands.add('clickFooterLink', (deviceName, linkName) => {
      cy.closeSidebar(deviceName);
      cy.get(`[data-cy-footer-link=${linkName}]`).scrollIntoView().click();
    });

  });

  Devices.forEach(({ name: deviceName, viewport: [width, height] }) => {

    describe(deviceName, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
        cy.openSidebar(deviceName, Audience.BUSINESS);
      });

      afterEach(() => {
        cy.closeSidebar(deviceName);
      });

      it('defaults to business users', () => {
        cy.assertToggleState(deviceName, Audience.BUSINESS);
      });

      it('switches to technical users when clicked', () => {
        cy.getToggle(Audience.TECHNICAL).click();
        cy.assertToggleState(deviceName, Audience.TECHNICAL);
      });

      it('switches back to business users when clicked again', () => {
        cy.getToggle(Audience.TECHNICAL).click();
        cy.getToggle(Audience.BUSINESS).click();
        cy.assertToggleState(deviceName, Audience.BUSINESS);
      });

      it('is keyboard accessible', () => {
        cy.getToggle(Audience.TECHNICAL).focus();
        cy.getToggle(Audience.TECHNICAL).trigger('keydown', { key: 'Enter' });
        cy.assertToggleState(deviceName, Audience.TECHNICAL);
        cy.getToggle(Audience.BUSINESS).focus();
        cy.getToggle(Audience.BUSINESS).trigger('keydown', { key: 'Enter' });
        cy.assertToggleState(deviceName, Audience.BUSINESS);
      });

      it('switches to correct audience when navigating directly', () => {
        cy.visit('/dashboard/flows');
        cy.assertToggleState(deviceName, Audience.BUSINESS);
        cy.visit('/dashboard/installation');
        cy.assertToggleState(deviceName, Audience.TECHNICAL);
      });

      const footerLinks = [
        { linkName: 'view-flows', audience: Audience.BUSINESS },
        { linkName: 'create-flows', audience: Audience.BUSINESS },
        { linkName: 'search-flows', audience: Audience.BUSINESS },
        { linkName: 'dashboard-installation', audience: Audience.TECHNICAL },
        { linkName: 'framework-installation', audience: Audience.TECHNICAL },
        { linkName: 'migrate-v4-to-v5', audience: Audience.TECHNICAL },
        { linkName: 'migrate-v5-to-v6', audience: Audience.TECHNICAL },
      ];

      footerLinks.forEach(({ linkName, audience }) => {
        it(`switches to correct audience when clicking ${linkName} footer link`, () => {
          cy.clickFooterLink(deviceName, linkName);
          cy.assertToggleState(deviceName, audience);
        });
      });

    });
  });

  describe('Mobile-only behavior', () => {

    beforeEach(() => {
      cy.viewport(375, 667);
      cy.visit('/');
    });

    it('toggle is not present in the top navbar', () => {
      cy.get('.navbar__items [data-cy-toggle]').should('not.exist');
    });

    it('shows both toggle options after opening the hamburger sidebar', () => {
      cy.get('.navbar__toggle').click();
      cy.get('[data-cy-toggle=business]').should('be.visible');
      cy.get('[data-cy-toggle=technical]').should('be.visible');
    });

  });

});