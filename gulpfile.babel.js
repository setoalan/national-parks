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

const Server = require('karma').Server;
const protractor = require('gulp-protractor').protractor;

gulp.task('clean', () => {
  return del(['public']);
});

gulp.task('jshint', () => {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('usemin', ['jshint'], () => {
  return gulp.src('./app/**/*.html')
    .pipe(flatmap((stream, file) => {
      return stream
        .pipe(usemin({
          css: [cleancss(), rev()],
          js: [babel({presets: ['es2015'], compact: false}), ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('./public/'));
    }));
});

gulp.task('imagemin', () => {
  return gulp.src('app/assets/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copyfonts', ['clean'], () => {
  gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('test', (done) => {
  new Server({
    configFile: __dirname + '/test/unit/karma.conf.js',
    singleRun: true
  }, done).start();
  gulp.src(['./test/e2e/*spec.js'])
    .pipe(protractor({
      configFile: __dirname + '/test/e2e/protractor.conf.js',
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', (e) => { throw e });
});

gulp.task('build', ['clean'], () => {
  gulp.start('usemin', 'imagemin', 'copyfonts');
});

gulp.task('default', () => {
  gulp.start('build');
});
