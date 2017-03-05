const gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  concat = require('gulp-concat'),
  cache = require('gulp-cache'),
  changed = require('gulp-changed'),
  rev = require('gulp-rev'),
  browserSync = require('browser-sync'),
  ngannotate = require('gulp-ng-annotate'),
  del = require('del'),
  foreach = require('gulp-foreach'),
  babel = require('gulp-babel');

gulp.task('jshint', function () {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('usemin', ['jshint'], function () {
  return gulp.src('./app/**/*.html')
    .pipe(foreach(function (stream, file) {
      return stream
        .pipe(usemin({
          css: [minifycss(), rev()],
          js: [babel({presets: ['es2015'], compact: false}), ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
    }))
});

gulp.task('copyfonts', ['clean'], function () {
  gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('default', ['clean'], function () {
  gulp.start('usemin', 'copyfonts');
});

gulp.task('watch', function () {
  gulp.watch('./app/**/*', ['default']);
});
