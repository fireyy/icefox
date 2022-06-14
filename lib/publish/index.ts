import local from './providers/local'
import qiniu from './providers/qiniu'

const providers = {
  local,
  qiniu,
} as any

const provider = providers[process.env.STORAGE_PROVIDER || 'local']

const publish = {
  push (domain: string, list: any, mime: string) { //TODO: list type
    return provider.put(domain, list, mime)
  }
}

export default publish
