module.exports = {
	preset: 'ts-jest',

	testEnvironment: 'node',
	verbose: true,
	watchPathIgnorePatterns: [
		"/graphinius.d.ts",
		"/build",
		"/coverage",
		"/docs",
		"/lib",
		"/data"
	],
	collectCoverage: false,
	collectCoverageFrom: [
		"lib/**/*.ts",
		"!**/node_modules/**"
	],
	testMatch: [
		'**/test/_async/**/*.ts'
	],
	testPathIgnorePatterns: [
	]
};
