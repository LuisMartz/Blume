import { CalendarDays, Search } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { tasks } from '../data/mockData'

export function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Seguimiento de próximos pasos, vencimientos y recordatorios por cliente."
        action="Nueva tarea"
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Buscar tarea"
              type="search"
            />
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
            <option>Todas las prioridades</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.title} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_180px_140px_120px] md:items-center">
              <div>
                <p className="font-medium text-slate-950">{task.title}</p>
                <p className="mt-1 text-sm text-slate-500">{task.client}</p>
              </div>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays className="size-4 text-slate-400" aria-hidden="true" />
                {task.due}
              </p>
              <Badge tone={task.priority === 'Alta' ? 'danger' : task.priority === 'Media' ? 'pending' : 'neutral'}>
                {task.priority}
              </Badge>
              <Badge tone={task.status === 'Pendiente' ? 'pending' : 'neutral'}>
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
