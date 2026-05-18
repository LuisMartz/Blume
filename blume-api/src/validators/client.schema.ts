import { z } from 'zod'

export const clientCreateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  contact: z.string().trim().optional().nullable(),
  email: z.string().trim().email('Email no válido').optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  value: z.coerce.number().nonnegative().optional().nullable(),
  status: z.string().trim().min(1).default('Activo'),
})

export const clientUpdateSchema = clientCreateSchema.partial()
