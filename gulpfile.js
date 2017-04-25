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


//----------------------------
// PATHS
//----------------------------
const paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async/**/*.ts'],
	testsources: ['src/**/*.js'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'src/**/*.map', 'test/**/*.js', 'test/**/*.map', 'test_async/**/*Tests.js', 'test_async/**/*.map', 'build', 'dist', 'docs', 'coverage'], 
	tests_basic: ['test/core/**/*.js', 'test/datastructs/**/*.js', 'test/io/**/*.js', 'test/search/**/*.js', 'test/utils/**/*.js', 'test/centralities/**/*.js'],
	tests_async: ['test/test_async/**/*.js'],
	tests_eme: ['test/mincutmaxflow/**/*.js', 'test/energyminimization/**/*.js'],
	tests_perturb: ['test/perturbation/**/*.js'],
	tests_all: ['test/**/*.js'],
	git_sources: ['./*', '!node_modules', '!.vscode', '!.idea', '!yarn.lock']
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
// GIT TASKS
//----------------------------

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('git-add', ['bundle'], function () {
  return gulp.src(paths.git_sources)
    .pipe(git.add());
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


// Run git push
// remote is the remote repo
// branch is the remote branch to push to
gulp.task('git-submit', function () {
	gulp.src(paths.git_sources)
		.pipe(prompt.prompt({
        type: 'input',
        name: 'submit_branch',
        message: 'Branch to submit to? \n'
    }, function(res){
        //value is in res.task (the name option gives the key)
				git.push('origin', res.submit_branch, function (err) {
					if (err) throw err;
				})
    }));
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
		tsResult.dts //.pipe(concat('graphinius.d.ts'))
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
gulp.task('test-basic', ['build'], function () {
	return gulp.src(paths.tests_basic, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'Async tests - usually take a tad longer'
gulp.task('test-async', ['build'], function () {
	return gulp.src(paths.tests_async, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'Perturbation tests - usually take a tad longer'
gulp.task('test-perturb', ['build'], function () {
	return gulp.src(paths.tests_perturb, {read: false})
						 .pipe(mocha({reporter: 'spec',
						 							timeout: 60000}));
});


// 'Boykov Energyminimization tests - including mincutmaxflow'
gulp.task('test-eme', ['build'], function () {
	return gulp.src(paths.tests_eme, {read: false})
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


//----------------------------
// WATCH TASKS
//----------------------------
gulp.task('watch-basic', function () {
	gulp.watch(paths.typescripts, ['test-basic']);
});


gulp.task('watch-async', function () {
	gulp.watch(paths.typescripts, ['test-async']);
});


gulp.task('watch-perturb', function () {
	gulp.watch(paths.typescripts, ['test-perturb']);
});


gulp.task('watch-all', function () {
	gulp.watch(paths.typescripts, ['test-all']);
});


gulp.task('default', ['watch-basic']);
