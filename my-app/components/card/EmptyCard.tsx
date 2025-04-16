import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

const EmptyCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.avatarPlaceholder} />
        ))}
      </View>

      <Text style={styles.noMeeting}>No Meeting Available</Text>
      <Text style={styles.description}>
        It looks like you don’t have any meetings scheduled at the moment.{'\n'}
        This space will be updated as new meetings are added!
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2E2E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#507F7E',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#D8E3FF', // light purple/blue
    opacity: 0.4,
  },
  noMeeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F2E2E',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#507F7E',
    textAlign: 'center',
    lineHeight: 16,
  },
})

export default EmptyCard
