const path = require('path');
const webpack = require('webpack');
// const Clean = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

module.exports = {
  mode: 'production',
  node: { Buffer: false, global: true, process: true, setImmediate: false },
  entry: {
    FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
    'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].sentry.js',
    library: 'FlussonicMsePlayer',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
    new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, './node_modules')],
      },
      { test: /\.worker\.js$/, loader: 'worker-loader', options: { inline: 'fallback', filename: '[name].js' } },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    plugins: [new DirectoryNamedWebpackPlugin(true)],
  },
  optimization: {
    // minimize: true,
    // minimizer: [
    //   new UglifyJsPlugin({
    //     include: /\.min\.js$/,
    //     cache: true,
    //     parallel: 4,
    //     uglifyOptions: {
    //       compress: true,
    //       ecma: 5,
    //       mangle: true,
    //     },
    //     sourceMap: false,
    //   }),
    // ],
    minimize: true,
    // runtimeChunk: true,
    // splitChunks: {
    //   chunks: 'async',
    //   minSize: 1000,
    //   minChunks: 2,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: true,
    //   cacheGroups: {
    //     default: {
    //       minChunks: 1,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //     },
    //   },
    // },
  },
  devServer: {
    disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
  },
};
