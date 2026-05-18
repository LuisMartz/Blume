import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '../ui/Card'

type StatCardProps = {
  name: string
  value: string
  change: string
  icon: LucideIcon
}

export function StatCard({ name, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{name}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-700">
        <ArrowUpRight className="size-4" aria-hidden="true" />
        {change}
      </p>
    </Card>
  )
}
