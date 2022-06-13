import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query,
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  const id = Number(query.id)

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(id, res)
        break
      case 'PUT':
        await handlePUT(id, {
          ...data
        }, res)
        break
      case 'DELETE':
        await handleDELETE(id, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/data/:id
async function handleGET(id: number, res: NextApiResponse) {
  const result = await prisma.key.findUnique({
    where: { id },
  })
  res.json(result)
}

// PUT /api/data/:id
async function handlePUT(id: number, data: any, res: NextApiResponse) {
  const result = await prisma.key.update({
    where: { id },
    data: { ...data },
  })
  res.json(result)
}

// DELETE /api/data/:id
async function handleDELETE(id: number, res: NextApiResponse) {
  const result = await prisma.key.delete({
    where: { id },
  })
  res.json(result)
}

