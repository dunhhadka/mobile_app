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
  id: number;
  type: Type;
  image: ImageResponse | null;
  note?: string;
  latitude?: string;
  longitude?: string;

  user: User;
}
export type Type =  'in'| 'out'| 'break_work'|'back_work'