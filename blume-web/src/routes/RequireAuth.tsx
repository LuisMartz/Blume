import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getStoredToken } from '../api/session'

export function RequireAuth() {
  const location = useLocation()
  const token = getStoredToken()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
