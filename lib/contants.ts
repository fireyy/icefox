import getConfig from 'next/config'

export const { publicRuntimeConfig: { staticPath, baseUrl } } = getConfig()

export const dataKeyType = [
  { text: 'String', value: 1 },
  { text: 'Text', value: 2 },
  { text: 'Number', value: 3 },
  { text: 'Boolean', value: 4 },
  { text: 'Percent', value: 5 },
  { text: 'Date', value: 6 },
  { text: 'JSON', value: 9 }
]
