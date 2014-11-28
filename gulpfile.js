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

dest = dest.join( path.sep );

gulp.task( 'test', function () {
  return gulp.src( src )
    .pipe( jshint() );
});

gulp.task( 'build', [ 'test' ], function () {
  return gulp.src( src )
    .pipe( uglify() )
    .pipe( rename( min ) )
    .pipe( gulp.dest( dest ) );
});

gulp.task( 'default', [ 'test' ]);
