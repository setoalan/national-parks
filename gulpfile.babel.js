'use strict';

import gulp from 'gulp';
import cleancss from 'gulp-clean-css';
import jshint from 'gulp-jshint';
import stylish from 'jshint-stylish';
import uglify from 'gulp-uglify';
import usemin from 'gulp-usemin';
import rev from 'gulp-rev';
import ngannotate from 'gulp-ng-annotate';
import del from 'del';
import flatmap from 'gulp-flatmap';
import babel from 'gulp-babel';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';

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
