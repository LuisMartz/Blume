const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
}

type StatusBadgeProps = {
  children: string
  tone?: keyof typeof statusStyles
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[tone]}`}
    >
      {children}
    </span>
  )
}
