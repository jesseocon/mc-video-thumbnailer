exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/e2e/mc-video-thumbnail.js'],
  capabilities: {
    'browserName': 'firefox'
  }
};
