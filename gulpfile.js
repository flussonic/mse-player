"use strict";

const gulp = require('gulp');

const mseDepsList = [
  'dist/FlussonicMsePlayer.js'
];

const mseDepsOutput = '../flussonic/wwwroot/flu/reactapp/lib/';

gulp.task('cp', function() {
  return gulp.src(mseDepsList)
    .pipe(gulp.dest(mseDepsOutput));
});

gulp.watch('dist/**/*', gulp.series('cp'))
