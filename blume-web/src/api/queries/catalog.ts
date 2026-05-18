import { http } from '../http'
import type { CatalogItem } from '../types'

export type CreateCatalogItemInput = {
  name: string
  description?: string
  category: string
  unit?: string
  price: number
  margin?: number
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
}

export async function getCatalogItems() {
  const { data } = await http.get<CatalogItem[]>('/catalog')
  return data
}

export async function createCatalogItem(input: CreateCatalogItemInput) {
  const { data } = await http.post<CatalogItem>('/catalog', input)
  return data
}
