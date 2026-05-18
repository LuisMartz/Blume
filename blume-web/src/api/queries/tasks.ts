import { http } from '../http'
import type { Task, TaskPriority, TaskStatus } from '../types'

export type CreateTaskInput = {
  title: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  status?: TaskStatus
  clientId?: string
  quoteId?: string
}

export async function getTasks() {
  const { data } = await http.get<Task[]>('/tasks')
  return data
}

export async function createTask(input: CreateTaskInput) {
  const { data } = await http.post<Task>('/tasks', input)
  return data
}

export async function updateTask(id: string, input: Partial<CreateTaskInput>) {
  const { data } = await http.patch<Task>(`/tasks/${id}`, input)
  return data
}

export async function deleteTask(id: string) {
  await http.delete(`/tasks/${id}`)
}
