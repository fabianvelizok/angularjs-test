'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jshint = require('gulp-jshint'), stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    historyApiFallback = require('connect-history-api-fallback');

gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8080,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

gulp.task('jshint', function() {
  return gulp.src('./app/js/**/*.js')
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
  .pipe(stylus({ use: nib() }))
  .pipe(gulp.dest('./app/stylesheets'))
  .pipe(connect.reload());
});

gulp.task('inject', function() {
  var sources = gulp.src(['./app/js/**/*.js','./app/stylesheets/**/*.css']);
  return gulp.src('index.html', {cwd: './app'})
  .pipe(inject(sources, {
    read: false,
    ignorePath: '/app'
  }))
  .pipe(gulp.dest('./app'));
});

gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
  .pipe(wiredep({
    directory: './app/libs'
  }))
  .pipe(gulp.dest('./app'));
});

gulp.task('html', function() {
  gulp.src('./app/**/*.html')
  .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  gulp.watch(['./app/js/**/*.js', './Gulpfile.js'], ['jshint']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  gulp.watch(['./app/js/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);