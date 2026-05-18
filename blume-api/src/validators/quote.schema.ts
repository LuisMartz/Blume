import { QuoteStatus } from '@prisma/client'
import { z } from 'zod'

export const quoteItemCreateSchema = z.object({
  catalogItemId: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  description: z.string().trim().optional().nullable(),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
})

export const quoteCreateSchema = z.object({
  code: z.string().trim().min(1, 'El código es obligatorio'),
  clientId: z.string().trim().min(1, 'El cliente es obligatorio'),
  date: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional().nullable(),
  status: z.enum(QuoteStatus).default(QuoteStatus.DRAFT),
  taxRate: z.coerce.number().nonnegative().default(21),
  notes: z.string().trim().optional().nullable(),
  items: z.array(quoteItemCreateSchema).min(1, 'Añade al menos una línea'),
})

export const quoteUpdateSchema = z.object({
  code: z.string().trim().min(1).optional(),
  clientId: z.string().trim().min(1).optional(),
  date: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional().nullable(),
  status: z.enum(QuoteStatus).optional(),
  subtotal: z.coerce.number().nonnegative().optional(),
  taxRate: z.coerce.number().nonnegative().optional(),
  taxAmount: z.coerce.number().nonnegative().optional(),
  total: z.coerce.number().nonnegative().optional(),
  notes: z.string().trim().optional().nullable(),
})
