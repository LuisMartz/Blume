import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, Mail, Phone } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clientStatusLabel, formatCurrency, formatDate, quoteStatusLabel, taskPriorityLabel, taskStatusLabel } from '../api/format'
import { getClient } from '../api/queries/clients'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { StateBlock } from '../components/ui/StateBlock'

export function ClientDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: client, isLoading, isError } = useQuery({
    queryKey: ['clients', id],
    queryFn: () => getClient(id!),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return <StateBlock title="Cargando cliente" description="Leyendo el detalle del cliente desde Neon." />
  }

  if (isError || !client) {
    return <StateBlock title="No se pudo cargar el cliente" description="Comprueba que exista y que la API este disponible." />
  }

  return (
    <div>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        onClick={() => navigate('/clients')}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a clientes
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-slate-950">{client.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{client.contact ?? 'Sin contacto principal'}</p>
        </div>
        <Badge tone={client.status === 'ACTIVE' ? 'active' : client.status === 'INACTIVE' ? 'neutral' : 'pending'}>
          {clientStatusLabel(client.status)}
        </Badge>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold">Datos del cliente</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <p className="flex min-w-0 items-center gap-2 text-slate-600">
              <Mail className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">{client.email ?? 'Sin email'}</span>
            </p>
            <p className="flex min-w-0 items-center gap-2 text-slate-600">
              <Phone className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">{client.phone ?? 'Sin telefono'}</span>
            </p>
            <p><span className="font-medium text-slate-950">NIF/CIF:</span> {client.taxId ?? '-'}</p>
            <p><span className="font-medium text-slate-950">Ciudad:</span> {client.city ?? '-'}</p>
            <p className="sm:col-span-2"><span className="font-medium text-slate-950">Direccion:</span> {[client.address, client.postalCode, client.country].filter(Boolean).join(', ') || '-'}</p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Resumen</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-500">Valor estimado</p>
              <p className="mt-1 text-xl font-semibold">{formatCurrency(client.value)}</p>
            </div>
            <div className="rounded-md bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase text-slate-500">Presupuestos</p>
              <p className="mt-1 text-xl font-semibold">{client.quotes.length}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">Presupuestos del cliente</h2>
          </div>
          {client.quotes.length === 0 ? (
            <div className="p-4"><StateBlock title="Sin presupuestos" description="Crea un presupuesto para este cliente desde la seccion de presupuestos." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Codigo</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {client.quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-5 py-4 font-medium">{quote.code}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(quote.date)}</td>
                      <td className="px-5 py-4 text-slate-600">{formatCurrency(quote.total)}</td>
                      <td className="px-5 py-4"><Badge tone={quote.status === 'ACCEPTED' ? 'active' : quote.status === 'REJECTED' ? 'danger' : 'pending'}>{quoteStatusLabel(quote.status)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Tareas</h2>
            <Link className="text-sm font-medium text-[var(--brand-deep)]" to="/tasks" state={{ openCreate: true }}>
              Nueva
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {(client.tasks ?? []).length === 0 ? (
              <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">Sin tareas vinculadas.</p>
            ) : (
              client.tasks!.map((task) => (
                <div key={task.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-950">{task.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {formatDate(task.dueDate)} - {taskPriorityLabel(task.priority)} - {taskStatusLabel(task.status)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}
