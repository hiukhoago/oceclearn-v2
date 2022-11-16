var gulp = require("gulp");
var pug = require('gulp-pug');
var sass = require("gulp-sass");
var autoprefix = require("gulp-autoprefixer");
var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var wait = require('gulp-wait');
var sourcemaps = require('gulp-sourcemaps');
var del = require("del");
var browserSync = require("browser-sync").create();

var PORT = 6789;
var VERSION = '2.4.0';
var PATH = {
    build: "dist",
    pug: "src/pug",
    scss: "src/scss",
    js: "src/js",
};

// Clear all
gulp.task("clean", function () {
    return del([PATH.build]);
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: './',
            serveStaticOptions: { extensions: ["html"] }
        },
        port: PORT,
        notify: false,
        timestamps: true,
        files: [
            "./*.html",
            PATH.scss + "/plugins.css",
            PATH.scss + "/style.css",
            PATH.js + "/plugins.min.js",
            PATH.js + "/main.js",
        ]
    });
});

gulp.task('pug', function buildHTML() {
    return gulp.src([PATH.pug + '/*.pug', "!" + PATH.pug + '/_*.pug'])
        .pipe(wait(200))
        .pipe(plumber({
            errorHandler: function (err) { console.log(err); }
        }))
        .pipe(pug({ pretty: '    ' }))
        .pipe(gulp.dest('./'));
});

gulp.task("sass", function () {
    return gulp.src([PATH.scss + '/*.scss', "!" + PATH.scss + '/_*.scss'])
        .pipe(wait(200))
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefix(["last 2 versions", "> 5%", "Firefox ESR"]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH.scss))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        // .pipe(concat(PATH.scss+"/"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(PATH.scss));
});


gulp.task("scripts", function () {
    gulp.src([PATH.js + "/**/*.min.js", "!" + PATH.js + '/main.min.js', "!" + PATH.js + '/plugins.min.js'])
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(concat("plugins.min.js"))
        .pipe(gulp.dest(PATH.js));
});

gulp.task("scripts-main", function () {
    gulp.src([PATH.js + "/pages/*.js", PATH.js + "/edit.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH.js))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(concat("main.min.js"))
        .pipe(gulp.dest(PATH.js));
});

// Return the task when a file changes
gulp.task("watch", ["pug", "sass", "scripts", "scripts-main", "browser-sync"], function () {
    gulp.watch(PATH.pug + '/**/*.pug', ["pug"]);
    gulp.watch(PATH.scss + '/**/**/*.scss', ["sass"]);
    gulp.watch([PATH.js + '/**/*.min.js', "!" + PATH.js + '/main.min.js', "!" + PATH.js + '/plugins.min.js'], ["scripts"]);
    gulp.watch([PATH.js + '/edit.js', PATH.js + "/pages/*.js"], ["scripts-main"]);
    console.log("\x1b[31m\x1b[1m\n================== \t COREFE: " + VERSION + " / START PORT: " + PORT + " \t ================== \n\x1b[0m");
});

// The default task (called when you run `gulp` from cli)
gulp.task("default", ["clean"], function () {
    gulp.start(["pug"]);
    gulp.start(["sass"]);
    gulp.start(["scripts"]);
    gulp.start(["scripts-main"]);
    wait(250);
});