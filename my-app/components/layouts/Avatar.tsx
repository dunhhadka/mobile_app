import { Image, Text, View } from 'react-native'

export default function Avatar({
  uri,
  name,
  size,
}: {
  uri?: string
  name?: string
  size?: number
}) {
  return (
    <View
      style={{
        width: size || 48,
        height: size || 48,
        borderRadius: (size || 48) / 2,
        overflow: 'hidden',
        backgroundColor: '#ccc',
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <Text>{name?.charAt(0).toUpperCase()}</Text>
      )}
    </View>
  )
}
