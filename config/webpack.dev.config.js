const merge = require('webpack-merge')
const base = require('./webpack.base.config.js')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(base, {
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
    compress: true,
    port: 9000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
})
