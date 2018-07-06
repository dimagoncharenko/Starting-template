var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify       = require('gulp-csso');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var concatCss    = require('gulp-concat-css');
var imagemin     = require('gulp-imagemin');
var webp         = require('gulp-webp');
var server       = require('browser-sync').create();
var rename       = require('gulp-rename');
var run          = require('run-sequence');
var del          = require('del');

gulp.task('style', function () {
	gulp.src('source/sass/style.scss')
	.pipe(plumber())
	.pipe(sass({
		includePaths: require('node-normalize-scss').includePaths
	}))
	.pipe(postcss([
		autoprefixer()
	]))
	.pipe(gulp.dest('source/css'))
	.pipe(minify())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('source/css'))
	.pipe(server.stream());
});

gulp.task('cssLibs', function () {
	return gulp.src([
		'source/libs/slick-carousel/slick/slick.css'
	])
	.pipe(concatCss('libs.css'))
	.pipe(minify())
	.pipe(gulp.dest('source/css'));
});


//Сборка стилей в продакшн

gulp.task('styleProd', function () {
	gulp.src('source/sass/style.scss')
	.pipe(plumber())
	.pipe(postcss([
		autoprefixer()
	]))
	.pipe(sass({
		includePaths: require('node-normalize-scss').includePaths
	}))
	.pipe(gulp.dest('build/css'))
	.pipe(minify())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('build/css'));
});


// Скидываю все Js библиотеки в один файл

gulp.task('jsLibs', function () {
	return gulp.src([
		'source/libs/jquery/dist/jquery.min.js',
		'source/libs/picturefill/dist/picturefill.min.js',
		'source/libs/svg4everybody/dist/svg4everybody.min.js',
		'source/libs/slick-carousel/slick/slick.min.js'
	])
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('source/js'));
});


// Минифицирую js

gulp.task('js', function () {
	return gulp.src('source/js/script.js')
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('source/js'))
	.pipe(server.stream());
});


gulp.task('serve', ['style', 'jsLibs', 'cssLibs', 'js'], function () {
	server.init({
		server: 'source/',
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch('source/sass/**/*.scss', ['style']);
	gulp.watch('source/*.html', server.reload);
	gulp.watch('source/js/**/*.js', ['js']);
});


gulp.task('copy', function () {
	return gulp.src([
		'source/fonts/**/*.{woff,woff2}',
		'source/img/**',
		'source/js/**',
		'source/css/libs.css',
		'source/*.html',
		'source/libs/**'
	], {
		base: 'source'
	})
	.pipe(gulp.dest('build'));
});


gulp.task('clean', function () {
	return del('build');
});


gulp.task('build', function (done) {
	run(
		'clean',
		'js',
		'jsLibs',
		'cssLibs',
		'copy',
		'styleProd',
		done
	);
});


//Запуск сервера продакшн

gulp.task('serveProd', function () {
	server.init({
		server: 'build/',
		notify: false,
		open: true,
		cors: true,
		ui: false
	});
});


gulp.task('images', function () {
	return gulp.src('source/img/**/*.{png,jpg,svg}')
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: false}
			]
		})
	]))
	.pipe(gulp.dest('source/img'));
});


//делаю webp

gulp.task('webp', function () {
	return gulp.src('source/img/content/**/*.{png,jpg}')
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest('source/img/content'));
});
