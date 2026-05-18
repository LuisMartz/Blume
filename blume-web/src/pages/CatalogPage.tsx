import { Search } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { catalogItems } from '../data/mockData'

export function CatalogPage() {
  return (
    <div>
      <PageHeader
        title="Catálogo"
        description="Servicios y tarifas usados para crear presupuestos consistentes y rápidos."
        action="Nuevo servicio"
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="Filtrar servicios"
              type="search"
            />
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none">
            <option>Todas las categorías</option>
            <option>Servicio</option>
            <option>Proyecto</option>
            <option>Retainer</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Nombre</th>
                <th className="px-4 py-3 font-medium sm:px-5">Categoría</th>
                <th className="px-4 py-3 font-medium sm:px-5">Precio</th>
                <th className="px-4 py-3 font-medium sm:px-5">Margen</th>
                <th className="px-4 py-3 font-medium sm:px-5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {catalogItems.map((item) => (
                <tr key={item.name}>
                  <td className="px-4 py-4 font-medium text-slate-950 sm:px-5">{item.name}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{item.category}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{item.price}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-5">{item.margin}</td>
                  <td className="px-4 py-4 sm:px-5">
                    <Badge tone={item.status === 'Activo' ? 'active' : 'neutral'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
