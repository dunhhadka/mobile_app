import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const EmptySearchResult = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Không có kết quả nào</Text>
      <Text style={styles.subtitle}>
        Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm nhé!
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
})

export default EmptySearchResult
