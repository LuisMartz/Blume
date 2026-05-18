import { http } from '../http'
import type { CatalogItem } from '../types'

export async function getCatalogItems() {
  const { data } = await http.get<CatalogItem[]>('/catalog')
  return data
}
