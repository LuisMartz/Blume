import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { ClientsPage } from '../pages/ClientsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProductsPage } from '../pages/ProductsPage'
import { QuotesPage } from '../pages/QuotesPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'quotes',
        element: <QuotesPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
