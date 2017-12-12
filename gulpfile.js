/**
 * 
 * 1. Configuration 
 *
 *    • Gulp Dependencies
 *    • Base Directories
 *    • Project Configuration JSON
 *        :: Consumed by Sass: ${SRC_DIR}/config.json -> ${SRC_DIR}/sass/config/_global.scss
 *        :: Consumed by Pug as a global variable. 
 *        :: Consumed by JavaScript in ${SRC_DIR}/js/site.js.
 * 
 *    • Entrypoints / Concatenated Filenames
 *    • Directory Structure
 *    • Glob Shortcuts
 *
 *
 *
 * 2. Gulp Tasks
 *
 *    • ['clean']      :: Delete SERVE directory.
 *    • ['clean:all']  :: Delete SERVE and NODE_MODULES directories.
 *    • ['babel:dev']  :: ES6 -> ES5 Babel transpilation; includes sourcemaps, excludes concatenation & minification.
 *    • ['babel:prod'] :: ES6 -> ES5 Babel transpilation; excludes sourcemaps, includes concatenation & minification. 
 *    • ['sass:dev']   :: Sass compilation with concatenation, minification & sourcemaps. 
 *    • ['sass:prod']  :: Sass compilation concatenation & minification; no sourcemaps.
 *    • ['pug:dev']    :: Pug template rendering. 
 *    • ['pug:prod']   :: Pug template rendering with uglification. 
 *    • ['static']     :: Copy static files to SERVE directory.
 *    • ['build:dev']  :: Build project using ['*:dev']  tasks.
 *    • ['build:prod'] :: Build project using ['*:prod'] tasks.
 *    • ['serve:dev']  :: ['build:dev']  + serve project with BrowserSync.
 *    • ['serve:prod'] :: ['build:prod'] + serve project with BrowserSync.
 *    • ['dev']        :: ['serve:dev']  shortcut.
 *    • ['prod']       :: ['serve:prod'] shortcut.
 *
 *    DEFAULT: ['dev']
 *
 */



/**
 * Gulp Dependencies 
 */
const babel       = require('gulp-babel')
const browserSync = require('browser-sync')
const concat      = require('gulp-concat')
const config      = require('gulp-data')
const fs          = require('fs')
const gulp        = require('gulp')
const plumber     = require('gulp-plumber')
const pug         = require('gulp-pug')
const rename      = require('gulp-rename')
const rimraf      = require('gulp-rimraf')
const rjsOptimize = require('gulp-requirejs-optimize')
const sass        = require('gulp-sass')
const jsonSass    = require('json-sass')
const source      = require('vinyl-source-stream')
const sourcemaps  = require('gulp-sourcemaps')



/**
 * Base Directories
 */
const SRC_DIR      = './src'
const BUILD_DIR    = './tmp'
const SERVE_DIR    = './serve'
const NODE_MODULES = './node_modules'



/**
 * Project Configuration JSON
 * Consumed by Sass: ${SRC_DIR}/config.json -> ${SRC_DIR}/sass/config/_global.scss
 * Consumed by Pug as a global variable. 
 * Consumed by JavaScript in ${SRC_DIR}/js/site.js.
 */
const CONFIG_JSON = `${SRC_DIR}/config.json`



/**
 * Entrypoints / Concatenated Filenames
 */
const JS_ENTRY   = 'site.js'
const SASS_ENTRY = 'style.scss' 
const STYLESHEET = 'style.css'



/**
 * Directory Structure
 */
const DIR = {
  SRC : {
    JS : {
      ROOT :   `${SRC_DIR}/js`,
      LIB :    `${SRC_DIR}/js/lib`
    },
    SASS : {
      ROOT :   `${SRC_DIR}/sass`,
      CONFIG : `${SRC_DIR}/sass/config`,
    },
    PUG :      `${SRC_DIR}`,
    STATIC :   `${SRC_DIR}/static`
  },

  BUILD : {
    JS : {
      ROOT :   `${BUILD_DIR}/js`,
      LIB :    `${BUILD_DIR}/js/lib`
    }
  },

  SERVE : {
    JS : {
      ROOT :   `${SERVE_DIR}/js`,
      LIB :    `${SERVE_DIR}/js/lib`
    },
    SASS :     `${SERVE_DIR}/css`,
    PUG :         SERVE_DIR,
    STATIC :   `${SERVE_DIR}/static`
  }
}



/**
 * Glob Shortcuts
 */ 
const GLOBS = {
  SRC : {
    JS : {
      CLASSES : [`${DIR.SRC.JS.ROOT}/**/*.js`, `!${DIR.SRC.JS.LIB}/**/*.js`],
      LIB :      `${DIR.SRC.JS.LIB}/**/*.js`,
      REQUIREJS: `${DIR.SRC.JS.LIB}/require.js`
    },
    SASS : {
      ALL :      `${DIR.SRC.SASS.ROOT}/**/*.scss`,
      ENTRY :    `${DIR.SRC.SASS.ROOT}/${SASS_ENTRY}`,
    },
    PUG : {
      ALL :      `${DIR.SRC.PUG}/**/*.pug`,
      PAGES :   [`${DIR.SRC.PUG}/**/*.pug`, `!${DIR.SRC.PUG}/partials/**/*.pug`, `!${DIR.SRC.PUG}/templates/**/*.pug`]
    },
    STATIC :     `${DIR.SRC.STATIC}/**/*.*`
  },

  BUILD : {
    JS : {
      LIB :      `${DIR.BUILD.JS.LIB}/**/*.js`,
      ENTRY :    `${DIR.BUILD.JS.ROOT}/${JS_ENTRY}`
    }
  }
}



/**
 * Delete SERVE and BUILD directories.
 */
gulp.task('clean', () => {
  return gulp.src([
    SERVE_DIR,
    BUILD_DIR
  ], { read: false })
  .pipe(rimraf({ force: true }))
})



/**
 * Delete SERVE, BUILD and NODE_MODULES directories.
 */
gulp.task('clean:all', () => {
  return gulp.src([
    SERVE_DIR,
    BUILD_DIR,
    NODE_MODULES
  ], { read: false })
  .pipe(rimraf({ force: true }))
})



/**
 * Babel Transpilation Options
 */
const BabelOptions = {
  presets: ['env'],
  plugins: ['transform-es2015-modules-amd'] 
}



/**
 * ES6 -> ES5 Babel transpilation.
 * Includes sourcemaps, excludes concatenation & minification.
 */
gulp.task('babel:dev', () => {
  gulp.src(GLOBS.SRC.JS.CLASSES)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel(BabelOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DIR.SERVE.JS.ROOT))
    .pipe(browserSync.stream())
  
  return gulp.src(GLOBS.SRC.JS.LIB)
    .pipe(gulp.dest(DIR.SERVE.JS.LIB))
})



/**
 * ES6 -> ES5 Babel transpilation.
 * Excludes sourcemaps, includes concatenation & minification. 
 */
gulp.task('babel:prod', () => {
  gulp.src(GLOBS.SRC.JS.CLASSES)
    .pipe(plumber())
    .pipe(babel(BabelOptions))
    .pipe(gulp.dest(DIR.BUILD.JS.ROOT))

  gulp.src(GLOBS.SRC.JS.LIB)
    .pipe(gulp.dest(DIR.BUILD.JS.LIB))
  
  gulp.src(GLOBS.SRC.JS.REQUIREJS)
    .pipe(gulp.dest(DIR.SERVE.JS.LIB))

  return gulp.src(GLOBS.BUILD.JS.ENTRY)
    .pipe(rjsOptimize())
    .pipe(concat(JS_ENTRY))
    .pipe(gulp.dest(DIR.SERVE.JS.ROOT))
})



/**
 * Create ${SRC_DIR}/sass/config/_global.scss from Project Configuration JSON
 */
const CreateGlobalSassConfig = () => {
  fs.createReadStream(CONFIG_JSON)
    .pipe(jsonSass({ prefix: '$GLOBAL: ' }))
    .pipe(source(CONFIG_JSON))
    .pipe(rename('_global.scss'))
    .pipe(gulp.dest(DIR.SRC.SASS.CONFIG))
}



/**
 * Sass compilation with concatenation, minification & sourcemaps.
 * Consumes Project Configuration JSON to create ${SRC_DIR}/sass/config/_global.scss
 */          
gulp.task('sass:dev', () => {
  CreateGlobalSassConfig()

  return gulp.src(GLOBS.SRC.SASS.ENTRY)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat(STYLESHEET))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIR.SERVE.SASS))
    .pipe(browserSync.stream())
})



/**
 * Sass compilation concatenation & minification; no sourcemaps.
 * Consumes Project Configuration JSON to create ${SRC_DIR}/sass/config/_global.scss
 */          
gulp.task('sass:prod', () => {
  CreateGlobalSassConfig()

  return gulp.src(GLOBS.SRC.SASS.ENTRY)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat(STYLESHEET))
    .pipe(gulp.dest(DIR.SERVE.SASS))
    .pipe(browserSync.stream())
})



/**
 * Pug template rendering without uglification.
 */
gulp.task('pug:dev', () => {
  return gulp.src(GLOBS.SRC.PUG.PAGES)
    .pipe(plumber())
    .pipe(config((file) => {
      let path = file.history[0].replace(file.base, '');

      path = path.slice(0, -4);

      return {
        global: JSON.parse(fs.readFileSync(CONFIG_JSON)),
        path: path
      }
    }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(DIR.SERVE.PUG))
    .pipe(browserSync.stream())
})



/**
 * Pug template rendering with uglification.
 */
gulp.task('pug:prod', () => {
  return gulp.src(GLOBS.SRC.PUG.PAGES)
    .pipe(plumber())
    .pipe(config((file) => {
      let path = file.history[0].replace(file.base, '');

      path = path.slice(0, -4);

      return {
        global: JSON.parse(fs.readFileSync(CONFIG_JSON)),
        path: path
      }
    }))
    .pipe(pug({ pretty: false }))
    .pipe(gulp.dest(DIR.SERVE.PUG))
    .pipe(browserSync.stream())
})



/**
 * Copy static files to SERVE directory.
 */
gulp.task('static', () => {
  gulp.src(CONFIG_JSON)
    .pipe(gulp.dest(SERVE_DIR))

  return gulp.src(GLOBS.SRC.STATIC)
    .pipe(gulp.dest(DIR.SERVE.STATIC))
})



/** 
 * Build & serve, environment-specific. 
 */
const ENV = ['dev', 'prod']

ENV.forEach((env) => {
  /**
   * Build project.
   */
  gulp.task(`build:${env}`, [`babel:${env}`, `sass:${env}`, `pug:${env}`, 'static'])

  /**
   * Serve project with BrowserSync.
   */
  gulp.task(`serve:${env}`, [`build:${env}`], () => {
    browserSync.init({
      server : { baseDir: SERVE_DIR },
      port   : 3000,
      notify : false,
      open   : false,
      reloadDebounce: 300
    })

    /**
     * Watch for file changes, rebuild as necessary. 
     */
    gulp.watch(CONFIG_JSON,          [`build:${env}`])
    gulp.watch(GLOBS.SRC.JS.CLASSES, [`babel:${env}`])
    gulp.watch(GLOBS.SRC.SASS.ALL,   [`sass:${env}`])
    gulp.watch(GLOBS.SRC.PUG.ALL,    [`pug:${env}`])
  })
})



/**
 * Build & serve.
 */
gulp.task('dev', ['serve:dev'])
gulp.task('prod', ['serve:prod'])
gulp.task('default', ['dev'])