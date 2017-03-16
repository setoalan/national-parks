const gulp = require('gulp');
const cleancss = require('gulp-clean-css');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
const usemin = require('gulp-usemin');
const rev = require('gulp-rev');
const ngannotate = require('gulp-ng-annotate');
const del = require('del');
const flatmap = require('gulp-flatmap');
const babel = require('gulp-babel');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');

gulp.task('jshint', function () {
  return gulp.src('./app/**/*.js')
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

gulp.task('imagemin', function () {
  return gulp.src('app/assets/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copyfonts', ['clean'], function () {
  gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('default', ['clean'], function () {
  gulp.start('usemin', 'imagemin', 'copyfonts');
});

gulp.task('watch', function () {
  gulp.watch('./app/**/*', ['default']);
});
