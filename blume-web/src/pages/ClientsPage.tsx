import { Mail, Phone } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'

const clients = [
  { name: 'Acme Studio', contact: 'Laura Martín', email: 'laura@acme.studio', phone: '+34 610 245 823', value: '12.400 €', status: 'Activo' },
  { name: 'Norte Dental', contact: 'Pablo Ruiz', email: 'pablo@nortedental.es', phone: '+34 689 441 209', value: '8.950 €', status: 'Activo' },
  { name: 'Verde Home', contact: 'Clara Soler', email: 'clara@verdehome.es', phone: '+34 622 118 704', value: '5.900 €', status: 'Pendiente' },
  { name: 'Atlas Legal', contact: 'Marcos Gil', email: 'marcos@atlaslegal.es', phone: '+34 677 309 551', value: '2.150 €', status: 'Nuevo' },
]

export function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Base de clientes con contacto, estado comercial y valor estimado de oportunidades."
        action="Nuevo cliente"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {clients.map((client) => (
          <article key={client.email} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{client.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{client.contact}</p>
              </div>
              <StatusBadge tone={client.status === 'Activo' ? 'active' : 'pending'}>
                {client.status}
              </StatusBadge>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <span className="flex min-w-0 items-center gap-2">
                <Mail className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="truncate">{client.email}</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4 text-slate-400" aria-hidden="true" />
                {client.phone}
              </span>
            </div>
            <div className="mt-5 rounded-md bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-500">Valor estimado</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{client.value}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
