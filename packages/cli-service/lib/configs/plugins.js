const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
const entry = require('./entry')


const env = require('./env')
const {
  isProduction,
  isDevelopment,
  appPath,
  isBundleAnalyze
} = env


const plugins = [
  isProduction && new CleanWebpackPlugin(),
  new ProgressBarPlugin({
    summary: isDevelopment
  }),
  isDevelopment && new webpack.HotModuleReplacementPlugin(),
  isProduction && new MiniCssExtractPlugin({
    filename: 'css/[name].[contentHash:8].css',
    chunkFilename: 'css/[id].[contentHash:8].css'
  }),
  isProduction && isBundleAnalyze && new BundleAnalyzerPlugin()
].filter(Boolean)

function getHtmlWebpackPluginConfigs () {
  const res = []
  for (let [entryName, entryPath] of Object.entries(entry)) {
    const htmlFilePath = `${appPath}/pages/${entryName}/index.html`
    if (!fs.existsSync(htmlFilePath)) {
      throw new Error(`file: ${htmlFilePath} not exist`)
    }
    const plugin = new HtmlWebpackPlugin({
      template: htmlFilePath,
      filename: `${entryName}.html`,
      chunks: ['vendor', 'common', entryName],
      ...isProduction ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      } : {}
    })
    res.push(plugin)
  }
  return res
}

module.exports = [...plugins, ...getHtmlWebpackPluginConfigs()]
