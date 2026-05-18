import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { catalogStatusLabel, formatCurrency } from '../api/format'
import { createCatalogItem, getCatalogItems } from '../api/queries/catalog'
import type { CatalogStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

function catalogStatusTone(status: CatalogStatus) {
  if (status === 'ACTIVE') return 'active'
  if (status === 'ARCHIVED') return 'neutral'
  return 'pending'
}

export function CatalogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const queryClient = useQueryClient()
  const { data: catalogItems = [], isLoading, isError } = useQuery({
    queryKey: ['catalog'],
    queryFn: getCatalogItems,
  })
  const createMutation = useMutation({
    mutationFn: createCatalogItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      setIsModalOpen(false)
    },
  })
  const categories = useMemo(
    () => Array.from(new Set(catalogItems.map((item) => item.category))),
    [catalogItems],
  )
  const filteredItems = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return catalogItems.filter((item) => {
      const matchesCategory = category === 'ALL' || item.category === category
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [item.name, item.description, item.category]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))

      return matchesCategory && matchesSearch
    })
  }, [catalogItems, category, search])

  return (
    <div>
      <PageHeader
        title="Catálogo"
        description="Servicios y tarifas usados para crear presupuestos consistentes y rápidos."
        action="Nuevo servicio"
        onAction={() => setIsModalOpen(true)}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filtrar servicios"
              type="search"
              value={search}
            />
          </div>
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="ALL">Todas las categorías</option>
            {categories.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>{itemCategory}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="p-4"><StateBlock title="Cargando catálogo" description="Leyendo servicios desde Neon." /></div>
        ) : isError ? (
          <div className="p-4"><StateBlock title="No se pudo cargar el catálogo" description="Comprueba que blume-api esté arrancada en el puerto 4000." /></div>
        ) : filteredItems.length === 0 ? (
          <div className="p-4"><StateBlock title="Sin resultados" description="Ajusta los filtros o añade un nuevo servicio." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-5">Nombre</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Categoría</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Unidad</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Precio</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Margen</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 sm:px-5">
                      <p className="font-medium text-slate-950">{item.name}</p>
                      <p className="mt-1 max-w-sm text-xs text-slate-500">{item.description}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{item.category}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{item.unit}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-5">{item.margin ?? '-'}%</td>
                    <td className="px-4 py-4 sm:px-5">
                      <Badge tone={catalogStatusTone(item.status)}>{catalogStatusLabel(item.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal title="Nuevo servicio" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            createMutation.mutate({
              name: String(formData.get('name')),
              description: String(formData.get('description') || ''),
              category: String(formData.get('category')),
              unit: String(formData.get('unit') || 'unidad'),
              price: Number(formData.get('price') || 0),
              margin: Number(formData.get('margin') || 0),
              status: formData.get('status') as CatalogStatus,
            })
          }}
        >
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="name" required />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Descripción</span>
            <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="description" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Categoría</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="category" required />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Unidad</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="unit" defaultValue="unidad" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Precio</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" name="price" required step="0.01" type="number" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Margen %</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" max="100" name="margin" type="number" />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">Activo</option>
              <option value="DRAFT">Borrador</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </label>
          {createMutation.isError ? <p className="sm:col-span-2 text-sm text-rose-700">No se pudo crear el servicio.</p> : null}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-70" disabled={createMutation.isPending} type="submit">
              {createMutation.isPending ? 'Guardando...' : 'Guardar servicio'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
