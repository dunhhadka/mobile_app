import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'

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
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <View style={styles.content}>{children}</View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background mờ
  },
  modalContainer: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#808080', // Màu xám
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    position: 'absolute', // Để đặt vị trí chính xác
    top: 10, // Khoảng cách từ phía trên
    left: 10, // Khoảng cách từ phía trái
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
})
