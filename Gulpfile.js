var config = require('./gulp-config.js'),
		stylus = require('gulp-stylus'),
		watch = require('gulp-watch'),
		jade = require('gulp-jade'),
		gulp = require('gulp');


gulp.task('stylus-watch', function () {
	gulp.watch(config.stylus.watch, ['stylus-dev']);
});

gulp.task('stylus-dev', function () {
	return gulp.src(config.stylus.src, { base: config.stylus.base })
		.pipe(stylus({ compress: false, linenos: true }))
		.pipe(gulp.dest(config.stylus.devOut));
});

gulp.task('stylus-build', function () {
	return gulp.src(config.stylus.src, { base: config.stylus.base })
		.pipe(stylus({ compress: true, linenos: false }))
		.pipe(gulp.dest(config.stylus.buildOut));
});

gulp.task('jade-watch', function () {
	gulp.watch(config.jade.watch, ['jade-dev']);
});

gulp.task('jade-dev', function () {
	return gulp.src(config.jade.src, { base: config.jade.base })
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest(config.jade.devOut));
});

gulp.task('jade-build', function () {
	return gulp.src(config.jade.src, { base: config.jade.base })
		.pipe(jade())
		.pipe(gulp.dest(config.jade.buildOut));
});

gulp.task('copy', ['copy-libs', 'copy-access']);

gulp.task('copy-libs', function () {
	return gulp.src(config.copy.libs.src)
		.pipe(gulp.dest(config.copy.libs.out));
});

gulp.task('copy-access', function () {
	return gulp.src(config.copy.access.src)
		.pipe(gulp.dest(config.copy.access.out));
});

gulp.task('watch', ['stylus-dev', 'stylus-watch', 'jade-dev', 'jade-watch']);
gulp.task('build', ['copy', 'stylus-build', 'jade-build']);		