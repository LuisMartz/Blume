import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'
import { catalogCreateSchema, catalogUpdateSchema } from '../validators/catalog.schema.js'

export const catalogRouter = Router()
catalogRouter.use(requireAuth)

catalogRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const items = await prisma.catalogItem.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })

    res.json(items)
  } catch (error) {
    next(error)
  }
})

catalogRouter.post('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = catalogCreateSchema.parse(req.body)
    const item = await prisma.catalogItem.create({
      data: {
        ...data,
        workspaceId,
        price: data.price.toString(),
      },
    })

    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
})

catalogRouter.patch('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = catalogUpdateSchema.parse(req.body)
    const item = await prisma.catalogItem.update({
      where: { id: req.params.id, workspaceId },
      data: {
        ...data,
        price: data.price == null ? data.price : data.price.toString(),
      },
    })

    res.json(item)
  } catch (error) {
    next(error)
  }
})

catalogRouter.delete('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    await prisma.catalogItem.delete({ where: { id: req.params.id, workspaceId } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
