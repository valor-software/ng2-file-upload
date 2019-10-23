// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

const customLaunchers = require('./sauce-browsers').customLaunchers;

module.exports = function (config) {
  const configuration = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: false
    },

    reporters: ['dots', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    browserNoActivityTimeout: 20000,
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 5000,
    singleRun: true,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },
    mime: { 'text/x-typescript': ['ts','tsx'] },
    client: { captureConsole: true }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  if (process.env.SAUCE) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
      process.exit(1);
    }

    configuration.plugins.push(require('karma-sauce-launcher'));
    configuration.reporters.push('saucelabs');
    configuration.sauceLabs = {
      verbose: true,
      testName: 'ng2-bootstrap unit tests',
      recordScreenshots: false,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    };
    configuration.captureTimeout = 60000;
    configuration.customLaunchers = customLaunchers();
    configuration.browsers = Object.keys(configuration.customLaunchers);
    configuration.concurrency = 4;
    configuration.browserDisconnectTolerance = 2;
    configuration.browserNoActivityTimeout = 20000;
    configuration.browserDisconnectTimeout = 5000;
  }

  config.set(configuration);
};
