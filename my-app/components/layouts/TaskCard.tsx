import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Task } from '../../types/task'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import AvatarGroup from './AvatarGroup'
import ProgressBar from './ProgressBar'
import { Calendar, Paperclip } from 'lucide-react-native'
import colors from '../../constants/colors'
import typography from '../../constants/typography'
import layout from '../../constants/layout'

interface TaskCardProps {
  task: Task
  onPress?: () => void
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const dueDate = formatDate(task.dueDate)
  const hasAttachments = task.attachments && task.attachments.length > 0

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <StatusBadge status={task.status} size="small" />
        <PriorityBadge priority={task.priority} size="small" />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      {task.progress !== undefined && (
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={task.progress}
            height={6}
            //   showPercentage
          />
        </View>
      )}

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{dueDate}</Text>
        </View>

        {hasAttachments && (
          <View style={styles.metaItem}>
            <Paperclip size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{task.attachments?.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <AvatarGroup users={task.assignedTo} size={28} maxDisplayed={3} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.sm,
  } as ViewStyle,
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: layout.spacing.xs,
  } as TextStyle,
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.md,
  } as TextStyle,
  progressContainer: {
    marginBottom: layout.spacing.md,
  } as ViewStyle,
  metaContainer: {
    flexDirection: 'row',
    marginBottom: layout.spacing.md,
  } as ViewStyle,
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: layout.spacing.md, // Replaces unsupported `gap`
  } as ViewStyle,
  metaText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
})
