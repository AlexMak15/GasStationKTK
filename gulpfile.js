var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    notify          = require('gulp-notify'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglifyjs'),
    rename          = require('gulp-rename'),
    minify          = require('gulp-minify-css'),
    htmlmin         = require('gulp-htmlmin'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    autoprefixer    = require('gulp-autoprefixer'),
    scss            = require('gulp-scss');


gulp.task('scss', function(){
    return gulp.src(['src/scss/main.scss'])
        .pipe(scss())
        .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8']))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify('Done!'));
});

gulp.task('minify', function() {
    return gulp.src('src/css/main.css')
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css/min'));
});
gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function(){
    return gulp.src([
        'src/js/libs/jquery.min.js',
        'src/js/libs/blueimp-gallery.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});
gulp.task('img', function(){
    return gulp.src('src/img/**/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

gulp.task('watch',['scss','browser-sync'], function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js**/*.js', browserSync.reload);
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('build', ['img','htmlmin','minify','scripts'], function(){

    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css'
    ])
        .pipe(gulp.dest('build/css'));

    var buildFont = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));

    var buildJs = gulp. src('src/js/**/*')
        .pipe(gulp.dest('build/js'));

    var buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest('build'));

})