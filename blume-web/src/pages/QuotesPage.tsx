import { Download, Eye, Search, Send } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { quotes } from '../data/mockData'

export function QuotesPage() {
  return (
    <div>
      <PageHeader
        title="Presupuestos"
        description="Seguimiento de propuestas, importes y acciones rápidas para cada oportunidad."
        action="Crear presupuesto"
        secondaryAction="Nuevo cliente"
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Filtrar presupuestos"
              type="search"
            />
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
            <option>Todos los estados</option>
            <option>Enviado</option>
            <option>Aceptado</option>
            <option>Borrador</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Código</th>
                <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
                <th className="px-4 py-3 font-medium sm:px-5">Fecha</th>
                <th className="px-4 py-3 font-medium sm:px-5">Importe</th>
                <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
                <th className="px-4 py-3 text-right font-medium sm:px-5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => (
                <tr key={quote.code}>
                  <td className="px-4 py-4 font-medium text-slate-950 sm:px-5">{quote.code}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{quote.client}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{quote.date}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{quote.amount}</td>
                  <td className="px-4 py-4 sm:px-5">
                    <Badge tone={quote.status === 'Aceptado' ? 'active' : quote.status === 'Borrador' ? 'neutral' : 'pending'}>
                      {quote.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex justify-end gap-2">
                      {[
                        { label: 'Ver presupuesto', icon: Eye },
                        { label: 'Enviar presupuesto', icon: Send },
                        { label: 'Descargar presupuesto', icon: Download },
                      ].map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          aria-label={action.label}
                          title={action.label}
                        >
                          <action.icon className="size-4" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
