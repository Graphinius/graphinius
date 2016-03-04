var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/build/',
    filename: 'graphinius.js'
  },
  target: "web",
  module: {
    loaders: [
      // {
      //   test: /\.css$/,
      //   loader: 'style!css!'
      // },
      {
        test: /\.json$/,
        loader: 'json!'
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
    root: [
      path.join( __dirname, 'node_modules' ),
      path.join( __dirname, 'src' ),
      path.join( __dirname, 'node_modules/har-validator/lib/schemas/')
    ],
    extensions: [ '', '.js', 'json']
  }
};
