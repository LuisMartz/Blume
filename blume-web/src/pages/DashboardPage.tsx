import { CheckSquare, CircleDollarSign, FileCheck2, UsersRound } from 'lucide-react'
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable'
import { SalesFunnel } from '../components/dashboard/SalesFunnel'
import { StatCard } from '../components/dashboard/StatCard'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { dashboardStats, tasks } from '../data/mockData'

const statIcons = [CircleDollarSign, UsersRound, FileCheck2, CheckSquare]

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de pipeline, clientes, tareas y presupuestos para priorizar el trabajo del día."
        action="Nuevo presupuesto"
        secondaryAction="Nuevo cliente"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => (
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
        <RecentActivityTable />
        <div className="space-y-6">
          <SalesFunnel />
          <Card className="p-5">
            <h2 className="font-semibold">Próximas tareas</h2>
            <div className="mt-4 space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.title} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-950">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {task.client} · {task.due}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
