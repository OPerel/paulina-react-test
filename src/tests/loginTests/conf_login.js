exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['loginTests.js'],
  onPrepare: function() {
    browser.manage().window().setSize(900, 1000);
  },
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['disable-infobars']
    }
  },
  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',
  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 3000000
  },
  allScriptsTimeout: 20000
};
