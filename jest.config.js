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
  collectCoverage: false,

  // collectCoverageFrom: [
  //   "**/*.{ts}",
  //   "!**/node_modules/**",
  //   "!**/vendor/**"
  // ]
};
