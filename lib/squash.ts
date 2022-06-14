import { SquashItems } from 'lib/interfaces'

export default function squash (list: any[]): SquashItems {
  // Build result map
  let result = Object.create(null)
  list.forEach(({ path, name, value, publishAt, updatedAt }) => {
    if (!(path in result)) result[path] = { path, value: {}, updatedAt: new Date(0), publishAt: new Date(0) }
    let obj = result[path]
    if (updatedAt > obj.updatedAt) obj.updatedAt = updatedAt
    if (publishAt > obj.publishAt) obj.publishAt = publishAt
    try {
      obj.value[name] = JSON.parse(value)
    } catch (error) {
      obj.value[name] = value
    }
  })
  return Object.keys(result).reduce((reciever: any[], path) => {
    reciever.push(result[path])
    return reciever
  }, [])
}
