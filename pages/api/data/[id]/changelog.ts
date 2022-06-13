import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query,
    method,
  } = req

  const session = await roleProtect(req, res)

  const id = Number(query.id)
  const { page, limit } = query

  if (session) {
    switch (method) {
      case 'GET':
        const result = await prisma.$transaction([
          prisma.changelog.count({
            where: { keyId: id },
          }),
          prisma.changelog.findMany({
            where: { keyId: id },
            take: +limit,
            skip: (+page - 1) * +limit,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }),
        ])
        res.json({
          total: result[0],
          pageCount: Math.ceil(result[0] / +limit),
          page,
          data: result[1],
        })
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
