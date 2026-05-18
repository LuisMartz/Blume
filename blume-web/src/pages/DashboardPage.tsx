import { ArrowUpRight, CircleDollarSign, Clock3, FileCheck2, UsersRound } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'

const stats = [
  { name: 'Facturación estimada', value: '42.800 €', change: '+12%', icon: CircleDollarSign },
  { name: 'Clientes activos', value: '128', change: '+8', icon: UsersRound },
  { name: 'Presupuestos abiertos', value: '24', change: '+5', icon: FileCheck2 },
  { name: 'Tiempo medio cierre', value: '6 días', change: '-2 días', icon: Clock3 },
]

const activity = [
  { client: 'Acme Studio', action: 'Presupuesto enviado', amount: '3.450 €', status: 'Pendiente' },
  { client: 'Norte Dental', action: 'Aceptó propuesta', amount: '1.280 €', status: 'Ganado' },
  { client: 'Verde Home', action: 'Revisión solicitada', amount: '5.900 €', status: 'En revisión' },
  { client: 'Atlas Legal', action: 'Nuevo cliente creado', amount: '860 €', status: 'Activo' },
]

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de ventas, clientes y presupuestos para priorizar el trabajo del día."
        action="Nuevo presupuesto"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.name} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{stat.name}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stat.value}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <stat.icon className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="size-4" aria-hidden="true" />
              {stat.change} este mes
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">Actividad reciente</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Movimiento</th>
                  <th className="px-5 py-3 font-medium">Importe</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activity.map((item) => (
                  <tr key={`${item.client}-${item.action}`}>
                    <td className="px-5 py-4 font-medium text-slate-950">{item.client}</td>
                    <td className="px-5 py-4 text-slate-600">{item.action}</td>
                    <td className="px-5 py-4 text-slate-600">{item.amount}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={item.status === 'Ganado' ? 'active' : 'pending'}>
                        {item.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Embudo comercial</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Contactado', 86],
              ['Propuesta enviada', 62],
              ['Negociación', 38],
              ['Cerrado', 24],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
