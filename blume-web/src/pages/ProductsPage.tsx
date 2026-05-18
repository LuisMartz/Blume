import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'

const products = [
  { name: 'Consultoría inicial', category: 'Servicio', price: '450 €', margin: '72%', status: 'Activo' },
  { name: 'Diseño web corporativo', category: 'Proyecto', price: '2.800 €', margin: '64%', status: 'Activo' },
  { name: 'Mantenimiento mensual', category: 'Retainer', price: '390 €/mes', margin: '58%', status: 'Activo' },
  { name: 'Auditoría SEO', category: 'Servicio', price: '690 €', margin: '61%', status: 'Borrador' },
]

export function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Productos y servicios"
        description="Catálogo comercial usado para crear presupuestos consistentes y rápidos."
        action="Nuevo servicio"
      />

      <article className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Precio</th>
                <th className="px-5 py-3 font-medium">Margen</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.name}>
                  <td className="px-5 py-4 font-medium text-slate-950">{product.name}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 text-slate-600">{product.price}</td>
                  <td className="px-5 py-4 text-slate-600">{product.margin}</td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={product.status === 'Activo' ? 'active' : 'neutral'}>
                      {product.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}
