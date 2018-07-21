module.exports = function(config) {
  config.set({
    plugins: [
      "karma-mocha",
      "karma-typescript",
      "karma-chrome-launcher",
      "karma-firefox-launcher"
    ],
    frameworks: [
      "mocha", 
      "karma-typescript"
    ],
    files: [
      "src/**/*.ts",
      "test/test_async/**/*.ts",
      "test/io/input/common.ts"
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript"
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
        ]//,
        // "exclude": [
        //   "./node_modules"
        // ]
      }//,
      // bundlerOptions: {
      //   transforms: [
      //       require("karma-typescript-es6-transform")({
      //         presets: [
      //             ["env", {
      //                 targets: {
      //                     chrome: "67"
      //                 }
      //             }]
      //         ]
      //     })
      //   ]
      // }
    },
    reporters: [
      "progress", 
      "karma-typescript"
    ],
    browsers: [
      // "Firefox"//,
      "Chrome"
    ],
    colors: true,
    logLevel: config.LOG_INFO,
    captureTimeout: 60000,
    processKillTimeout: 60000,
    browserDisconnectTimeout: 60000,
    singleRun: true
  });
};
