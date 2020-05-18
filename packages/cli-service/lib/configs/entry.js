const path = require('path')
const glob = require('glob')
const env = require('./env')
const {
  appPath
} = env

function getEntry () {
  let entry = {}
  glob.sync(path.resolve(appPath, 'pages/**/index.js')).forEach(function (fileDir) {
    let pathObj = path.parse(fileDir)
    let entryName = pathObj.dir.match(/\/\w+$/g)[0].split('/')[1] // 用文件夹名字作为入口名。
    entry[entryName] = fileDir
  })
  return entry
}

module.exports = getEntry()

