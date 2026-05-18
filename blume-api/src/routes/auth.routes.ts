import { Router } from 'express'
import {
  createSession,
  getBearerToken,
  getUserFromRequest,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../auth.js'
import { prisma } from '../prisma.js'
import { loginSchema, registerSchema } from '../validators/auth.schema.js'

export const authRouter = Router()

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const

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
      },
      select: publicUserSelect,
    })
    const session = await createSession(user.id)

    res.status(201).json({ user, ...session })
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

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
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

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
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
