const path = require('path')
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')

const webpackConfig = require('./webpack-base-config')

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist/'),
  filename: '[name].js',
  library: 'FlussonicMsePlayer',
  libraryTarget: 'umd',
}

webpackConfig.entry = {
  FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
}

if (process.env.npm_lifecycle_event === 'build-min') {
  webpackConfig.entry = {
    'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  }
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({minimize: true, debug: false}))
} else if (process.env.npm_lifecycle_event === 'build') {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({minimize: false, debug: false}))
} else if (process.env.npm_lifecycle_event !== 'start') {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}))
}

module.exports = webpackConfig
