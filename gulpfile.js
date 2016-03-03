var gulp 				= require('gulp');
var clean 			= require('gulp-clean');
var mocha 			= require('gulp-mocha');
var ts 					= require('gulp-typescript');
var tdoc 				= require("gulp-typedoc");
var browserify 	= require('gulp-browserify');
var concat			= require('gulp-concat');
var merge 			= require('merge2');
var webpack 		= require('webpack-stream');



//----------------------------
// PATHS
//----------------------------
var paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async_nomock/**/*.ts'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'test/**/*.js', 'test_async_nomock/**/*Tests.js', 'build', 'dist', 'docs'],
	tests: ['test/**/*.js'],
	tests_async: ['test_async_nomock/**/*Tests.js']
};

var tsProject = ts.createProject({
	target: "ES5",
	module: "commonjs",
	declaration: false,
	noExternalResolve: false
});

//----------------------------
// TASKS
//----------------------------
gulp.task('build', function () {
	return gulp.src(paths.typescripts, {base: "."})
						 .pipe(ts(tsProject))
						 .pipe(gulp.dest('.'));
});

// Packaging - Node / Commonjs
gulp.task('dist', ['tdoc'], function () {
	var tsResult = gulp.src(paths.distsources)
						 				 .pipe(ts(tsProject))

	// Merge the two output streams, so this task is finished
	// when the IO of both operations are done.
	return merge([
		tsResult.dts//.pipe(concat('graphinius.d.ts'))
								.pipe(gulp.dest('.')),
		tsResult.js.pipe(gulp.dest('./dist/'))
	]);
});

// Packaging - Browser
gulp.task('browserify', ['dist'], function() {
	// Single entry point to browserify
	gulp.src('./index.js')
		.pipe(browserify({
		  insertGlobals : false
		}))
		.pipe(gulp.dest('./build/graphinius'))
});

// Packaging - Webpack
gulp.task('pack', ['dist'], function() {
	return gulp.src('src/entry.js')
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(gulp.dest('dist/'));
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
			}))
	;
});

gulp.task('test', ['build'], function () {
	return gulp.src(paths.tests, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 5000}));
});

gulp.task('test-async', ['build'], function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 5000}));
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
