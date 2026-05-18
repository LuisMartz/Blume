import { Download, Eye, Send } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'

const quotes = [
  { code: 'BL-2026-018', client: 'Acme Studio', date: '18 may 2026', amount: '3.450 €', status: 'Enviado' },
  { code: 'BL-2026-017', client: 'Norte Dental', date: '16 may 2026', amount: '1.280 €', status: 'Aceptado' },
  { code: 'BL-2026-016', client: 'Verde Home', date: '14 may 2026', amount: '5.900 €', status: 'Revisión' },
  { code: 'BL-2026-015', client: 'Atlas Legal', date: '10 may 2026', amount: '860 €', status: 'Borrador' },
]

export function QuotesPage() {
  return (
    <div>
      <PageHeader
        title="Presupuestos"
        description="Seguimiento de propuestas, importes y acciones rápidas para cada oportunidad."
        action="Crear presupuesto"
      />

      <article className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Código</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Importe</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => (
                <tr key={quote.code}>
                  <td className="px-5 py-4 font-medium text-slate-950">{quote.code}</td>
                  <td className="px-5 py-4 text-slate-600">{quote.client}</td>
                  <td className="px-5 py-4 text-slate-600">{quote.date}</td>
                  <td className="px-5 py-4 text-slate-600">{quote.amount}</td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={quote.status === 'Aceptado' ? 'active' : quote.status === 'Borrador' ? 'neutral' : 'pending'}>
                      {quote.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
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
      </article>
    </div>
  )
}
