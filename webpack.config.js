var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/build/',
    filename: 'graphinius.js'
  },
  mode: 'production',
  target: "web",
  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json!'
      }
    ]
  },
  node: {
    fs: "empty",
    http: "empty",
    net: "empty",
    tls: "empty"
  },
  resolve: {
    modules: [
      path.join( __dirname, 'node_modules' ),
      path.join( __dirname, 'src' ),
      path.join( __dirname, 'node_modules/har-validator/lib/schemas/')
    ],
    extensions: ['*', '.js', 'json']
  }
};
