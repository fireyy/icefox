import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req
  const s = String(data.s)
  const session = await roleProtect(req, res)

  if (session) {
    if (method === 'POST') {
      const data = await prisma.key.findMany({
        where: {
          OR: [
            {
              name: {
                contains: s,
              },
            },
            {
              path: {
                contains: s,
              },
            },
            {
              value: {
                contains: s,
              },
            },
            {
              comment: {
                contains: s,
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          value: true,
          path: true,
          comment: true,
        }
      })
      const result = data.map(item => (
        {
          name: `${item.name}`,
          comment: `${item.comment}`,
          value: `${item.value}`,
          group: `${item.path}`,
        }
      ))
        .slice(0, 10)
        .sort(seed => {
          const startsWithName = seed.name.toLowerCase().startsWith(s)
          const startsWithGroup = seed.group?.toLowerCase().startsWith(s)
          if (startsWithName) return -1
          if (startsWithGroup) return 0
          return 1
        })
      res.json(result)
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
