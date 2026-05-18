import { z } from 'zod'

export const catalogCreateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  category: z.string().trim().min(1, 'La categoría es obligatoria'),
  price: z.coerce.number().nonnegative(),
  margin: z.coerce.number().int().min(0).max(100).optional().nullable(),
  status: z.string().trim().min(1).default('Activo'),
})

export const catalogUpdateSchema = catalogCreateSchema.partial()
