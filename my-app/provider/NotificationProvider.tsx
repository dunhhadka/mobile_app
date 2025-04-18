import { Client } from '@stomp/stompjs'
import { createContext, useEffect, useRef } from 'react'
import { View } from 'react-native'
import SockJS from 'sockjs-client'
import { URL } from '../api/magementApi'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import Toast from 'react-native-toast-message'
import { Notification } from '../types/management'

interface Props {
  children: React.ReactNode
}

interface WebSocketContextType {
  stompClient: Client | null
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
)

const NotificationProvider = ({ children }: Props) => {
  const stompClientref = useRef<Client | null>(null)

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  useEffect(() => {
    const socket = new SockJS(URL + '/ws')
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('🪵 [STOMP DEBUG]:', str),
      reconnectDelay: 5000,
    })

    stompClient.onConnect = (frame) => {
      console.log('🟢 WebSocket connected')

      stompClient.subscribe(
        `/topic/notification/${currentUser?.id ?? 0}`,
        (data) => {
          console.log('📩 Tin nhắn nhận được:', data.body)

          Toast.show({
            type: 'custom_notification',
            props: {
              notification: JSON.parse(data.body) as Notification,
            },
            position: 'top',
            autoHide: true,
            visibilityTime: 4000,
          })
        }
      )
    }

    stompClient.onStompError = (error) => {
      console.error('❌ Lỗi STOMP:', error)
    }

    stompClient.onWebSocketError = (event) => {
      console.error('❌ Lỗi WebSocket:', event)
    }

    stompClient.onDisconnect = () => {
      console.log('🔌 Mất kết nối WebSocket.')
    }

    stompClient.activate()

    return () => {
      if (stompClient.connected) {
        console.log('👋 Đang hủy kết nối WebSocket...')
        stompClient.deactivate()
      } else {
        console.log('⚠️ Chưa từng kết nối - không cần hủy.')
      }
    }
  }, [currentUser])

  return (
    <WebSocketContext.Provider value={{ stompClient: stompClientref.current }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export default NotificationProvider
