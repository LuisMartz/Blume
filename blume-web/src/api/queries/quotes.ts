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

export async function getQuote(id: string) {
  const { data } = await http.get<Quote>(`/quotes/${id}`)
  return data
}

export async function createQuote(input: CreateQuoteInput) {
  const { data } = await http.post<Quote>('/quotes', input)
  return data
}

export type UpdateQuoteInput = Partial<{
  status: 'DRAFT' | 'SENT' | 'REVISION' | 'ACCEPTED' | 'REJECTED'
  validUntil: string
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
}>

export async function updateQuote(id: string, input: UpdateQuoteInput) {
  const { data } = await http.patch<Quote>(`/quotes/${id}`, input)
  return data
}

export async function deleteQuote(id: string) {
  await http.delete(`/quotes/${id}`)
}
