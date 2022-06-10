import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'
import { setScopeCookie } from 'lib/cookies'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(domain as string, res)
        break
      case 'DELETE':
        await handleDELETE(domain as string, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/:domain
async function handleGET(domain: string, res: NextApiResponse) {
  const result = await prisma.domain.findUnique({
    where: { domain },
  })
  if (result) {
    setScopeCookie(res, domain)
    res.json(result)
  } else {
    res.json({})
  }
}

// DELETE /api/:domain
async function handleDELETE(domain: string, res: NextApiResponse) {
  const hasKey = await prisma.key.findFirst({
    where: { domain },
  })
  if (!hasKey) {
    await prisma.domain.delete({
      where: { domain },
    })
    res.json({
      name: 'OK'
    })
  } else {
    res.json({
      name: 'NOT_NULL',
      message: 'Domain is not empty'
    })
  }
}
