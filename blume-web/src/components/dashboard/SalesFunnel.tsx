import { funnel } from '../../data/mockData'
import { Card } from '../ui/Card'

export function SalesFunnel() {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">Embudo comercial</h2>
      <div className="mt-5 space-y-4">
        {funnel.map((item) => (
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
