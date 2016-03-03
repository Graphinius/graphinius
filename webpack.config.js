module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/build/',
    filename: 'graphinius.js'
  },
  target: "web",
  module: {
    loaders: [
      // { test: /\.css$/, loader: 'style!css!' },
      {
        test: /\.json$/,
        loader: 'json!'
      }
    ]
  },
  node: {
    fs: "empty",
    request: "empty",
    net: "empty",
    tls: "empty"
  }
};
