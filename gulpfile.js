// jshint node:true

'use strict';

var path   = require( 'path' );
var gulp   = require( 'gulp' );
var jshint = require( 'gulp-jshint' );
var uglify = require( 'gulp-uglify' );
var rename = require( 'gulp-rename' );

var pkg = require( './package.json' );
var bwr = require( './bower.json' );

var src  = pkg.main;
var dest = bwr.main.split( /(\/|\\)+/ );
var min  = dest.pop();

var karmaConfig = __dirname + '/karma.conf.js';

dest = dest.join( path.sep );

gulp.task( 'lint', function () {
  return gulp.src( src )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) );
});

gulp.task( 'test', [ 'lint' ], function ( done ) {
  require( 'karma' ).server
    .start({
      configFile : karmaConfig,
      singleRun  : true
    }, done );
});


gulp.task( 'tdd', [ 'lint' ], function ( done ) {
  require( 'karma' ).server
    .start({
      configFile : karmaConfig
    }, done );
});

gulp.task( 'build', [ 'lint', 'test' ], function () {
  return gulp.src( src )
    .pipe( uglify() )
    .pipe( rename( min ) )
    .pipe( gulp.dest( dest ) );
});

gulp.task( 'default', [ 'test' ]);
