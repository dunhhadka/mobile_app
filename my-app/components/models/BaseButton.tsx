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
  isActive?: boolean
  isLoading?: boolean
  onPress?: () => void
  title: string
}

export default function BaseButton({
  isActive = true,
  isLoading = false,
  title,
  onPress,
}: Props) {
  return (
    isActive ?
      (<TouchableOpacity
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
      </TouchableOpacity>)
      :
      (
        <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.inActiveButton}>
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      )
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
  inActiveButton: {
    backgroundColor: '#ccc', // Màu xám để hiển thị button bị vô hiệu hóa
    opacity: 0.6,             // Làm mờ một chút
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  } as ViewStyle
  ,
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
})
