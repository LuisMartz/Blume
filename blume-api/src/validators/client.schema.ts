import { ClientStatus } from '@prisma/client'
import { z } from 'zod'

export const clientCreateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  contact: z.string().trim().optional().nullable(),
  email: z.string().trim().email('Email no válido').optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  taxId: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  postalCode: z.string().trim().optional().nullable(),
  country: z.string().trim().min(1).default('España'),
  value: z.coerce.number().nonnegative().optional().nullable(),
  status: z.enum(ClientStatus).default(ClientStatus.ACTIVE),
})

export const clientUpdateSchema = clientCreateSchema.partial()
