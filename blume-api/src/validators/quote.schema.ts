import { z } from 'zod'

export const quoteItemCreateSchema = z.object({
  catalogItemId: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
})

export const quoteCreateSchema = z.object({
  code: z.string().trim().min(1, 'El código es obligatorio'),
  clientId: z.string().trim().min(1, 'El cliente es obligatorio'),
  date: z.coerce.date().optional(),
  status: z.string().trim().min(1).default('Borrador'),
  items: z.array(quoteItemCreateSchema).min(1, 'Añade al menos una línea'),
})

export const quoteUpdateSchema = z.object({
  code: z.string().trim().min(1).optional(),
  clientId: z.string().trim().min(1).optional(),
  date: z.coerce.date().optional(),
  amount: z.coerce.number().nonnegative().optional(),
  status: z.string().trim().min(1).optional(),
})
