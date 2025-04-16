import { ActivityIndicator, View, Text, StyleSheet, Modal } from 'react-native'
import colors from '../../constants/colors'

interface Props {
  size?: 'small' | 'large' | number
  color?: string
}

const Loading = ({
  size,
  color = 'black',
  message = '',
}: Props & { message?: string }) => {
  return (
    <Modal transparent visible hardwareAccelerated style={styles.container}>
      <View style={styles.container}>
        <ActivityIndicator
          size={50}
          color={colors.primary}
          style={styles.loadingContainer}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
