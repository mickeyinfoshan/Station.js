'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var gbrowserify = require("gulp-browserify");


gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  b.add('./src/DataStation/DataStationBase.js');

  return b.bundle()
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('./examples/**.js')
        .pipe(gbrowserify())
        .pipe(gulp.dest('./examples/js'));
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

