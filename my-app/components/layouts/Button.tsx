import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native'
import layout from '../../constants/layout'
import colors from '../../constants/colors'
import typography from '../../constants/typography'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  const getContainerStyles = () => {
    const baseStyles: any[] = [styles.container]

    // Variant styles
    if (variant === 'primary') baseStyles.push(styles.primaryContainer)
    if (variant === 'secondary') baseStyles.push(styles.secondaryContainer)
    if (variant === 'outline') baseStyles.push(styles.outlineContainer)
    if (variant === 'ghost') baseStyles.push(styles.ghostContainer)

    // Size styles
    if (size === 'small') baseStyles.push(styles.smallContainer)
    if (size === 'large') baseStyles.push(styles.largeContainer)

    // Width style
    if (fullWidth) baseStyles.push(styles.fullWidth)

    // Disabled style
    if (disabled) baseStyles.push(styles.disabledContainer)

    return baseStyles
  }

  const getTextStyles = () => {
    const baseStyles: any[] = [styles.text]

    // Variant styles
    if (variant === 'primary') baseStyles.push(styles.primaryText)
    if (variant === 'secondary') baseStyles.push(styles.secondaryText)
    if (variant === 'outline') baseStyles.push(styles.outlineText)
    if (variant === 'ghost') baseStyles.push(styles.ghostText)

    // Size styles
    if (size === 'small') baseStyles.push(styles.smallText)
    if (size === 'large') baseStyles.push(styles.largeText)

    // Disabled style
    if (disabled) baseStyles.push(styles.disabledText)

    return baseStyles
  }

  const getIconColor = () => {
    if (disabled) return colors.greyDark

    if (variant === 'primary') return colors.white
    if (variant === 'secondary') return colors.primary
    if (variant === 'outline') return colors.primary
    if (variant === 'ghost') return colors.primary

    return colors.white
  }

  return (
    <Pressable
      style={({ pressed }) => [
        ...getContainerStyles(),
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              {React.cloneElement(icon as React.ReactElement, {
                color: getIconColor(),
                size: size === 'small' ? 16 : size === 'large' ? 24 : 20,
              })}
            </View>
          )}

          <Text style={getTextStyles()}>{title}</Text>

          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              {React.cloneElement(icon as React.ReactElement, {
                color: getIconColor(),
                size: size === 'small' ? 16 : size === 'large' ? 24 : 20,
              })}
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: `${colors.primary}15`,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  smallContainer: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
  },
  largeContainer: {
    paddingHorizontal: layout.spacing.xl,
    paddingVertical: layout.spacing.lg,
    borderRadius: layout.borderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    backgroundColor: colors.grey,
    borderColor: colors.grey,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.fontSizes.sm,
  },
  largeText: {
    fontSize: typography.fontSizes.lg,
  },
  disabledText: {
    color: colors.textLight,
  },
  iconLeft: {
    marginRight: layout.spacing.xs,
  },
  iconRight: {
    marginLeft: layout.spacing.xs,
  },
})
