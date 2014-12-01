// Karma configuration
// Generated on Mon Dec 01 2014 12:41:23 GMT+0100 (CET)

// jshint node:true

module.exports = function ( config ) {
  'use strict';

  config.set({
    basePath : '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks : ['jasmine'],

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'index.js',
      'index.spec.js'
    ],

    exclude : [
    ],

    preprocessors : {
      'index.js' : [
        'coverage'
      ]
    },

    coverageReporter : {
      type : 'text-summary',
      dir  : 'coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters : [
      'progress',
      'coverage'
    ],

    // web server port
    port : 9876,

    // enable / disable colors in the output (reporters and logs)
    colors : true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel : config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch : true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers : ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun : false
  });
};
