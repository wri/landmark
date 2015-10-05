var config = require('./gulp-config.js'),
    imagemin = require('gulp-imagemin'),
    requirejs = require('requirejs'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    react = require('gulp-react'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    gulp = require('gulp');

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: "src"
    },
    port: process.env.PORT || 3000,
    files: config.browserSyncSrc,
    logFileChanges: false,
    ghostMode: false,
    reloadOnRestart: false,
    open: false,
    ui: false
  })
})

gulp.task('stylus-watch', function() {
    gulp.watch(config.stylus.watch, ['stylus-dev']);
});

gulp.task('stylus-dev', function() {
    return gulp.src(config.stylus.src, {
            base: config.stylus.base
        })
        .pipe(stylus({
            compress: false,
            linenos: true
        }))
        .pipe(gulp.dest(config.stylus.devOut));
});

gulp.task('stylus-build', function() {
    return gulp.src(config.stylus.src, {
            base: config.stylus.base
        })
        .pipe(stylus({
            compress: true,
            linenos: false
        }))
        .pipe(gulp.dest(config.stylus.buildOut));
});

gulp.task('jade-watch', function() {
    gulp.watch(config.jade.watch, ['jade-dev']);
});

gulp.task('jade-dev', function() {
    return gulp.src(config.jade.src, {
            base: config.jade.base
        })
        .pipe(jade({
            pretty: true,
            locals: {
                appVersion: config.appVersion
            }
        }))
        .pipe(gulp.dest(config.jade.devOut));
});

gulp.task('jade-build', function() {
    return gulp.src(config.jade.src, {
            base: config.jade.base
        })
        .pipe(jade({
            locals: {
                appVersion: config.appVersion
            }
        }))
        .pipe(gulp.dest(config.jade.buildOut));
});

gulp.task('copy', ['copy-libs', 'copy-access']);

gulp.task('copy-libs', function() {
    return gulp.src(config.copy.libs.src)
        .pipe(gulp.dest(config.copy.libs.out));
});

gulp.task('copy-access', function() {
    return gulp.src(config.copy.access.src)
        .pipe(gulp.dest(config.copy.access.out));
});

gulp.task('optimize', ['optimize-map-page']);

gulp.task('optimize-map-page', function() {
    requirejs.optimize(config.optimizer.map.options, function(res) {});
});

gulp.task('minify', ['minify-js', 'minify-images']);

gulp.task('minify-js', function() {
    return gulp.src(config.uglify.src)
        .pipe(uglify())
        .pipe(gulp.dest(config.uglify.dest));
});

gulp.task('minify-images', function() {
    return gulp.src(config.imagemin.src)
        .pipe(imagemin({
            pngquant: true,
            optimizationLevel: 7,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .on('error', console.error)
        .pipe(gulp.dest(config.imagemin.dest));
});

gulp.task('react-watch', function() {
    gulp.watch(config.react.src, ['react-jsx']);
});

gulp.task('react-jsx', function() {
    return gulp.src(config.react.src)
        .pipe(react())
        .pipe(gulp.dest(config.react.out));
});

gulp.task('watch', ['stylus-dev', 'stylus-watch', 'jade-dev', 'jade-watch', 'react-jsx', 'react-watch', 'browser-sync']);

gulp.task('build', ['copy', 'minify', 'stylus-build', 'jade-build', 'optimize']);
