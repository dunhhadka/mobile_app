import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Plus } from 'lucide-react-native'
import layout from '../../constants/layout'
import colors from '../../constants/colors'

interface FloatingActionButtonProps {
  onPress: () => void
  icon?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export default function FloatingActionButton({
  onPress,
  icon,
  size = 'medium',
  color = colors.primary,
}: FloatingActionButtonProps) {
  const getSize = () => {
    if (size === 'small') return 48
    if (size === 'large') return 64
    return 56
  }

  const getIconSize = () => {
    if (size === 'small') return 20
    if (size === 'large') return 28
    return 24
  }

  const buttonSize = getSize()
  const iconSize = getIconSize()

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: color,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {icon || <Plus size={iconSize} color={colors.white} />}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: layout.spacing.xl,
    right: layout.spacing.xl,
    zIndex: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
})
