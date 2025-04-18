import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Vibration } from 'react-native'
import { Bell } from 'lucide-react-native'
import colors from '../constants/colors'
import { Notification } from '../types/management'

const CustomNotificationToast = ({
  notification,
}: {
  notification: Notification
}) => {
  console.log('SHOW NOTIFICATION', notification)

  const slideAnim = useRef(new Animated.Value(-80)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const shakeAnim = useRef(new Animated.Value(0)).current

  const hasVibrated = useRef(false)

  useEffect(() => {
    console.log('Component Mount')

    if (!hasVibrated.current) {
      Vibration.vibrate(500)
      hasVibrated.current = true
    }

    // Slide + Fade animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()

    // Bell shake animation (infinite loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      { iterations: Infinity } // luôn lắc
    ).start()

    return () => {
      console.log('Component Unmount')
      hasVibrated.current = false
    }
  }, [notification])

  const rotate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View style={[styles.iconWrapper, { transform: [{ rotate }] }]}>
        <Bell color={colors.white} size={18} />
      </Animated.View>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{notification?.receive_message}</Text>
        <Text style={styles.timestamp}>
          {new Date(notification?.created_at).toLocaleTimeString()}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 16,
  },
  iconWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderColor: colors.primaryLight,
    borderWidth: 1,
  },
  messageContainer: {
    flex: 1,
  },
  username: {
    color: '#1E1E2D',
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    color: '#6E6B7B',
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'medium',
  },
  timestamp: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },
})

export default CustomNotificationToast
