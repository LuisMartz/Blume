import { http } from '../http'
import type { Quote } from '../types'

export type CreateQuoteInput = {
  code: string
  clientId: string
  validUntil?: string
  status?: 'DRAFT' | 'SENT' | 'REVISION' | 'ACCEPTED' | 'REJECTED'
  taxRate?: number
  notes?: string
  items: Array<{
    catalogItemId?: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
  }>
}

export async function getQuotes() {
  const { data } = await http.get<Quote[]>('/quotes')
  return data
}

export async function createQuote(input: CreateQuoteInput) {
  const { data } = await http.post<Quote>('/quotes', input)
  return data
}
