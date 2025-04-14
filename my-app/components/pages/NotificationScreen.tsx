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
import Avatar from '../layouts/Avatar'
import layout from '../../constants/layout'
import typography from '../../constants/typography'
import users from '../../mocks/users'

const notifications = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Design new dashboard"',
    time: '2 hours ago',
    read: false,
    user: users[0],
    taskId: '1',
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Jane Smith completed "Create employee onboarding flow"',
    time: '5 hours ago',
    read: false,
    user: users[1],
    taskId: '3',
  },
  {
    id: '3',
    type: 'comment',
    title: 'New Comment',
    message: 'Robert Johnson commented on "Implement authentication system"',
    time: 'Yesterday',
    read: true,
    user: users[2],
    taskId: '2',
  },
  {
    id: '4',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: '"Optimize database queries" is due tomorrow',
    time: 'Yesterday',
    read: true,
    taskId: '5',
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    message:
      'Emily Davis mentioned you in a comment on "Create mobile responsive layouts"',
    time: '2 days ago',
    read: true,
    user: users[3],
    taskId: '6',
  },
]

interface NotificationItemProps {
  notification: (typeof notifications)[0]
  onPress: () => void
}

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'task_assigned':
        return <Clock size={20} color={colors.primary} />
      case 'task_completed':
        return <CheckCircle size={20} color={colors.success} />
      case 'comment':
        return <MessageCircle size={20} color={colors.info} />
      case 'deadline':
        return <AlertCircle size={20} color={colors.warning} />
      case 'mention':
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
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>

      {notification.user && (
        <View style={styles.avatarContainer}>
          <Avatar
            uri={notification.user.avatar}
            name={notification.user.name}
            size={40}
          />
        </View>
      )}
    </Pressable>
  )
}

export default function NotificationsScreen() {
  const router = useRouter()

  const handleNotificationPress = (notification: (typeof notifications)[0]) => {
    if (notification.taskId) {
      router.push(`/task/${notification.taskId}`)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />
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
