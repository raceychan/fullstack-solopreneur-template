import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Task } from '../data/schema'
import { getTasksApiV1TasksGet, createNewTaskApiV1TasksPost, removeTaskApiV1TasksDelete, updateTaskApiV1TasksPut } from '@/client/sdk.gen'
import { TaskCreate, TaskDto, TaskUpdate } from '@/client/types.gen'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasks: Task[]
  createTask: (newTask: TaskCreate) => void
  updateTask: (taskId: number, taskUpdate: TaskUpdate) => void
  removeTask: (taskId: number) => void
  pagination: {
    page: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: () => void
    previousPage: () => void
  }
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [page, setPage] = useState(0)
  const limit = 10
  const queryClient = useQueryClient()

  const { data: tasksResponse, error } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => getTasksApiV1TasksGet({
      query: {
        limit,
        offset: page * limit
      }
    })
  })

  if (error) {
    console.error("Failed to fetch tasks")
    throw error
  }

  // Convert API response to Task format
  const tasks: Task[] = tasksResponse?.data?.map((task: TaskDto) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    label: task.label,
    priority: task.priority,
  })) || []

  const createTaskMutation = useMutation({
    mutationFn: (newTask: TaskCreate) => {
      return createNewTaskApiV1TasksPost({ body: newTask })
    },
    onSuccess: () => {
      // Reset to first page and invalidate all pages
      setPage(0)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const createTask = (newTask: TaskCreate) => {
    createTaskMutation.mutate(newTask)
  }

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskUpdate }: { taskId: number, taskUpdate: TaskUpdate }) => {
      return updateTaskApiV1TasksPut({
        query: { task_id: taskId },
        body: taskUpdate
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      console.error('updateTaskMutation error:', error)
    },
  })

  const updateTask = (taskId: number, taskUpdate: TaskUpdate) => {
    updateTaskMutation.mutate({ taskId, taskUpdate })
  }

  const removeTaskMutation = useMutation({
    mutationFn: (taskId: number) => {
      return removeTaskApiV1TasksDelete({
        query: { task_id: taskId }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const removeTask = (taskId: number) => {
    removeTaskMutation.mutate(taskId)
  }

  // Determine if there are more pages
  const hasNextPage = (tasks?.length || 0) === limit
  const hasPreviousPage = page > 0

  const nextPage = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1)
    }
  }

  const pagination = {
    page,
    limit,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage
  }

  return (
    <TasksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, tasks, createTask, updateTask, removeTask, pagination }}>
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
