/****************************************************************************************************/
// MODULES IMPORT
/****************************************************************************************************/
const { src, dest, symlink, lastRun, series, parallel, watch } = require('gulp')
const less = require('gulp-less')
const validator = require('gulp-w3c-html-validator')
const fileinclude = require('gulp-file-include')
const htmlmin = require('gulp-html-minifier2')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')
const postcssNormalize = require('postcss-normalize')
const postcssImport = require('postcss-import')
const postcssCsso = require('postcss-csso')
const tailwind = require('tailwindcss')
const gulpPurgeCss = require('gulp-purgecss')
const webpack = require('webpack')
const gulpwebpack = require('webpack-stream')
const ts = require('gulp-typescript')
const mainNpmFiles = require('npmfiles')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const svgSprite = require('gulp-svg-sprite')
const favicons = require('gulp-favicons')
const plumber = require('gulp-plumber')
const newer = require('gulp-newer')
const debug = require('gulp-debug')
const gulpIf = require('gulp-if')
const del = require('del')
const flatten = require('gulp-flatten')
const remember = require('gulp-remember')
const cached = require('gulp-cached')
const path = require('path')
const fs = require('fs')
const { create } = require('browser-sync')

/****************************************************************************************************/
// DEV OR PRODUCTION
/****************************************************************************************************/
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

/****************************************************************************************************/
// CREATE BROWSER-SYNC INSTANCE
/****************************************************************************************************/
const browserSync = create()
/****************************************************************************************************/
// BROWSER-SYNC TASK
/****************************************************************************************************/
const serve = cb => {
  browserSync.init({
    server: 'build',
    // proxy: 'localhost/gruzovoy-service/build/',
    watch: true,
    open: false,
    notify: false
  })
  cb()
}
exports.serve = serve
/****************************************************************************************************/
// DEL BUILD DIRECTORY TASK
/****************************************************************************************************/
const clean = () => del('build')
exports.clean = clean
/****************************************************************************************************/
// PATHS AND SETTINGS
/****************************************************************************************************/
const cms = {
  modx: {
    html: 'build/',
    css: 'build/assets/css/',
    js: 'build/assets/js/',
    php: 'build/assets/php/',
    img: 'build/assets/',
    libs: 'build/assets/libs/',
    fonts: 'build/assets/fonts/',
    favicon: 'build/assets/img/favicons'
  }
}
/****************************************************************************************************/
// HTML TASK
/****************************************************************************************************/
const html = () =>
  src('src/views/*.html', {
    since: lastRun(html)
  })
  .pipe(plumber())
  .pipe(fileinclude({
    basepath: './src'
  }))
  .pipe(gulpIf(!isDevelopment, htmlmin({
    collapseWhitespace: true
  })))
  .pipe(dest(cms.modx.html))
exports.html = html
/****************************************************************************************************/
// HTML TEMPLATES TASK
/****************************************************************************************************/
const htmltemplates = () =>
  src('src/views/*.html')
  .pipe(plumber())
  .pipe(fileinclude({
    basepath: './src'
  }))
  .pipe(dest(cms.modx.html))
exports.htmltemplates = htmltemplates
/****************************************************************************************************/
// HTML VALIDATION TASK
/****************************************************************************************************/
const validation = () =>
  src('build/*.html')
  .pipe(validator())
  .pipe(validator.reporter())
exports.validation = validation
/****************************************************************************************************/
// CSS TASK
/****************************************************************************************************/
const css = () =>
  src('src/css/style.css', {
    sourcemaps: true
  })
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    postcssImport({
      path: ['src/css']
    }),
    postcssNormalize({
      forceImport: true
    }),
    tailwind(),
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true
      },
      autoprefixer: {
        cascade: false
      }
    })
  ]))
  .pipe(gulpIf(!isDevelopment, gulpPurgeCss({
    content: ['src/views/*.html', 'src/templates/*.html', 'src/js/**/*.js', 'src/js/**/*.ts'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
  })))
  .pipe(gulpIf(!isDevelopment, postcss([postcssCsso({
    restructure: false,
    comments: false
  })])))
  .pipe(gulpIf(!isDevelopment, dest(cms.modx.css), dest(cms.modx.css, {
    sourcemaps: '.'
  })))
exports.css = css
/****************************************************************************************************/
// JS TASK WITH BABEL AND WEBPACK
/****************************************************************************************************/
const js = () =>
  src('src/js/main.js')
  .pipe(plumber())
  .pipe(gulpwebpack(require('./webpack.config.js'), webpack))
  .pipe(dest(cms.modx.js))
exports.js = js
/****************************************************************************************************/
// JS TASK WITHOUT BABEL AND WEBPACK, BUT WITH TypeScript
/****************************************************************************************************/
// const tsProject = ts.createProject('tsconfig.json')
// const js = () =>
//   src('src/js/**/*.ts')
//     .pipe(plumber())
//     .pipe(tsProject())
//     .pipe(gulpIf(!isDevelopment, uglify()))
//     .pipe(dest(cms.modx.js))
// exports.js = js
/****************************************************************************************************/
// JS TASK WITHOUT BABEL, WEBPACK AND TypeScript
/****************************************************************************************************/
// const js = () =>
//   src('src/js/main.js')
//     .pipe(plumber())
//     .pipe(dest(cms.modx.js))
// exports.js = js
/****************************************************************************************************/
// PHP TASK
/****************************************************************************************************/
const php = () =>
  src('src/php/*.php')
  .pipe(plumber())
  .pipe(dest(cms.modx.php))
exports.php = php
/****************************************************************************************************/
// LIBS TASK
/****************************************************************************************************/
const libs = () =>
  src(mainNpmFiles(), {
    base: './node_modules'
  })
  .pipe(flatten({
    includeParents: 1
  }))
  .pipe(newer(cms.modx.libs))
  .pipe(dest(cms.modx.libs))
exports.libs = libs
/****************************************************************************************************/
// FONTS TASK
/****************************************************************************************************/
const fonts = () =>
  src('src/fonts/**/*.*')
  .pipe(newer(cms.modx.fonts))
  .pipe(gulpIf(isDevelopment, symlink(cms.modx.fonts), dest(cms.modx.fonts)))
exports.fonts = fonts
/****************************************************************************************************/
// IMG TASK (JPG,PNG,GIF)
/****************************************************************************************************/
const img = () =>
  src(['src/img/**/*.*', 'src/images/**/*.*', '!src/img/icons/*.*'], {
    base: 'src'
  })
  .pipe(newer(cms.modx.img))
  .pipe(gulpIf(!isDevelopment, imagemin([
    imagemin.gifsicle({
      interlaced: true
    }),
    imagemin.mozjpeg({
      progressive: true
    }),
    imagemin.optipng({
      optimizationLevel: 1
    }),
    imagemin.svgo({
      removeViewBox: false,
      collapseGroups: true
    })
  ])))
  .pipe(gulpIf(!isDevelopment, dest(cms.modx.img), symlink(cms.modx.img)))
exports.img = img
/****************************************************************************************************/
// IMG TASK (JPG,PNG,GIF)
/****************************************************************************************************/
const webpimages = () =>
  src(['src/img/**/*.{jpg,png,gif}', 'src/images/**/*.{jpg,png,gif}', '!src/img/favicons/*.*'], {
    base: 'src',
    since: lastRun(webpimages)
  })
  .pipe(plumber())
  .pipe(webp())
  .pipe(dest('src'))
exports.webpimages = webpimages
/****************************************************************************************************/
// SVG SPRITE ICONS TASK
/****************************************************************************************************/
const config = {
  shape: {
    dimension: {
      maxWidth: 50,
      maxHeight: 50
    },
    spacing: {
      padding: 0,
      box: 'icon'
    },
    transform: [{
      svgo: {
        plugins: [{
            removeXMLNS: true
          },
          {
            cleanupListOfValues: true
          },
          {
            convertShapeToPath: false
          },
          {
            removeAttrs: {
              attrs: ['data-name', 'version']
            }
          },
          {
            removeStyleElement: true
          },
          {
            removeScriptElement: true
          }
        ],
        floatPrecision: 1
      }
    }]
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    dimensionAttributes: false
  },
  mode: {
    stack: {
      dest: '.',
      sprite: 'img/sprite.svg',
      render: {
        css: {
          template: 'src/templates/icon_template.html',
          dest: 'css/modules/sprite.css'
        }
      }
    }
  }
}
const svgicons = () =>
  src('src/img/icons/*.svg')
  .pipe(cached('svg:icons'))
  .pipe(remember('svg:icons'))
  .pipe(svgSprite(config))
  .pipe(dest('src'))
exports.svgicons = svgicons
/****************************************************************************************************/
// COPY FAVICON
/****************************************************************************************************/
const faviconsGenerator = () =>
  src('src/img/favicons/favicon.png')
  .pipe(favicons({
    appName: 'My App',
    appShortName: 'App',
    appDescription: 'This is my application',
    background: '#020307',
    path: 'assets/img/favicons/',
    url: 'http://mysite.ru/',
    display: 'standalone',
    lang: 'ru-RU',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    version: 1.0,
    logging: false,
    html: 'index.html',
    pipeHTML: true,
    replace: true,
    icons: {
      coast: false,
      firefox: false,
      windows: false,
      yandex: false
    }
  }))
  .pipe(dest(cms.modx.favicon))
exports.faviconsGenerator = faviconsGenerator
/****************************************************************************************************/
// WATCHERS
/****************************************************************************************************/
const watchers = cb => {
  watch('src/views/*.html', html)
    .on('unlink', filepath => {
      const filePathFromSrc = path.relative(path.resolve('src/views'), filepath)
      const destFilePath = path.resolve(cms.modx.html, filePathFromSrc)
      fs.unlinkSync(destFilePath)
    })
  watch('src/templates/*.html', htmltemplates)
  watch('src/css/**/*.css', css)
  watch('src/css/**/*.less', css)
  watch('src/js/**/*.{js,ts}', js)
  watch('src/php/**/*.php', php)
  watch(['src/**/*.{jpg,png,gif,webp}', '!src/img/icons/'], img)
    .on('unlink', filepath => {
      const filePathFromSrc = path.relative(path.resolve('src'), filepath)
      const destFilePath = path.resolve(cms.modx.img, filePathFromSrc)
      fs.unlinkSync(destFilePath)
    })
  watch('src/img/icons/*.svg', svgicons)
    .on('unlink', filepath => {
      remember.forget('svg:icons', path.resolve(filepath))
      delete cached.caches['svg:icons'][path.resolve(filepath)]
    })
  watch('src/fonts/**/*.*', fonts)
    .on('unlink', filepath => {
      const filePathFromSrc = path.relative(path.resolve('src/fonts'), filepath)
      const destFilePath = path.resolve(cms.modx.fonts, filePathFromSrc)
      fs.unlinkSync(destFilePath)
    })
  cb()
}

/****************************************************************************************************/
// GLOBAL TASKS
/****************************************************************************************************/
const build = series(svgicons, parallel(html, css, js, php, libs, fonts, img))
exports.build = build
const dev = series(build, parallel(watchers, serve))
exports.dev = dev
