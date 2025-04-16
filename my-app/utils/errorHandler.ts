import { ToastShowParams } from 'react-native-toast-message'
import { ToastType } from 'react-native-toast-notifications'

interface ErrorResponse {
  data?: {
    message?: string
  }
  status?: number
  [key: string]: any
}

export const handleApiError =
  (toast: ToastType) =>
  (
    err: ErrorResponse,
    fallbackMessage = 'Đã xảy ra lỗi. Vui lòng thử lại!'
  ) => {
    const message = err?.data?.message ?? fallbackMessage

    toast.show(message, {
      type: 'danger',
      duration: 4000,
    } as ToastShowParams)
  }
