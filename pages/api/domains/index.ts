import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'
import { setScopeCookie } from 'lib/cookies'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  switch (method) {
    case 'GET':
      await handleGET(req, res)
      break
    case 'PUT':
      if (session?.user?.role === 'ADMIN') {
        await handlePUT({
          ...data,
          createBy: session?.user?.id,
        }, res)
      } else {
        res.status(401).json({ message: 'No Permission' })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/domains
async function handleGET(req:NextApiRequest, res: NextApiResponse) {
  const domain = await prisma.domain.findMany()
  let scope = req.cookies.scope
  const hasScope = !!scope
  if (domain && domain.length > 0 && !hasScope) {
    scope = domain[0].domain
    setScopeCookie(res, scope)
  }
  res.json({
    scope,
    domain,
  })
}

// PUT /api/domains
async function handlePUT(data: any, res: NextApiResponse) {
  const result = await prisma.domain.create({
    data,
  })
  res.json(result)
}
