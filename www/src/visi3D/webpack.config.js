

const path = require('path');
const webpack = require('webpack');
const bodyParser = require('body-parser');
 let conf = {
  	entry: './src/libMy/visi3D/index.js',
  	output: {
    	path: path.resolve(__dirname, 'src/libMy/visi3D/'),
		filename: 'visi3D.min.js',
		publicPath: 'src/libMy/visi3D/'
  	},
  	devServer: {       
        overlay: true,        
    },  
	module: {
		rules: [
	      {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        use: {
	          loader: "babel-loader"
	        }
	      }
	    ]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
    ],
	devtool: 'eval-sourcemap'
};

module.exports = conf;

module.exports = (_env, _options) => {

	let production = (_options.mode === 'production');

	conf.devtool = production ? false : 'eval-sourcemap';
	// conf.devtool = production ? 'source-map' : 'eval-sourcemap';

	return conf;
}