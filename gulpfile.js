const gulp = require('gulp'),
  cleancss = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  ngannotate = require('gulp-ng-annotate'),
  del = require('del'),
  flatmap = require('gulp-flatmap'),
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
    .pipe(flatmap(function (stream, file) {
      return stream
        .pipe(usemin({
          css: [cleancss(), rev()],
          js: [babel({presets: ['es2015'], compact: false}), ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
    }));
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
