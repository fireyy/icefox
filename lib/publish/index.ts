const provider = process.env.STORAGE_PROVIDER
let uploadProvide = import(`./providers/${provider}`)

const publish = {
  push (domain: string, list: any) { //TODO: list type
    return uploadProvide.then(m => m.put())
  }
}

export default publish
