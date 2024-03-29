import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain },
    method,
  } = req

  const session = await roleProtect(req, res)

  switch (method) {
    case 'GET':
      await handleGET(domain as string, res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/publishlog/:domain
async function handleGET(domain: string, res: NextApiResponse) {
  const result = await prisma.publishlog.findMany({
    where: { domain },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
  if (result) {
    res.json(result)
  } else {
    res.json([])
  }
}
