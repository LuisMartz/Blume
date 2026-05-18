import type { AuthResponse } from './auth'

export function saveSession(session: AuthResponse) {
  localStorage.setItem('blume_token', session.token)
  localStorage.setItem('blume_user', JSON.stringify(session.user))
}

export function getStoredToken() {
  return localStorage.getItem('blume_token')
}
