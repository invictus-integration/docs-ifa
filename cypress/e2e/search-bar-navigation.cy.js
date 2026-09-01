/**
 * SearchBar navigation tests — local search variant only.
 *
 * Azure Search is intercepted and forced to fail so that every test
 * exercises the local fallback path deterministically, regardless of
 * whether live credentials are present in the environment.
 */
describe('SearchBar navigation (local search)', () => {

  beforeEach(() => {
    // Block all Azure Search requests so local fallback always activates.
    cy.intercept('GET', '**/indexes/*/docs*', { forceNetworkError: true }).as('azureSearch');
    cy.visit('/');
  });

  /**
   * Opens the search modal and types a query, then waits for the local
   * fallback indicator to confirm we are in the offline/local search path.
   */
  function openSearchAndType(term) {
    cy.get('[data-cy=search-trigger]').click();
    cy.get('[data-cy=search-modal-input]').type(term);
    cy.get('[data-cy=local-fallback-hint]', { timeout: 6000 }).should('be.visible');
  }

  // ── Local search fallback indicator ─────────────────────────────────────

  describe('local search fallback', () => {

    it('shows the fallback banner when Azure Search is unavailable', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=local-fallback-hint]')
        .should('contain', 'local results');
    });

    it('returns at least one result for a known term', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').should('have.length.greaterThan', 0);
    });

    it('shows no results for a nonsense term', () => {
      openSearchAndType('xyznonexistentterm');
      cy.get('[data-cy=search-result]').should('not.exist');
    });

  });

  // ── Regular doc result navigation ────────────────────────────────────────

  describe('regular doc result navigation', () => {

    it('closes the modal and navigates to a doc page after clicking a result', () => {
      openSearchAndType('release notes');
      cy.get('[data-cy=search-result]').first().click();
      // Modal must close
      cy.get('[data-search-modal]').should('not.exist');
      // Must have left the root page
      cy.location('pathname').should('not.eq', '/');
    });

    it('strips the transient ?highlight= param so the final URL has no query string', () => {
      // navigate() appends ?highlight=<term> so SearchHighlighter can mark the page,
      // then SearchHighlighter immediately calls replaceState to clean up the URL.
      // "release notes" only matches static doc pages — none have an anchor field.
      openSearchAndType('release notes');
      cy.get('[data-cy=search-result]')
        .contains(/release notes/i)
        .first()
        .click();
      // Cypress retries until replaceState has run (within 4 s default timeout).
      cy.location('search').should('eq', '');
      cy.location('hash').should('eq', '');
    });

  });

  // ── Knowledge term result navigation ─────────────────────────────────────

  describe('knowledge term result navigation', () => {

    it('shows term matches in the knowledge column', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').should('have.length.greaterThan', 0);
    });

    it('navigates to the help center when clicking a term result', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('pathname').should('match', /\/support\/help-center-(technical|business)/);
    });

    it('appends ?q= so the help center scrolls to the matching term', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('search').should('match', /[?&]q=.+/);
    });

    it('replaying the recent (mouse click) navigates straight back to the term page, not a fresh search', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('pathname').then(firstPath => {
        cy.visit('/');
        cy.get('[data-cy=search-trigger]').click();
        cy.get('[data-cy=recent-result]').first().click();
        cy.location('pathname').should('eq', firstPath);
      });
    });

    it('replaying the recent (Enter key) navigates straight back to the term page, not a fresh search', () => {
      openSearchAndType('flow');
      cy.get('[data-cy=knowledge-term-result]').first().click();
      cy.location('pathname').then(firstPath => {
        cy.visit('/');
        cy.get('[data-cy=search-trigger]').click();
        cy.get('[data-cy=search-modal-input]').type('{downarrow}{enter}');
        cy.location('pathname').should('eq', firstPath);
      });
    });

  });

  // ── Knowledge FAQ result navigation ──────────────────────────────────────

  describe('knowledge FAQ result navigation', () => {

    it('shows FAQ matches in the knowledge column', () => {
      openSearchAndType('cosmos');
      cy.get('[data-cy=knowledge-faq-result]').should('have.length.greaterThan', 0);
    });

    it('navigates to the help center when clicking a FAQ result', () => {
      openSearchAndType('cosmos');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('pathname').should('match', /\/support\/help-center-(technical|business)/);
    });

    it('appends ?q= so the help center pre-filters to the matching question', () => {
      openSearchAndType('cosmos');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('search').should('match', /[?&]q=.+/);
    });

    it('appends #faq hash to land on the FAQ section', () => {
      openSearchAndType('cosmos');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.location('hash').should('eq', '#faq');
    });

    it('auto-opens the first matching answer after navigating', () => {
      openSearchAndType('cosmos');
      cy.get('[data-cy=knowledge-faq-result]').first().click();
      cy.get('[data-cy=faq-answer]').should('be.visible');
    });

  });

  // ── Bicep parameter result navigation ────────────────────────────────────

  describe('Bicep parameter result navigation', () => {

    it('navigates to the installation page when clicking a parameter result', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('pathname').should('match', /\/(framework|dashboard)\/installation/);
    });

    it('appends ?q=<paramName> so the ParameterTable pre-filters to that row', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('search').should('include', 'q=resourcePrefix');
    });

    it('appends #bicep-template-parameters so the page scrolls to that section', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('hash').should('eq', '#bicep-template-parameters');
    });

    it('pre-fills the ParameterTable search input after deep-link navigation', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.get('[data-cy=search-input]').should('have.value', 'resourcePrefix');
    });

    it('filters the ParameterTable to show only the matching row', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.get('[data-cy=search-results] tbody tr').should('have.length.greaterThan', 0);
      cy.get('[data-cy=search-results] tbody tr td:nth-child(1) code')
        .first()
        .should('contain', 'resourcePrefix');
    });

    it('does not append the generic ?highlight= param, since the ParameterTable already filters to the matching row', () => {
      openSearchAndType('resourcePrefix');
      cy.get('[data-cy=search-result]').contains('resourcePrefix').first().click();
      cy.location('search').should('not.include', 'highlight=');
      cy.get('mark[data-search-highlight]').should('not.exist');
    });

  });

  // ── Legacy glossary-stub redirect ────────────────────────────────────────
  //
  // Older search-index generations modeled glossary terms as fake doc pages
  // (filepath support/glossary-<audience>.mdx) that don't correspond to a
  // real Docusaurus route. If any of these stale entries are still present
  // in the live Azure index, clicking one must redirect to the real
  // help-center term view instead of 404ing. This overrides the file-level
  // Azure-failure intercept with a mocked success response so the component
  // takes the "live Azure result" branch rather than the local fallback.

  describe('legacy glossary-stub redirect', () => {

    it('redirects a stale glossary-stub page result to the help center instead of 404ing', () => {
      cy.intercept('GET', '**/indexes/*/docs*', {
        statusCode: 200,
        body: {
          value: [
            {
              id: 'data-glossary-v6-json-support-glossary-technical-mdx-dsav',
              title: 'DSAV',
              filepath: 'support/glossary-technical.mdx',
              anchor: '?q=DSAV',
              category: 'support',
              content: 'Stands for Domain, Service, Action, and Version.',
              sidebar_label: 'Glossary',
              user_type: 'technical',
            },
          ],
        },
      }).as('azureSearchGlossaryStub');

      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=search-modal-input]').type('dsav');
      cy.wait('@azureSearchGlossaryStub');

      // Must not show the local-fallback banner — this exercises the live-Azure-result branch.
      cy.get('[data-cy=local-fallback-hint]').should('not.exist');

      cy.get('[data-cy=search-result]').contains(/dsav/i).first().click();

      cy.get('[data-search-modal]').should('not.exist');
      cy.location('pathname').should('eq', '/support/help-center-technical');
      cy.location('search').should('eq', '?q=DSAV');
    });

    it('stores the redirected entry as a "term" recent, not a "page" recent', () => {
      cy.intercept('GET', '**/indexes/*/docs*', {
        statusCode: 200,
        body: {
          value: [
            {
              id: 'data-glossary-v6-json-support-glossary-technical-mdx-dsav',
              title: 'DSAV',
              filepath: 'support/glossary-technical.mdx',
              anchor: '?q=DSAV',
              category: 'support',
              content: 'Stands for Domain, Service, Action, and Version.',
              sidebar_label: 'Glossary',
              user_type: 'technical',
            },
          ],
        },
      }).as('azureSearchGlossaryStub');

      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=search-modal-input]').type('dsav');
      cy.wait('@azureSearchGlossaryStub');
      cy.get('[data-cy=search-result]').contains(/dsav/i).first().click();

      // Re-open the modal in "recents" mode and confirm the entry is labeled a term, not a page.
      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=recent-result]').first()
        .find('[data-cy=recent-result-type]')
        .should('contain', 'Term');
    });

  });

  describe('deprecated docs are de-prioritized in search results', () => {

    it('ranks a deprecated page below its current replacement even when Azure scores it higher', () => {
      // Mirrors the real-world "transco" bug: Azure's relevance score can rank
      // a deprecated doc above its current replacement when both share a title
      // and the deprecated page has more legacy body text. The client must not
      // trust raw Azure order for deprecated content.
      cy.intercept('GET', '**/indexes/*/docs*', {
        statusCode: 200,
        body: {
          value: [
            {
              id: 'framework-deprecated-transco-md',
              title: 'Transco',
              filepath: 'framework/deprecated/transco.md',
              anchor: '',
              category: 'framework',
              content: 'Legacy Transco component documentation.',
              sidebar_label: 'Transco',
              user_type: 'both',
            },
            {
              id: 'framework-transcoV2-mdx',
              title: 'Transco',
              filepath: 'framework/transcoV2.mdx',
              anchor: '',
              category: 'framework',
              content: 'Transco component documentation.',
              sidebar_label: 'Transco',
              user_type: 'both',
            },
          ],
        },
      }).as('azureSearchTransco');

      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=search-modal-input]').type('transco');
      cy.wait('@azureSearchTransco');

      cy.get('[data-cy=search-result]').first()
        .should('contain', 'Transco')
        .and('not.contain', 'Deprecated')
        .click();

      cy.location('pathname').should('eq', '/framework/transcoV2');
    });

    it('shows a "Deprecated" badge on results from a deprecated docs folder', () => {
      cy.intercept('GET', '**/indexes/*/docs*', {
        statusCode: 200,
        body: {
          value: [
            {
              id: 'framework-deprecated-transco-md',
              title: 'Transco',
              filepath: 'framework/deprecated/transco.md',
              anchor: '',
              category: 'framework',
              content: 'Legacy Transco component documentation.',
              sidebar_label: 'Transco',
              user_type: 'both',
            },
          ],
        },
      }).as('azureSearchDeprecated');

      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=search-modal-input]').type('transco');
      cy.wait('@azureSearchDeprecated');

      cy.get('[data-cy=search-result]').first().should('contain', 'Deprecated');
    });

  });

  describe('recent searches — Clear all keeps focus in the modal', () => {

    it('keeps focus on the search input after clicking "Clear all", so typing still works', () => {
      // Seed a recent search first.
      openSearchAndType('flow');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=recent-result]').should('have.length.greaterThan', 0);

      cy.get('[data-cy=recent-clear-all]').click();

      // Recents section (and the button itself) unmounts — focus must have
      // moved to the search input, not been dropped to <body>.
      cy.get('[data-cy=recent-result]').should('not.exist');
      cy.focused().should('have.attr', 'data-cy', 'search-modal-input');

      // And typing should immediately start a new search without needing to re-click.
      cy.focused().type('flow');
      cy.get('[data-cy=local-fallback-hint]', { timeout: 6000 }).should('be.visible');
    });

  });



  describe('keyboard navigation', () => {

    it('highlights the first result when pressing ArrowDown', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]').type('{downarrow}');
      cy.get('[data-cy=search-result]').first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('navigates to the selected result when pressing Enter', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]')
        .type('{downarrow}{enter}');
      cy.get('[data-search-modal]').should('not.exist');
      cy.location('pathname').should('not.eq', '/');
    });

    it('closes the modal when pressing Escape', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-modal-input]').type('{esc}');
      cy.get('[data-search-modal]').should('not.exist');
    });

  });

  // ── Search term highlighting ──────────────────────────────────────────────
  //
  // Verifies that SearchHighlighter (Root.js) correctly injects
  // <mark data-search-highlight> elements on the destination page after the
  // search modal navigates via history.push(?highlight=<term>).

  describe('search term highlighting', () => {

    it('injects <mark data-search-highlight> elements on the destination page', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      // SearchHighlighter waits for the MutationObserver to see DOM settle
      // (80 ms debounce) before injecting marks — allow 4 s for new page + marks.
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('marks exactly the first occurrence with data-search-highlight-first', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight-first]', { timeout: 4000 })
        .should('have.length', 1);
    });

    it('cleans up ?highlight= from the URL while still injecting marks', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      // URL must be clean ...
      cy.location('search', { timeout: 3000 }).should('not.include', 'highlight=');
      // ... but marks must still be present (replaceState must not re-trigger the effect)
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('applies highlights via SPA navigation — the previously broken path', () => {
      // Regression guard for the original bug: [location.href] was always
      // undefined, so the useEffect only fired on mount (= page reload).
      // Fixed by using [location.pathname, location.search, location.hash].
      // All history.push() calls here are SPA navigations (no full reload).
      openSearchAndType('release');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

    it('removes highlights when subsequently navigating without a ?highlight= param', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);

      // Plain navigation — SearchHighlighter should call removeSearchHighlights().
      cy.visit('/');
      cy.get('mark[data-search-highlight]').should('not.exist');
    });

    it('highlights using the stored query when replaying a recent search', () => {
      // First search — creates a recent search entry with query='installation'.
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);

      // Go back to the home page so we can open the modal in "recents" mode.
      cy.visit('/');

      // Open the modal without typing — recents list should appear.
      cy.get('[data-cy=search-trigger]').click();
      cy.get('[data-cy=local-fallback-hint]').should('not.exist'); // no query = no search
      cy.get('[data-cy=recent-result]').first().click(); // click the recent entry

      // navigate() must use result.query ('installation') as the highlight term
      // because the live input query is empty when replaying from recents.
      cy.get('mark[data-search-highlight]', { timeout: 4000 })
        .should('have.length.greaterThan', 0);
    });

  });

  // ── Dismiss chip ──────────────────────────────────────────────────────────
  //
  // Verifies the highlight state that appears in the search trigger while
  // highlights are active and the two ways to dismiss it: clicking Clear and pressing Escape.

  describe('dismiss chip', () => {

    it('shows the chip with the search term in the label when highlights are active', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('[data-cy=search-highlight-chip]').should('be.visible');
      cy.get('[data-cy=search-highlight-chip-label]').should('contain', 'installation');
    });

    it('clicking the Clear button removes all marks and hides the chip', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('[data-cy=search-highlight-chip]').click();

      cy.get('mark[data-search-highlight]').should('not.exist');
      cy.get('[data-cy=search-highlight-chip]').should('not.exist');
    });

    it('pressing Escape removes all marks and hides the chip', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('mark[data-search-highlight]', { timeout: 4000 }).should('have.length.greaterThan', 0);

      cy.get('body').type('{esc}');

      cy.get('mark[data-search-highlight]').should('not.exist');
      cy.get('[data-cy=search-highlight-chip]').should('not.exist');
    });

    it('hides the chip when navigating to a page without highlights', () => {
      openSearchAndType('installation');
      cy.get('[data-cy=search-result]').first().click();
      cy.get('[data-cy=search-highlight-chip]', { timeout: 4000 }).should('be.visible');

      // cy.visit() is a full page reload — chip element is gone from the DOM entirely.
      cy.visit('/');
      cy.get('[data-cy=search-highlight-chip]').should('not.exist');
    });

  });

});
