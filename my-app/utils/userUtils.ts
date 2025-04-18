import { User } from '../types/management'

export const getUserName = (user: User | null) => {
  if (!user) return ''
  const fullName: string = `${user.first_name} ${user.last_name}`
  return user.user_name ?? fullName ?? ''
}

export const getUserNameWithPosition = (user: User | null) => {
  if (!user) return ''
  return `${user.user_name} - ${user.position ?? 'Chưa có vị trí làm việc'}`
}
