const merge = require('webpack-merge')
const prod = require('./webpack.prod.config.js')
const webpack = require('webpack')

module.exports = merge(prod, {
  output: {
    publicPath: '/wxemcp/haina/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('haina')
    })
  ]
})
