var gulp = require('gulp');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');


//----------------------------
// PATHS
//----------------------------
var paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts'],
	buildlocal: ['build'],
	tests: ['build/**/*Tests.js']
};


//----------------------------
// TASKS
//----------------------------
gulp.task('build', () => {
	return gulp.src(paths.typescripts)
						 .pipe(ts({
							 target: "ES5",
							 module: "commonjs",
							 removeComments: true
						 }))
						 .pipe(gulp.dest('build/local'));
});

gulp.task('mocha', ['build'], () => {
	return gulp.src(paths.tests, {read: false})
						 .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('clean', () => {
	return gulp.src(paths.buildlocal, {read: false})
						 .pipe(clean());
});

gulp.task('watch', () => {
	gulp.watch(paths.typescripts, ['mocha']);
});

gulp.task('default', ['watch']);