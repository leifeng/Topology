const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: ['webpack-dev-server/client?http://localhost:9000/', './index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'topology.js'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  }
};
