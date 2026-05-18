import { activity } from '../../data/mockData'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

export function RecentActivityTable() {
  return (
    <Card>
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold">Actividad reciente</h2>
      </div>
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
              <tr key={`${item.client}-${item.action}`}>
                <td className="px-4 py-4 font-medium text-slate-950 sm:px-5">{item.client}</td>
                <td className="px-4 py-4 text-slate-600 sm:px-5">{item.action}</td>
                <td className="px-4 py-4 text-slate-600 sm:px-5">{item.amount}</td>
                <td className="px-4 py-4 sm:px-5">
                  <Badge tone={item.status === 'Ganado' ? 'active' : 'pending'}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
