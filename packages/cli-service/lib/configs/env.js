const path = require('path')
const NODE_ENV = 'development'
const BUNDLE_ANNALYZE = ''
module.exports = {
  NODE_ENV: 'development',
  BUNDLE_ANNALYZE: BUNDLE_ANNALYZE,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  shouldUseSourceMap: true,
  PORT: process.env.port || 9001,
  PROTOCOL: process.env.HTTPS === 'true' ? 'https' : 'http',
  HOST: '127.0.0.1',
  appPath: path.join(process.cwd(), './src'),
  isBundleAnalyze: BUNDLE_ANNALYZE === 'analyze'
}
