import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id: d },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)
  const id = Number(d)

  switch (method) {
    case 'GET':
      await handleGET(id, res)
      break
    case 'PATCH':
      await handlePATCH(id, data, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/users/:id
async function handleGET(id: number, res: NextApiResponse) {
  const result = await prisma.user.findUnique({
    where: { id },
  })
  if (result) {
    res.json(result)
  } else {
    res.json({})
  }
}

// PATCH /api/users/:id
async function handlePATCH(id: number, data: any, res: NextApiResponse) {
  const result = await prisma.user.update({
    where: { id },
    data
  })
  res.json(result)
}
