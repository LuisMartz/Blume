import { http } from '../http'
import type { Client } from '../types'

export type CreateClientInput = {
  name: string
  contact?: string
  email?: string
  phone?: string
  taxId?: string
  address?: string
  city?: string
  postalCode?: string
  value?: number
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE'
}

export async function getClients() {
  const { data } = await http.get<Client[]>('/clients')
  return data
}

export async function createClient(input: CreateClientInput) {
  const { data } = await http.post<Client>('/clients', input)
  return data
}
