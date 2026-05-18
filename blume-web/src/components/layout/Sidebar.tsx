import { BarChart3, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { getStoredWorkspace } from '../../api/session'
import { navigation } from '../../data/navigation'
import { BlumeLogo } from '../brand/BlumeLogo'

export function Sidebar() {
  const workspace = getStoredWorkspace()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--border)] bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-5">
        <BlumeLogo className="h-7 w-7" />
        <span className="font-semibold">Blume</span>
      </div>

      <div className="px-3 pt-4">
        <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2">
          <div className="h-7 w-7 rounded bg-[var(--brand)]" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{workspace?.name ?? 'Espacio Blume'}</p>
            <p className="text-[11px] text-slate-500">
              {workspace?.isDemo ? 'Demo temporal' : 'Plan Profesional'}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 px-3">
        <p className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Gestión
        </p>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--brand-soft)] font-medium text-[var(--brand-deep)]'
                  : 'text-slate-500 hover:bg-[var(--surface)] hover:text-slate-950',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <BarChart3 className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
            Resumen mensual
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Enviados</dt>
              <dd className="font-semibold">18</dd>
            </div>
            <div>
              <dt className="text-slate-500">Aceptados</dt>
              <dd className="font-semibold">4</dd>
            </div>
          </dl>
        </div>
        <NavLink
          to="/settings"
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-500 hover:bg-[var(--surface)] hover:text-slate-950"
        >
          <Settings className="h-4 w-4" /> Ajustes
        </NavLink>
      </div>
    </aside>
  )
}
