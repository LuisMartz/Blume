import { z } from 'zod'

export const settingsUpdateSchema = z.object({
  companyName: z.string().trim().min(1, 'El nombre comercial es obligatorio'),
  taxId: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  postalCode: z.string().trim().optional().nullable(),
  country: z.string().trim().min(1).default('España'),
  defaultTaxRate: z.coerce.number().min(0).max(100).default(21),
  currency: z.string().trim().min(3).max(3).default('EUR'),
})
