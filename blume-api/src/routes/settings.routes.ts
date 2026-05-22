import { Router } from 'express'
import { getWorkspaceId, requireAuth } from '../auth.js'
import { prisma } from '../prisma.js'
import { settingsUpdateSchema } from '../validators/settings.schema.js'

export const settingsRouter = Router()
settingsRouter.use(requireAuth)

async function ensureSettings(workspaceId: string) {
  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspaceId },
    select: { name: true },
  })

  return prisma.workspaceSettings.upsert({
    where: { workspaceId },
    update: {},
    create: {
      workspaceId,
      companyName: workspace.name,
    },
  })
}

settingsRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const settings = await ensureSettings(workspaceId)

    res.json(settings)
  } catch (error) {
    next(error)
  }
})

settingsRouter.put('/', async (req, res, next) => {
  try {
    const workspaceId = getWorkspaceId(req)
    const data = settingsUpdateSchema.parse(req.body)
    const settings = await prisma.workspaceSettings.upsert({
      where: { workspaceId },
      create: {
        ...data,
        workspaceId,
        defaultTaxRate: data.defaultTaxRate.toString(),
      },
      update: {
        ...data,
        defaultTaxRate: data.defaultTaxRate.toString(),
      },
    })

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { name: data.companyName },
    })

    res.json(settings)
  } catch (error) {
    next(error)
  }
})
