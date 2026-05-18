import { BarChart3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../../data/navigation'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
          B
        </div>
        <div>
          <p className="text-lg font-semibold leading-none">Blume</p>
          <p className="mt-1 text-xs text-slate-500">Gestión comercial</p>
        </div>
      </div>

      <nav className="mt-9 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              ].join(' ')
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <BarChart3 className="size-4 text-emerald-600" aria-hidden="true" />
          Resumen mensual
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Enviados</dt>
            <dd className="font-semibold text-slate-950">18</dd>
          </div>
          <div>
            <dt className="text-slate-500">Pendientes</dt>
            <dd className="font-semibold text-slate-950">12</dd>
          </div>
          <div>
            <dt className="text-slate-500">Aceptados</dt>
            <dd className="font-semibold text-slate-950">4</dd>
          </div>
          <div>
            <dt className="text-slate-500">Valor</dt>
            <dd className="font-semibold text-slate-950">42,8k</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
