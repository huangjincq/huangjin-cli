const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./configs/webpack.config')
const webpackDevServerConfig = require('./configs/webpackDevServer.config')
const PORT = require('./configs/env').PORT

const formatMessages = require('webpack-format-messages')
const chalk = require('chalk')

module.exports = class Service {
  constructor (context, { plugins, pkg, inlineOptions, useBuiltIn } = {}) {
  }

  async run (name, args = {}, rawArgv = []) {
    if (name !== 'build') {
      const compiler = webpack(webpackConfig)
      const server = new WebpackDevServer(compiler, webpackDevServerConfig)

      server.listen(PORT, function () {
        console.log('Example app listening on port 9001!\n')
      });

      ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig, function () {
          server.close()
          process.exit()
        })
      })
    } else {
      build()
    }
  }
}

function build () {
  const complier = webpack(webpackConfig)
  complier.run((err, stats) => {
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
