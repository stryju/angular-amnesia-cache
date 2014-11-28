var gulp   = require( 'gulp' );
var jshint = require( 'gulp-jshint' );
var uglify = require( 'gulp-uglify' );

var src = './amnesia-cache.js';

gulp.task( 'test', function () {
  return gulp.src( src )
    .pipe( jshint() );
});

gulp.task( 'build', [ 'test' ], function () {
  return gulp.src( src )
    .pipe( uglify() )
    .pipe( gulp.dest( 'dist' ) );
});

gulp.task( 'default', [ 'test' ]);
