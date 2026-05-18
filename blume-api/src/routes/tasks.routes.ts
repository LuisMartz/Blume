import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'
import { taskCreateSchema, taskUpdateSchema } from '../validators/task.schema.js'

export const tasksRouter = Router()
tasksRouter.use(requireAuth)

tasksRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const tasks = await prisma.task.findMany({
      where: { workspaceId },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        client: true,
        quote: true,
      },
    })

    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

tasksRouter.post('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = taskCreateSchema.parse(req.body)

    if (data.clientId) {
      const client = await prisma.client.findFirst({ where: { id: data.clientId, workspaceId } })
      if (!client) {
        res.status(400).json({ message: 'Cliente no valido para esta cuenta' })
        return
      }
    }

    if (data.quoteId) {
      const quote = await prisma.quote.findFirst({ where: { id: data.quoteId, workspaceId } })
      if (!quote) {
        res.status(400).json({ message: 'Presupuesto no valido para esta cuenta' })
        return
      }
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        workspaceId,
      },
      include: {
        client: true,
        quote: true,
      },
    })

    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
})

tasksRouter.patch('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = taskUpdateSchema.parse(req.body)

    const task = await prisma.task.update({
      where: { id: req.params.id, workspaceId },
      data,
      include: {
        client: true,
        quote: true,
      },
    })

    res.json(task)
  } catch (error) {
    next(error)
  }
})

tasksRouter.delete('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    await prisma.task.delete({ where: { id: req.params.id, workspaceId } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
