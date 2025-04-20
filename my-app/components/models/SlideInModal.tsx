import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

const SlideInModal = ({ open, onClose, children, title }: Props) => {
  return (
    <View style={styles.container}>
      <Modal
        isVisible={open}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={onClose}
        style={styles.modal}
        backdropOpacity={0.3}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{title}</Text>
          <View>{children}</View>
        </View>
      </Modal>
    </View>
  )
}

export default SlideInModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    margin: 0, // Fullscreen modal
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeText: {
    color: 'blue',
    marginTop: 20,
  },
})
