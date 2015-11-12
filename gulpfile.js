var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function(){
    return gulp.src('js/*.js') // read all of the files that are in script/lib with a .js extension
        .pipe(concat('vis-graph.js')) // concatenate all of the file contents into a file titled 'all.js'
        .pipe(gulp.dest('dist/')) // write that file to the dist/js directory
        .pipe(rename('vis-graph.min.js')) // now rename the file in memory to 'all.min.js'
        .pipe(uglify()) // run uglify (for minification) on 'all.min.js'
        .pipe(gulp.dest('dist/')); // write all.min.js to the dist/js file
});