/**
 * Global e2e support file — loaded before every spec.
 */

/**
 * Inject the user-type key into localStorage before the page loads, preventing
 * the welcome splash from appearing in tests that don't explicitly test it.
 *
 * Usage: cy.visit('/some-page', { onBeforeLoad: bypassSplash })
 */
globalThis.bypassSplash = (win) =>
  win.localStorage.setItem('invictus-user-type', 'business');
