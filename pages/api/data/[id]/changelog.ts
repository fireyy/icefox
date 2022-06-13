import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query,
    method,
  } = req

  const session = await roleProtect(req, res)

  const id = Number(query.id)

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(id, res)
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/data/:id/changelog
async function handleGET(id: number, res: NextApiResponse) {
  const result = await prisma.changelog.findMany({
    where: { keyId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  })
  res.json(result)
}
