import React from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import colors from '../../constants/colors'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={open} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                  <Text style={styles.cancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                  <Text style={styles.confirmText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ConfirmModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  confirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 15,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
})
