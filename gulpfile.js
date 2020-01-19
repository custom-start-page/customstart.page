const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const notifier = require('node-notifier');
const nodemon = require('nodemon');

const styles = function(cb) {
    gulp.src([
        'src/sass/main.scss'
    ])
    .pipe(plumber({
        errorHandler: function (err) {
            notifier.notify({
                title: 'Error in style stask',
                message: err.message
            });

            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(cssnano({ zindex: false }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'))
    .on('end', function() {
        notifier.notify({
            title: 'Styles task completed',
            message: 'Success'
        });
    });

    cb();
};

const scripts = function(cb) {
    gulp
        .src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: function (err) {
                notifier.notify({
                    title: 'Error in scripts task',
                    message: err.message
                });

                this.emit('end');
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(babel({
            presets: ['@babel/preset-react']
        }))
        // .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/js'))
        .on('end', function() {
            notifier.notify({
                title: 'Scripts task completed',
                message: 'Success'
            });
        });

    cb()
};

const start = function(cb) {
    nodemon({
        script: 'server.js',
        ext: 'js,md,json',
        watch: ['server/*', 'server.js', 'data/*']
    });

    cb();
};

const watch = function(cb) {
    gulp.watch('src/sass/**/*.scss', styles);

    gulp.watch('src/js/**/*.js', scripts);

    cb();
};

exports.scripts = scripts;
exports.default = gulp.parallel(styles, scripts, start, watch);
