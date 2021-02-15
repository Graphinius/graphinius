/**
 * In case jest --watch hits the OS's file watch limit, run:
 * '''bash
 * echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
 * '''
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  watchPathIgnorePatterns: [
    "/graphinius.d.ts",
    "/coverage",
    "/docs",
    "/data"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.ts",
    "!**/node_modules/**",
  ],
  testMatch: [
    '**/test/**/*.ts'
  ],
  testPathIgnorePatterns: [
    'test_paths.ts',
    'common.ts'
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
