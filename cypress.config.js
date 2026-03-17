const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,


  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
