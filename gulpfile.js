'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');


gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/entry.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('jasmine-test', function () {
    return gulp.src('./test/spec/**/*Spec.js')
        .pipe(jasmine());
});

gulp.task('default', function() {
  	var watcher = gulp.watch(['./src/**/*.js','./test/spec/**/*Spec.js'],['jasmine-test']);
  	watcher.on('change', function(event) {
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

