export const dashboardStats = [
  { name: 'Pipeline estimado', value: '42.800 €', change: '+12%' },
  { name: 'Clientes activos', value: '128', change: '+8' },
  { name: 'Presupuestos abiertos', value: '24', change: '+5' },
  { name: 'Tareas vencen hoy', value: '7', change: '3 urgentes' },
]

export const activity = [
  { client: 'Bruma Studio', action: 'Presupuesto enviado', amount: '3.450 €', status: 'Pendiente' },
  { client: 'Norte Dental', action: 'Aceptó propuesta', amount: '1.280 €', status: 'Ganado' },
  { client: 'Verde Home', action: 'Revisión solicitada', amount: '5.900 €', status: 'En revisión' },
  { client: 'Lantia Legal', action: 'Nuevo cliente creado', amount: '860 €', status: 'Activo' },
]

export const funnel = [
  { label: 'Contactado', value: 86 },
  { label: 'Propuesta enviada', value: 62 },
  { label: 'Negociación', value: 38 },
  { label: 'Cerrado', value: 24 },
]

export const clients = [
  { name: 'Bruma Studio', contact: 'Laura Martín', email: 'laura@brumastudio.es', phone: '+34 610 245 823', value: '12.400 €', status: 'Activo' },
  { name: 'Norte Dental', contact: 'Pablo Ruiz', email: 'pablo@nortedental.es', phone: '+34 689 441 209', value: '8.950 €', status: 'Activo' },
  { name: 'Verde Home', contact: 'Clara Soler', email: 'clara@verdehome.es', phone: '+34 622 118 704', value: '5.900 €', status: 'Pendiente' },
  { name: 'Lantia Legal', contact: 'Marcos Gil', email: 'marcos@lantialegal.es', phone: '+34 677 309 551', value: '2.150 €', status: 'Nuevo' },
]

export const catalogItems = [
  { name: 'Consultoría inicial', category: 'Servicio', price: '450 €', margin: '72%', status: 'Activo' },
  { name: 'Diseño web corporativo', category: 'Proyecto', price: '2.800 €', margin: '64%', status: 'Activo' },
  { name: 'Mantenimiento mensual', category: 'Retainer', price: '390 €/mes', margin: '58%', status: 'Activo' },
  { name: 'Auditoría SEO', category: 'Servicio', price: '690 €', margin: '61%', status: 'Borrador' },
]

export const quotes = [
  { code: 'BL-2026-018', client: 'Bruma Studio', date: '18 may 2026', amount: '3.450 €', status: 'Enviado' },
  { code: 'BL-2026-017', client: 'Norte Dental', date: '16 may 2026', amount: '1.280 €', status: 'Aceptado' },
  { code: 'BL-2026-016', client: 'Verde Home', date: '14 may 2026', amount: '5.900 €', status: 'Revisión' },
  { code: 'BL-2026-015', client: 'Lantia Legal', date: '10 may 2026', amount: '860 €', status: 'Borrador' },
]

export const tasks = [
  { title: 'Llamar a Bruma Studio', client: 'Bruma Studio', due: 'Hoy, 12:00', priority: 'Alta', status: 'Pendiente' },
  { title: 'Enviar revisión de presupuesto', client: 'Verde Home', due: 'Hoy, 17:30', priority: 'Alta', status: 'Pendiente' },
  { title: 'Preparar propuesta mensual', client: 'Norte Dental', due: 'Mañana', priority: 'Media', status: 'En curso' },
  { title: 'Actualizar datos fiscales', client: 'Lantia Legal', due: '22 may', priority: 'Baja', status: 'Planificada' },
]

export const reports = [
  { name: 'Conversión de presupuestos', period: 'Mayo 2026', value: '34%', trend: '+6%' },
  { name: 'Valor medio por propuesta', period: 'Mayo 2026', value: '2.675 €', trend: '+11%' },
  { name: 'Clientes nuevos', period: 'Mayo 2026', value: '18', trend: '+4' },
]
