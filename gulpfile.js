var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var path = require('path');

var paths = {
  es6: ['es6/*.js'],
  es5: '.',
  // Must be absolute or relative to source map
  sourceRoot: path.join(__dirname, 'es6'),
};

gulp.task('babel', function() {
  return gulp.src(paths.es6)
  .pipe(sourcemaps.init())
  .pipe(babel({
    plugins: ['object-assign']
  }))
  .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
  .pipe(gulp.dest(paths.es5));
});

gulp.task('watch', function() {
  gulp.watch(paths.es6, ['babel']);
});

gulp.task('default', ['watch']);
