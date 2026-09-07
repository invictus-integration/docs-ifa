const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  // Retry failed tests automatically in `cypress run` (CI), to absorb
  // isolated infra flakes (e.g. a dev-server chunk failing to load under
  // resource contention) without masking real bugs. Left at 0 for
  // `cypress open` so flakiness stays visible during interactive local dev.
  retries: {
    runMode: 2,
    openMode: 0,
  },

  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
