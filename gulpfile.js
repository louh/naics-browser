'use strict'

var gulp = require('gulp')

var autoprefix = require('gulp-autoprefixer')
var cssimport = require('gulp-cssimport')
var debug = require('gulp-debug')
var livereload = require('gulp-livereload')
var minifyCSS = require('gulp-minify-css')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
var watch = require('gulp-watch')

gulp.task('default', ['styles'], function () {
  gulp.start('watch')
  console.log('Running!')
})

gulp.task('watch', function () {
  livereload.listen()

  // Watch for changes to SCSS and recompile
  watch('./stylesheets/**/*.scss', function () {
    gulp.start('styles')
  })

  // Watch for changes to compiled CSS and reload browser
  watch('./stylesheets/styles.css')
    .pipe(plumber())
    .pipe(livereload())
})

gulp.task('styles', function () {
  return gulp.src('./stylesheets/styles.scss')
    //.pipe(plumber())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefix('last 2 versions'))
    //.pipe(cssimport())
    //.pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ minimal: false }))
    .pipe(gulp.dest('./stylesheets'))
})
