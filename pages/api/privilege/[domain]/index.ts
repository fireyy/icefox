import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain: d },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)
  const domain = d as string

  switch (method) {
    case 'GET':
      await handleGET(domain, res)
      break
    case 'PUT':
      await handlePUT({
        ...data,
        domain,
        createBy: session?.user?.id,
      }, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/privilege/:domain
async function handleGET(domain: string, res: NextApiResponse) {
  const result = await prisma.privilege.findMany({
    where: { domain },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
  res.json(result || [])
}

// PUT /api/privilege/:domain
async function handlePUT(data: any, res: NextApiResponse) {
  const result = await prisma.privilege.create({
    data,
  })
  res.json(result)
}
