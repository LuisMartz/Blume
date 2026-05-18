import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
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

  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold text-slate-950">Crear cuenta</h1>
      <p className="mt-2 text-sm text-slate-500">
        Crea un usuario inicial para empezar a separar la demo de una app pública.
      </p>

      <form
        className="mt-6 space-y-4"
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
            className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            name="name"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            name="email"
            type="email"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contraseña</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
          className="h-10 w-full rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending}
          type="submit"
        >
          {mutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link className="font-medium text-emerald-700" to="/login">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
