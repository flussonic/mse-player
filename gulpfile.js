"use strict";

const gulp = require('gulp');

const mseDepsList = [
  'dist/FlussonicMsePlayer.js'
];

const mseDepsOutput = '../flussonic/wwwroot/flu/reactapp/lib/';

gulp.task('cp:flu', function() {
  return gulp.src(mseDepsList)
    .pipe(gulp.dest(mseDepsOutput));
});

const webrtcOutput = '../flussonic/apps/demo/web-swift-publish/www/';

gulp.task('cp:webrtc', function() {
  return gulp.src(mseDepsList)
    .pipe(gulp.dest(webrtcOutput));
});

gulp.task('cp', gulp.parallel('cp:flu', 'cp:webrtc'))

gulp.watch('dist/**/*', gulp.series('cp'))
