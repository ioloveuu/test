var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  // 这是一个插件
  plugins: [
    new webpack.BannerPlugin('This file is created by ioloveuu')
  ]
}