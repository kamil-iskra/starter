var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');
var cleanCSS = require('gulp-clean-css');
var color = require('gulp-color');
var connect = require('gulp-connect-php');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var size = require('gulp-size');


var handleError = function(err) {
	console.log(err.toString());
	this.emit('end');
}

//============================================
//Sass and CSS tasks
//============================================

    //Compile and minify Sass files
    gulp.task('sass:prod', function() {
	    var s = size();
        return gulp.src('src/scss/*.scss')
	        .pipe(plumber({
		        errorHandler: handleError
	        }))
	        .pipe(sourcemaps.init())
	        .pipe(
		        sass({
			        outputStyle : 'compressed'
		        })
	        )
	        .pipe(autoprefixer({browsers: ["> 1%"]}))
	        .pipe(cleanCSS())
	        .pipe(s)
	        .pipe(rename({suffix: '.min'}))
	        .pipe(sourcemaps.write('.'))
	        .pipe(gulp.dest('dist/css'))
	        .pipe(browserSync.stream({match: '**/*.css'}))
	        .pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total CSS size: ' + s.prettySize;
		        }
	        }))
    });

    // Compile Sass files
    gulp.task('sass:dev', function() {
	    var s = size();
        return gulp.src('src/scss/*.scss')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(
            	sass({
                    outputStyle : 'expanded'
                })
            )
            .pipe(autoprefixer({browsers: ["> 1%"]}))
	        .pipe(rename({suffix: '.min'}))
	        .pipe(s)
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
	        .pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total CSS size ' + s.prettySize;
		        }
	        }))
    });


    // Copy CSS files
    gulp.task('css:dev', function() {
	    var s = size();
        return gulp.src('src/css/*.css')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(autoprefixer({browsers: ["> 1%"]}))
	        .pipe(rename({suffix: '.min'}))
	        .pipe(s)
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
	        .pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total CSS size ' + s.prettySize;
		        }
	        }))
    });

    // Copy and minify CSS files
    gulp.task('css:prod', function() {
	    var s = size();
        return gulp.src('src/css/*.css')
	        .pipe(plumber({
		        errorHandler: handleError
	        }))
	        .pipe(autoprefixer({browsers: ["> 1%"]}))
	        .pipe(cleanCSS())
	        .pipe(s)
	        .pipe(rename({suffix: '.min'}))
	        .pipe(gulp.dest('dist/css'))
	        .pipe(browserSync.stream({match: '**/*.css'}))
	        .pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total CSS size: ' + s.prettySize;
		        }
	        }))
    });


//============================================
//JS tasks
//============================================
    // Lint Task
    gulp.task('js-lint', function() {
        return gulp.src('src/js/*.js')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    // Concatenate JS
    gulp.task('js:dev', function() {
	    var s = size();
        return gulp.src('src/js/*.js')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(concat('scripts.js'))
	        .pipe(s)
	        .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream())
	        .pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total JS size ' + s.prettySize;
		        }
	        }))
    });

    // Minify JS
	gulp.task('js:prod', function() {
		var s = size();
		return gulp.src('src/js/*.js')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(concat('scripts.js'))
			.pipe(uglify())
			.pipe(s)
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/js'))
			.pipe(browserSync.stream())
			.pipe(notify({
		        onLast: true,
		        message: function () {
			        return 'Total JS size ' + s.prettySize;
		        }
	        }))
	});


//============================================
//Watch tasks
//============================================
    gulp.task('watch:prod', function() {
        gulp.watch('src/js/*.js', ['js-lint', 'js:prod']);
        gulp.watch('src/scss/**/*.scss', ['sass:prod']);
        gulp.watch('src/css/**/*.css', ['css:prod']);
    });

    gulp.task('watch:dev', function() {
        gulp.watch('src/js/*.js', ['js-lint', 'js:dev']);
        gulp.watch('src/scss/**/*.scss', ['sass:dev']);
        gulp.watch('src/css/**/*.css', ['css:dev']);
    });


//============================================
//Server tasks
//============================================
	gulp.task('browseSync', function() {
		browserSync.init({
            server: "./dist",
            notify: false
        });

        gulp.watch('**/*.php').on('change', function () {
			browserSync.reload();
		});
        gulp.watch('**/*.html').on('change', function () {
			browserSync.reload();
		});
        gulp.watch('js/**/*.js').on('change', function () {
			browserSync.reload();
		});
	});


//============================================
//Global tasks
//============================================
    gulp.task('compile:dev', function() {
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Kompiluje scss i lacze js', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
        gulp.start('css:dev', 'sass:dev', 'js-lint', 'js:dev');
    });

    gulp.task('compile:prod', function() {
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Kompiluje scss i js', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
        gulp.start('css:prod', 'sass:prod', 'js-lint', 'js:prod');
    });

    gulp.task('dev', function() {
	    gulp.start('css:dev', 'sass:dev', 'js-lint', 'js:dev', 'watch:dev', 'browseSync');
	    console.log(color('-------------------------------------------', 'YELLOW'));
	    console.log(color('Rozpoczynamy prace (DEV)', 'YELLOW'));
	    console.log(color('-------------------------------------------', 'YELLOW'));
    });

    gulp.task('prod', function() {
	    gulp.start('css:prod', 'sass:prod', 'js-lint', 'js:prod', 'watch:prod', 'browseSync');
	    console.log(color('-------------------------------------------', 'YELLOW'));
	    console.log(color('Rozpoczynamy prace (PROD)', 'YELLOW'));
	    console.log(color('-------------------------------------------', 'YELLOW'));
    });

    gulp.task('default', ['dev']);
