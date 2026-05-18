import type { AuthResponse } from './auth'

export function saveSession(session: AuthResponse) {
  localStorage.setItem('blume_token', session.token)
  localStorage.setItem('blume_user', JSON.stringify(session.user))
  localStorage.setItem('blume_workspace', JSON.stringify(session.workspace))
}

export function getStoredToken() {
  return localStorage.getItem('blume_token')
}

export function getStoredUser() {
  const rawUser = localStorage.getItem('blume_user')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthResponse['user']
  } catch {
    return null
  }
}

export function getStoredWorkspace() {
  const rawWorkspace = localStorage.getItem('blume_workspace')

  if (!rawWorkspace) {
    return null
  }

  try {
    return JSON.parse(rawWorkspace) as AuthResponse['workspace']
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem('blume_token')
  localStorage.removeItem('blume_user')
  localStorage.removeItem('blume_workspace')
}
