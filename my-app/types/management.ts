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
  default_color?: string
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
  default_color?: string
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
  status?: 'in_process' | 'to_do' | 'finish'
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
  status?: 'in_process' | 'to_do' | 'finish'
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
  tags?: Tag[]
  start_date: Date
  actual_start_date?: Date
  completed_at?: Date
  extimated_time?: number
  actual_time?: number
  attachments?: string[]
}

export type Tag =
  | 'front_end'
  | 'back_end'
  | 'database'
  | 'architecture'
  | 'security'
  | 'performance'
  | 'design'
  | 'test'
  | 'other'

export const tagLabelMap: Record<Tag, string> = {
  front_end: 'Giao diện (Frontend)',
  back_end: 'Xử lý (Backend)',
  database: 'Cơ sở dữ liệu',
  architecture: 'Kiến trúc hệ thống',
  security: 'Bảo mật',
  performance: 'Hiệu năng',
  design: 'Thiết kế',
  test: 'Kiểm thử',
  other: 'Khác',
}

export const tagWithLabel = Object.entries(tagLabelMap).map(
  ([_, label], index) => ({
    value: index,
    label,
  })
)

export interface ProjectSearchRequest {
  processIds?: number[]
  createdIds?: number[]
  statuses?: string[]
}

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
  status?: 'to_do' | 'in_process' | 'finish'
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

  total_to_do: number
  total_in_progress: number
  total_finish: number
  total_task: number

  progress: number
}

export interface UserFilterRequest {
  ids?: number[]
  project_id?: number
}

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
  tags?: Tag[]
  start_date: Date
  due_date: Date
  actual_start_date?: Date
  completed_at?: Date
  extimated_time?: number
  actual_time?: number
}

export interface ImageRequest {
  id?: number
  alt?: string
  name?: string
  file?: File
}

export interface AggregateLogRequest {
  date: string
  user_id: number
  note: string
}

export interface AttendanceResponse {
  id: number
  date: string
  clock_in: string | null
  clock_out: string | null
  actual_clock_in: string | null
  actual_clock_out: string | null
  total_hours: string | null
  note: string | null
}

export interface LogResponse {
  id: number
  type: Type
  check_in: string
  image?: ImageResponse
  note?: string
  latitude?: string
  longitude?: string
  user: number
}
export type Type = 'in' | 'out' | 'break_work' | 'back_work'

export interface ChatRoom {
  id: number
  name: string
  user: User
  project: Project
  last_message: LastMessage
}

export interface ChatMember {
  id: number
  user: User
  chat_room: ChatRoom
  joined_at: string
  un_read: boolean
  un_read_count?: number
  last_message?: LastMessage
}

export interface LastMessage {
  user_last_send: User
  send_time: string
  content: string
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
  leave: 'Yêu cầu nghỉ phép',
}

export interface CommentRequest {
  task_id: number
  user_id: number
  content: string
}

export interface Comment {
  id: number
  content: string
  user: User
  created_at: string
}

export type ActionType =
  | 'create'
  | 'update'
  | 'start'
  | 'finish'
  | 'no_action'
  | 'update_process'
  | 'reopen'

export interface DailyReportRequest {
  note: string
  progress: number
  task_id: number
  reporter_id: number
}

export interface DailyReport {
  id: number
  note?: string
  progress: number
  created_at?: string
  updated_at?: string
  reporter: User
  date: Date
}

export interface TaskFilterRequest {
  title?: string
  ids?: number[]
  processId?: number
  assignId?: number
  projectId?: number
  status?: StatusType
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

export interface ProjectManagement {
  id: number
  project: Project
  user: User
  total_to_do: number
  total_in_progress: number
  total_finish: number
  progress: number
  total_task: number
}

export interface ChangeProjectStatusRequest {
  project_id: number
  status: 'in_process' | 'to_do' | 'finish'
  creator_id?: number
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}