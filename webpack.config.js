const path = require('path')
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')

const webpackConfig = require('./webpack-base-config')


webpackConfig.entry = {
  'FlussonicMsePlayer': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
}

webpackConfig.output = {
  path: path.resolve(__dirname, '../flu/reactapp/lib/'),
  filename: '[name].js',
  library: '[name]',
  libraryTarget: 'umd'
}

if (process.env.npm_lifecycle_event === 'build-min') {
  webpackConfig.entry = {
    'mse-player': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  }
  webpackConfig.output.path = path.resolve(__dirname, 'dist/')
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }))
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
      sourceMap: true,
      comments: false,
      output: {comments: false}
    })
  )
} else if (process.env.npm_lifecycle_event === 'build') {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: false, debug: false }))
} else if (process.env.npm_lifecycle_event !== 'start') {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}))
}

module.exports = webpackConfig
