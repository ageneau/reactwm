var gulp = require('gulp');
var react = require('gulp-react');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var reactify = require('reactify');
var watchify = require('watchify');
var browserify = require('browserify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['package']); 

gulp.task('package', function () {
  return gulp.src('lib/**/*.js*')
  .pipe(react())
  .pipe(gulp.dest('pkg'));
});

gulp.task('watch', ['default'], function () {
  gulp.watch('./lib/**/*', ['package']);
});

gulp.task('example', ['example/stylesheets', 'example/app'], function () {
  gulp.watch('./example/*.scss', ['example/stylesheets']);

  return connect.server({
    root: ['example/dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('example/app', function () {
  var bundler = watchify(browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    extensions: '.jsx'
  }));

  bundler.add('./example/app.jsx');
  bundler.transform(reactify);

  bundler.on('update', rebundle);

  function rebundle () {
    console.log('rebundling');
    return bundler.bundle()
      .on('error', function (err) {
        console.log(err.message);
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest('./example/dist/js'))
      .pipe(connect.reload());
  }

  return rebundle();
});

gulp.task('example/stylesheets', function () {
  return gulp.src('./example/screen.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./example/dist/css'))
    .pipe(connect.reload());
});
