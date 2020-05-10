const VERSION = '1.0.0'
const FILENAME = `better-stack-v${VERSION}.zip`

const {src, dest, watch, series, parallel} = require('gulp')
const connect = require('gulp-connect')
const del = require('del')
const path = require('path')
const zip = require('gulp-zip')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('autoprefixer')

sass.compiler = require('node-sass')

const destination = (relativePath = '/') => {
  return path.join('dist', relativePath)
}

const clean = () => {
  return del(destination('/'))
}

const manifest = () => {
  return src('manifest.json').pipe(dest(destination('/')))
}

const css = () => {
  return src('./src/styles/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest(destination('/css')))
    .pipe(connect.reload())
}

const script = () => {
  return src('./src/scripts/toggle.js')
    .pipe(dest(destination('/js')))
    .pipe(connect.reload())
}

const background = () => {
  return src('./src/scripts/background.js')
    .pipe(dest(destination()))
    .pipe(connect.reload())
}

const zipAll = () => {
  return src('dist/**')
    .pipe(zip(FILENAME))
    .pipe(dest(destination('../build')))
}

const icons = () => {
  return src('./src/icons/*.png')
    .pipe(dest(destination('/icons')))
    .pipe(connect.reload())
}

exports.clean = clean
exports.build = series(
  clean,
  parallel(manifest, css, script, background, icons),
  zipAll,
)
exports.dev = series(
  clean,
  parallel(manifest, css, script, background, icons),
  (done) => {
    connect.server({
      root: destination('/'),
      livereload: true,
    })
    watch('./src/styles/*.scss', css)
    watch('./src/scripts/*.js', parallel(script, background))
    watch('./manifest.json', manifest)
    watch('./src/icons/*.png', icons)
    done()
  },
)
