import { http } from './http'

export type AuthUser = {
  id: string
  name: string
  email: string
  isDemo: boolean
  createdAt: string
}

export type AuthWorkspace = {
  id: string
  name: string
  slug: string
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export type AuthResponse = {
  user: AuthUser
  workspace: AuthWorkspace
  token: string
  expiresAt: string
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await http.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function register(payload: {
  name: string
  email: string
  password: string
}) {
  const { data } = await http.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function startDemo() {
  const { data } = await http.post<AuthResponse>('/auth/demo')
  return data
}
