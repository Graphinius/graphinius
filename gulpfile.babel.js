import gulp from 'gulp'
import gulpClean from 'gulp-clean'
import ts from 'gulp-typescript'
import typedoc from 'gulp-typedoc'
import merge from 'merge2'
import mocha from 'gulp-mocha'
import dtsGen from 'dts-generator'
import webpack from 'webpack-stream'


//----------------------------
// PATHS
//----------------------------
const paths = {
	typescripts: ['src/**/*.ts', 'test/**/*.ts', 'test_async/**/*.ts'],
	typesources: ['src/**/*.ts'],
	// distsources: ['dist/**/*.js'], // Used for coverage tests... NAH... rewrite!!
	clean_build: ['build'],
	clean_docs: ['docs'],
	clean_dist: ['dist'],
	clean_dts: ['./graphinius.d.ts'],
	clean_all: ['build', 'dist', 'docs', 'coverage', 'graphinius.d.ts'],
	tests_core: ['test/core/**/*.ts', 'test/datastructs/**/*.ts', 'test/io/**/*.ts', 'test/utils/**/*.ts'],
	tests_search: ['test/search/**/*.ts'],
	tests_async: ['test/test_async/**/*.ts'],
  tests_perturb: ['test/perturbation/**/*.ts'],
	tests_central: ['test/centralities/**/*.ts'],
	tests_eme: ['test/mincutmaxflow/**/*.ts', 'test/energyminimization/**/*.ts'],
	tests_generators: ['test/generators/**/*.ts'],	
	tests_all: ['test/**/*.ts']
}


//----------------------------
// CONFIG
//----------------------------
const tsProject = ts.createProject('./tsconfig.json')
const src_options = {
	read: false,
	allowEmpty: true
}


//----------------------------
// TEST CONFIG
//----------------------------
const mocha_options = {
	reporter: 'spec',
	require: ['ts-node/register'],
	timeout: 60000
}
const mochaRun = mocha(mocha_options)


// CLEAN
const cleanBuild = () => gulp.src(paths.clean_build, src_options).pipe(gulpClean())
const cleanDist = () => gulp.src(paths.clean_dist, src_options).pipe(gulpClean())
const cleanDocs = () => gulp.src(paths.clean_docs, src_options).pipe(gulpClean())
const cleanDts = () => gulp.src(paths.clean_dts, src_options).pipe(gulpClean())
const cleanAll = () => gulp.src(paths.clean_all, src_options).pipe(gulpClean())


// DIST
const compileDist = () => {
	var tsResult = gulp.src(paths.typesources)
						 				 .pipe(tsProject());
	// Merge the two output streams, so this task is finished
	// when the IO of both operations are done.
	return merge([
		tsResult.dts //.pipe(concat('graphinius.d.ts'))
								.pipe(gulp.dest('./dist/')),
		tsResult.js.pipe(gulp.dest('./dist/'))
	])
}


// DOCS
const createDoc = () => {
	return gulp.src(paths.typesources)
		.pipe(typedoc({
			module: "commonjs",
			target: "es6",
			includeDeclarations: false,
			// exclude: gulp.src(paths.typedoc_ignore, stdOptions),
			mode: 'file',
			excludeExternals: true,
			excludeNotExported: true,
			excludePrivate: true,
			out: 'docs/'
		})
	)
}


// d.ts HEADERS
const generateDts = () => dtsGen({
		name: 'graphinius',
		baseDir: './',
		project: './src/',
		out: 'graphinius.d.ts'
})


// PACK
const generatePackage = () => gulp.src('./index.js')
	.pipe(webpack(require('./webpack.config.js')))
	.pipe(gulp.dest('build/'))



//----------------------------
// BUILD TASKS
//----------------------------

export const clean = cleanAll

export const docs = gulp.series(cleanDocs, createDoc)

export const dist = gulp.series(cleanDist, compileDist)

export const dts = gulp.series(cleanDts, generateDts)

export const bundle = gulp.series(cleanBuild, dist, docs, dts, generatePackage)


//----------------------------
// TEST TASKS => CONVERTING ALL TEST CASES TO JEST !!!
//----------------------------
