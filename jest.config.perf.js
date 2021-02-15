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
		"!**/node_modules/**",
	],
	testMatch: [
		'**/test/_performance/**/*.ts'
	],
  moduleDirectories: [
    "node_modules", "lib"
  ],
  moduleFileExtensions: [
    "js",
    "ts"
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/lib/$1",
    "_/(.*)": "<rootDir>/test/$1",
    "#/(.*)": "<rootDir>/$1",
  }
};
