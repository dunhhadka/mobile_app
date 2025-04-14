import React from 'react'
import { Pressable, Text, StyleSheet, View } from 'react-native'
import { X } from 'lucide-react-native'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'

interface FilterChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  onClear?: () => void
  icon?: React.ReactNode
}

export default function FilterChip({
  label,
  selected = false,
  onPress,
  onClear,
  icon,
}: FilterChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[styles.label, selected && styles.selectedLabel]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {selected && onClear && (
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          onPress={onClear}
          hitSlop={8}
        >
          <X size={14} color={selected ? colors.white : colors.textSecondary} />
        </Pressable>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greyLight,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    // fontWeight: typography.fontWeights.medium,
  },
  selectedLabel: {
    color: colors.white,
  },
  clearButton: {
    marginLeft: 6,
    padding: 2,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
})
