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

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(d, res)
        break
      case 'PUT':
        await handlePUT({
          ...data,
          domain: d,
          createBy: session.user.id,
        }, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/:domain/data
async function handleGET(domain: string, res: NextApiResponse) {
  const result = await prisma.key.findMany({
    where: { domain },
  })
  res.json(result)
}

// PUT /api/:domain/data
async function handlePUT(data: any, res: NextApiResponse) {
  const result = await prisma.key.create({
    data: { ...data },
  })
  res.json(result)
}

