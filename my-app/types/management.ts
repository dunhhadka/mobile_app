import { DifficultyType } from '../components/form/CreateOrUpdateTaskFrom'
import { TaskPriority } from './task'

export interface UserRequest {
  id?: number
  email: string
  phone?: string
  password: string
  company_id?: string
  first_name: string
  last_name?: string
  date_of_birth?: string
  position?: Position
  address?: AddressRequest
  confirm_password?: string
}

export interface AddressRequest {
  ward_name: string
  district_name: string
  country_name: string
}

export interface User {
  id: number
  company_id?: string
  date_of_birth?: string
  first_name?: string
  last_name?: string
  phone?: string
  email: string
  user_name?: string
  position?: Position
  role?: Role
  address?: AddressResponse
  avatar?: ImageResponse
}

export interface AddressResponse {
  id: number
  ward_name: string
  district_name: string
  country_name: string
}

export interface ImageResponse {
  id: number
  alt: string
  src: string
  file_name: string
  physical_info: ImagePhysicalInfo
}

export interface ImagePhysicalInfo {
  size: number
  width: number
  height: number
}

export type Role = 'manager' | 'member'

export enum Position {
  dev = 'Lập trình viên',
  tester = 'Kiểm thử',
  designer = 'Thiết kế',
  analyst = 'Phân tích',
  manager = 'Quản lý',
  other = 'Khác',
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ProjectRequest {
  id?: number
  company_id?: number
  title?: string
  description?: string
  status?: 'in_process' | 'done' | 'reject' | 'none'
  user_ids?: number[]
  started_on: Date // Dạng ISO 8601 string, ví dụ: "2025-04-15T12:00:00Z"
  created_id: number
}

export interface Project {
  id: number
  company_id?: number
  title: string
  description: string
  created_on: string // Dạng ISO 8601 string
  started_on: Date // Dạng ISO 8601 string
  modified_on: string // Dạng ISO 8601 string
  status?: 'to_do' | 'in_process' | 'finish'
  users: User[]
  tasks: Task[]
}

export interface Task {
  id: number
  title: string
  description: string
  project_id: number
  assign_id?: number
  process_id?: number
  priority?: TaskPriority
  difficulty?: 'very_easy' | 'easy' // Bạn có thể thêm các giá trị difficulty còn lại
  status?: 'to_do' | 'in_process' | 'finish'
  created_on: string // Dạng ISO 8601 string
  modified_on: string // Dạng ISO 8601 string
  finished_on?: string // Dạng ISO 8601 string
  images: ImageResponse[]
  assign?: User
  process?: User
  due_date?: Date
  process_value?: number
}

export interface UserFilterRequest {
  ids?: number[]
}

export interface ProjectSearchRequest {}

export interface TaskRequest {
  id?: number
  title?: string
  description?: string
  project_id?: number
  assign_id?: number
  process_id?: number
  priority?: PriorityType
  difficulty?: DifficultyType
  status?: StatusType
  images?: ImageRequest[]
  process_value?: number
}

export type StatusType = 'to_do' | 'in_process' | 'finish'

export type PriorityType = 'low' | 'medium' | 'high'

export interface ImageRequest {
  id?: number
  alt?: string
  name?: string
  file?: File
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ProjectRequest {
  id?: number
  company_id?: number
  title?: string
  description?: string
  status?: 'in_process' | 'done' | 'reject' | 'none'
  user_ids?: number[]
  started_on: Date // Dạng ISO 8601 string, ví dụ: "2025-04-15T12:00:00Z"
}

export interface Project {
  id: number
  company_id?: number
  title: string
  description: string
  created_on: string // Dạng ISO 8601 string
  started_on: Date // Dạng ISO 8601 string
  modified_on: string // Dạng ISO 8601 string
  status?: 'to_do' | 'in_process' | 'finish'
  users: User[]
  tasks: Task[]
}

export interface Task {
  id: number
  title: string
  description: string
  project_id: number
  assign_id?: number
  process_id?: number
  priority?: TaskPriority
  difficulty?: 'very_easy' | 'easy' // Bạn có thể thêm các giá trị difficulty còn lại
  status?: 'to_do' | 'in_process' | 'finish'
  created_on: string // Dạng ISO 8601 string
  modified_on: string // Dạng ISO 8601 string
  finished_on?: string // Dạng ISO 8601 string
  images: ImageResponse[]
  assign?: User
  process?: User
  due_date?: Date
  process_value?: number
}

export interface UserFilterRequest {
  ids?: number[]
}

export interface ProjectSearchRequest {}

export interface TaskRequest {
  id?: number
  title?: string
  description?: string
  project_id?: number
  assign_id?: number
  process_id?: number
  priority?: PriorityType
  difficulty?: DifficultyType
  status?: StatusType
  images?: ImageRequest[]
  process_value?: number
}

export interface ImageRequest {
  id?: number
  alt?: string
  name?: string
  file?: File
}

export interface LogResponse {
  id: number
  type: Type
  image: ImageResponse | null
  note?: string
  latitude?: string
  longitude?: string

  user: User
}
export type Type = 'in' | 'out' | 'break_work' | 'back_work'

export interface ChatRoom {
  id: number
  name: string
  user: User
  project: Project
  last_message: LastMessage
}

export interface LastMessage {
  sender: User
  content: string
}

export interface ChatMember {
  id: number
  user: User
  chat_room: ChatRoom
  joined_at: string
  un_read: boolean
}

export interface MessageRequest {
  sender_id: number
  chat_room_id: number
  chat_member_id: number
  content: string
  time: string
}

export interface Message {
  id: number
  sender_id: number
  chat_room: ChatRoom
  chat_member: ChatMember
  content: string
  time: string
  sender: User
}

export interface Notification {
  id: number
  receive_message: string
  receive: User
  read: boolean
  created_at: string
  type: NotificationType
  data?: string
}

export type NotificationType =
  | 'messenger'
  | 'task'
  | 'comment'
  | 'deadline'
  | 'user'
  | 'leave'

export const NotificationTitle = {
  messenger: 'Tin nhắn',
  task: 'Nhiệm vụ',
  comment: 'Bình luận',
  deadline: 'Hạn chót',
  user: 'Người dùng',
  leave: "Yêu cầu nghỉ phép",
}

export interface LeaveRequest {
  category: string
  start_leave: string // ISO date string, ví dụ: "2025-04-02"
  end_leave: string // ISO date string, ví dụ: "2025-04-05"
  contact_phone: string
  description: string
}

export interface LeaveResponse {
  id: number
  category: string
  start_leave: string // ISO date string
  end_leave: string // ISO date string, fixed typo from end_eave
  contact_phone: string
  description: string
  status: 'review' | 'approved' | 'rejected'
  created_by: number
  created_on: string // ISO date-time string
  total_leave: number // Số ngày nghỉ
}