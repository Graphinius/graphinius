import gulp from 'gulp'
import clean from 'gulp-clean'
import ts from 'gulp-typescript'
import typedoc from 'gulp-typedoc'
import merge from 'merge2'
import mocha from 'gulp-mocha'


//----------------------------
// PATHS
//----------------------------
const paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async/**/*.ts'],
	typesources: ['src/**/*.ts'],
	typedoc_ignore: ['**/node_modules/**/*', '**/typings/**/*'],
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
const tsProject = ts.createProject('./tsconfig.json');
const stdOptions = {
	read: false,
	allowEmpty: true
}

//----------------------------
// TASKS
//----------------------------
export const cleanTask = () => gulp.src(paths.clean, stdOptions)
	.pipe(clean());


const createDoc = () => {
	return gulp.src(paths.typesources)
		.pipe(typedoc({
			module: "commonjs",
			target: "es6",
			includeDeclarations: false,
			exclude: gulp.src(paths.typedoc_ignore, stdOptions),
			mode: 'file',
			excludeExternals: true,
			excludeNotExported: true,
			excludePrivate: true,
			out: 'docs/'
		})
	);
}

// Documentation (type doc)
export const docTask = gulp.series(cleanTask, createDoc)


// Packaging - Node / Commonjs
const dist = () => {
	var tsResult = gulp.src(paths.typesources)
						 				 .pipe(tsProject());
	// Merge the two output streams, so this task is finished
	// when the IO of both operations are done.
	return merge([
		tsResult.dts //.pipe(concat('graphinius.d.ts'))
								.pipe(gulp.dest('./dist/')),
		tsResult.js.pipe(gulp.dest('./dist/'))
	]);
}

export const distTask = gulp.series( cleanTask, dist )


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


gulp.task('test-all', function () {
	return gulp.src(paths.tests_all, {read: false})
						 .pipe(mocha( mocha_options ));
});