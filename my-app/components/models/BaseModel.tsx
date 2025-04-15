import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'

interface Props {
  children: React.ReactNode
  open: boolean
  onClose: () => void
  title?: string
}

export default function BaseModel({ children, open, onClose, title }: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={onClose}
      hardwareAccelerated={true} // Tăng tốc phần cứng cho modal
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1} // Giúp tránh việc touch không vào modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.content}>{children}</View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background mờ
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  content: {
    marginBottom: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
})
