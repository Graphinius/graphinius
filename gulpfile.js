var gulp 						= require('gulp');
var clean 					= require('gulp-clean');
var mocha 					= require('gulp-mocha');
var ts 							= require('gulp-typescript');
var tdoc 						= require("gulp-typedoc");
var concat					= require('gulp-concat');
var merge 					= require('merge2');
var webpack 				= require('webpack-stream');
var uglify 					= require('gulp-uglify');
var rename 					= require('gulp-rename');
var istanbul 				= require('gulp-istanbul');


//----------------------------
// PATHS
//----------------------------
var paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async/**/*.ts'],
	testsources: ['src/**/*.js'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'src/**/*.map', 'test/**/*.js', 'test/**/*.map', 'test_async/**/*Tests.js', 'test_async/**/*.map', 'build', 'dist', 'docs', 'coverage'], 
	tests_sync: ['test/**/*.js'],
	tests_async: ['test_async/**/*Tests.js'],
	tests_all: ['test/**/*.js', 'test_async/**/*Tests.js']
};


//----------------------------
// CONFIG
//----------------------------
var tsProject = ts.createProject({
	target: "ES5",
	module: "commonjs",
	declaration: false,
	noExternalResolve: false,
  removeComments: true
});


//----------------------------
// TASKS
//----------------------------
gulp.task('build', ['clean'], function () {
	return gulp.src(paths.typescripts, {base: "."})
						 .pipe(ts(tsProject))
						 .pipe(gulp.dest('.'));
});


// Documentation (type doc)
gulp.task("tdoc", ['clean'], function() {
	return gulp
		.src(paths.typesources)
		.pipe(tdoc({
			module: "commonjs",
			target: "es5",
			out: "docs/",
			name: "Graphinius"//,
			//theme: "minimal"
		}));
});


// Packaging - Node / Commonjs
gulp.task('dist', ['tdoc'], function () {
	var tsResult = gulp.src(paths.distsources)
						 				 .pipe(ts(tsProject));
	// Merge the two output streams, so this task is finished
	// when the IO of both operations are done.
	return merge([
		tsResult.dts//.pipe(concat('graphinius.d.ts'))
								.pipe(gulp.dest('./dist/')),
		tsResult.js.pipe(gulp.dest('./dist/'))
	]);
});


// Packaging - Webpack
gulp.task('pack', ['dist'], function() {
	return gulp.src('./index.js')
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(gulp.dest('build/'));
});


// Uglification...
gulp.task('bundle', ['pack'], function() {
	return gulp.src('build/graphinius.js')
		.pipe(uglify())
		.pipe(rename('graphinius.min.js'))
		.pipe(gulp.dest('build'));
});


//----------------------------
// TEST TASKS
//----------------------------
// 'Normal' synchronous tests
gulp.task('test', ['build'], function () {
	return gulp.src(paths.tests_sync, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 60000}));
});


// 'Async tests - usually take a tad longer'
gulp.task('test-async', ['build'], function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 60000}));
});


// COVERAGE TESTS SOURCE COVER
gulp.task('pre-cov-test', ['build'], function () {
	return gulp.src(paths.testsources)
		// Covering files
		.pipe(istanbul())
		// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});


gulp.task('coverage', ['pre-cov-test'], function () {
	return gulp.src(paths.tests_all, {read: false})
		.pipe(mocha({reporter: 'nyan',
			timeout: 60000}))
		// .pipe(istanbul.writeReports({
		// 	dir: './coverage/node-tests',
		// 	reporters: [ 'json' ],
		// 	reportOpts: { dir: './coverage/node-tests'}
		// }));
		.pipe(istanbul.writeReports());
		// .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});


gulp.task('clean', function () {
	return gulp.src(paths.clean, {read: false})
						 .pipe(clean());
});


gulp.task('watch', function () {
	gulp.watch(paths.typescripts, ['test']);
});


gulp.task('watch-async', function () {
	gulp.watch(paths.typescripts, ['test-async']);
});


gulp.task('default', ['watch']);
