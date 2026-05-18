import { Card } from '../ui/Card'

type SalesFunnelProps = {
  funnel: {
    contacted: number
    sent: number
    revision: number
    closed: number
  }
}

function percent(value: number, total: number) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function SalesFunnel({ funnel }: SalesFunnelProps) {
  const total = Math.max(funnel.contacted, funnel.sent, funnel.revision, funnel.closed)
  const items = [
    { label: 'Contactado', value: percent(funnel.contacted, total) },
    { label: 'Propuesta enviada', value: percent(funnel.sent, total) },
    { label: 'Negociacion', value: percent(funnel.revision, total) },
    { label: 'Cerrado', value: percent(funnel.closed, total) },
  ]

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Embudo comercial</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-600"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
