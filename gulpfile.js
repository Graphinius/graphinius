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
var mochaPhantomJS	= require('gulp-mocha-phantomjs');
var istanbulReport 	= require('gulp-istanbul-report');
var shell           = require('gulp-shell');
var inject					= require('gulp-inject');



//----------------------------
// PATHS
//----------------------------
var paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async_nomock/**/*.ts'],
	testsources: ['src/**/*.js'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'src/**/*.map', 'test/**/*.js', 'test/**/*.map', 'test_async_nomock/**/*Tests.js', 'test_async_nomock/**/*.map', 'build', 'dist', 'docs', 'coverage'],
	tests_sync: ['test/**/*.js'],
	tests_async: ['test_async_nomock/**/*Tests.js'],
	tests_all: ['test/**/*.js', 'test_async_nomock/**/*Tests.js']
};


//----------------------------
// CONFIG
//----------------------------
var tsProject = ts.createProject({
	target: "ES5",
	module: "commonjs",
	declaration: false,
	noExternalResolve: false
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
			// theme: "minimal"
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
								.pipe(gulp.dest('.')),
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
						 							timeout: 5000}));
});


// 'Async tests - usually take a tad longer'
gulp.task('test-async', ['build'], function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 60000}));
});


// MANUAL PHANTOM TEST EXECUTION - WORKS
// phantomjs --web-security=false  node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js test_phantomjs/testrunner.html
// mocha-phantomjs --setting webSecurityEnabled=false test_phantomjs/testrunner.html
// COVERAGE TESTS SOURCE COVER
gulp.task('pre-cov-phantom-test', ['bundle'], function () {
	return gulp.src('./build/graphinius.js') // paths.testsources
		// Covering files
		.pipe(istanbul({includeUntested: true}));
    // .pipe(istanbul.hookRequire());
});


gulp.task('test-browser', ['pre-cov-phantom-test'], function () {
	return gulp.src('test_phantomjs/testrunner.html', {read: false})
	.pipe(mochaPhantomJS({
		phantomjs: {
			hooks: 'mocha-phantomjs-istanbul',
		  coverageFile: 'browser_coverage.json',
			settings: {
				webSecurityEnabled: false //,
				// localToRemoteUrlAccessEnabled: false
			}
		},
		reporter: 'spec',
	}))
  .pipe(istanbul.writeReports());
  // .pipe(istanbul.writeReports({
  //   dir: './coverage/browser-tests',
  //   reporters: [ 'json' ],
  //   reportOpts: { dir: './coverage/browser-tests'}
  // }));
});


// COVERAGE TESTS SOURCE COVER
gulp.task('pre-cov-test', ['build'], function () {
	return gulp.src(paths.testsources)
		// Covering files
		.pipe(istanbul())
		// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});


gulp.task('cov-test', ['pre-cov-test'], function () {
	return gulp.src(paths.tests_all, {read: false})
		.pipe(mocha({reporter: 'nyan',
			timeout: 60000}))
		.pipe(istanbul.writeReports());
	// .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })); ;
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