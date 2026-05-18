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
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        total: total.toString(),
      }
    })
    const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0)
    const taxAmount = subtotal * (data.taxRate / 100)
    const total = subtotal + taxAmount

    const quote = await prisma.quote.create({
      data: {
        code: data.code,
        clientId: data.clientId,
        date: data.date,
        validUntil: data.validUntil,
        status: data.status,
        subtotal: subtotal.toString(),
        taxRate: data.taxRate.toString(),
        taxAmount: taxAmount.toString(),
        total: total.toString(),
        notes: data.notes,
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
        subtotal: data.subtotal == null ? data.subtotal : data.subtotal.toString(),
        taxRate: data.taxRate == null ? data.taxRate : data.taxRate.toString(),
        taxAmount: data.taxAmount == null ? data.taxAmount : data.taxAmount.toString(),
        total: data.total == null ? data.total : data.total.toString(),
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
