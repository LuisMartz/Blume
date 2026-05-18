import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Search, Trash2 } from 'lucide-react'
import { catalogStatusLabel, formatCurrency } from '../api/format'
import { createCatalogItem, deleteCatalogItem, getCatalogItems, updateCatalogItem } from '../api/queries/catalog'
import type { CatalogItem, CatalogStatus } from '../api/types'
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

function catalogPayload(formData: FormData) {
  return {
    name: String(formData.get('name')),
    description: String(formData.get('description') || ''),
    category: String(formData.get('category')),
    unit: String(formData.get('unit') || 'unidad'),
    price: Number(formData.get('price') || 0),
    margin: Number(formData.get('margin') || 0),
    status: formData.get('status') as CatalogStatus,
  }
}

export function CatalogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
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
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReturnType<typeof catalogPayload> }) =>
      updateCatalogItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
      setIsModalOpen(false)
      setEditingItem(null)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteCatalogItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] })
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

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div>
      <PageHeader
        title="Catalogo"
        description="Servicios y tarifas usados para crear presupuestos consistentes y rapidos."
        action="Nuevo servicio"
        onAction={() => {
          setEditingItem(null)
          setIsModalOpen(true)
        }}
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
            <option value="ALL">Todas las categorias</option>
            {categories.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>{itemCategory}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="p-4"><StateBlock title="Cargando catalogo" description="Leyendo servicios desde Neon." /></div>
        ) : isError ? (
          <div className="p-4"><StateBlock title="No se pudo cargar el catalogo" description="Comprueba que blume-api este arrancada en el puerto 4000." /></div>
        ) : filteredItems.length === 0 ? (
          <div className="p-4"><StateBlock title="Sin resultados" description="Ajusta los filtros o añade un nuevo servicio." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-5">Nombre</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Categoria</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Unidad</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Precio</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Margen</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-5">Acciones</th>
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
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          aria-label={`Editar ${item.name}`}
                          title="Editar servicio"
                          onClick={() => {
                            setEditingItem(item)
                            setIsModalOpen(true)
                          }}
                        >
                          <Edit2 className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-md border border-slate-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          aria-label={`Eliminar ${item.name}`}
                          title="Eliminar servicio"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Eliminar ${item.name}? Los presupuestos conservaran el nombre y precio ya guardados.`)) {
                              deleteMutation.mutate(item.id)
                            }
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal title={editingItem ? 'Editar servicio' : 'Nuevo servicio'} open={isModalOpen} onClose={closeModal}>
        <form
          key={editingItem?.id ?? 'new-catalog-item'}
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const payload = catalogPayload(new FormData(event.currentTarget))

            if (editingItem) {
              updateMutation.mutate({ id: editingItem.id, data: payload })
              return
            }

            createMutation.mutate(payload)
          }}
        >
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="name" defaultValue={editingItem?.name ?? ''} required />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Descripcion</span>
            <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="description" defaultValue={editingItem?.description ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Categoria</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="category" defaultValue={editingItem?.category ?? ''} required />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Unidad</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="unit" defaultValue={editingItem?.unit ?? 'unidad'} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Precio</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" name="price" required step="0.01" type="number" defaultValue={editingItem?.price ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Margen %</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" min="0" max="100" name="margin" type="number" defaultValue={editingItem?.margin ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="status" defaultValue={editingItem?.status ?? 'ACTIVE'}>
              <option value="ACTIVE">Activo</option>
              <option value="DRAFT">Borrador</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </label>
          {createMutation.isError || updateMutation.isError ? <p className="sm:col-span-2 text-sm text-rose-700">No se pudo guardar el servicio.</p> : null}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700" type="button" onClick={closeModal}>Cancelar</button>
            <button className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-70" disabled={createMutation.isPending || updateMutation.isPending} type="submit">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar servicio'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
