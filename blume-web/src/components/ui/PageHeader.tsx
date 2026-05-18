type PageHeaderProps = {
  title: string
  description: string
  action?: string
  secondaryAction?: string
}

export function PageHeader({
  title,
  description,
  action,
  secondaryAction,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          {secondaryAction ? (
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {secondaryAction}
            </button>
          ) : null}
          {action ? (
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              {action}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
