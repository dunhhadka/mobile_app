import { View } from 'react-native'

export default function ProgressBar({
  progress,
  color = '#4CAF50',
  backgroundColor = '#e0e0e0',
  height = 20,
}: {
  progress: number
  color?: string
  backgroundColor?: string
  height?: number
}) {
  return (
    <View
      style={{
        width: '100%',
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  )
}
