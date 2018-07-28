var gulp					= require('gulp');
var sass					= require('gulp-sass');
var plumber				= require('gulp-plumber');
var postcss				= require('gulp-postcss');
var autoprefixer	= require('autoprefixer');
var minify				= require('gulp-csso');
var imagemin			= require('gulp-imagemin');
var webp					= require('gulp-webp');
var rename				= require('gulp-rename');
var concat        = require('gulp-concat');
var server				= require('browser-sync').create();
var run						= require('run-sequence');
var del						= require('del');

gulp.task('style', function () {
	gulp.src('source/sass/main.sass')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer(['last 15 versions'])
		]))
		.pipe(gulp.dest('build/css'))
		.pipe(minify())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(server.reload( {stream: true} ))
});

gulp.task('js', function () {
	gulp.src([
		'source/js/common.js'
	])
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('build/js'))
	.pipe(server.reload( {stream: true} ))
});

gulp.task('images', function () {
	return gulp.src('source/img/**/*.{png,jpg,svg}')
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest('source/img'));
});

gulp.task('webp', function () {
	return gulp.src('source/img/**/*.{png,jpg}')
		.pipe(webp({guality: 90}))
		.pipe(gulp.dest('source/img'));
});

gulp.task('clean', function () {
	return del('build');
});

gulp.task('copy', function () {
	return gulp.src([
		'source/fonts/**/*.{woff,woff2}',
		'source/img/**',
		'source/**/*.html'
	], {
		base: "source"
	})
	.pipe(gulp.dest('build'));
});

gulp.task('html', function () {
	return gulp.src(['source/**/*.html'], {
		base: 'source'
	})
	.pipe(gulp.dest('build'))
	.pipe(server.reload( {stream: true} ))
});

gulp.task('serve', function () {
	server.init({
		server: 'build/'
	});

	gulp.watch('source/sass/**/*.sass', ['style']);
	gulp.watch('source/js/**/*.js', ['js']);
	gulp.watch('source/*.html', ['html']);
});


gulp.task('build', function (done) {
	run(
		'clean',
		'copy',
		'style',
		'js',
		done
	);
});

gulp.task('start', ['build', 'serve'], function() {} );

gulp.task('default', ['start']);