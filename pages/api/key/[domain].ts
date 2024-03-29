import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  const d = domain as string

  switch (method) {
    case 'GET':
      await handleGET(d, res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/key/:domain
async function handleGET(domain: string, res: NextApiResponse) {
  const result = await prisma.key.findMany({
    where: { domain, isDelete: 0 },
  })
  if (result) {
    res.json(result)
  } else {
    res.json([])
  }
}
