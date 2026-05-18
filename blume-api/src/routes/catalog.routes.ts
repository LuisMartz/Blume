import { Router } from 'express'
import { prisma } from '../prisma.js'
import { catalogCreateSchema, catalogUpdateSchema } from '../validators/catalog.schema.js'

export const catalogRouter = Router()

catalogRouter.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.catalogItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json(items)
  } catch (error) {
    next(error)
  }
})

catalogRouter.post('/', async (req, res, next) => {
  try {
    const data = catalogCreateSchema.parse(req.body)
    const item = await prisma.catalogItem.create({
      data: {
        ...data,
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
    const data = catalogUpdateSchema.parse(req.body)
    const item = await prisma.catalogItem.update({
      where: { id: req.params.id },
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
    await prisma.catalogItem.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
