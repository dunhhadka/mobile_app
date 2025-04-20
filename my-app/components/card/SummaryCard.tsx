import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Camera } from 'lucide-react-native'

interface Props {
  title: string
  subtitle?: string
}

const SummaryCard = ({ title, subtitle }: Props) => {
  return (
    <LinearGradient
      colors={['#6c5ce7', '#8e74f9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.decorations}>
        <View style={styles.cameraContainer}>
          <Camera size={24} color="white" />
        </View>
        <View style={styles.star1} />
        <View style={styles.star2} />
        <View style={styles.star3} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  decorations: {
    position: 'relative',
    width: 80,
    height: '100%',
  },
  cameraContainer: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star1: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
  },
  star2: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  star3: {
    position: 'absolute',
    right: 50,
    bottom: 15,
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
})

export default SummaryCard
