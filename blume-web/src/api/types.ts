export type ClientStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE'
export type CatalogStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
export type QuoteStatus = 'DRAFT' | 'SENT' | 'REVISION' | 'ACCEPTED' | 'REJECTED'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Client = {
  id: string
  name: string
  contact: string | null
  email: string | null
  phone: string | null
  taxId: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  country: string
  value: string | null
  status: ClientStatus
  createdAt: string
  updatedAt: string
  _count?: {
    quotes: number
  }
}

export type ClientDetail = Client & {
  quotes: Quote[]
  tasks?: Task[]
}

export type CatalogItem = {
  id: string
  name: string
  description: string | null
  category: string
  unit: string
  price: string
  margin: number | null
  status: CatalogStatus
  createdAt: string
  updatedAt: string
}

export type QuoteItem = {
  id: string
  quoteId: string
  catalogItemId: string | null
  name: string
  description: string | null
  quantity: number
  unitPrice: string
  total: string
}

export type Quote = {
  id: string
  code: string
  clientId: string
  date: string
  validUntil: string | null
  status: QuoteStatus
  subtotal: string
  taxRate: string
  taxAmount: string
  total: string
  notes: string | null
  createdAt: string
  updatedAt: string
  client: Client
  items: QuoteItem[]
  tasks?: Task[]
}

export type Task = {
  id: string
  workspaceId: string
  clientId: string | null
  quoteId: string | null
  title: string
  description: string | null
  dueDate: string | null
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
  client?: Client | null
  quote?: Quote | null
}

export type DashboardActivity = {
  id: string
  client: string
  movement: string
  amount: string | number | null
  status: QuoteStatus | ClientStatus
  date: string
}

export type DashboardSummary = {
  stats: {
    pipeline: number
    activeClients: number
    openQuotes: number
    dueToday: number
    urgentTasks: number
  }
  activity: DashboardActivity[]
  tasks: Task[]
  funnel: {
    contacted: number
    sent: number
    revision: number
    closed: number
  }
}

export type WorkspaceSettings = {
  id: string
  workspaceId: string
  companyName: string
  taxId: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  country: string
  defaultTaxRate: string
  currency: string
  createdAt: string
  updatedAt: string
}
