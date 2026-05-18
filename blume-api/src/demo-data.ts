import { CatalogStatus, ClientStatus, PrismaClient, QuoteStatus, TaskPriority, TaskStatus } from '@prisma/client'

const toDecimalString = (value: number) => value.toFixed(2)

export async function seedWorkspace(prisma: PrismaClient, workspaceId: string) {
  const [bruma, norte, verde, lantia] = await Promise.all([
    prisma.client.create({
      data: {
        workspaceId,
        name: 'Bruma Studio',
        contact: 'Laura Martín',
        email: 'laura@brumastudio.es',
        phone: '+34 610 245 823',
        taxId: 'B42815973',
        address: 'Calle del Prado 18',
        city: 'Madrid',
        postalCode: '28014',
        value: '12400',
        status: ClientStatus.ACTIVE,
      },
    }),
    prisma.client.create({
      data: {
        workspaceId,
        name: 'Norte Dental',
        contact: 'Pablo Ruiz',
        email: 'pablo@nortedental.es',
        phone: '+34 689 441 209',
        taxId: 'B67294481',
        address: 'Avenida Constitución 42',
        city: 'Bilbao',
        postalCode: '48001',
        value: '8950',
        status: ClientStatus.ACTIVE,
      },
    }),
    prisma.client.create({
      data: {
        workspaceId,
        name: 'Verde Home',
        contact: 'Clara Soler',
        email: 'clara@verdehome.es',
        phone: '+34 622 118 704',
        taxId: 'B80317594',
        address: 'Rambla Catalunya 91',
        city: 'Barcelona',
        postalCode: '08008',
        value: '5900',
        status: ClientStatus.PENDING,
      },
    }),
    prisma.client.create({
      data: {
        workspaceId,
        name: 'Lantia Legal',
        contact: 'Marcos Gil',
        email: 'marcos@lantialegal.es',
        phone: '+34 677 309 551',
        taxId: 'B51820466',
        address: 'Gran Vía 12',
        city: 'Valencia',
        postalCode: '46002',
        value: '2150',
        status: ClientStatus.PENDING,
      },
    }),
  ])

  const [consulting, website, maintenance, seo] = await Promise.all([
    prisma.catalogItem.create({
      data: {
        workspaceId,
        name: 'Consultoría inicial',
        description: 'Sesión de diagnóstico, prioridades y plan de acción.',
        category: 'Servicio',
        unit: 'servicio',
        price: '450',
        margin: 72,
        status: CatalogStatus.ACTIVE,
      },
    }),
    prisma.catalogItem.create({
      data: {
        workspaceId,
        name: 'Diseño web corporativo',
        description: 'Diseño e implementación de web corporativa completa.',
        category: 'Proyecto',
        unit: 'proyecto',
        price: '2800',
        margin: 64,
        status: CatalogStatus.ACTIVE,
      },
    }),
    prisma.catalogItem.create({
      data: {
        workspaceId,
        name: 'Mantenimiento mensual',
        description: 'Soporte, mejoras menores y revisión técnica mensual.',
        category: 'Retainer',
        unit: 'mes',
        price: '390',
        margin: 58,
        status: CatalogStatus.ACTIVE,
      },
    }),
    prisma.catalogItem.create({
      data: {
        workspaceId,
        name: 'Auditoría SEO',
        description: 'Análisis técnico y recomendaciones de posicionamiento.',
        category: 'Servicio',
        unit: 'servicio',
        price: '690',
        margin: 61,
        status: CatalogStatus.DRAFT,
      },
    }),
  ])

  const createQuote = async ({
    code,
    clientId,
    status,
    notes,
    lines,
  }: {
    code: string
    clientId: string
    status: QuoteStatus
    notes: string
    lines: Array<{
      catalogItemId: string
      name: string
      description: string
      quantity: number
      unitPrice: number
    }>
  }) => {
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
    const taxRate = 21
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    return prisma.quote.create({
      data: {
        workspaceId,
        code,
        clientId,
        status,
        subtotal: toDecimalString(subtotal),
        taxRate: toDecimalString(taxRate),
        taxAmount: toDecimalString(taxAmount),
        total: toDecimalString(total),
        validUntil: new Date('2026-06-18T00:00:00.000Z'),
        notes,
        items: {
          create: lines.map((line) => ({
            catalogItemId: line.catalogItemId,
            name: line.name,
            description: line.description,
            quantity: line.quantity,
            unitPrice: toDecimalString(line.unitPrice),
            total: toDecimalString(line.quantity * line.unitPrice),
          })),
        },
      },
    })
  }

  const [brumaQuote, norteQuote, verdeQuote, lantiaQuote] = await Promise.all([
    createQuote({
      code: `BL-${workspaceId.slice(-6)}-018`,
      clientId: bruma.id,
      status: QuoteStatus.SENT,
      notes: 'Propuesta para renovar la presencia digital de la marca.',
      lines: [
        { catalogItemId: website.id, name: website.name, description: 'Web corporativa con páginas principales y responsive.', quantity: 1, unitPrice: 2800 },
        { catalogItemId: consulting.id, name: consulting.name, description: 'Sesión inicial de estrategia y alcance.', quantity: 1, unitPrice: 450 },
      ],
    }),
    createQuote({
      code: `BL-${workspaceId.slice(-6)}-017`,
      clientId: norte.id,
      status: QuoteStatus.ACCEPTED,
      notes: 'Mantenimiento web y soporte mensual.',
      lines: [
        { catalogItemId: maintenance.id, name: maintenance.name, description: 'Tres meses de mantenimiento y mejoras menores.', quantity: 3, unitPrice: 390 },
      ],
    }),
    createQuote({
      code: `BL-${workspaceId.slice(-6)}-016`,
      clientId: verde.id,
      status: QuoteStatus.REVISION,
      notes: 'Pendiente de ajustar alcance de SEO y contenidos.',
      lines: [
        { catalogItemId: website.id, name: website.name, description: 'Web corporativa para nueva línea de negocio.', quantity: 1, unitPrice: 2800 },
        { catalogItemId: seo.id, name: seo.name, description: 'Auditoría técnica inicial.', quantity: 1, unitPrice: 690 },
      ],
    }),
    createQuote({
      code: `BL-${workspaceId.slice(-6)}-015`,
      clientId: lantia.id,
      status: QuoteStatus.DRAFT,
      notes: 'Borrador pendiente de revisión interna.',
      lines: [
        { catalogItemId: consulting.id, name: consulting.name, description: 'Consultoría inicial para definir prioridades.', quantity: 1, unitPrice: 450 },
      ],
    }),
  ])

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  await Promise.all([
    prisma.task.create({
      data: {
        workspaceId,
        clientId: bruma.id,
        quoteId: brumaQuote.id,
        title: 'Llamar para resolver dudas del presupuesto',
        description: 'Confirmar alcance y fecha de inicio.',
        dueDate: today,
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING,
      },
    }),
    prisma.task.create({
      data: {
        workspaceId,
        clientId: verde.id,
        quoteId: verdeQuote.id,
        title: 'Enviar revision con SEO ajustado',
        dueDate: tomorrow,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.IN_PROGRESS,
      },
    }),
    prisma.task.create({
      data: {
        workspaceId,
        clientId: norte.id,
        quoteId: norteQuote.id,
        title: 'Preparar onboarding de mantenimiento',
        dueDate: nextWeek,
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING,
      },
    }),
    prisma.task.create({
      data: {
        workspaceId,
        clientId: lantia.id,
        quoteId: lantiaQuote.id,
        title: 'Revisar borrador interno',
        dueDate: today,
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING,
      },
    }),
  ])
}
