const fs = require('fs') // Load the filesystem module

const DELAY_WRITE_FILE = 1000 // 延遲判斷輸出檔案

class webpackBuildVersionFile {
  /**
   * 建構子
   * @param {Object} config 設定
   * @param {String} config.input 來源檔名(完整路徑)
   * @param {String} config.output 輸出檔名(完整路徑)
   * @param {Number} config.delay 延遲
   */
  constructor (config) {
    Object.assign(this, config)
  }

  // Configure your plugin with options...
  apply (compiler) {
    const delay = this.delay ? this.delay : DELAY_WRITE_FILE

    compiler.plugin('done', stats => {
      setTimeout(() => {
        console.log(`The version file is build after waiting ${delay}ms.`)
      }, 100)
      setTimeout(() => {
        const myStats = fs.statSync(this.input)
        if (!myStats) { return }
        const fileSizeInBytes = myStats.size
        const arrPath = this.input.split('/')
        const fileName = arrPath.pop()

        let jsonContent = {
          version: new Date().toISOString(8).replace(/[-:.]/g, ''),
          parting: {
            size: fileSizeInBytes,
            files: [
              {
                name: fileName,
                size: fileSizeInBytes
              }
            ]
          }
        }
        fs.writeFile(this.output, JSON.stringify(jsonContent), err => {
          console.log(err || `The version file is build success.`)
        })
      }, delay)
    })
  }
};

module.exports = webpackBuildVersionFile
