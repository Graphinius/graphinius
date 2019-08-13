const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
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
			path.join(__dirname, 'node_modules'),
			path.join(__dirname, 'src'),
			path.join(__dirname, 'node_modules/har-validator/lib/schemas/')
		],
		extensions: ['*', '.js', 'json']
	},
	plugins: [],
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: true
				}
			})
		]
	}
};

