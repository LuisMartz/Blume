import { TaskPriority, TaskStatus } from '@prisma/client'
import { z } from 'zod'

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, 'El titulo es obligatorio'),
  description: z.string().trim().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  priority: z.enum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.enum(TaskStatus).default(TaskStatus.PENDING),
  clientId: z.string().trim().optional().nullable(),
  quoteId: z.string().trim().optional().nullable(),
})

export const taskUpdateSchema = taskCreateSchema.partial()
