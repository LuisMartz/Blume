import { http } from '../http'
import type { DashboardSummary } from '../types'

export async function getDashboard() {
  const { data } = await http.get<DashboardSummary>('/dashboard')
  return data
}
