import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Eye, Search, Send, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate, quoteStatusLabel } from '../api/format'
import { getCatalogItems } from '../api/queries/catalog'
import { getClients } from '../api/queries/clients'
import { createQuote, deleteQuote, getQuotes, updateQuote } from '../api/queries/quotes'
import type { Quote, QuoteStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

function quoteStatusTone(status: QuoteStatus) {
  if (status === 'ACCEPTED') return 'active'
  if (status === 'DRAFT') return 'neutral'
  if (status === 'REJECTED') return 'danger'
  return 'pending'
}

function downloadQuote(quote: Quote) {
  const lines = [
    `Presupuesto ${quote.code}`,
    `Cliente: ${quote.client.name}`,
    `Fecha: ${formatDate(quote.date)}`,
    `Estado: ${quoteStatusLabel(quote.status)}`,
    '',
    'Lineas:',
    ...quote.items.map((item) => `- ${item.name} x${item.quantity}: ${formatCurrency(item.total)}`),
    '',
    `Subtotal: ${formatCurrency(quote.subtotal)}`,
    `IVA ${Number(quote.taxRate)}%: ${formatCurrency(quote.taxAmount)}`,
    `Total: ${formatCurrency(quote.total)}`,
    quote.notes ? `Notas: ${quote.notes}` : '',
  ].filter(Boolean)

  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${quote.code}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export function QuotesPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'ALL' | QuoteStatus>('ALL')
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState('')
  const queryClient = useQueryClient()
  const { data: quotes = [], isLoading, isError } = useQuery({
    queryKey: ['quotes'],
    queryFn: getQuotes,
  })
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: catalogItems = [] } = useQuery({ queryKey: ['catalog'], queryFn: getCatalogItems })
  const selectedCatalogItem = catalogItems.find((item) => item.id === selectedCatalogItemId)

  const createMutation = useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      setIsModalOpen(false)
      setSelectedCatalogItemId('')
    },
  })
  const sendMutation = useMutation({
    mutationFn: (quoteId: string) => updateQuote(quoteId, { status: 'SENT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return quotes.filter((quote) => {
      const matchesStatus = status === 'ALL' || quote.status === status
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [quote.code, quote.client.name, quote.notes]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))

      return matchesStatus && matchesSearch
    })
  }, [quotes, search, status])

  return (
    <div>
      <PageHeader
        title="Presupuestos"
        description="Seguimiento de propuestas, importes y acciones rapidas para cada oportunidad."
        action="Crear presupuesto"
        secondaryAction="Nuevo cliente"
        onAction={() => setIsModalOpen(true)}
        onSecondaryAction={() => navigate('/clients')}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" onChange={(event) => setSearch(event.target.value)} placeholder="Filtrar presupuestos" type="search" value={search} />
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none" onChange={(event) => setStatus(event.target.value as 'ALL' | QuoteStatus)} value={status}>
            <option value="ALL">Todos los estados</option>
            <option value="SENT">Enviado</option>
            <option value="ACCEPTED">Aceptado</option>
            <option value="DRAFT">Borrador</option>
            <option value="REVISION">Revision</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-4"><StateBlock title="Cargando presupuestos" description="Leyendo propuestas desde Neon." /></div>
        ) : isError ? (
          <div className="p-4"><StateBlock title="No se pudieron cargar los presupuestos" description="Comprueba que blume-api este arrancada en el puerto 4000." /></div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-4"><StateBlock title="Sin resultados" description="Ajusta los filtros o crea una nueva propuesta." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-5">Codigo</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Fecha</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Subtotal</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Total</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-5">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-4 py-4 font-medium text-slate-950 sm:px-5">{quote.code}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{quote.client.name}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{formatDate(quote.date)}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{formatCurrency(quote.subtotal)}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{formatCurrency(quote.total)}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <Badge tone={quoteStatusTone(quote.status)}>{quoteStatusLabel(quote.status)}</Badge>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Ver presupuesto" title="Ver presupuesto" onClick={() => setSelectedQuote(quote)}>
                          <Eye className="size-4" aria-hidden="true" />
                        </button>
                        <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50" aria-label="Marcar como enviado" title="Marcar como enviado" disabled={sendMutation.isPending || quote.status === 'SENT'} onClick={() => sendMutation.mutate(quote.id)}>
                          <Send className="size-4" aria-hidden="true" />
                        </button>
                        <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Descargar presupuesto" title="Descargar presupuesto" onClick={() => downloadQuote(quote)}>
                          <Download className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-md border border-slate-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          aria-label="Eliminar presupuesto"
                          title="Eliminar presupuesto"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Eliminar presupuesto ${quote.code}?`)) {
                              deleteMutation.mutate(quote.id)
                            }
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal title="Crear presupuesto" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const catalogItem = catalogItems.find((item) => item.id === String(formData.get('catalogItemId')))
            if (!catalogItem) return
            createMutation.mutate({
              code: String(formData.get('code')),
              clientId: String(formData.get('clientId')),
              validUntil: String(formData.get('validUntil') || ''),
              status: formData.get('status') as QuoteStatus,
              taxRate: Number(formData.get('taxRate') || 21),
              notes: String(formData.get('notes') || ''),
              items: [{
                catalogItemId: catalogItem.id,
                name: catalogItem.name,
                description: catalogItem.description ?? '',
                quantity: Number(formData.get('quantity') || 1),
                unitPrice: Number(catalogItem.price),
              }],
            })
          }}
        >
          <label>
            <span className="text-sm font-medium text-slate-700">Codigo</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="code" defaultValue={`BL-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`} required />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Cliente</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="clientId" required disabled={clients.length === 0}>
              <option value="">{clients.length === 0 ? 'Crea un cliente primero' : 'Selecciona cliente'}</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Servicio</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="catalogItemId" required disabled={catalogItems.length === 0} onChange={(event) => setSelectedCatalogItemId(event.target.value)}>
              <option value="">{catalogItems.length === 0 ? 'Crea un servicio primero' : 'Selecciona servicio'}</option>
              {catalogItems.map((item) => <option key={item.id} value={item.id}>{item.name} - {formatCurrency(item.price)}</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Cantidad</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="1" name="quantity" defaultValue="1" type="number" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">IVA %</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" name="taxRate" defaultValue="21" step="0.01" type="number" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Validez</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="validUntil" type="date" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="status" defaultValue="DRAFT">
              <option value="DRAFT">Borrador</option>
              <option value="SENT">Enviado</option>
              <option value="REVISION">Revision</option>
            </select>
          </label>
          <div className="rounded-md bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Precio servicio</p>
            <p className="mt-1 text-sm font-semibold">{selectedCatalogItem ? formatCurrency(selectedCatalogItem.price) : '-'}</p>
          </div>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notas</span>
            <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="notes" />
          </label>
          {createMutation.isError ? <p className="sm:col-span-2 text-sm text-rose-700">No se pudo crear el presupuesto. Revisa que el codigo no exista ya.</p> : null}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-70" disabled={createMutation.isPending || clients.length === 0 || catalogItems.length === 0} type="submit">
              {createMutation.isPending ? 'Creando...' : 'Crear presupuesto'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal title={selectedQuote ? `Presupuesto ${selectedQuote.code}` : 'Presupuesto'} open={Boolean(selectedQuote)} onClose={() => setSelectedQuote(null)}>
        {selectedQuote ? (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-md bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <p><span className="font-medium text-slate-950">Cliente:</span> {selectedQuote.client.name}</p>
              <p><span className="font-medium text-slate-950">Fecha:</span> {formatDate(selectedQuote.date)}</p>
              <p><span className="font-medium text-slate-950">Estado:</span> {quoteStatusLabel(selectedQuote.status)}</p>
              <p><span className="font-medium text-slate-950">Validez:</span> {selectedQuote.validUntil ? formatDate(selectedQuote.validUntil) : 'Sin fecha'}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 font-medium">Concepto</th>
                    <th className="py-2 font-medium">Cantidad</th>
                    <th className="py-2 font-medium">Precio</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedQuote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">{item.name}</td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(selectedQuote.subtotal)}</strong></div>
              <div className="flex justify-between"><span>IVA {Number(selectedQuote.taxRate)}%</span><strong>{formatCurrency(selectedQuote.taxAmount)}</strong></div>
              <div className="flex justify-between text-base"><span>Total</span><strong>{formatCurrency(selectedQuote.total)}</strong></div>
            </div>
            {selectedQuote.notes ? <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">{selectedQuote.notes}</p> : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
