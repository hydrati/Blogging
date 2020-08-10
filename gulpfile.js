var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
const babel = require("gulp-babel");
var buffer = require("vinyl-buffer");
var sourcemaps = require("gulp-sourcemaps");
var paths = {
  pages: ["html/**/*"],
};
//增加copy-html并将它作为default的依赖项，当default执行时，copy-html会被首先执行
function copyDist() {
  return gulp.src(paths.pages).pipe(gulp.dest("build"));
}

function build() {
  return (
    browserify({
      basedir: ".",
      debug: false,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    })
      //使用tsify插件调用Browserify
      .plugin(tsify, {
        target: "es7",
        esModuleInterop: true,
        noImplicitAny: false,
        allowSyntheticDefaultImports: true,
      })
      .bundle()
      //调用bundle后，使用source把输出文件命名为bundle.js
      .pipe(source("blogging.min.js"))
      .pipe(buffer())
      // .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(
        babel({
          presets: ["@babel/env"],
          // plugins: ["@babel/transform-runtime"],
        })
      )
      .pipe(uglify())
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest("build/js"))
  );
}

exports.default = gulp.series([build, copyDist]);
