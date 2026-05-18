import { ArrowLeft, Check, FileText, UsersRound } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { BlumeLogo } from '../components/brand/BlumeLogo'

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] lg:block">
          <div className="bg-grid-faint absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
          <div className="relative flex min-h-screen flex-col px-10 py-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <BlumeLogo className="h-8 w-8" />
              <span className="font-semibold">Blume</span>
            </Link>

            <div className="my-auto max-w-xl">
              <p className="text-sm font-medium text-[var(--brand)]">Gestión comercial ligera</p>
              <h1 className="mt-4 font-display text-5xl leading-tight">
                Clientes, catálogo y presupuestos con datos reales.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                Accede a tu espacio para trabajar con la API REST, Prisma y Neon sin salir de una interfaz limpia.
              </p>

              <div className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_24px_70px_-35px_color-mix(in_oklab,var(--brand)_30%,transparent)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Resumen</p>
                    <p className="mt-1 font-display text-3xl">42.800 €</p>
                  </div>
                  <div className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-medium text-[var(--brand-deep)]">
                    +12,4%
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    [UsersRound, 'Clientes activos', '128'],
                    [FileText, 'Presupuestos abiertos', '24'],
                    [Check, 'Aceptados este mes', '4'],
                  ].map(([Icon, label, value]) => (
                    <div key={String(label)} className="flex items-center justify-between rounded-lg bg-[var(--surface)] p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <p className="text-sm text-slate-600">{String(label)}</p>
                      </div>
                      <p className="font-semibold">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">Demo local · API REST · Neon PostgreSQL</p>
          </div>
        </section>

        <section className="flex min-h-screen flex-col px-6 py-6">
          <div className="flex items-center justify-between lg:justify-end">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BlumeLogo className="h-8 w-8" />
              <span className="font-semibold">Blume</span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-10">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
