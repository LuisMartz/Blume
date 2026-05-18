import { useQuery } from '@tanstack/react-query'
import { CheckSquare, CircleDollarSign, FileCheck2, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate, taskPriorityLabel } from '../api/format'
import { getDashboard } from '../api/queries/dashboard'
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable'
import { SalesFunnel } from '../components/dashboard/SalesFunnel'
import { StatCard } from '../components/dashboard/StatCard'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

const statIcons = [CircleDollarSign, UsersRound, FileCheck2, CheckSquare]

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  })

  const stats = data
    ? [
        { name: 'Pipeline estimado', value: formatCurrency(data.stats.pipeline), change: `${data.stats.openQuotes} abiertos` },
        { name: 'Clientes activos', value: String(data.stats.activeClients), change: 'datos reales' },
        { name: 'Presupuestos abiertos', value: String(data.stats.openQuotes), change: 'sin cerrar' },
        { name: 'Tareas vencen hoy', value: String(data.stats.dueToday), change: `${data.stats.urgentTasks} urgentes` },
      ]
    : []

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de pipeline, clientes, tareas y presupuestos para priorizar el trabajo del dia."
        action="Nuevo presupuesto"
        secondaryAction="Nuevo cliente"
        onAction={() => navigate('/quotes', { state: { openCreate: true } })}
        onSecondaryAction={() => navigate('/clients', { state: { openCreate: true } })}
      />

      {isLoading ? (
        <StateBlock title="Cargando dashboard" description="Calculando resumen con datos reales de tu cuenta." />
      ) : isError || !data ? (
        <StateBlock title="No se pudo cargar el dashboard" description="Comprueba que la API este disponible y vuelve a intentarlo." />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.name}
                name={stat.name}
                value={stat.value}
                change={stat.change}
                icon={statIcons[index]}
              />
            ))}
          </section>

          <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <RecentActivityTable activity={data.activity} />
            <div className="space-y-6">
              <SalesFunnel funnel={data.funnel} />
              <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">Proximas tareas</h2>
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--brand-deep)]"
                    onClick={() => navigate('/tasks')}
                  >
                    Ver todas
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {data.tasks.length === 0 ? (
                    <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">No hay tareas pendientes.</p>
                  ) : (
                    data.tasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        className="block w-full rounded-md bg-slate-50 p-3 text-left transition hover:bg-slate-100"
                        onClick={() => navigate('/tasks')}
                      >
                        <p className="text-sm font-medium text-slate-950">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {task.client?.name ?? 'Sin cliente'} - {formatDate(task.dueDate)} - {taskPriorityLabel(task.priority)}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
