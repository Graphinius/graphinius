const gulp 						= require('gulp');
const clean 					= require('gulp-clean');
const mocha 					= require('gulp-mocha');
const ts 							= require('gulp-typescript');
const tdoc 						= require("gulp-typedoc");
const merge 					= require('merge2');
const webpack 				= require('webpack-stream');
const uglify 					= require('gulp-uglify-es').default;
const pump						= require('pump');
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
	typesources: ['src/**/*.ts'],
	distsources: ['dist/**/*.js'],
	clean: ['src/**/*.js', 'src/**/*.map', 'src/**/*.d.ts', 'test/**/*.js', 'test/**/*.map', 'test/**/*.d.ts', 'test_async/**/*Tests.js', 'test_async/**/*.map', 'build', 'dist/**/*.js', 'docs', 'coverage'],
	tests_core: ['test/core/**/*.ts', 'test/datastructs/**/*.ts', 'test/io/**/*.ts', 'test/mincutmaxflow/**/*.ts', 'test/utils/**/*.ts'],
	tests_search: ['test/search/**/*.ts'],
	tests_async: ['test/test_async/**/*.ts'],
  tests_perturb: ['test/perturbation/**/*.ts'],
	tests_central: ['test/centralities/**/*.ts'],
	tests_eme: ['test/energyminimization/**/*.ts'],
	tests_generators: ['test/generators/**/*.ts'],	
	tests_all: ['test/**/*.ts'],
	git_sources: ['./*', '.gitignore', '.npmignore', '.circleci/*', '!docs', '!node_modules', '!.vscode', '!.idea', '!yarn.lock', '!package-lock.json']
};


//----------------------------
// CONFIG
//----------------------------
var tsProject = ts.createProject('./tsconfig.json');


//----------------------------
// GIT TASKS
//----------------------------

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('git-add', ['bundle'], function () {
	return gulp.src(paths.git_sources)
		.pipe(git.add())
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
	var tsResult = gulp.src(paths.typesources)
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
gulp.task('bundle', ['pack'], cb => {
		pump( [
						gulp.src('build/graphinius.js'),
						uglify(),
						rename('graphinius.min.js'),
						gulp.dest('build')
					],
					cb
		);
});


//----------------------------
// TEST TASKS
//----------------------------

const mocha_options = {
	reporter: 'spec',
	require: ['ts-node/register'],
	timeout: 60000
};


gulp.task('test-core', function () {
	return gulp.src(paths.tests_core, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-async', function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-search', function () {
	return gulp.src(paths.tests_search, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-perturb', function () {
	return gulp.src(paths.tests_perturb, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-central', function () {
    return gulp.src(paths.tests_central, {read: false})
						.pipe(mocha( mocha_options ));
});


gulp.task('test-eme', function () {
	return gulp.src(paths.tests_eme, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-generators', function () {
	return gulp.src(paths.tests_generators, {read: false})
						 .pipe(mocha( mocha_options ));
});


gulp.task('test-all', function () {
	return gulp.src(paths.tests_all, {read: false})
						 .pipe(mocha( mocha_options ));
});


// COVERAGE TESTS SOURCE COVER
gulp.task('pre-cov-test', ['dist'], function () {
	return gulp.src(paths.distsources)
		// Covering files
		.pipe(istanbul())
		// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});


gulp.task('coverage', ['pre-cov-test'], function () {
	return gulp.src(paths.tests_all, {read: false})
		.pipe(mocha( mocha_options ))
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


gulp.task('default', ['watch-all']);
