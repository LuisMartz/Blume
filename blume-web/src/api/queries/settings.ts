import { http } from '../http'
import type { WorkspaceSettings } from '../types'

export type UpdateSettingsInput = {
  companyName: string
  taxId?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  defaultTaxRate?: number
  currency?: string
}

export async function getSettings() {
  const { data } = await http.get<WorkspaceSettings>('/settings')
  return data
}

export async function updateSettings(input: UpdateSettingsInput) {
  const { data } = await http.put<WorkspaceSettings>('/settings', input)
  return data
}
