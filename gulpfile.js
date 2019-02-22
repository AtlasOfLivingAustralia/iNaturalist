var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var rename = require('gulp-rename');

gulp.task ('sass', function () {
    return gulp.src('sass/pivotal/*.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(rename('stylesheet.min.css'))
        .pipe(gulp.dest('stylesheet'));
});