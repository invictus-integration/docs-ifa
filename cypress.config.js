const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,


  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000/',
    setupNodeEvents(on, config) {
      on('task', {
        // Lets cypress-axe violation summaries print to the CI log, since
        // cy.log output isn't captured in `cypress run` terminal output.
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
