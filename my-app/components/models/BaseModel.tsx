import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { X } from 'lucide-react-native'
import colors from '../../constants/colors'

interface Props {
  children: React.ReactNode
  open: boolean
  onClose: () => void
  title?: string
  height?: number
  onBlur?: () => void
  showIcon?: boolean
}

export default function BaseModel({
  children,
  open,
  onClose,
  title,
  height,
  onBlur,
  showIcon = true,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={open}
      onRequestClose={onClose}
      hardwareAccelerated
      style={styles.container}
    >
      {showIcon && (
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <X size={24} color={colors.primary} strokeWidth={3} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        // onPress={() => {
        //   onBlur?.()
        //   onClose()
        // }}
      >
        <View
          style={[
            styles.modalContainer,
            height != null
              ? {
                  height,
                  flex: undefined,
                  position: 'absolute',
                  width: '100%',
                  bottom: 0,
                }
              : { flex: 1 },
          ]}
        >
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.content}>{children}</View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: 20,
    alignSelf: 'stretch',
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
  backButton: {
    position: 'absolute',
    top: 25,
    left: 5,
    zIndex: 10,
  },
})
