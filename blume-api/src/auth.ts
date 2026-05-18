import { pbkdf2Sync, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import type { User, WorkspaceMember } from '@prisma/client'
import { prisma } from './prisma.js'

const iterations = 120_000
const keyLength = 64
const digest = 'sha512'
const sessionDays = 7

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex')

  return `${iterations}:${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string) {
  const [storedIterations, salt, hash] = storedHash.split(':')

  if (!storedIterations || !salt || !hash) {
    return false
  }

  const calculatedHash = pbkdf2Sync(
    password,
    salt,
    Number(storedIterations),
    keyLength,
    digest,
  )
  const storedBuffer = Buffer.from(hash, 'hex')

  return (
    storedBuffer.length === calculatedHash.length &&
    timingSafeEqual(storedBuffer, calculatedHash)
  )
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  })

  return { token, expiresAt }
}

export function getBearerToken(req: Request) {
  const authorization = req.header('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length)
}

export async function getUserFromRequest(req: Request) {
  const token = getBearerToken(req)

  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session.user
}

export type AuthenticatedRequest = Request & {
  user: User
  workspaceId: string
  membership: WorkspaceMember
}

export function getAuthUser(req: Request) {
  return (req as unknown as AuthenticatedRequest).user
}

export function getWorkspaceId(req: Request) {
  return (req as unknown as AuthenticatedRequest).workspaceId
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      res.status(401).json({ message: 'No autenticado' })
      return
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    })

    if (!membership) {
      res.status(403).json({ message: 'El usuario no pertenece a ningún espacio de trabajo' })
      return
    }

    ;(req as AuthenticatedRequest).user = user
    ;(req as AuthenticatedRequest).workspaceId = membership.workspaceId
    ;(req as AuthenticatedRequest).membership = membership
    next()
  } catch (error) {
    next(error)
  }
}
