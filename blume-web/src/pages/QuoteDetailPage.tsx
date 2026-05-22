import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, Download, FileText, Send } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatCurrency, formatDate, quoteStatusLabel, taskPriorityLabel, taskStatusLabel } from '../api/format'
import { getQuote, updateQuote } from '../api/queries/quotes'
import { getSettings } from '../api/queries/settings'
import type { Quote, QuoteStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { StateBlock } from '../components/ui/StateBlock'
import { downloadQuotePdf } from '../utils/quotePdf'

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
    `Validez: ${formatDate(quote.validUntil)}`,
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

export function QuoteDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { data: quote, isLoading, isError } = useQuery({
    queryKey: ['quotes', id],
    queryFn: () => getQuote(id!),
    enabled: Boolean(id),
  })
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })
  const sendMutation = useMutation({
    mutationFn: () => updateQuote(id!, { status: 'SENT' }),
    onSuccess: (updatedQuote) => {
      queryClient.setQueryData(['quotes', id], updatedQuote)
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  if (isLoading) {
    return <StateBlock title="Cargando presupuesto" description="Leyendo el presupuesto desde Neon." />
  }

  if (isError || !quote) {
    return <StateBlock title="No se pudo cargar el presupuesto" description="Comprueba que exista y que la API este disponible." />
  }

  return (
    <div>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        onClick={() => navigate('/quotes')}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a presupuestos
      </button>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--brand)]">Presupuesto</p>
          <h1 className="font-display text-3xl text-slate-950">{quote.code}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Para <Link className="font-medium text-[var(--brand-deep)]" to={`/clients/${quote.client.id}`}>{quote.client.name}</Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={quoteStatusTone(quote.status)}>{quoteStatusLabel(quote.status)}</Badge>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={() => downloadQuote(quote)}
          >
            <Download className="size-4" aria-hidden="true" />
            TXT
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={() => void downloadQuotePdf(quote, settings)}
          >
            <FileText className="size-4" aria-hidden="true" />
            PDF
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            disabled={quote.status === 'SENT' || sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
          >
            <Send className="size-4" aria-hidden="true" />
            Marcar enviado
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase text-slate-500">Fecha</p>
          <p className="mt-2 font-semibold">{formatDate(quote.date)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-slate-500">Validez</p>
          <p className="mt-2 font-semibold">{formatDate(quote.validUntil)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-slate-500">Subtotal</p>
          <p className="mt-2 font-semibold">{formatCurrency(quote.subtotal)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-slate-500">Total</p>
          <p className="mt-2 font-semibold">{formatCurrency(quote.total)}</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">Lineas del presupuesto</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Concepto</th>
                  <th className="px-5 py-3 font-medium">Cantidad</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-950">{item.name}</p>
                      {item.description ? <p className="mt-1 text-xs text-slate-500">{item.description}</p> : null}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.quantity}</td>
                    <td className="px-5 py-4 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-5 py-4 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ml-auto max-w-sm space-y-2 border-t border-slate-200 p-5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(quote.subtotal)}</strong></div>
            <div className="flex justify-between"><span>IVA {Number(quote.taxRate)}%</span><strong>{formatCurrency(quote.taxAmount)}</strong></div>
            <div className="flex justify-between text-base"><span>Total</span><strong>{formatCurrency(quote.total)}</strong></div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold">Cliente</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="font-medium text-slate-950">{quote.client.name}</p>
              <p>{quote.client.contact ?? 'Sin contacto'}</p>
              <p>{quote.client.email ?? 'Sin email'}</p>
              <p>{quote.client.phone ?? 'Sin telefono'}</p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Tareas vinculadas</h2>
              <Link className="text-sm font-medium text-[var(--brand-deep)]" to="/tasks" state={{ openCreate: true }}>
                Nueva
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {(quote.tasks ?? []).length === 0 ? (
                <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">Sin tareas vinculadas.</p>
              ) : (
                quote.tasks!.map((task) => (
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

          {quote.notes ? (
            <Card className="p-5">
              <h2 className="font-semibold">Notas</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{quote.notes}</p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  )
}
