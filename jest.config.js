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
    '**/test/**/*.ts'
  ],
  testPathIgnorePatterns: [
    '_async',
    '_performance',
    'test_paths.ts',
    'common.ts'
  ]
};
