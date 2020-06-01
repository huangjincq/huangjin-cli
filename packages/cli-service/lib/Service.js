const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./configs/webpack.config')
const webpackDevServerConfig = require('./configs/webpackDevServer.config')
const express = require('express')
const DIST_PORT = 3000
const PORT = require('./configs/env').PORT
const merge = require('webpack-merge')
const proxy = require('http-proxy-middleware')

const appConfigPath = path.join(process.cwd(), './app.config.js')
let customConfig = {
  webpackConfig: {},
  devConfig: {}
}

if (fs.existsSync(appConfigPath)) {
  customConfig = require(appConfigPath)
}

const formatMessages = require('webpack-format-messages')
const chalk = require('chalk')


module.exports = class Service {
  constructor (context, { plugins, pkg, inlineOptions, useBuiltIn } = {}) {
  }

  async run (name, args = {}, rawArgv = []) {
    switch (name) {
      case 'serve':
        serve()
        break
      case 'build':
        build()
        break
      case 'distServe':
        distServe()
        break
      default:
    }
  }
}


function serve () {
  const compiler = webpack(merge(webpackConfig, customConfig.webpackConfig))
  const server = new WebpackDevServer(compiler, Object.assign(webpackDevServerConfig, customConfig.devConfig))

  server.listen(PORT, function () {
    console.log('Example app listening on port 9001!\n')
  });

  ['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
      server.close()
      process.exit()
    })
  })
}

function build () {
  const compiler = webpack(merge(webpackConfig, customConfig.webpackConfig))
  compiler.run((err, stats) => {
    let messages
    if (err) {
      messages = formatMessages({
        errors: [err.message],
        warnings: []
      })
    } else {
      messages = formatMessages(stats)
    }
    if (stats.hasErrors()) {
      if (messages.errors.length) {
        console.log(chalk.red('Failed to compile.\n'))
        messages.errors.forEach(e => console.log(e))
        return
      }
      process.exit(1)
    }

    if (stats.hasWarnings()) {
      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        messages.warnings.forEach(w => console.log(w))
      }
    }
    let buildCoastTime = (stats.endTime - stats.startTime) / 1000
    buildCoastTime = buildCoastTime.toFixed(2)

    console.log(chalk.blue(
      `build completed in ${buildCoastTime}s\n`
    ))

  })
}

function distServe () {
  const app = express()
  app.use(express.static(path.join(process.cwd(), './dist')))
  if (customConfig.devConfig && customConfig.devConfig.proxy) {
    loopProxy(app, customConfig.devConfig.proxy)
  }
  app.listen(DIST_PORT, () => {
    console.log('Example app listening at http://localhost:' + DIST_PORT)
  })
}

// 循环代理
function loopProxy (app, proxyMap) {
  Object.entries(proxyMap).forEach(([key, value], index) => {
    app.use(key, proxy(value));
  })
}