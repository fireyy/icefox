import qiniu from 'qiniu'

const {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET,
  QINIU_BASEURL
} = process.env

if (
  QINIU_ACCESS_KEY === 'YOUR AK' ||
  QINIU_SECRET_KEY === 'YOUR SK' ||
  QINIU_BUCKET === 'YOUR BUCKET' ||
  QINIU_BASEURL === 'YOUR URL'
  ) {
  throw new Error(
    ` Qiniu config parameters has not define , please define the parameters in .env file in the project root path.`
  )
}

const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
const conf = new qiniu.conf.Config()
const options = {
  scope: QINIU_BUCKET,
}

const provider = {
  provider: 'qiniu',
  name: '七牛对象存储Kodo',
  put (key: string, data: string, mime: string) {
    return new Promise((resolve, reject) => {
      const putPolicy = new qiniu.rs.PutPolicy(options)
      const uploadToken = putPolicy.uploadToken(mac)

      const formUploader = new qiniu.form_up.FormUploader(conf)
      const putExtra = new qiniu.form_up.PutExtra()
      formUploader.put(
        uploadToken,
        key,
        data,
        putExtra,
        function (respErr:any, respBody:any, respInfo:any) { //TODO: 参数类型
          if (respErr) {
            reject(respErr)
          } else {
            if (respInfo.statusCode === 200) {
              resolve(respBody)
            }
          }
        }
      )
    })
  },
}

export default provider
