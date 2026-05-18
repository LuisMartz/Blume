import { useQuery } from '@tanstack/react-query'
import { Mail, Phone, Search } from 'lucide-react'
import { clientStatusLabel, formatCurrency } from '../api/format'
import { getClients } from '../api/queries/clients'
import type { ClientStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

function clientStatusTone(status: ClientStatus) {
  if (status === 'ACTIVE') {
    return 'active'
  }

  if (status === 'INACTIVE') {
    return 'neutral'
  }

  return 'pending'
}

export function ClientsPage() {
  const { data: clients = [], isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Base de clientes con contacto, estado comercial y valor estimado de oportunidades."
        action="Nuevo cliente"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Buscar cliente"
            type="search"
          />
        </div>
        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
          <option>Todos los estados</option>
          <option>Activo</option>
          <option>Pendiente</option>
          <option>Inactivo</option>
        </select>
      </div>

      {isLoading ? (
        <StateBlock title="Cargando clientes" description="Leyendo datos reales desde Neon." />
      ) : isError ? (
        <StateBlock
          title="No se pudieron cargar los clientes"
          description="Comprueba que blume-api esté arrancada en el puerto 4000."
        />
      ) : clients.length === 0 ? (
        <StateBlock
          title="Todavía no hay clientes"
          description="Crea el primer cliente para empezar a preparar presupuestos."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {clients.map((client) => (
            <Card key={client.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{client.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{client.contact ?? 'Sin contacto'}</p>
                </div>
                <Badge tone={clientStatusTone(client.status)}>
                  {clientStatusLabel(client.status)}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <span className="flex min-w-0 items-center gap-2">
                  <Mail className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{client.email ?? 'Sin email'}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-slate-400" aria-hidden="true" />
                  {client.phone ?? 'Sin teléfono'}
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Valor estimado</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {formatCurrency(client.value)}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Presupuestos</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {client._count?.quotes ?? 0}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
