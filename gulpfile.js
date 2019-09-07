var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var server = require('browser-sync').create();
var rename = require('gulp-rename');
var run = require('run-sequence');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var svgstore = require('gulp-svgstore');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var rigger = require('gulp-rigger');

//Build Style

gulp.task('style', function () {
	return gulp.src('source/sass/style.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: require('node-normalize-scss').includePaths
		}))
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest('build/css'))
		.pipe(minify())
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'))
		.pipe(server.stream());
});

// Build js

gulp.task('js', function () {
	return gulp.src('source/js/app.js')
		.pipe(plumber())
		.pipe(webpackStream({
			mode: 'production',
			output: {
				filename: 'app.js',
			},
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['@babel/preset-env']
						}
					}
				]
			},
			// externals: {
			//   jquery: 'jQuery'
			// }
		}))
		.pipe(gulp.dest('build/js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('build/js'))
		.pipe(server.stream());
});

gulp.task('html', function () {
	return gulp.src('source/*.html')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest('build/'))
		.pipe(server.stream());
});

gulp.task('serve', function () {
	server.init({
		server: 'build/',
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch('source/sass/**/*.scss', gulp.parallel('style'));
	gulp.watch('source/**/*.html').on('change', gulp.series('html'));
	gulp.watch('source/js/**/*.js', gulp.series('js'));
	gulp.watch('source/img/**', gulp.series('images'));
});


gulp.task('fonts', function () {
	return gulp.src('source/fonts/**/*.{woff,woff2}', { base: 'source' })
		.pipe(gulp.dest('build'))
})

gulp.task('copy', function () {
	return gulp.src([
		'source/libs/**'
	], {
			base: 'source'
		})
		.pipe(gulp.dest('build'));
});


gulp.task('clean', function () {
	return del('build');
});

gulp.task('images', function () {
	return gulp.src('source/img/**', { base: 'source' })
		.pipe(gulp.dest('build'))
		.pipe(server.stream());
});

// gulp.task('images', function () {
// 	return gulp.src('source/img/**/*.{png,jpg,svg}', {base: 'source'})
// 		.pipe(imagemin([
// 			imagemin.optipng({ optimizationLevel: 3 }),
// 			imagemin.jpegtran({ progressive: true }),
// 			imagemin.svgo({
// 				plugins: [
// 					{ removeViewBox: false }
// 				]
// 			})
// 		]))
// 		.pipe(gulp.dest('build'));
// });

gulp.task('webp', function () {
	return gulp.src('source/img/content/**/*.{png,jpg}')
		.pipe(webp({ quality: 90 }))
		.pipe(gulp.dest('source/img/content'));
});

gulp.task('sprite', function () {
	return gulp.src('source/img/icons/icon-*.svg')
		.pipe(svgstore({
			inlineSVG: true
		}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('source/img/icons'));
});

gulp.task('watch', gulp.series('clean', 'html', 'style', 'js', 'images', 'fonts', 'serve'));
