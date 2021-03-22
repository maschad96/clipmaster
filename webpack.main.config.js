module.exports = {
	/**
	 * This is the main entry point for your application, it's the first file
	 * that runs in the main process.
	 */
	entry: './src/index.ts',
	// Put your normal webpack config below here
	module: {
		rules: require('./webpack.rules'),
	},
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
	},
	externals: {
		// Possible drivers for knex - we'll ignore them
		// comment the one YOU WANT to use
		sqlite3: 'sqlite3',
		knex: 'commonjs knex',
	},
};
