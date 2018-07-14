module.exports = function(config) {
  config.set({
    plugins: [
      "karma-mocha",
      "karma-typescript",
      "karma-chrome-launcher"
    ],
    frameworks: [
      "mocha", 
      "karma-typescript"
    ],
    files: [
      "src/**/*.ts",
      "test/**/*.ts" // *.tsx for React Jsx
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript" // *.tsx for React Jsx
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        allowJs: true,
        "target": "es2017",
        "lib": [
            "es2015",
            "es2016",
            "es2017",
            "dom"
        ],
        "include": [
          "./src/**/*.ts",
          "./test/**/*.ts"
        ]
      },
      bundlerOptions: {
        transforms: [
            require("karma-typescript-es6-transform")()
        ]
      }
    },
    reporters: ["progress", "karma-typescript"],
    browsers: ["Chrome"],
    colors: true,
    logLevel: config.LOG_INFO,
    captureTimeout: 60000,
    singleRun: true
  });
};
