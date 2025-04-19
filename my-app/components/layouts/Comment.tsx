import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native'
import colors from '../../constants/colors'
import { getTimeAgo } from '../../utils/timeUtils'
import { Send } from 'lucide-react-native'
import SockJS from 'sockjs-client'
import * as Stomp from '@stomp/stompjs'
import { URL, useGetCommentsByTaskIdQuery } from '../../api/magementApi'
import { Comment, CommentRequest } from '../../types/management'
import Avatar from './Avatar'
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface Props {
  taskId: number
}

const CommentPage = ({ taskId }: Props) => {
  const [newComment, setNewComment] = useState('')

  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null)

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const { data: commentData, isLoading: isCommentsLoading } =
    useGetCommentsByTaskIdQuery(taskId, { refetchOnMountOrArgChange: true })

  const [comments, setComments] = useState<Comment[]>([])

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.avatar}>
        <Avatar uri={item?.user?.avatar?.src} size={40} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{item.user.user_name}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>{getTimeAgo(item.created_at)}</Text>
      </View>
    </View>
  )

  const sendMessage = () => {
    const trimmed = newComment.trim()
    if (!stompClient || !trimmed) {
      console.warn('⚠️ Không thể gửi: Chưa kết nối hoặc nội dung COMMENT rỗng.')
      return
    }

    const comment: CommentRequest = {
      content: trimmed,
      task_id: taskId,
      user_id: currentUser?.id ?? 0,
    }

    stompClient.publish({
      destination: `/app/submitComment/${taskId}`,
      body: JSON.stringify(comment),
    })

    setNewComment('')
  }

  useEffect(() => {
    console.log('👉 Bắt đầu tạo kết nối WebSocket Cho Comment...')
    const socket = new SockJS(`${URL}/ws`)
    const client = new Stomp.Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('🪵 [STOMP DEBUG FOR COMMENT]:', str),
      reconnectDelay: 5000,
    })

    client.onConnect = (frame) => {
      console.log('👉 Kết nối STOMP COMMENT thành công: ', frame)

      setStompClient(client)

      client.subscribe(`/topic/comment-task/${taskId}`, (message) => {
        console.log('👉 Lấy được thông tin COMMENT từ server:')
        const newComment = JSON.parse(message.body)
        setComments((prevComments) => [...prevComments, newComment])
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
  }, [taskId])

  const allComments = [...(commentData ?? []), ...comments]

  const isLoading = isCommentsLoading

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Bình luận của Task #{taskId}</Text>
        {allComments && allComments.length ? (
          <FlatList
            data={allComments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View>
            <Text style={styles.noCommentText}>Chưa có comment nào</Text>
          </View>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Nhập bình luận..."
          value={newComment}
          onChangeText={setNewComment}
          placeholderTextColor={colors.textLight}
        />
        <Pressable
          style={[
            styles.sendButton,
            !newComment.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!newComment.trim()}
        >
          <Send
            size={20}
            color={newComment.trim() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
          />
        </Pressable>
      </View>
      {isLoading && <Loading />}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 23,
    textAlign: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    color: colors.textSecondary,
    marginTop: 5,
  },
  time: {
    color: colors.textLight,
    marginTop: 5,
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.greyLight,
    color: colors.textPrimary,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    // Đổ bóng cho iOS
    shadowColor: '#000', // Màu bóng
    shadowOffset: { width: 0, height: 4 }, // Vị trí bóng
    shadowOpacity: 0.1, // Độ mờ của bóng
    shadowRadius: 5, // Bán kính của bóng
    // Đổ bóng cho Android
    elevation: 5, // Độ sâu của bóng
    width: 40,
    height: 40,
  },
  sendText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  noCommentText: {
    textAlign: 'center',
    color: '#999', // Màu chữ nhạt
    fontSize: 16,
    fontStyle: 'italic', // In nghiêng để tạo cảm giác nhấn mạnh
    paddingVertical: 20,
  },
})

export default CommentPage
