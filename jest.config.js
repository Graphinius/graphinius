module.exports = {
  "verbose": true,
  "collectCoverage": true,
  "roots": [
    "./src"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testMatch": [
    "**/test/**/*.{js,ts}",
    "**/?(*.)(spec|test).{js,ts}"
  ],
  "moduleFileExtensions": [
    "ts",
    "js",
    "json",
    "node"
  ],
}
