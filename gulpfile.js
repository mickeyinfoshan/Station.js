'use strict';

var gulp = require('gulp');

var jasmine = require('gulp-jasmine');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');


gulp.task('jasmine-test', function () {
    return gulp.src('./test/spec/**/*Spec.js')
        .pipe(jasmine());
});

gulp.task('build-todo', function() {
    var bundler = browserify({
        entries: ['./examples/todo/src/app.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    bundler.bundle()
    .pipe(source("app.js"))
    .pipe(gulp.dest('./examples/todo/dist/'));
});

gulp.task('default', function() {
  	
    var testWatcher = gulp.watch(['./src/**/*.js','./test/spec/**/*Spec.js'],['jasmine-test']);
  	testWatcher.on('change', function(event) {
  		console.log('Test Watcher : File ' + event.path + ' was ' + event.type + ', running test tasks...');
	  });

    var buildTodoWatcher = gulp.watch(['./src/**/*.js','./examples/todo/src/*.js','./examples/todo/src/components/*.react.js'],['build-todo']);
    buildTodoWatcher.on('change', function(event) {
      console.log('Build Todo Watcher : File ' + event.path + ' was ' + event.type + ', running building tasks...');
    });
});

