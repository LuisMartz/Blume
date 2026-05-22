import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'
import { quoteCreateSchema, quoteUpdateSchema } from '../validators/quote.schema.js'

export const quotesRouter = Router()
quotesRouter.use(requireAuth)

quotesRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const quotes = await prisma.quote.findMany({
      where: { workspaceId },
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

quotesRouter.get('/:id', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const quote = await prisma.quote.findFirst({
      where: {
        id: req.params.id,
        workspaceId,
      },
      include: {
        client: true,
        items: true,
        tasks: {
          orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
          include: { client: true },
        },
      },
    })

    if (!quote) {
      res.status(404).json({ message: 'Presupuesto no encontrado' })
      return
    }

    res.json(quote)
  } catch (error) {
    next(error)
  }
})

quotesRouter.post('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = quoteCreateSchema.parse(req.body)
    const client = await prisma.client.findUnique({
      where: { id: data.clientId, workspaceId },
      select: { id: true },
    })

    if (!client) {
      res.status(400).json({ message: 'Cliente no válido para esta cuenta' })
      return
    }

    const catalogItemIds = data.items
      .map((item) => item.catalogItemId)
      .filter((id): id is string => Boolean(id))

    if (catalogItemIds.length > 0) {
      const validCatalogItems = await prisma.catalogItem.count({
        where: {
          id: { in: catalogItemIds },
          workspaceId,
        },
      })

      if (validCatalogItems !== new Set(catalogItemIds).size) {
        res.status(400).json({ message: 'Servicio no válido para esta cuenta' })
        return
      }
    }

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
        workspaceId,
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
    const workspaceId = getWorkspaceId(req)
    const data = quoteUpdateSchema.parse(req.body)
    const quote = await prisma.quote.update({
      where: { id: req.params.id, workspaceId },
      data,
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
    const workspaceId = getWorkspaceId(req)
    await prisma.quote.delete({ where: { id: req.params.id, workspaceId } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
