import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

const settings = [
  { label: 'Nombre comercial', value: 'Blume Studio' },
  { label: 'Moneda', value: 'EUR' },
  { label: 'IVA por defecto', value: '21%' },
  { label: 'Prefijo presupuestos', value: 'BL-2026' },
]

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Ajustes"
        description="Configuración básica de empresa, presupuestos y preferencias comerciales."
        action="Guardar cambios"
      />

      <Card className="max-w-3xl p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {settings.map((setting) => (
            <label key={setting.label} className="block">
              <span className="text-sm font-medium text-slate-700">{setting.label}</span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                defaultValue={setting.value}
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
