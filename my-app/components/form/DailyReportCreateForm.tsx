import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import colors from '../../constants/colors'
import { TaskActionButton } from '../buttons/TaskActionButton'
import { DailyReportRequest, Task } from '../../types/management'
import { useCreateDailyReportMutation } from '../../api/magementApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { set } from 'react-hook-form'
import ConfirmModal from '../card/ConfirmModal'

interface Props {
  task: Task | undefined
  onClose?: () => void
}

export default function DailyReportCreateForm({ task, onClose }: Props) {
  const [note, setNote] = useState('')
  const [progress, setProgress] = useState('')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const [createDailyReport, { isLoading: isCreateDailyReportLoading }] =
    useCreateDailyReportMutation()

  const handleSubmit = async () => {
    try {
      const request: DailyReportRequest = {
        task_id: task?.id ?? 0,
        progress: Number(progress),
        note: note,
        reporter_id: currentUser?.id ?? 0,
      }
      console.log(request)
      await createDailyReport(request).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const isLoading = isCreateDailyReportLoading

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ghi chú hôm nay</Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: '#f0f0f0', marginTop: 10, marginBottom: 20 },
        ]}
        value={`Tiến độ hiện tại: ${task?.process_value ?? 0}%`}
        editable={false}
        selectTextOnFocus={false} // optional: không cho copy
      />

      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Nhập ghi chú"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top" // rất quan trọng để text không bị canh giữa
        numberOfLines={4}
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>Tiến độ (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiến độ (0-100)"
        keyboardType="numeric"
        value={progress}
        onChangeText={(value) => {
          let number: number
          if (!value || value === '') {
            number = 0
          } else {
            number = Number(value)
          }
          if (number >= 0 && number <= 100) {
            setProgress(number.toString())
          }
          if (number > 100) {
            setProgress('100')
          }
        }}
      />

      <TaskActionButton
        onClick={() => setShowConfirmModal(true)}
        action={'Báo cáo'}
        showIcon={false}
        isLoading={isLoading}
      />
      {showConfirmModal && (
        <ConfirmModal
          open={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            handleSubmit()
            setShowConfirmModal(false)
            onClose?.()
          }}
          message="Khi bạn submit báo cáo thì sẽ không thể sửa lại. Bạn có chắc chắn thực hiện hành động này"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    marginTop: 10,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.greyLight,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  noteInput: {
    height: 120, // hoặc tùy bạn điều chỉnh độ cao
  },
})
