describe('Business/Technical user toggle', () => {

  const Audience = { BUSINESS: 'business', TECHNICAL: 'technical' };
  const Desktop = 'Desktop';
  const Devices = [
    { name: Desktop, viewport: [1280, 720] },
  ];

  before(() => {

    // Desktop only: the business/technical switcher lives inside the docs
    // sidebar (UserTypeSwitcher) and is only rendered there — on mobile it's
    // replaced entirely by the audience bar + overlay (see the "Mobile
    // audience bar" describe block below).
    Cypress.Commands.add('getToggle', (audience) =>
      cy.get(`[data-cy-toggle=${audience}]`));

    Cypress.Commands.add('assertToggleState', (activeAudience) => {
      const inactive = activeAudience === Audience.BUSINESS ? Audience.TECHNICAL : Audience.BUSINESS;
      cy.getToggle(activeAudience).should('have.attr', 'data-cy-toggle-active', 'true');
      cy.getToggle(inactive).should('have.attr', 'data-cy-toggle-active', 'false');
    });

    Cypress.Commands.add('clickFooterLink', (linkName) => {
      cy.get(`[data-cy-footer-link=${linkName}]`).scrollIntoView().click();
    });

  });

  Devices.forEach(({ name: deviceName, viewport: [width, height] }) => {

    describe(deviceName, () => {
      beforeEach(() => {
        cy.clearLocalStorage();
        cy.viewport(width, height);
        cy.visit('/');
        cy.getToggle(Audience.BUSINESS).should('be.visible');
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

      it('persists selected audience in localStorage', () => {
        cy.getToggle(Audience.TECHNICAL).click();
        cy.getAllLocalStorage().then((storage) => {
          const siteStorage = storage['http://localhost:3000'] || storage[Object.keys(storage)[0]];
          expect(siteStorage?.['invictus-user-type']).to.equal('technical');
        });
        cy.getToggle(Audience.BUSINESS).click();
        cy.getAllLocalStorage().then((storage) => {
          const siteStorage = storage['http://localhost:3000'] || storage[Object.keys(storage)[0]];
          expect(siteStorage?.['invictus-user-type']).to.equal('business');
        });
      });

      it('is keyboard accessible', () => {
        cy.getToggle(Audience.TECHNICAL).focus().press(Cypress.Keyboard.Keys.ENTER);
        cy.assertToggleState(Audience.TECHNICAL);
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
        { linkName: 'migrate-v4-to-v5', audience: Audience.TECHNICAL },
        { linkName: 'migrate-v5-to-v6', audience: Audience.TECHNICAL },
      ];

      footerLinks.forEach(({ linkName, audience }) => {
        it(`switches to correct audience when clicking ${linkName} footer link`, () => {
          cy.clickFooterLink(linkName);
          cy.assertToggleState(audience);
        });
      });

    });
  });

  describe('Mobile audience bar', () => {

    const audienceBar = () => cy.get('nav[aria-label="Documentation section"]');
    const audienceTab = (label) => audienceBar().contains('a', label);
    const overlay = () => cy.get('#audience-overlay');

    beforeEach(() => {
      cy.clearLocalStorage();
      cy.viewport(375, 667);
      cy.visit('/');
    });

    it('does not render the desktop sidebar switcher', () => {
      cy.get('[data-cy-toggle]').should('not.exist');
    });

    it('shows both audience tabs, defaulting to "User guides" as active', () => {
      audienceTab('User guides').should('have.attr', 'aria-current', 'page');
      audienceTab('Setup & maintenance').should('not.have.attr', 'aria-current');
    });

    it('opens the overlay when tapping the active tab, and closes it when tapping again', () => {
      overlay().should('not.be.visible');

      audienceTab('User guides').click();
      audienceTab('User guides').should('have.attr', 'aria-expanded', 'true');
      overlay().should('be.visible');

      audienceTab('User guides').click();
      audienceTab('User guides').should('have.attr', 'aria-expanded', 'false');
      overlay().should('not.be.visible');
    });

    it('closes the overlay on Escape', () => {
      audienceTab('User guides').click();
      overlay().should('be.visible');
      cy.get('body').type('{esc}');
      overlay().should('not.be.visible');
    });

    it('closes the overlay when tapping the backdrop', () => {
      audienceTab('User guides').click();
      overlay().should('be.visible');
      cy.get('[data-cy="audience-overlay-backdrop"]').click({ force: true });
      overlay().should('not.be.visible');
    });

    it('tapping an unvisited section seeds navigation to it and marks it active', () => {
      // "Setup & maintenance" hasn't been cached yet on a fresh visit to '/',
      // so opening it seeds a client-side navigation to /technical.
      audienceTab('Setup & maintenance').click();
      cy.location('pathname').should('eq', '/technical');
      audienceTab('Setup & maintenance').should('have.attr', 'aria-current', 'page');
      cy.getAllLocalStorage().then((storage) => {
        const siteStorage = storage['http://localhost:3000'] || storage[Object.keys(storage)[0]];
        expect(siteStorage?.['invictus-user-type']).to.equal('technical');
      });
    });

    it('navigates to the page behind a link tapped inside the overlay', () => {
      audienceTab('User guides').click();
      overlay().should('be.visible');

      overlay().find('a[href]').first().then(($link) => {
        const href = $link.attr('href');
        cy.wrap($link).click();
        cy.location('pathname').should('eq', href);
      });
      overlay().should('not.be.visible');
    });

  });

});
