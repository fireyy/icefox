import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'
import squash from 'lib/squash'
import { SquashItems } from 'lib/interfaces'
import publishProvider from 'lib/publish'

type Pargs = {
  publishId: number
  path: string
  name: string
  value: string
}

function escape(str: string) {
  return str.replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
            .replace(/<\/script>/g, '<\\/script>')
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain: d },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)
  const domain = d as string

  if (session) {
    switch (method) {
      case 'PUT':
        const where = {
          AND: [
            { domain },
            { isDelete: 0 },
            { path: { in: data } }
          ],
        }
        const result = await prisma.key.findMany({
          where,
        })
        const list = await prisma.$transaction(async (prisma) => {
          let res = await pushToCDN(domain, squash(result))
          await prisma.key.updateMany({
            where,
            data: {
              publishAt: new Date(),
            }
          })
          return res
        })
        // Save to publishlog, Ignore publishing error
        await prisma.$transaction(async (prisma) => {
          const { id: publishId } = await prisma.publishlog.create({
            data: {
              domain,
              createBy: 1,
            }
          })
          const publishedData: Pargs[] = result.map(({ path, name, value }: any) => ({ publishId, path, name, value }))
          return await prisma.publishdata.createMany({
            data: publishedData
          })
        })
        res.json(list)
        break
      default:
        res.setHeader('Allow', ['PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

async function pushToCDN (domain: string, squashedList: SquashItems) {
  let contents = [
    // JS format
    ...squashedList.map(({ path, value }) => {
      let key = domain + path
      let contents = escape(JSON.stringify(value))
      contents = `var icefox=${contents};`
      let mime = 'application/javascript; charset=utf-8'
      return { key, contents, mime }
    }),
    // JS format with ref support
    ...squashedList.map(({ path, value }) => {
      let key = domain + '@ref' + path
      let contents = escape(JSON.stringify(value))
      contents = `!function(){var t,e=document.currentScript||function(){var t=document.getElementsByTagName("script");return t.length?t[t.length-1]:void 0}();e&&(t=e.getAttribute("data-ref")),window[t||"icefox"]=${contents}}();`
      let mime = 'application/javascript; charset=utf-8'
      return { key, contents, mime }
    }),
    // JSON format
    ...squashedList.map(({ path, value }) => {
      let key = domain + '@json' + path
      let contents = JSON.stringify(value)
      let mime = 'application/json'
      return { key, contents, mime }
    })
  ]
  let tasks = contents.map(({ key, contents, mime }) =>  publishProvider.push(key, contents, mime))
  return await Promise.all(tasks)
}
