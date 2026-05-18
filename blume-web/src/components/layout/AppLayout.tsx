import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7fb] text-slate-950">
      <Sidebar />
      <div className="min-w-0 lg:pl-72">
        <Topbar />
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
