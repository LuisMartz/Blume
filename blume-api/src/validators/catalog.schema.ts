import { CatalogStatus } from '@prisma/client'
import { z } from 'zod'

export const catalogCreateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().min(1, 'La categoría es obligatoria'),
  unit: z.string().trim().min(1).default('unidad'),
  price: z.coerce.number().nonnegative(),
  margin: z.coerce.number().int().min(0).max(100).optional().nullable(),
  status: z.enum(CatalogStatus).default(CatalogStatus.ACTIVE),
})

export const catalogUpdateSchema = catalogCreateSchema.partial()
