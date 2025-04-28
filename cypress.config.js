const { defineConfig } = require('cypress');
const { lighthouse, prepareAudit } = require('cypress-audit');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on('task', {
        lighthouse: lighthouse(),
      });
      
      require('@percy/cypress/task')(on, config);
    },
  },
  env: {
    PERCY_TOKEN: process.env.PERCY_TOKEN
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 30000,
  retries: {
    runMode: 2,
    openMode: 0
  }
}); 