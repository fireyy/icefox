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
      case 'PATCH':
        await handlePATCH(id, {
          ...data
        }, Number(session.user.id), res)
        break
      case 'DELETE':
        await handleDELETE(id, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/domains/:domain/:id
async function handleGET(id: number, res: NextApiResponse) {
  const result = await prisma.key.findUnique({
    where: { id },
  })
  res.json(result)
}

// PATCH /api/domains/:domain/:id
async function handlePATCH(id: number, data: any, userId: number, res: NextApiResponse) {
  const key = await prisma.key.findFirst({
    where: { id, isDelete: 0 },
    select: {
      value: true
    }
  })
  if (!key) {
    res.json({
      name: 'KEY_NOT_FOUND',
      message: 'key is not found'
    })
  }
  const result = await prisma.key.update({
    where: { id },
    data: { ...data },
  })
  if (key && data.value !== key.value) {
    await prisma.changelog.create({
      data: {
        keyId: id,
        value: data.value,
        createBy: userId,
      },
    })
  }
  res.json(result)
}

// DELETE /api/domains/:domain/:id
async function handleDELETE(id: number, res: NextApiResponse) {
  const result = await prisma.key.update({
    where: { id },
    data: {
      isDelete: 1,
    }
  })
  res.json(result)
}

