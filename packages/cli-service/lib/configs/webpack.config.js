const path = require('path')
const optimization = require('./optimization')
const wModule = require('./module')
const plugins = require('./plugins')
const entry = require('./entry')

const env = require('./env')
const {
  NODE_ENV,
  isDevelopment,
  isProduction,
  appPath
} = env

module.exports = {
  target: "web",
  devtool: "source-map",
  mode: NODE_ENV,
  entry,
  output: {
    filename: isDevelopment ? "js/[name].bundle.js" : "js/[name].[contentHash:8].js",
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined
  },
  resolve: {
    extensions: [".js", ".css", ".less", ".json"],
    alias: {
      "@": appPath,
    }
  },
  performance: {
    hints: "warning", // "error" or false are valid too
    maxEntrypointSize: 50000, // in bytes, default 250k
    maxAssetSize: 450000, // in bytes
  },
  externals: {
    // jquery: 'jQuery'
  },
  optimization,
  module:wModule,
  plugins
}
