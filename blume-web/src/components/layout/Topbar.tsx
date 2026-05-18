import { useState } from 'react'
import { Bell, LogOut, Plus, Search } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getStoredUser } from '../../api/session'
import { navigation } from '../../data/navigation'
import { BlumeLogo } from '../brand/BlumeLogo'

export function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const user = getStoredUser()
  const active = navigation.find((item) => location.pathname.startsWith(item.href))
  const title = active?.name ?? 'Panel'
  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'BL'

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <BlumeLogo className="h-8 w-8" />
          <span className="font-semibold">Blume</span>
        </div>

        <div className="hidden lg:block">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Blume</p>
          <h1 className="text-lg font-semibold leading-none">{title}</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <form
            className="relative hidden md:block"
            onSubmit={(event) => {
              event.preventDefault()
              if (query.trim()) {
                navigate('/clients')
              }
            }}
          >
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-9 w-72 rounded-md border border-[var(--border)] bg-white pl-8 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-emerald-100"
              placeholder="Buscar clientes, presupuestos..."
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-white"
            aria-label="Ver tareas"
            title="Ver tareas"
            onClick={() => navigate('/tasks')}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hidden h-9 items-center gap-1 rounded-md bg-[var(--brand)] px-3 text-sm font-medium text-white sm:inline-flex"
            onClick={() => navigate('/quotes')}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear
          </button>
          {user?.isDemo ? (
            <span className="hidden rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--brand-deep)] sm:inline-flex">
              Demo
            </span>
          ) : null}
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">
            {initials}
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-white"
            aria-label="Cerrar sesion"
            title="Cerrar sesion"
            onClick={() => {
              clearSession()
              navigate('/login')
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-[var(--border)] px-4 py-2 lg:hidden">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              [
                'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-[var(--brand-soft)] text-[var(--brand-deep)]'
                  : 'text-slate-500 hover:bg-white',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
