import { http } from '../http'
import type { Quote } from '../types'

export async function getQuotes() {
  const { data } = await http.get<Quote[]>('/quotes')
  return data
}
