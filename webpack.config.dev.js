const path = require('path');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

const port = 8090;

module.exports = {
  node: { Buffer: false, global: true, process: true, setImmediate: false },
  entry: {
    index: [path.resolve(__dirname, 'src/demo/index.js')],
    FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    library: 'FlussonicMsePlayer',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
    new HtmlWebPackPlugin({
      template: './src/demo/index.html',
      filename: './index.html',
      inject: 'head',
    }),
    new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          inline: 'fallback',
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    plugins: [new DirectoryNamedWebpackPlugin(true)],
  },
  devServer: {
    host: '0.0.0.0',
    port,
  },
};
