const path = require('path')
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')

const webpackConfig = require('./webpack-base-config')


webpackConfig.entry = {
  'App': [path.resolve(__dirname, 'src/index.js')],
}

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].js',
  // library: '[name]',
  // libraryTarget: 'umd'
}

module.exports = webpackConfig
