import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { seedWorkspace } from '../src/demo-data.js'

const prisma = new PrismaClient()

function hashPassword(password: string) {
  const iterations = 120_000
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex')

  return `${iterations}:${salt}:${hash}`
}

async function main() {
  await prisma.quoteItem.deleteMany()
  await prisma.task.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.catalogItem.deleteMany()
  await prisma.client.deleteMany()
  await prisma.workspaceSettings.deleteMany()
  await prisma.session.deleteMany()
  await prisma.workspaceMember.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Blume',
      email: 'demo@blume.local',
      passwordHash: hashPassword('password123'),
      isDemo: true,
    },
  })
  const demoWorkspace = await prisma.workspace.create({
    data: {
      name: 'Demo Blume',
      slug: 'demo-blume',
      isDemo: true,
      members: {
        create: {
          userId: demoUser.id,
          role: 'OWNER',
        },
      },
    },
  })

  await seedWorkspace(prisma, demoWorkspace.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
