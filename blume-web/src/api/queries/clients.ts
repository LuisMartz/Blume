import { http } from '../http'
import type { Client } from '../types'

export async function getClients() {
  const { data } = await http.get<Client[]>('/clients')
  return data
}
