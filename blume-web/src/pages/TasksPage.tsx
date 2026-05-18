import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Check, Edit2, Search, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatDate, taskPriorityLabel, taskStatusLabel } from '../api/format'
import { getClients } from '../api/queries/clients'
import { createTask, deleteTask, getTasks, updateTask } from '../api/queries/tasks'
import type { Task, TaskPriority, TaskStatus } from '../api/types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { StateBlock } from '../components/ui/StateBlock'

function priorityTone(priority: TaskPriority) {
  if (priority === 'HIGH') return 'danger'
  if (priority === 'MEDIUM') return 'pending'
  return 'neutral'
}

function statusTone(status: TaskStatus) {
  if (status === 'DONE') return 'active'
  if (status === 'IN_PROGRESS') return 'pending'
  return 'neutral'
}

function taskPayload(formData: FormData) {
  return {
    title: String(formData.get('title')),
    description: String(formData.get('description') || ''),
    dueDate: String(formData.get('dueDate') || ''),
    priority: formData.get('priority') as TaskPriority,
    status: formData.get('status') as TaskStatus,
    clientId: String(formData.get('clientId') || ''),
  }
}

export function TasksPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<'ALL' | TaskPriority>('ALL')
  const queryClient = useQueryClient()
  const { data: tasks = [], isLoading, isError } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsModalOpen(false)
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReturnType<typeof taskPayload> }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsModalOpen(false)
      setEditingTask(null)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
  const completeMutation = useMutation({
    mutationFn: (id: string) => updateTask(id, { status: 'DONE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return tasks.filter((task) => {
      const matchesPriority = priority === 'ALL' || task.priority === priority
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [task.title, task.description, task.client?.name]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))

      return matchesPriority && matchesSearch
    })
  }, [priority, search, tasks])

  useEffect(() => {
    if ((location.state as { openCreate?: boolean } | null)?.openCreate) {
      setEditingTask(null)
      setIsModalOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Seguimiento de proximos pasos, vencimientos y recordatorios por cliente."
        action="Nueva tarea"
        onAction={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tarea"
              type="search"
              value={search}
            />
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none" onChange={(event) => setPriority(event.target.value as 'ALL' | TaskPriority)} value={priority}>
            <option value="ALL">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </div>
        {isLoading ? (
          <div className="p-4"><StateBlock title="Cargando tareas" description="Leyendo tareas reales de tu cuenta." /></div>
        ) : isError ? (
          <div className="p-4"><StateBlock title="No se pudieron cargar las tareas" description="Comprueba que la API este disponible." /></div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-4"><StateBlock title="Sin tareas" description="Crea una tarea para planificar el siguiente paso." /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <div key={task.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_180px_110px_120px_150px] md:items-center">
                <div>
                  <p className="font-medium text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{task.client?.name ?? 'Sin cliente'}</p>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays className="size-4 text-slate-400" aria-hidden="true" />
                  {formatDate(task.dueDate)}
                </p>
                <Badge tone={priorityTone(task.priority)}>{taskPriorityLabel(task.priority)}</Badge>
                <Badge tone={statusTone(task.status)}>{taskStatusLabel(task.status)}</Badge>
                <div className="flex justify-end gap-2">
                  <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50" aria-label="Completar tarea" title="Completar tarea" disabled={task.status === 'DONE' || completeMutation.isPending} onClick={() => completeMutation.mutate(task.id)}>
                    <Check className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Editar tarea" title="Editar tarea" onClick={() => {
                    setEditingTask(task)
                    setIsModalOpen(true)
                  }}>
                    <Edit2 className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50" aria-label="Eliminar tarea" title="Eliminar tarea" disabled={deleteMutation.isPending} onClick={() => {
                    if (window.confirm(`Eliminar tarea ${task.title}?`)) {
                      deleteMutation.mutate(task.id)
                    }
                  }}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal title={editingTask ? 'Editar tarea' : 'Nueva tarea'} open={isModalOpen} onClose={closeModal}>
        <form
          key={editingTask?.id ?? 'new-task'}
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const payload = taskPayload(new FormData(event.currentTarget))

            if (editingTask) {
              updateMutation.mutate({ id: editingTask.id, data: payload })
              return
            }

            createMutation.mutate(payload)
          }}
        >
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Titulo</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="title" defaultValue={editingTask?.title ?? ''} required />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Descripcion</span>
            <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="description" defaultValue={editingTask?.description ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Cliente</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="clientId" defaultValue={editingTask?.clientId ?? ''}>
              <option value="">Sin cliente</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Vencimiento</span>
            <input className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="dueDate" type="date" defaultValue={editingTask?.dueDate?.slice(0, 10) ?? ''} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Prioridad</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="priority" defaultValue={editingTask?.priority ?? 'MEDIUM'}>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name="status" defaultValue={editingTask?.status ?? 'PENDING'}>
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En curso</option>
              <option value="DONE">Completada</option>
            </select>
          </label>
          {createMutation.isError || updateMutation.isError ? <p className="sm:col-span-2 text-sm text-rose-700">No se pudo guardar la tarea.</p> : null}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700" type="button" onClick={closeModal}>Cancelar</button>
            <button className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-70" disabled={createMutation.isPending || updateMutation.isPending} type="submit">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar tarea'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
