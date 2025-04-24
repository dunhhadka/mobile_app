import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Position } from '../types/management'

export const useGetCurrentUser = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  return {
    currentUser,
    isManager:
      currentUser?.position && Position[currentUser.position] === 'Quản lý',
  }
}
