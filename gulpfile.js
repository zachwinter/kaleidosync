const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const sass = require('gulp-sass')

const globs = {
  sass: 'public/scss/**/*.scss',
  js: 'public/js/**/*.js'
}

gulp.task('sass', () => {
  gulp.src(globs.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['public/scss/imports']
    }).on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/serve'))
})

gulp.task('js', () => {
  gulp.src(globs.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env'],
      plugins: ['transform-object-rest-spread', 'transform-es2015-modules-amd']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/serve/js'))
})

gulp.task('watch', ['sass', 'js'], () => {
  gulp.watch(globs.sass, ['sass'])
  gulp.watch(globs.js, ['js'])
})

gulp.task('default', ['watch']) 