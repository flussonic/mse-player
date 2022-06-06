const path = require('path');
const webpack = require('webpack');
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
    library: 'FlussonicMsePlayer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    chunkFilename: 'scripts/[name].[hash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
    new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt'),
    new webpack.IgnorePlugin({
      resourceRegExp: /@sentry/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, './node_modules')],
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: { inline: 'fallback', filename: '[name].js' },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    plugins: [new DirectoryNamedWebpackPlugin(true)],
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        sentry: {
          test: /node_modules[\\/]@sentry/,
          name: 'sentry',
          chunks: 'all',
          priority: 1,
        },
        // parseurl: {
        //   test: /node_modules[\\/]parseurl/,
        //   name: 'parseurl',
        //   chunks: 'all',
        //   priority: 1,
        // },
        // commons: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendors',
        //   chunks: 'all',
        // },
        default: {
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
        },
        sourceMap: false,
      }),
    ],
    removeAvailableModules: true,
  },
  devServer: {
    disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
  },
};
