import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
} from 'react-native'
import colors from '../../constants/colors'
import { Stack } from 'expo-router'
import Avatar from '../layouts/Avatar'
import { ArrowLeft, Send } from 'lucide-react-native'
import { HomeStackParamList } from '../../App'
import {
  URL,
  useGetMessageByRoomIdQuery,
  useGetRoomByIdQuery,
  useMarkupReadRoomMessageQuery,
} from '../../api/magementApi'
import Loading from '../loading/Loading'
import { useEffect, useRef, useState } from 'react'
import * as Stomp from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { Message, MessageRequest } from '../../types/management'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { mockMessages } from '../test'
import { getUserName } from '../../utils/userUtils'

type ProjectDetailRouteProp = RouteProp<
  { params: { room_id: number; member_id: number } },
  'params'
>

const formatTime = (isoString: string): string => {
  const date = new Date(isoString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // tháng bắt đầu từ 0
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes} ${day}/${month}`
}

interface MessageBubbleProps {
  message: Message
  isSender: boolean
  onLongPress?: () => void
}
const MessageBubble = ({
  message,
  isSender,
  onLongPress,
}: MessageBubbleProps) => {
  return (
    <Pressable onLongPress={onLongPress} style={{ marginTop: 10 }}>
      <Text
        style={[
          { bottom: -3 },
          isSender ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
        ]}
      >
        {isSender ? 'Bạn' : getUserName(message.sender)}
      </Text>
      <View
        style={[
          styles.bubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={[styles.messageText]}>{message.content}</Text>
        <View
          style={
            (styles.metadataContainer,
            isSender ? styles.senderTimeText : styles.receiveTimeText)
          }
        >
          <Text
            style={[
              styles.timestamp,
              isSender ? { color: colors.white } : { color: colors.black },
            ]}
          >
            {' '}
            {formatTime(message.time)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const ChatRoomScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()
  const route = useRoute<ProjectDetailRouteProp>()
  const roomId = route.params.room_id
  const memberId = route.params.member_id

  const { data: fechedData, isLoading: isMessageLoading } =
    useGetMessageByRoomIdQuery(roomId, { refetchOnMountOrArgChange: true })

  const { data, isLoading: isMarkupLoading } = useMarkupReadRoomMessageQuery(
    memberId,
    { skip: !memberId }
  )

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>(mockMessages)
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null)

  const { data: room, isLoading: isRoomLoading } = useGetRoomByIdQuery(roomId)

  const flatListRef = useRef<FlatList>(null)

  const renderMessageItem = ({
    item,
    index,
  }: {
    item: Message
    index: number
  }) => {
    const isSender = item.sender_id === currentUser?.id
    return <MessageBubble message={item} isSender={isSender} />
  }

  useEffect(() => {
    setMessages(fechedData || [])
  }, [fechedData])

  useEffect(() => {
    console.log('👉 Bắt đầu tạo kết nối WebSocket...')
    const socket = new SockJS(`${URL}/ws`)
    const client = new Stomp.Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('🪵 [STOMP DEBUG]:', str),
      reconnectDelay: 5000,
    })

    client.onConnect = (frame) => {
      console.log('✅ Kết nối STOMP thành công:', frame)
      setStompClient(client)

      client.subscribe(`/topic/group/${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body)
        console.log('📩 Tin nhắn nhận được:', receivedMessage)
        setMessages((prev) => [...prev, receivedMessage])
      })
    }

    client.onStompError = (error) => {
      console.error('❌ Lỗi STOMP:', error)
    }

    client.onWebSocketError = (event) => {
      console.error('❌ Lỗi WebSocket:', event)
    }

    client.onDisconnect = () => {
      console.log('🔌 Mất kết nối WebSocket.')
    }

    client.activate()

    return () => {
      if (client.connected) {
        console.log('👋 Đang hủy kết nối WebSocket...')
        client.deactivate()
      } else {
        console.log('⚠️ Chưa từng kết nối - không cần hủy.')
      }
    }
  }, [roomId])

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!stompClient || !trimmed) {
      console.warn('⚠️ Không thể gửi: Chưa kết nối hoặc nội dung rỗng.')
      return
    }

    const messageData: MessageRequest = {
      sender_id: currentUser?.id ?? 1,
      chat_member_id: memberId,
      chat_room_id: roomId,
      content: trimmed,
      time: new Date().toISOString(),
    }

    console.log('📤 Gửi tin nhắn:', messageData)

    stompClient.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify(messageData),
    })

    setMessage('')
  }

  const isLoading = isRoomLoading || isMarkupLoading

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.light.tint} />
        </Pressable>
        <View style={styles.headerTitle}>
          <Avatar size={40} />
          <Text style={styles.headerName}>{room?.name ?? ''}</Text>
        </View>
      </View>

      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessageItem}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false })
              }
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>
                  Send a message to start the conversation
                </Text>
              </View>
            }
          />
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Pressable
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Send
            size={20}
            color={message.trim() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
          />
        </Pressable>
      </KeyboardAvoidingView>

      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

export default ChatRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.light.backgroundSecondary,
    paddingTop: 20,
  },
  receiveTimeText: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-start',
  },
  senderTimeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.light.backgroundSecondary,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  backButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.light.messagePreview,
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.separator,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  senderBubble: {
    backgroundColor: colors.sent,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    padding: 8,

    // Đổ bóng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Android
  },

  receiverBubble: {
    backgroundColor: colors.received,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    padding: 8,

    // Đổ bóng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Android
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
})
