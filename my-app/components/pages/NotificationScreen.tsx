import React from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  User,
} from 'lucide-react-native'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import {
  useGetNotificationByUserIdQuery,
  useMarkIsReadMutation,
} from '../../api/magementApi'
import Loading from '../loading/Loading'
import {
  Notification,
  NotificationTitle,
  NotificationType,
} from '../../types/management'
import { getTimeAgo } from '../../utils/timeUtils'
import { useNavigation } from '@react-navigation/native'

interface NotificationItemProps {
  notification: Notification
  onPress: () => void
}

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'task':
        return <Clock size={20} color={colors.primary} />
      case 'comment':
        return <CheckCircle size={20} color={colors.success} />
      case 'messenger':
        return <MessageCircle size={20} color={colors.info} />
      case 'deadline':
        return <AlertCircle size={20} color={colors.warning} />
      case 'user':
        return <User size={20} color={colors.accent} />
      default:
        return <Bell size={20} color={colors.primary} />
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notificationItem,
        notification.read && styles.readNotification,
        pressed && styles.pressedNotification,
      ]}
      onPress={onPress}
    >
      {!notification.read && <View style={styles.unreadIndicator} />}

      <View style={styles.iconContainer}>{getIcon()}</View>

      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>
          {getNotiTitle(notification.type)}
        </Text>
        <Text style={styles.notificationMessage}>
          {notification.receive_message}
        </Text>
        <Text style={styles.notificationTime}>
          {getTimeAgo(notification.created_at)}
        </Text>
      </View>
    </Pressable>
  )
}

export const getNotiTitle = (key: NotificationType): string => {
  return NotificationTitle[key]
}

export default function NotificationsScreen() {
  const router = useRouter()

  const navigation = useNavigation()

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    isFetching: isFetchingNotification,
  } = useGetNotificationByUserIdQuery(currentUser?.id ?? 0, {
    refetchOnMountOrArgChange: true,
  })

  const [markIsRead, { isLoading: isMarkLoading }] = useMarkIsReadMutation()

  console.log('Get Notifications', notifications)

  const handleNotificationPress = async (notification: Notification) => {
    await markIsRead(notification.id)

    switch (notification.type) {
      case 'user': {
        var data = JSON.parse(notification.data ?? '')

        if (data && data?.projectId) {
          // @ts-ignore
          navigation.navigate('Tasks', {
            screen: 'ProjectDetail',
            params: { project_id: data?.projectId },
          })
        }
        break;
      }
      case 'leave': {
        var data = JSON.parse(notification.data ?? '')

        if (data && data?.leaveId) {
          // @ts-ignore
          navigation.navigate('LeaveStack', {
            screen: 'LeaveDetail',
            params: { leave_id: data?.leaveId },
          })
        }
        break;
      }
    }
  }

  const isLoading = isLoadingNotifications || isFetchingNotification

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  notificationsList: {
    padding: layout.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  readNotification: {
    opacity: 0.8,
  },
  pressedNotification: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: typography.fontSizes.xs,
    color: colors.textLight,
  },
  avatarContainer: {
    marginLeft: layout.spacing.md,
  },
})
