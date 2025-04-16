export type TaskStatus =
  | 'completed'
  | 'inProgress'
  | 'pending'
  | 'cancelled'
  | 'review'
  | 'todo'
  | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size?: number
  createdAt: string
}

export interface Comment {
  id: string
  userId: string
  text: string
  createdAt: string
  attachments?: Attachment[]
}

export interface User {
  id: string
  name: string
  avatar: string
  role: string
  department?: string
  email?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  assignedTo: User[]
  createdBy: User
  attachments?: Attachment[]
  comments?: Comment[]
  progress?: number
  tags?: string[]
}

export interface TaskGroup {
  title: string
  data: Task[]
}
