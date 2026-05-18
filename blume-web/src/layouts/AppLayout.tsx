import {
  BarChart3,
  Bell,
  Boxes,
  FileText,
  LayoutDashboard,
  Search,
  UsersRound,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, end: true },
  { name: 'Clientes', href: '/clients', icon: UsersRound },
  { name: 'Productos', href: '/products', icon: Boxes },
  { name: 'Presupuestos', href: '/quotes', icon: FileText },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
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
              end={item.end}
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
            Mayo 2026
          </div>
          <p className="mt-2 text-sm text-slate-500">
            18 presupuestos enviados y 12 pendientes de respuesta.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="grid size-9 place-items-center rounded-md bg-emerald-600 text-sm font-bold text-white">
                B
              </div>
              <span className="font-semibold">Blume</span>
            </div>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                placeholder="Buscar clientes, productos o presupuestos"
                type="search"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Notificaciones"
              >
                <Bell className="size-5" aria-hidden="true" />
              </button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">Luis</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <div className="grid size-10 place-items-center rounded-md bg-slate-900 text-sm font-semibold text-white">
                L
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100',
                  ].join(' ')
                }
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
