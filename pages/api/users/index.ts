import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { s },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  if (method === 'GET') {
    const where: any = {}
    if (s) {
      where.name = {
        contains: String(s),
      }
    }
    const result = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true
      }
    })
    res.json(result ?? [])
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
