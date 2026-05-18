import { Router } from 'express'
import { randomBytes } from 'node:crypto'
import { WorkspaceRole } from '@prisma/client'
import {
  createSession,
  getBearerToken,
  getUserFromRequest,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../auth.js'
import { seedWorkspace } from '../demo-data.js'
import { prisma } from '../prisma.js'
import { loginSchema, registerSchema } from '../validators/auth.schema.js'

export const authRouter = Router()

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  isDemo: true,
  createdAt: true,
} as const

async function createOwnedWorkspace({
  userId,
  name,
  isDemo,
}: {
  userId: string
  name: string
  isDemo: boolean
}) {
  const suffix = randomBytes(4).toString('hex')

  return prisma.workspace.create({
    data: {
      name,
      slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${suffix}`,
      isDemo,
      members: {
        create: {
          userId,
          role: WorkspaceRole.OWNER,
        },
      },
    },
  })
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })

    if (userExists) {
      res.status(409).json({ message: 'Ya existe una cuenta con este email' })
      return
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashPassword(data.password),
        isDemo: false,
      },
      select: publicUserSelect,
    })
    const workspace = await createOwnedWorkspace({
      userId: user.id,
      name: `${user.name} Workspace`,
      isDemo: false,
    })
    const session = await createSession(user.id)

    res.status(201).json({ user, workspace, ...session })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      res.status(401).json({ message: 'Email o contraseña incorrectos' })
      return
    }

    const session = await createSession(user.id)
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      include: { workspace: true },
      orderBy: { createdAt: 'asc' },
    })

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isDemo: user.isDemo,
        createdAt: user.createdAt,
      },
      workspace: membership?.workspace ?? null,
      ...session,
    })
  } catch (error) {
    next(error)
  }
})

authRouter.get('/me', async (req, res, next) => {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      res.status(401).json({ message: 'No autenticado' })
      return
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      include: { workspace: true },
      orderBy: { createdAt: 'asc' },
    })

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isDemo: user.isDemo,
        createdAt: user.createdAt,
      },
      workspace: membership?.workspace ?? null,
    })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/logout', async (req, res, next) => {
  try {
    const token = getBearerToken(req)

    if (token) {
      await prisma.session.deleteMany({
        where: { tokenHash: hashToken(token) },
      })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

authRouter.post('/demo', async (_req, res, next) => {
  try {
    const suffix = randomBytes(4).toString('hex')
    const user = await prisma.user.create({
      data: {
        name: 'Demo Blume',
        email: `demo-${suffix}@blume.local`,
        passwordHash: hashPassword(randomBytes(16).toString('hex')),
        isDemo: true,
      },
      select: publicUserSelect,
    })
    const workspace = await createOwnedWorkspace({
      userId: user.id,
      name: 'Demo Blume',
      isDemo: true,
    })

    await seedWorkspace(prisma, workspace.id)
    const session = await createSession(user.id)

    res.status(201).json({ user, workspace, ...session })
  } catch (error) {
    next(error)
  }
})
