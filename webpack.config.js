const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/build/',
    filename: 'graphinius.min.js'
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
    tls: "empty",
    url: "empty"
  },
  resolve: {
    modules: [
      path.join( __dirname, 'node_modules' ),
      path.join( __dirname, 'src' ),
      path.join( __dirname, 'node_modules/har-validator/lib/schemas/')
    ],
    extensions: ['*', '.js', 'json']
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ],
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         warnings: false,
  //         parse: {
  //           html5_comments: false
  //         },
  //         compress: {
  //           drop_console: true,
  //           drop_debugger: true,
  //         },
  //         mangle: true,
  //         keep_fnames: false,
  //         ie8: false,
  //         toplevel: false,
  //         output: null
  //       }
  //     })
  //   ]
  // }
}
