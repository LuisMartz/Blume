import type { CatalogStatus, ClientStatus, QuoteStatus, TaskPriority, TaskStatus } from './types'

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(value: string | number | null | undefined) {
  if (value == null) {
    return '-'
  }

  return currencyFormatter.format(Number(value))
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  return dateFormatter.format(new Date(value))
}

export function clientStatusLabel(status: ClientStatus) {
  const labels: Record<ClientStatus, string> = {
    ACTIVE: 'Activo',
    PENDING: 'Pendiente',
    INACTIVE: 'Inactivo',
  }

  return labels[status]
}

export function catalogStatusLabel(status: CatalogStatus) {
  const labels: Record<CatalogStatus, string> = {
    ACTIVE: 'Activo',
    DRAFT: 'Borrador',
    ARCHIVED: 'Archivado',
  }

  return labels[status]
}

export function quoteStatusLabel(status: QuoteStatus) {
  const labels: Record<QuoteStatus, string> = {
    DRAFT: 'Borrador',
    SENT: 'Enviado',
    REVISION: 'Revisión',
    ACCEPTED: 'Aceptado',
    REJECTED: 'Rechazado',
  }

  return labels[status]
}

export function taskStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En curso',
    DONE: 'Completada',
  }

  return labels[status]
}

export function taskPriorityLabel(priority: TaskPriority) {
  const labels: Record<TaskPriority, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  }

  return labels[priority]
}
