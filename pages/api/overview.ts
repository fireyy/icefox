import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)
  if (session) {
    if (method === 'GET') {
      const [user, key, domain, publish] = await prisma.$transaction([
        prisma.user.count(),
        prisma.key.count(),
        prisma.domain.count(),
        prisma.publishlog.count(),
      ])
      res.json({
        user,
        key,
        domain,
        publish,
      })
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
