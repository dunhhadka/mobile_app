import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated'
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native'
import colors from '../../constants/colors'

const ICON_SIZE = 24

const CustomToast = ({
  type,
  message,
}: {
  type: 'success' | 'error' | 'info'
  message: string
}) => {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // repeat forever
      true // reverse (bật qua lại 1.15 -> 1 -> 1.15 -> ...)
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const renderIcon = () => {
    const iconProps = {
      size: ICON_SIZE,
      style: [styles.icon, animatedStyle] as any,
    }

    switch (type) {
      case 'success':
        return (
          <Animated.View>
            <CheckCircle color="#4CAF50" {...iconProps} />
          </Animated.View>
        )
      case 'error':
        return (
          <Animated.View>
            <AlertCircle color="#F44336" {...iconProps} />
          </Animated.View>
        )
      case 'info':
      default:
        return (
          <Animated.View>
            <Info color="#2196F3" {...iconProps} />
          </Animated.View>
        )
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {renderIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
    top: 15,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 25,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,

    elevation: 10,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
})

export default CustomToast
