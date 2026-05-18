import { Router } from 'express'
import { prisma } from '../prisma.js'
import { quoteCreateSchema, quoteUpdateSchema } from '../validators/quote.schema.js'

export const quotesRouter = Router()

quotesRouter.get('/', async (_req, res, next) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        items: true,
      },
    })

    res.json(quotes)
  } catch (error) {
    next(error)
  }
})

quotesRouter.post('/', async (req, res, next) => {
  try {
    const data = quoteCreateSchema.parse(req.body)
    const items = data.items.map((item) => {
      const total = item.quantity * item.unitPrice

      return {
        catalogItemId: item.catalogItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        total: total.toString(),
      }
    })
    const amount = items.reduce((sum, item) => sum + Number(item.total), 0)

    const quote = await prisma.quote.create({
      data: {
        code: data.code,
        clientId: data.clientId,
        date: data.date,
        amount: amount.toString(),
        status: data.status,
        items: {
          create: items,
        },
      },
      include: {
        client: true,
        items: true,
      },
    })

    res.status(201).json(quote)
  } catch (error) {
    next(error)
  }
})

quotesRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = quoteUpdateSchema.parse(req.body)
    const quote = await prisma.quote.update({
      where: { id: req.params.id },
      data: {
        ...data,
        amount: data.amount == null ? data.amount : data.amount.toString(),
      },
      include: {
        client: true,
        items: true,
      },
    })

    res.json(quote)
  } catch (error) {
    next(error)
  }
})

quotesRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.quote.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
