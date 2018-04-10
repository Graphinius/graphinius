const gulp 						= require('gulp');
const clean 					= require('gulp-clean');
const mocha 					= require('gulp-mocha');
const ts 							= require('gulp-typescript');
const tdoc 						= require("gulp-typedoc");
const concat					= require('gulp-concat');
const merge 					= require('merge2');
const webpack 				= require('webpack-stream');
const uglify 					= require('gulp-uglify');
const rename 					= require('gulp-rename');
const istanbul 				= require('gulp-istanbul');
const git 						= require('gulp-git');
const prompt	 				= require('gulp-prompt');
const dtsGen					= require('dts-generator').default;


//----------------------------gulp
// PATHS
//----------------------------
const paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async/**/*.ts'],
	testsources: ['src/**/*.js'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'src/**/*.map', 'src/**/*.d.ts', 'test/**/*.js', 'test/**/*.map', 'test_async/**/*Tests.js', 'test_async/**/*.map', 'build', 'dist/**/*.js', 'docs', 'coverage'],
	tests_core: ['test/core/**/*.js', 'test/datastructs/**/*.js', 'test/io/**/*.js', 'test/mincutmaxflow/**/*.js', 'test/utils/**/*.js'],
	tests_search: ['test/search/**/*.js'],
	tests_async: ['test/test_async/**/*.js'],
  	tests_perturb: ['test/perturbation/**/*.js'],
	tests_central: ['test/centralities/**/*.js'],
	tests_eme: ['test/energyminimization/**/*.js'],
	tests_generators: ['test/generators/**/*.js'],	
	tests_all: ['test/**/*.js'],
	git_sources: ['./*', '.gitignore', '.npmignore', '.circleci/*', '!docs', '!node_modules', '!.vscode', '!.idea', '!yarn.lock', '!package-lock.json']
};


//----------------------------
// CONFIG
//----------------------------
var tsProject = ts.createProject({
	target: "ES5",
	lib: [
		"es2017",
		"dom"
	],
	// module: "commonjs",
	// declaration: false,
  // removeComments: true
});


//----------------------------
// GIT TASKS
//----------------------------

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('git-add', ['bundle'], function () {
  return gulp.src(paths.git_sources)
    .pipe(git.add({args: '-u'}));
});

// Run git commit
// src are the files to commit (or ./*)
gulp.task('git-commit', ['git-add'], function () {
	gulp.src(paths.git_sources)
		.pipe(prompt.prompt({
        type: 'input',
        name: 'commit_msg',
        message: 'Commit message? \n'
    }, function(res){
        //value is in res.task (the name option gives the key)
				return gulp.src(paths.git_sources)
				  .pipe(git.commit(res.commit_msg));
    }));
});



//----------------------------
// TASKS
//----------------------------
gulp.task('clean', function () {
	return gulp.src(paths.clean, {read: false})
						 .pipe(clean());
});


gulp.task('build', ['clean'], function () {
	return gulp.src(paths.typescripts, {base: "."})
						 .pipe(tsProject())
						 .pipe(gulp.dest('.'));
});


// Documentation (type doc)
gulp.task("tdoc", ['clean'], function() {
	return gulp
		.src(paths.typesources)
		.pipe(tdoc({
			module: "commonjs",
			target: "es2017",
			out: "docs/",
			name: "GraphiniusJS"//,
			//theme: "minimal"
		}));
});


// Packaging - Node / Commonjs
gulp.task('dist', ['clean'], function () {
	var tsResult = gulp.src(paths.distsources)
						 				 .pipe(tsProject());
	// Merge the two output streams, so this task is finished
	// when the IO of both operations are done.
	return merge([
		tsResult.dts //.pipe(concat('graphinius.d.ts'))
								.pipe(gulp.dest('./dist/')),
		tsResult.js.pipe(gulp.dest('./dist/'))
	]);
});


gulp.task('dts', ['dist'], function() {
	return dtsGen({
		name: 'graphinius',
		baseDir: './',
		project: './src/',
		out: 'graphinius.d.ts'
	});
});


// Packaging - Webpack
gulp.task('pack', ['dts'], function() {
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
gulp.task('test-core', ['build'], function () {
	return gulp.src(paths.tests_core, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'Async tests - usually take a tad longer'
gulp.task('test-async', ['build'], function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 6000}));
});


// 'Search tests - include Floyd Warshal and shortest paths'
gulp.task('test-search', ['build'], function () {
	return gulp.src(paths.tests_search, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'Perturbation tests - usually take a tad longer'
gulp.task('test-perturb', ['build'], function () {
	return gulp.src(paths.tests_perturb, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});

// 'Centrality tests'
gulp.task('test-central', ['build'], function () {
    return gulp.src(paths.tests_central, {read: false})
						.pipe(mocha({reporter: 'spec',
												 timeout: 600000}));
});

// 'Boykov Energyminimization tests - including mincutmaxflow'
gulp.task('test-eme', ['build'], function () {
	return gulp.src(paths.tests_eme, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});

// 'Generators tests'
gulp.task('test-generators', ['build'], function () {
	return gulp.src(paths.tests_generators, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'ALL tests '
gulp.task('test-all', ['build'], function () {
	return gulp.src(paths.tests_all, {read: false})
						 .pipe(mocha({reporter: 'spec',
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
		.pipe(mocha({reporter: 'spec',
			timeout: 600000}))
		// .pipe(istanbul.writeReports({
		// 	dir: './coverage/node-tests',
		// 	reporters: [ 'json' ],
		// 	reportOpts: { dir: './coverage/node-tests'}
		// }));
		.pipe(istanbul.writeReports());
		// .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});


//----------------------------
// WATCH TASKS
//----------------------------
gulp.task('watch-core', function () {
	gulp.watch(paths.typescripts, ['test-core']);
});


gulp.task('watch-async', function () {
	gulp.watch(paths.typescripts, ['test-async']);
});


gulp.task('watch-search', function () {
	gulp.watch(paths.typescripts, ['test-search']);
});


gulp.task('watch-perturb', function () {
	gulp.watch(paths.typescripts, ['test-perturb']);
});


gulp.task('watch-central', function () {
	gulp.watch(paths.typescripts, ['test-central']);
});


gulp.task('watch-all', function () {
	gulp.watch(paths.typescripts, ['test-all']);
});


gulp.task('default', ['watch-core']);
