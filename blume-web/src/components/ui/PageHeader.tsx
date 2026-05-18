type PageHeaderProps = {
  title: string
  description: string
  action?: string
  secondaryAction?: string
  onAction?: () => void
  onSecondaryAction?: () => void
}

export function PageHeader({
  title,
  description,
  action,
  secondaryAction,
  onAction,
  onSecondaryAction,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-slate-950">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          {secondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-[var(--surface)]"
            >
              {secondaryAction}
            </button>
          ) : null}
          {action ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:opacity-90"
            >
              {action}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
