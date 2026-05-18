import { clientStatusLabel, formatCurrency, quoteStatusLabel } from '../../api/format'
import type { DashboardActivity } from '../../api/types'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { StateBlock } from '../ui/StateBlock'

type RecentActivityTableProps = {
  activity: DashboardActivity[]
}

function statusLabel(status: DashboardActivity['status']) {
  if (['DRAFT', 'SENT', 'REVISION', 'ACCEPTED', 'REJECTED'].includes(status)) {
    return quoteStatusLabel(status as never)
  }

  return clientStatusLabel(status as never)
}

function statusTone(status: DashboardActivity['status']) {
  if (status === 'ACCEPTED' || status === 'ACTIVE') return 'active'
  if (status === 'REJECTED' || status === 'INACTIVE') return 'danger'
  if (status === 'DRAFT') return 'neutral'
  return 'pending'
}

export function RecentActivityTable({ activity }: RecentActivityTableProps) {
  return (
    <Card>
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold">Actividad reciente</h2>
      </div>
      {activity.length === 0 ? (
        <div className="p-4">
          <StateBlock title="Sin actividad" description="Crea clientes o presupuestos para ver movimientos aqui." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
                <th className="px-4 py-3 font-medium sm:px-5">Movimiento</th>
                <th className="px-4 py-3 font-medium sm:px-5">Importe</th>
                <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activity.map((item) => (
                <tr key={`${item.id}-${item.movement}`}>
                  <td className="px-4 py-4 font-medium text-slate-950 sm:px-5">{item.client}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{item.movement}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-4 sm:px-5">
                    <Badge tone={statusTone(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
