var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/app');

module.exports = function makeConfig(cfgEnv) {

  return {
    entry: APP_DIR + '/index.js',
    output: {
      path: BUILD_DIR,
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    module : {
      loaders : [
        {
          test : /\.js?/,
          include : APP_DIR,
          loader : 'babel-loader'
        }
      ]
    }
  };
};