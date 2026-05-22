import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, ReceiptText } from 'lucide-react'
import { getSettings, updateSettings } from '../api/queries/settings'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })
  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  return (
    <div>
      <PageHeader
        title="Ajustes"
        description="Configuracion de empresa, identidad fiscal y preferencias para presupuestos."
      />

      {isLoading ? (
        <StateBlock title="Cargando ajustes" description="Leyendo la configuracion del workspace." />
      ) : isError || !settings ? (
        <StateBlock title="No se pudieron cargar los ajustes" description="Comprueba que la API este disponible." />
      ) : (
        <form
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)

            mutation.mutate({
              companyName: String(formData.get('companyName')),
              taxId: String(formData.get('taxId') || ''),
              address: String(formData.get('address') || ''),
              city: String(formData.get('city') || ''),
              postalCode: String(formData.get('postalCode') || ''),
              country: String(formData.get('country') || 'España'),
              defaultTaxRate: Number(formData.get('defaultTaxRate') || 21),
              currency: String(formData.get('currency') || 'EUR').toUpperCase(),
            })
          }}
        >
          <Card className="p-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <Building2 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold">Datos de empresa</h2>
                <p className="text-sm text-slate-500">Estos datos apareceran en presupuestos y documentos.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Nombre comercial</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="companyName" defaultValue={settings.companyName} required />
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">NIF/CIF</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="taxId" defaultValue={settings.taxId ?? ''} />
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">Pais</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="country" defaultValue={settings.country} />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Direccion</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="address" defaultValue={settings.address ?? ''} />
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">Ciudad</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="city" defaultValue={settings.city ?? ''} />
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">Codigo postal</span>
                <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="postalCode" defaultValue={settings.postalCode ?? ''} />
              </label>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                  <ReceiptText className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold">Presupuestos</h2>
                  <p className="text-sm text-slate-500">Preferencias por defecto para nuevas propuestas.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                <label>
                  <span className="text-sm font-medium text-slate-700">IVA por defecto %</span>
                  <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" max="100" name="defaultTaxRate" step="0.01" type="number" defaultValue={settings.defaultTaxRate} />
                </label>
                <label>
                  <span className="text-sm font-medium text-slate-700">Moneda</span>
                  <input className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxLength={3} name="currency" defaultValue={settings.currency} />
                </label>
              </div>
            </Card>

            {mutation.isError ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">No se pudieron guardar los ajustes.</p> : null}
            {mutation.isSuccess ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Ajustes guardados correctamente.</p> : null}

            <button className="h-10 w-full rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70" disabled={mutation.isPending} type="submit">
              {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
