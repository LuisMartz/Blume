import { TrendingUp } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { reports } from '../data/mockData'

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Informes"
        description="Indicadores comerciales para revisar conversión, valor medio y evolución mensual."
        action="Exportar informe"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.name} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{report.name}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{report.value}</p>
                <p className="mt-1 text-sm text-slate-500">{report.period}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <TrendingUp className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-emerald-700">{report.trend} frente al mes anterior</p>
          </Card>
        ))}
      </section>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold">Rendimiento mensual</h2>
        <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3">
          {[42, 56, 48, 72, 64, 86].map((height, index) => (
            <div key={height} className="flex h-full flex-col justify-end gap-2">
              <div
                className="rounded-t-md bg-emerald-600"
                style={{ height: `${height}%` }}
              />
              <span className="text-center text-xs text-slate-500">
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][index]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
