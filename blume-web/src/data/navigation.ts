import {
  BarChart3,
  Boxes,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Settings,
  UsersRound,
} from 'lucide-react'

export const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clients', icon: UsersRound },
  { name: 'Catálogo', href: '/catalog', icon: Boxes },
  { name: 'Presupuestos', href: '/quotes', icon: FileText },
  { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  { name: 'Informes', href: '/reports', icon: BarChart3 },
  { name: 'Ajustes', href: '/settings', icon: Settings },
]
