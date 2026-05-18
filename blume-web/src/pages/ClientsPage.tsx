import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Eye, Mail, Phone, Search, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clientStatusLabel, formatCurrency } from '../api/format'
import { createClient, deleteClient, getClients, updateClient } from '../api/queries/clients'
import type { Client, ClientStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

function clientStatusTone(status: ClientStatus) {
  if (status === 'ACTIVE') return 'active'
  if (status === 'INACTIVE') return 'neutral'
  return 'pending'
}

function clientPayload(formData: FormData) {
  return {
    name: String(formData.get('name')),
    contact: String(formData.get('contact') || ''),
    email: String(formData.get('email') || ''),
    phone: String(formData.get('phone') || ''),
    taxId: String(formData.get('taxId') || ''),
    address: String(formData.get('address') || ''),
    city: String(formData.get('city') || ''),
    postalCode: String(formData.get('postalCode') || ''),
    value: Number(formData.get('value') || 0),
    status: formData.get('status') as ClientStatus,
  }
}

export function ClientsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'ALL' | ClientStatus>('ALL')
  const queryClient = useQueryClient()
  const { data: clients = [], isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setIsModalOpen(false)
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReturnType<typeof clientPayload> }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setIsModalOpen(false)
      setEditingClient(null)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return clients.filter((client) => {
      const matchesStatus = status === 'ALL' || client.status === status
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [client.name, client.contact, client.email, client.phone, client.city]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))

      return matchesStatus && matchesSearch
    })
  }, [clients, search, status])

  useEffect(() => {
    if ((location.state as { openCreate?: boolean } | null)?.openCreate) {
      setEditingClient(null)
      setIsModalOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Base de clientes con contacto, estado comercial y valor estimado de oportunidades."
        action="Nuevo cliente"
        onAction={() => {
          setEditingClient(null)
          setIsModalOpen(true)
        }}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente"
            type="search"
            value={search}
          />
        </div>
        <select
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
          onChange={(event) => setStatus(event.target.value as 'ALL' | ClientStatus)}
          value={status}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="PENDING">Pendiente</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      {isLoading ? (
        <StateBlock title="Cargando clientes" description="Leyendo datos reales desde Neon." />
      ) : isError ? (
        <StateBlock title="No se pudieron cargar los clientes" description="Comprueba que blume-api este arrancada en el puerto 4000." />
      ) : filteredClients.length === 0 ? (
        <StateBlock title="Sin resultados" description="Ajusta los filtros o crea un nuevo cliente." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{client.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{client.contact ?? 'Sin contacto'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={clientStatusTone(client.status)}>{clientStatusLabel(client.status)}</Badge>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    aria-label={`Ver ${client.name}`}
                    title="Ver detalle"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    aria-label={`Editar ${client.name}`}
                    title="Editar cliente"
                    onClick={() => {
                      setEditingClient(client)
                      setIsModalOpen(true)
                    }}
                  >
                    <Edit2 className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-md border border-slate-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    aria-label={`Eliminar ${client.name}`}
                    title="Eliminar cliente"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (window.confirm(`Eliminar ${client.name}? Tambien se eliminaran sus presupuestos.`)) {
                        deleteMutation.mutate(client.id)
                      }
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <span className="flex min-w-0 items-center gap-2">
                  <Mail className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{client.email ?? 'Sin email'}</span>
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <Phone className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{client.phone ?? 'Sin telefono'}</span>
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Valor estimado</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{formatCurrency(client.value)}</p>
                </div>
                <div className="rounded-md bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Presupuestos</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{client._count?.quotes ?? 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal title={editingClient ? 'Editar cliente' : 'Nuevo cliente'} open={isModalOpen} onClose={closeModal}>
        <form
          key={editingClient?.id ?? 'new-client'}
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const payload = clientPayload(new FormData(event.currentTarget))

            if (editingClient) {
              updateMutation.mutate({ id: editingClient.id, data: payload })
              return
            }

            createMutation.mutate(payload)
          }}
        >
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="name" defaultValue={editingClient?.name ?? ''} required />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Contacto</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="contact" defaultValue={editingClient?.contact ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="email" type="email" defaultValue={editingClient?.email ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Telefono</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="phone" defaultValue={editingClient?.phone ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">NIF/CIF</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="taxId" defaultValue={editingClient?.taxId ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Direccion</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="address" defaultValue={editingClient?.address ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Ciudad</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="city" defaultValue={editingClient?.city ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Codigo postal</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="postalCode" defaultValue={editingClient?.postalCode ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Valor estimado</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" name="value" step="0.01" type="number" defaultValue={editingClient?.value ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="status" defaultValue={editingClient?.status ?? 'ACTIVE'}>
              <option value="ACTIVE">Activo</option>
              <option value="PENDING">Pendiente</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </label>
          {createMutation.isError || updateMutation.isError ? <p className="sm:col-span-2 text-sm text-rose-700">No se pudo guardar el cliente.</p> : null}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700" type="button" onClick={closeModal}>Cancelar</button>
            <button className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-70" disabled={createMutation.isPending || updateMutation.isPending} type="submit">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar cliente'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
