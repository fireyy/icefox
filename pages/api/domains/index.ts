import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(res)
        break
      case 'PUT':
        await handlePUT({
          ...data,
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

// GET /api/domains
async function handleGET(res: NextApiResponse) {
  const domain = await prisma.domain.findMany()
  res.json(domain)
}

// PUT /api/domains
// TODO: 权限控制
async function handlePUT(data: any, res: NextApiResponse) {
  const result = await prisma.domain.create({
    data,
  })
  res.json(result)
}
