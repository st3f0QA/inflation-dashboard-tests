const { defineConfig } = require('cypress');
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true
  },
  retries: 2,
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
    defaultCommandTimeout: 20000,
    env: {
      INFLATION_URL: "https://app.fabric.microsoft.com/view?r=eyJrIjoiYWMwNmI1ZmMtZGYwYS00ODljLWE4NzgtNzM1OGRkYWQzMWMxIiwidCI6IjZiZTgxZjIwLWFlY2MtNGQyZC1hMTM0LWJmZWJlOTAxODE4NCIsImMiOjl9"
    },
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});