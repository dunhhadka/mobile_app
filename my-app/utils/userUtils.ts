import { User } from '../types/management'

export const getUserName = (user: User | null) => {
  if (!user) return ''
  const fullName: string = `${user.first_name} ${user.last_name}`
  return user.user_name ?? fullName ?? ''
}
