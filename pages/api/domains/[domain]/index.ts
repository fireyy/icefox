import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'
import { setScopeCookie } from 'lib/cookies'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { domain: d },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)
  const domain = d as string

  if (session) {
    switch (method) {
      case 'GET':
        await handleGET(domain, res)
        break
      case 'PUT':
        await handlePUT({
          ...data,
          domain,
          createBy: session.user.id,
        }, res)
        break
      case 'DELETE':
        await handleDELETE(domain, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/domains/:domain
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

// PUT /api/domains/:domain
async function handlePUT(data: any, res: NextApiResponse) {
  const result = await prisma.key.create({
    data: { ...data },
    select: {
      id: true,
      value: true,
      createBy: true
    }
  })
  if (result.id) {
    await prisma.changelog.create({
      data: {
        keyId: result.id,
        value: result.value,
        createBy: result.createBy,
      },
    })
  }
  res.json(result)
}

// DELETE /api/domains/:domain
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
