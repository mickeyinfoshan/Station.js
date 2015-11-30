var webpackConfig = require("../webpack.config.js");

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    files: ['./**/*.test.js'],
    frameworks: ['jasmine'],
    preprocessors: {
      './**/*.test.js' : ['webpack'],
    },
    reporters: ['dots'],
    webpack: {
      module : Object.create(webpackConfig.module)
    },
    webpackServer: {
      noInfo: true,
    }
  });
};