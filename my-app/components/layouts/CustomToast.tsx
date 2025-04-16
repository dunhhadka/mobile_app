import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const CustomToast = ({
  type,
  message,
}: {
  type: 'success' | 'error' | 'info'
  message: string
}) => {
  const toastStyles = {
    success: {
      backgroundColor: '#E8F5E9',
      icon: 'check-circle',
      iconColor: '#4CAF50',
    },
    error: {
      backgroundColor: '#FFEBEE',
      icon: 'error',
      iconColor: '#F44336',
    },
    info: {
      backgroundColor: '#E3F2FD',
      icon: 'info',
      iconColor: '#2196F3',
    },
  }

  const { backgroundColor, icon, iconColor } =
    toastStyles[type] || toastStyles.info

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.container, { backgroundColor }]}>
        <Icon name={icon} size={24} color={iconColor} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 9999, // Đè lên modal
    elevation: 9999, // Android
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
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
