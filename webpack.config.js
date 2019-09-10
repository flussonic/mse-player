const path = require('path')
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebPackPlugin = require("html-webpack-plugin");

var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

module.exports = {
  mode: 'production',
  node: {Buffer: false, global: true, process: true, setImmediate: false},
  entry: {
    FlussonicMsePlayer: [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
    'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    library: 'FlussonicMsePlayer',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    }),
    new HtmlWebPackPlugin({
      template: "./src/demo/index.html",
      filename: "./index.html"
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, './node_modules')]
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
    ]
  },
  resolve: {
    modules: ['node_modules'],
    plugins: [
      new DirectoryNamedWebpackPlugin(true)
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          mangle: true
        },
        sourceMap: false
      })
    ]
  },
  devServer: {
    disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
  }
}

if (process.env.npm_lifecycle_event === 'build-min') {
  module.exports.entry = {
    'FlussonicMsePlayer.min': [path.resolve(__dirname, 'src/FlussonicMsePlayer.js')],
  }
  module.exports.plugins.push(new webpack.LoaderOptionsPlugin({minimize: true, debug: false}))
} else if (process.env.npm_lifecycle_event === 'build') {
  module.exports.plugins.push(new webpack.LoaderOptionsPlugin({minimize: false, debug: false}))
} else if (process.env.npm_lifecycle_event !== 'start') {
  module.exports.plugins.push(new Clean(['dist'], {verbose: false}))
}
