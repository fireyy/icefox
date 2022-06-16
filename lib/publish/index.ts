import local from './providers/local'
import qiniu from './providers/qiniu'

const providers = {
  local,
  qiniu,
} as any

const provider = providers[process.env.STORAGE_PROVIDER || 'local']

const publish = {
  push (domain: string, content: string, mime: string) {
    return provider.put(domain, content, mime)
  }
}

export default publish
