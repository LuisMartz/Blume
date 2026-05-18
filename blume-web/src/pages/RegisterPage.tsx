import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { register, startDemo } from '../api/auth'
import { saveSession } from '../api/session'
import { Card } from '../components/ui/Card'

export function RegisterPage() {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      saveSession(session)
      navigate('/dashboard')
    },
  })
  const demoMutation = useMutation({
    mutationFn: startDemo,
    onSuccess: (session) => {
      saveSession(session)
      navigate('/dashboard')
    },
  })

  return (
    <Card className="w-full max-w-md p-7 shadow-[0_24px_70px_-35px_color-mix(in_oklab,var(--brand)_30%,transparent)]">
      <div>
        <p className="text-sm font-medium text-[var(--brand)]">Nuevo espacio</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">Crear cuenta</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Crea un usuario inicial para empezar a separar la demo de una app pública.
        </p>
      </div>

      <form
        className="mt-7 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)

          mutation.mutate({
            name: String(formData.get('name')),
            email: String(formData.get('email')),
            password: String(formData.get('password')),
          })
        }}
      >
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Nombre</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-emerald-100"
            name="name"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-emerald-100"
            name="email"
            type="email"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contraseña</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-emerald-100"
            minLength={8}
            name="password"
            type="password"
            required
          />
        </label>

        {mutation.isError ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            No se pudo crear la cuenta. Puede que el email ya exista.
          </p>
        ) : null}

        <button
          className="h-11 w-full rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending}
          type="submit"
        >
          {mutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        <button
          className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={demoMutation.isPending}
          type="button"
          onClick={() => demoMutation.mutate()}
        >
          {demoMutation.isPending ? 'Preparando demo...' : 'Probar sin registrarme'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link className="font-medium text-[var(--brand-deep)]" to="/login">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
