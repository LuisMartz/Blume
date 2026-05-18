import { QuoteStatus, TaskStatus } from '@prisma/client'
import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth)

const closedQuoteStatuses: QuoteStatus[] = [QuoteStatus.ACCEPTED, QuoteStatus.REJECTED]

dashboardRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [clients, quotes, tasks] = await Promise.all([
      prisma.client.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.quote.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: { client: true },
      }),
      prisma.task.findMany({
        where: { workspaceId },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        take: 8,
        include: { client: true, quote: true },
      }),
    ])

    const pipeline = quotes
      .filter((quote) => !closedQuoteStatuses.includes(quote.status))
      .reduce((sum, quote) => sum + Number(quote.total), 0)
    const openQuotes = quotes.filter((quote) => !closedQuoteStatuses.includes(quote.status)).length
    const activeClients = clients.filter((client) => client.status === 'ACTIVE').length
    const dueToday = tasks.filter((task) => task.dueDate && task.dueDate >= today && task.dueDate < tomorrow && task.status !== TaskStatus.DONE).length
    const urgentTasks = tasks.filter((task) => task.priority === 'HIGH' && task.status !== TaskStatus.DONE).length

    const quoteActivity = quotes.slice(0, 6).map((quote) => ({
      id: quote.id,
      client: quote.client.name,
      movement: quote.status === QuoteStatus.ACCEPTED ? 'Acepto propuesta' : quote.status === QuoteStatus.SENT ? 'Presupuesto enviado' : quote.status === QuoteStatus.REVISION ? 'Revision solicitada' : 'Presupuesto actualizado',
      amount: quote.total,
      status: quote.status,
      date: quote.updatedAt,
    }))
    const clientActivity = clients.slice(0, 3).map((client) => ({
      id: client.id,
      client: client.name,
      movement: 'Cliente creado',
      amount: client.value,
      status: client.status,
      date: client.createdAt,
    }))

    const activity = [...quoteActivity, ...clientActivity]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8)

    res.json({
      stats: {
        pipeline,
        activeClients,
        openQuotes,
        dueToday,
        urgentTasks,
      },
      activity,
      tasks,
      funnel: {
        contacted: clients.length,
        sent: quotes.filter((quote) => quote.status === QuoteStatus.SENT).length,
        revision: quotes.filter((quote) => quote.status === QuoteStatus.REVISION).length,
        closed: quotes.filter((quote) => quote.status === QuoteStatus.ACCEPTED).length,
      },
    })
  } catch (error) {
    next(error)
  }
})
