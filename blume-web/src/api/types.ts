export type ClientStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE'
export type CatalogStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
export type QuoteStatus = 'DRAFT' | 'SENT' | 'REVISION' | 'ACCEPTED' | 'REJECTED'

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
}
