import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'
import { clientCreateSchema, clientUpdateSchema } from '../validators/client.schema.js'

export const clientsRouter = Router()
clientsRouter.use(requireAuth)

clientsRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const clients = await prisma.client.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { quotes: true } } },
    })

    res.json(clients)
  } catch (error) {
    next(error)
  }
})

clientsRouter.get('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const client = await prisma.client.findUnique({
      where: { id: req.params.id, workspaceId },
      include: { quotes: { orderBy: { createdAt: 'desc' } } },
    })

    if (!client) {
      res.status(404).json({ message: 'Cliente no encontrado' })
      return
    }

    res.json(client)
  } catch (error) {
    next(error)
  }
})

clientsRouter.post('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = clientCreateSchema.parse(req.body)
    const client = await prisma.client.create({
      data: {
        ...data,
        workspaceId,
        value: data.value == null ? null : data.value.toString(),
      },
    })

    res.status(201).json(client)
  } catch (error) {
    next(error)
  }
})

clientsRouter.patch('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = clientUpdateSchema.parse(req.body)
    const client = await prisma.client.update({
      where: { id: req.params.id, workspaceId },
      data: {
        ...data,
        value: data.value == null ? data.value : data.value.toString(),
      },
    })

    res.json(client)
  } catch (error) {
    next(error)
  }
})

clientsRouter.delete('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    await prisma.client.delete({ where: { id: req.params.id, workspaceId } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
