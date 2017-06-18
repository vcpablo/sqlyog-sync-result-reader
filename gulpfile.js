var gulp = require('gulp'),
    htmlminify = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jsminify = require('gulp-minify'),
    csslint = require('gulp-csslint'),
    cssminify = require('gulp-cssmin'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    fs = require('fs'),
    connect = require('gulp-connect-php'),
    browsersync = require('browser-sync'),
    git = require('gulp-git'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    bower = require('main-bower-files'),
    inject = require('gulp-inject'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence');
bowerfiles = require('gulp-bower-files'),
    es = require('event-stream'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    ftp = require('gulp-ftp'),
    gulpDeployFtp = require('gulp-deploy-ftp'),
    stripCssComments = require('gulp-strip-css-comments'),
strip = require('gulp-strip-comments');


// less = require('gulp-less');


var pkg = JSON.parse(fs.readFileSync('./package.json'));
var dist = 'build';
var build = dist + '/' + pkg.version;

gulp.task('clean', function() {
    return gulp.src(build, { read: false })
        .pipe(clean());
});

// HTML - Minify
gulp.task('html-minify', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlminify({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(build));
});

// CSS - Minify
gulp.task('css-minify', function() {
    return gulp.src(['src/public/css/**/*.css*', '!src/css/**/*.min.css*'])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
         .pipe(cssminify({
            keepSpecialComments: 0
        }))
        // .pipe(strip())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(concat('style.min.css'))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build));
});

gulp.task('js-minify', function() {
    // gulp.src(['src/service-worker.js'])
    //     .pipe(sourcemaps.init())
    //     .pipe(jsminify({
    //         noSource: true,
    //         ext: { min: '.js' }
    //     }))

    // .pipe(sourcemaps.write('.'))
    //     .pipe(gulp.dest(build));

    return gulp.src(['src/**/*.js', '!src/**/*.min.js', '!bower_components/**/*'])
        .pipe(sourcemaps.init())
        .pipe(jsminify({
            noSource: true,
            ext: { min: '.min.js' }
        }))

    .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build));
});

// gulp.task('img-minify', function() {
//     return gulp.src(['src/public/img/**/*.{jpg,jpeg,png,gif}', '!src/public/img/**/*.old*'])
//          // .pipe(imagemin())
//         .pipe(gulp.dest(build + '/public/img'));
// });

// gulp.task('css-copy', function() {
//     return gulp.src(['src/public/css/**/*.min.css*'])
//         .pipe(gulp.dest(build + '/public/css'));
// });

gulp.task('inject', function() {
    var publicCssFiles = gulp.src([build + '/style.min.css*']);
    var publicJsFiles = gulp.src([build + '/*.min.js*', '!' + build + '/public/js/custom.min.js', '!' + build + '/public/js/*jquery*']);

    var customJsFiles = gulp.src([build + '/public/js/custom.min.js']);

    // var comingSoonJsFiles = gulp.src([build + '/public/js/countdown.min.js']);
    // var comingSoonCssFiles = gulp.src([build + '/public/css/bootstrap.min.css', build + '/public/css/style-main.css', build + '/public/css/style.css']);

    var jqueryFiles = gulp.src([build + '/public/js/*jquery*']);


    gulp.src(build + '/index.html')
        // .pipe(inject(es.merge(publicCssFiles, publicJsFiles), { name: 'public', relative: true }))
        .pipe(inject(customJsFiles, { name: 'custom', relative: true }))
        .pipe(inject(jqueryFiles, { name: 'jquery', relative: true }))
        .pipe(gulp.dest(build));

    // gulp.src(build + '/index.php')
    //     .pipe(gulp.dest(build));

    // gulp.src(build + '/public/partials/em-breve.php', { base: 'src/'})
    //     .pipe(inject(es.merge(comingSoonCssFiles), { name: 'public', relative: true }))
    //     .pipe(inject(es.merge(comingSoonJsFiles), { name: 'custom', relative: true }))
    //     .pipe(gulp.dest(build));
});


gulp.task('js-copy', function() {
    return gulp.src(['src/public/js/**/*.min.js'])
        .pipe(gulp.dest(build + '/public/js'));
});

// Copy index.php, .htaccess
gulp.task('copy', function() {
    return gulp.src(['src/index.php', 'src/service-worker.php', 'src/public/partials/**/*.php', 'src/.htaccess', 'src/public/plugins/**/*', 'src/public/fonts/**/*', 'src/includes/**/*'], { base: 'src/' })
        .pipe(gulp.dest(build));
});





gulp.task('stream', function() {
    // Endless stream mode 
    return watch('src/**/*', { ignoreInitial: false }, browsersync.reload);
});


// SERVE
gulp.task('connect', function() {
    connect.server({
        base: 'src',
        ini: 'C:/dev/PHP7/php.ini',
        exe: 'C:/dev/PHP7/php.exe',
        livereload: true
    }, function() {
        browsersync({
            proxy: '127.0.0.1:8000'
        });
    });

    // gulp.start('stream');
    // gulp.watch(['src/**/*'], browsersync.reload);
    // gulp.watch('src/css/**/*.css', [browsersync.reload]);
    // gulp.watch('src/js/**/*.js', [browsersync.reload]);
    // gulp.watch(['src/**/*.php', 'src/**/*.htaccess', 'src/img/*'], [browsersync.reload]);

});

gulp.task('test', function() {
    connect.server({
        base: build,
        ini: 'C:/dev/PHP7/php.ini',
        exe: 'C:/dev/PHP7/php.exe',
        livereload: true
    }, function() {
        browsersync({
            proxy: '127.0.0.1:8000'
        });
    });

    // gulp.start('stream');
    // gulp.watch(['src/**/*'], browsersync.reload);
    // gulp.watch('src/css/**/*.css', [browsersync.reload]);
    // gulp.watch('src/js/**/*.js', [browsersync.reload]);
    // gulp.watch(['src/**/*.php', 'src/**/*.htaccess', 'src/img/*'], [browsersync.reload]);

});

// gulp.task('deploy', function () {
//     var config = JSON.parse(fs.readFileSync('./config.json'));


    
//     return gulp.src(build + '/**/*')
//         .pipe(gulpDeployFtp(config))
//         // .pipe(ftp(config.ftp))
//         // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
//         // this can be a gulp plugin, gulp.dest, or any kind of stream 
//         // here we use a passthrough stream 
//         .pipe(gulp.dest('dest'));
// });


gulp.task('build', function(done) {
    sequence('clean', 'js-minify', 'js-copy', 'css-minify', 'css-copy', 'html-minify', 'img-minify', 'copy', 'inject',function() {
        console.log('Built!');
    });
});

gulp.task('serve', ['connect', 'stream']);
