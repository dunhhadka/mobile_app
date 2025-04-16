import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TaskPriority } from '../pages/ProjectDetail'
import colors from '../../constants/colors'

interface PriorityTagProps {
  priority: TaskPriority
}

export const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return colors.highPriority
      case 'medium':
        return colors.mediumPriority
      case 'low':
        return colors.lowPriority
      default:
        return colors.mediumPriority
    }
  }

  const getPriorityText = () => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return 'Medium'
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: getPriorityColor() }]}>
      <Text style={styles.text}>{getPriorityText()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '600',
  },
})
