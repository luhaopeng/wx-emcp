const merge = require('webpack-merge')
const base = require('./webpack.base.config.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(base, {
  mode: 'production',
  output: {
    publicPath: '/wxemcp/wx/',
    filename: '[name]_[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
})
