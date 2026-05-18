import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  ListChecks,
  Package,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { startDemo } from '../api/auth'
import { saveSession } from '../api/session'
import { BlumeLogo } from '../components/brand/BlumeLogo'

const features = [
  { icon: UsersRound, title: 'Clientes centralizados', body: 'Ficha fiscal, contactos, valor estimado y actividad comercial.' },
  { icon: Package, title: 'Catálogo de servicios', body: 'Servicios reutilizables con precio, unidad, margen y estado.' },
  { icon: FileText, title: 'Presupuestos en minutos', body: 'Subtotal, IVA, total, validez y líneas vinculadas al catálogo.' },
  { icon: ListChecks, title: 'Tareas y seguimiento', body: 'Próximos pasos por cliente para no perder oportunidades.' },
  { icon: BarChart3, title: 'Informes claros', body: 'Pipeline, conversión y actividad sin hojas de cálculo.' },
  { icon: ShieldCheck, title: 'Datos seguros', body: 'Base PostgreSQL en Neon y API propia entre la app y los datos.' },
]

export function LandingPage() {
  const navigate = useNavigate()
  const demoMutation = useMutation({
    mutationFn: startDemo,
    onSuccess: (session) => {
      saveSession(session)
      navigate('/dashboard')
    },
  })

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <BlumeLogo className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight">Blume</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-500 md:flex">
            <a href="#producto" className="transition hover:text-slate-950">Producto</a>
            <a href="#presupuestos" className="transition hover:text-slate-950">Presupuestos</a>
            <Link to="/dashboard" className="transition hover:text-slate-950">Demo</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white sm:inline-flex" to="/login">
              Iniciar sesión
            </Link>
            <Link className="inline-flex h-9 items-center rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:opacity-90" to="/register">
              Probar Blume
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="bg-grid-faint absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium text-slate-500">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              Nuevo · Gestión comercial conectada a Neon
            </div>
            <h1 className="font-display text-5xl leading-tight md:text-7xl">
              La gestión comercial,<br />
              <em className="text-[var(--brand)] not-italic">simple y profesional.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Blume reúne clientes, catálogo, presupuestos y tareas en un único panel claro para autónomos y pequeños equipos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--brand)] px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
                disabled={demoMutation.isPending}
                type="button"
                onClick={() => demoMutation.mutate()}
              >
                {demoMutation.isPending ? 'Preparando demo...' : 'Abrir demo'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link className="inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-[var(--surface)]" to="/quotes">
                Ver presupuestos
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">Demo local · API REST · Prisma · Neon PostgreSQL</p>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--brand)_30%,transparent)]">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="producto" className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[var(--brand)]">Todo lo necesario</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Un panel, todas las áreas de tu negocio</h2>
            <p className="mt-4 text-slate-600">Diseñado con la sobriedad de una herramienta profesional. Sin distracciones, sin curva de aprendizaje.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="bg-white p-8 transition hover:bg-[var(--surface)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="presupuestos" className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium text-[var(--brand)]">Presupuestos</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Cierra más trabajos con propuestas claras</h2>
            <p className="mt-4 text-slate-600">Crea un presupuesto desde tu catálogo, calcula impuestos y guarda la relación con el cliente.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Estados profesionales', 'IVA, subtotal y total', 'Validez y notas', 'Datos persistidos en Neon'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <QuotePreviewCard />
        </div>
      </section>
    </main>
  )
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 text-xs text-slate-500">blume.app / panel</span>
        </div>
        <span className="text-xs text-slate-500">Mayo 2026</span>
      </div>
      <div className="grid grid-cols-12">
        <aside className="col-span-3 hidden border-r border-[var(--border)] bg-white p-4 md:block">
          <p className="px-2 text-xs font-medium uppercase tracking-wider text-slate-500">Espacio</p>
          <div className="mt-2 flex items-center gap-2 rounded-md bg-[var(--surface)] px-2 py-2">
            <div className="h-6 w-6 rounded bg-[var(--brand)]" />
            <div className="leading-tight">
              <p className="text-xs font-semibold">Estudio Marín</p>
              <p className="text-[10px] text-slate-500">Plan Profesional</p>
            </div>
          </div>
          <nav className="mt-5 space-y-1 text-sm">
            {['Panel', 'Clientes', 'Presupuestos', 'Catálogo', 'Tareas'].map((label, index) => (
              <div key={label} className={`rounded-md px-2 py-1.5 ${index === 0 ? 'bg-[var(--brand-soft)] text-[var(--brand-deep)]' : 'text-slate-500'}`}>
                {label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="col-span-12 p-5 md:col-span-9">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Pipeline', '42.800 €', '+12,4%'],
              ['Abiertos', '23', '+4'],
              ['Clientes', '84', '+3'],
            ].map(([label, value, delta]) => (
              <div key={label} className="rounded-lg border border-[var(--border)] bg-white p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-display text-2xl">{value}</p>
                <p className="mt-1 text-xs text-[var(--success)]">{delta}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 md:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Ingresos por semana</p>
                <p className="text-xs text-slate-500">Últimas 8 semanas</p>
              </div>
              <div className="mt-4 flex h-32 items-end gap-2">
                {[38, 52, 44, 60, 55, 72, 68, 84].map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-gradient-to-t from-[var(--brand-deep)] to-[var(--brand)]" style={{ height: `${value}%` }} />
                    <span className="text-[10px] text-slate-500">S{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 md:col-span-2">
              <p className="text-sm font-medium">Actividad reciente</p>
              <ul className="mt-3 space-y-3 text-xs">
                {['Bruma Studio aceptó una propuesta', 'Norte Dental abrió presupuesto', 'Verde Home pidió revisión'].map((item) => (
                  <li key={item} className="text-slate-500">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function QuotePreviewCard() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Presupuesto</p>
          <p className="font-display text-2xl">BL-2026-018</p>
        </div>
        <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--brand-deep)]">Aceptado</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Diseño web corporativo', '2.800 €'],
              ['Consultoría inicial', '450 €'],
              ['IVA 21%', '682,50 €'],
            ].map(([name, value]) => (
              <tr key={name} className="border-t border-[var(--border)] first:border-t-0">
                <td className="px-3 py-3">{name}</td>
                <td className="px-3 py-3 text-right font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-3 font-semibold">
        <span>Total</span>
        <span>3.932,50 €</span>
      </div>
    </div>
  )
}
