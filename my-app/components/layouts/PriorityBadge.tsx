import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react-native'
import { TaskPriority } from '../../types/task'
import typography from '../../constants/typography'
import colors from '../../constants/colors'

interface PriorityBadgeProps {
  priority: TaskPriority
  size?: 'small' | 'medium' | 'large'
}

const priorityConfig = {
  high: {
    color: colors.danger,
    icon: ArrowUp,
    label: 'High',
  },
  medium: {
    color: colors.warning,
    icon: ArrowRight,
    label: 'Medium',
  },
  low: {
    color: colors.success,
    icon: ArrowDown,
    label: 'Low',
  },
}

export default function PriorityBadge({
  priority,
  size = 'medium',
}: PriorityBadgeProps) {
  const { color, icon: Icon, label } = priorityConfig[priority]

  const iconSize = size === 'small' ? 12 : size === 'large' ? 18 : 14

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${color}15` },
        size === 'small' && styles.containerSmall,
        size === 'large' && styles.containerLarge,
      ]}
    >
      <Icon size={iconSize} color={color} />
      <Text
        style={[
          styles.text,
          { color },
          size === 'small' && styles.textSmall,
          size === 'large' && styles.textLarge,
        ]}
      >
        {label}
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
    gap: 4,
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
  text: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500', // ✅ sửa lại đúng kiểu string
  },
  textSmall: {
    fontSize: typography.fontSizes.xs,
  },
  textLarge: {
    fontSize: typography.fontSizes.md,
  },
})
