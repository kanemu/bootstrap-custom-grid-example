/* Common libraries */
const gulp = require('gulp');
const plumber = require('gulp-plumber');

/* Libraries required for sass compile */
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const stripCssComments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
/* Use dart-sass */
sass.compiler = require('sass');

/*
 * Function to compile SCSS
 */
function sassCompile(outputStyle = 'compressed') {
    const isCompress = (outputStyle === 'compressed');
    return function (done) {
        gulp.src('./src/assets/css/*.scss')
            .pipe(plumber())
            .pipe(sass({
                includePaths: ['node_modules/bootstrap/scss'],
                outputStyle: outputStyle
            }))
            .pipe(autoprefixer())
            .pipe(gulpIf(isCompress, replace('/*!', '/*')))
            .pipe(gulpIf(isCompress, stripCssComments()))
            .pipe(gulpIf(!isCompress, rename({
                suffix: `.${outputStyle}`
            })))
            .pipe(gulp.dest('./src/assets/css/'))
            .on('end', function () {
                done();
            });
    }
}

/*
 * gulp sass task
 */
gulp.task('sass', gulp.series(sassCompile(), sassCompile('expanded')));

/*
 * default task
 */
gulp.task('default', gulp.series('sass', function () {
    gulp.watch('src/assets/css/**/*.scss', gulp.series('sass'));
}));
