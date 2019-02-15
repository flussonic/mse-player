const path = require('path')
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = require('./webpack-base-config')

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist/'),
  filename: '[name].js',
  library: 'FlussonicMsePlayer',
  libraryTarget: 'umd',
}

webpackConfig.entry = {
  FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
}

if (process.env.npm_lifecycle_event === 'build-min') {
  webpackConfig.entry = {
    'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  }
  // webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({minimize: true, debug: false}))
  // webpackConfig.plugins.push(
  //   // new webpack.optimization.minimize({
  //   //   compress: {
  //   //     warnings: false
  //   //   },
  //   //   mangle: true,
  //   //   sourceMap: true,
  //   //   comments: false,
  //   //   output: {comments: false}
  //   // })
  //   new HtmlWebpackPlugin({
  //     inject: true,
  //     template: '',
  //     minify: {
  //       removeComments: true,
  //       collapseWhitespace: true,
  //       preserveLineBreaks: true,
  //       removeRedundantAttributes: true,
  //       useShortDoctype: true,
  //       removeEmptyAttributes: true,
  //       removeStyleLinkTypeAttributes: true,
  //       keepClosingSlash: true,
  //       minifyJS: true,
  //       minifyCSS: true,
  //       minifyURLs: true,
  //     },
  //   })
  // )
  webpackConfig.plugins.push(
    new UglifyJsPlugin({
      include: /\/includes/,
      cache: true,
      parallel: true,
      uglifyOptions: {
        ecma: 6,
        mangle: true,
        compress: {
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebookincubator/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          pure_getters: true,
          unused: true,
          dead_code: true, // big one--strip code that will never execute
          warnings: false, // good for prod apps so users can't peek behind curtain
          drop_debugger: true,
          conditionals: true,
          evaluate: true,
          drop_console: true, // strips console statements
          sequences: true,
          booleans: true,
        },
      },
      // output: {
      //   comments: false,
      //   // Turned on because emoji and regex is not minified properly using default
      //   // https://github.com/facebookincubator/create-react-app/issues/2488
      //   ascii_only: true,
      // },
      sourceMap: false,
    })
  )
  console.log('minify')
} else if (process.env.npm_lifecycle_event === 'build') {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({minimize: false, debug: false}))
} else if (process.env.npm_lifecycle_event !== 'start') {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}))
}

module.exports = webpackConfig
