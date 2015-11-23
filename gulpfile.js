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
	distsources: ['src/**/*.ts'],
	builds: ['build', 'dist'],
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

gulp.task('dist', () => {
	return gulp.src(paths.distsources)
						 .pipe(ts({
							 target: "ES5",
							 module: "commonjs",
							 removeComments: true
						 }))
						 .pipe(gulp.dest('dist'));
});

gulp.task('mocha', ['build'], () => {
	return gulp.src(paths.tests, {read: false})
						 .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('clean', () => {
	return gulp.src(paths.builds, {read: false})
						 .pipe(clean());
});

gulp.task('watch', () => {
	gulp.watch(paths.typescripts, ['mocha']);
});

gulp.task('default', ['watch']);