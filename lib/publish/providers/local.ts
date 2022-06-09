import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
import mkdirp from 'mkdirp'

const { serverRuntimeConfig: { uploadDir } } = getConfig()

const local = {
  provider: 'local',
  name: 'Local Storage',
  put (key:string, data:string) {
    const filePath = path.join(uploadDir, key) + '.icefox'
    const parentPath = path.dirname(filePath)
    return new Promise((resolve, reject) => {
      mkdirp(parentPath)
      .then(() => fs.writeFile(filePath, data, (err) => {
        if (err)
          reject(err)
        else {
          resolve(filePath)
        }
      }))
    })
  },
}

export default local
