const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default

module.exports = {
  entry: [
    './client/index.js',
    './client/styles/main.scss'
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'bundle.js'
    }),
    new HTMLInlineCSSWebpackPlugin()
  ],
  resolve: {
    modules: [
      'node_modules',
      'client'
    ],
    extensions: ['.js', '.css', '.scss', '.sass']
  }
}