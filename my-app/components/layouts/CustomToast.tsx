import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons' // Hoặc thư viện icon bạn thích

const CustomToast = ({
  type,
  message,
}: {
  type: 'success' | 'error' | 'info'
  message: string
}) => {
  // Xác định màu sắc và icon dựa trên type
  const toastStyles = {
    success: {
      backgroundColor: '#E8F5E9', // Xanh lá nhạt
      icon: 'check-circle',
      iconColor: '#4CAF50',
    },
    error: {
      backgroundColor: '#FFEBEE', // Đỏ nhạt
      icon: 'error',
      iconColor: '#F44336',
    },
    info: {
      backgroundColor: '#E3F2FD', // Xanh dương nhạt
      icon: 'info',
      iconColor: '#2196F3',
    },
  }

  const { backgroundColor, icon, iconColor } =
    toastStyles[type] || toastStyles.info

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon name={icon} size={24} color={iconColor} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12, // Bo góc
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Hiệu ứng bóng cho Android
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
