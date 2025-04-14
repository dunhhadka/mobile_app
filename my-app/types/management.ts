export interface UserRequest {
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
