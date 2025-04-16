import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TaskStatus } from '../../types/task'
import { statusColors } from '../../constants/colors'
import typography from '../../constants/typography'

interface StatusBadgeProps {
  status: TaskStatus
  size?: 'small' | 'medium' | 'large'
}

const statusLabels: Record<TaskStatus, string> = {
  completed: 'Completed',
  inProgress: 'In Progress',
  pending: 'To Do',
  cancelled: 'Cancelled',
  review: 'In Review',
  todo: 'To Do',
  done: 'Done',
}

export default function StatusBadge({
  status,
  size = 'medium',
}: StatusBadgeProps) {
  const color = statusColors[status]

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${color}20` },
        size === 'small' && styles.containerSmall,
        size === 'large' && styles.containerLarge,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.text,
          { color },
          size === 'small' && styles.textSmall,
          size === 'large' && styles.textLarge,
        ]}
      >
        {statusLabels[status]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500', // fixed
  },
  textSmall: {
    fontSize: typography.fontSizes.xs,
  },
  textLarge: {
    fontSize: typography.fontSizes.md,
  },
})
