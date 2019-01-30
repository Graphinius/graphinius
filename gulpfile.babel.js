import gulp from 'gulp'
import clean from 'gulp-clean'
import ts from 'gulp-typescript'

// import mocha from 'gulp-mocha'


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
const tsProject = ts.createProject('./tsconfig.json');
const stdOptions = {
	read: false,
	allowEmpty: true
}


//----------------------------
// TASKS
//----------------------------
export const cleanUp = () => gulp.src(paths.clean, stdOptions)
	.pipe(clean());
