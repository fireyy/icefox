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

  switch (method) {
    case 'DELETE':
      await handleDELETE(id, res)
      break
    default:
      res.setHeader('Allow', ['DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// DELETE /api/privilege/:domain/:id
async function handleDELETE(id: number, res: NextApiResponse) {
  const result = await prisma.privilege.delete({
    where: { id },
  })
  res.json(result)
}

