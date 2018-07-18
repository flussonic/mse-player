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

const webrtcOutput = '../flussonic/apps/demo/web-swift-publish/www/';

gulp.task('cp:webrtc', function() {
  return gulp.src(mseDepsList)
    .pipe(gulp.dest(webrtcOutput));
});

gulp.watch('dist/**/*', gulp.parallel('cp', 'cp:webrtc'))
