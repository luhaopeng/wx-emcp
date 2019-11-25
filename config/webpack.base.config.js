const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, '../'),
  entry: {
    main: path.resolve(__dirname, '../src/index.js'),
    redirect: path.resolve(__dirname, '../src/redirect.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, '../static/favicon.ico'),
      template: path.resolve(__dirname, '../static/template.html'),
      excludeChunks: ['redirect']
    }),
    new HtmlWebpackPlugin({
      filename: 'redirect.html',
      favicon: path.resolve(__dirname, '../static/favicon.ico'),
      template: path.resolve(__dirname, '../static/template-redirect.html'),
      excludeChunks: ['main']
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
}
