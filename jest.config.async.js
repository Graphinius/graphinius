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
		"src/**/*.ts",
		"!**/node_modules/**",
		"!**/lib/**",
		"!**/build/**"
	],
	testMatch: [
		'**/test/_async/**/*.ts'
	],
	testPathIgnorePatterns: [
	]
};
