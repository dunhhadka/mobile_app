import { LinearGradient } from 'expo-linear-gradient'
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'

interface Props {
  isLoading?: boolean
  onPress?: () => void
  title: string
}

export default function BaseButton({
  isLoading = false,
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.buttonWrapper}
      onPress={onPress}
      disabled={isLoading}
    >
      <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
  } as ViewStyle,
  button: {
    // marginTop: 20,
    // paddingVertical: 12,
    // paddingHorizontal: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  } as ViewStyle,
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
})
