import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { CatalogPage } from '../pages/CatalogPage'
import { ClientsPage } from '../pages/ClientsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { QuotesPage } from '../pages/QuotesPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TasksPage } from '../pages/TasksPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'quotes',
        element: <QuotesPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
