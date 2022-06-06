const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

const port = 8090;

module.exports = {
  node: { Buffer: false, global: true, process: true, setImmediate: false },
  entry: {
    index: [path.resolve(__dirname, 'src/demo/index.js')],
    FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  },
  output: {         
    path: path.resolve(__dirname, 'dist/'),
    chunkFilename: 'scripts/[name].[hash].js',
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
        // core_js: {
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
  resolve: {
    modules: ['node_modules'],
    plugins: [new DirectoryNamedWebpackPlugin(true)],
  },
  devServer: {
    host: '0.0.0.0',
    port,
  },
};
