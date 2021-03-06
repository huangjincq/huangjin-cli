const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')


const env = require('./env')
const {
  isProduction,
  shouldUseSourceMap,
} = env

module.exports =  {
  splitChunks: {
    cacheGroups: {
      vendor: { // 抽离第三方插件
        test: /node_modules/, // 指定是node_modules下的第三方包
        chunks: "initial",
        name: "vendor", // 打包后的文件名，任意命名
        priority: 10, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
      },
      common: { // 抽离自己写的公共代码，common这个名字可以随意起
        chunks: "all",
        name: "common", // 任意命名
        minSize: 10000, // 只要大小超出设置的这个数值，就生成一个新包
        minChunks: 2,
        priority: 9
      }
    }
  },
  minimizer: [
    // This is only used in production mode
    isProduction && new TerserWebpackPlugin({
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: shouldUseSourceMap,
    }),
    // This is only used in production mode
    isProduction && new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: shouldUseSourceMap
          ? {
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            }
          : false,
      },
    }),
  ].filter(Boolean)
}
