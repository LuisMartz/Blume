import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)] text-[var(--foreground)]">
      <Sidebar />
      <div className="min-w-0 lg:pl-64">
        <Topbar />
        <main className="min-w-0 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
