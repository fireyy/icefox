import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  const session = await roleProtect(req, res)

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(Number(id), res)
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/publishlog/:id/publishdata
async function handleGET(id: number, res: NextApiResponse) {
  const result = await prisma.publishdata.findMany({
    where: { publishId: id },
  })
  if (result) {
    res.json(result)
  } else {
    res.json([])
  }
}
