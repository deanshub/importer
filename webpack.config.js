module.exports = {
	entry: './app/index.js',
	output: {
		path: 'build',
		filename: 'bundle.js',
		publicPath:'build/',
		chunkFilename:'[name].[ext]'
	},
	module: {
		loaders: [
		{ test: /\.css$/, loader: 'style!css' },
		{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&minetype=application/font-woff&name=assets/[name].[ext]' },
		{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&minetype=application/font-woff&name=assets/[name].[ext]' },
		{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&minetype=application/octet-stream&name=assets/[name].[ext]' },
		{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file?name=assets/[name].[ext]' },
		{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&minetype=image/svg+xml&name=assets/[name].[ext]' },
		{ test: /materialize\.js$/,    loader: 'imports?jQuery=jquery&$=jquery&Hammer=hammerjs' },
		{ test: /angular-materialize\.js$/,    loader: 'imports?angular' }
		
		],
		noParse:/browser\.js$/
	}
};