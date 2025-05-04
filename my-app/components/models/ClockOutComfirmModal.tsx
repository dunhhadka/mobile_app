import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors'; // Đường dẫn đến file colors của bạn

const ClockOutModal = ({ onConfirm, onClose , currentTotalTime}) => {
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      {/* Icon (Clock) */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⏰</Text>
      </View>

      {/* Description */}
      <Text style={styles.modalText}>
        Sau khi chấm công, bạn sẽ không thể chỉnh sửa thời gian này. Vui lòng kiểm tra kỹ giờ làm trước khi tiếp tục.
      </Text>

      {/* Time Display */}
      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Hôm nay</Text>
          <Text style={styles.timeValue}>{currentTotalTime} Giờ</Text>
        </View>
      </View>

      {/* Note Input */}
      <Text style={styles.noteLabel}>Ghi chú (tùy chọn):</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Thêm ghi chú..."
        placeholderTextColor={colors.textLight}
        value={note}
        onChangeText={setNote}
        multiline
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirm(note)}
        >
          <Text style={styles.buttonText}>Có, Chấm công</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Không</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding:20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary, // Sử dụng primary color cho icon container
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },    
  icon: {
    fontSize: 30,
    color: colors.white, // Màu trắng cho icon
  },
  modalText: {
    fontSize: 14,
    color: colors.textSecondary, // Màu chữ phụ
    textAlign: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.greyLight, // Màu nền cho time box
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textLight, // Màu chữ phụ cho nhãn
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary, // Màu chữ chính cho giá trị thời gian
  },
  noteLabel: {
    fontSize: 14,
    color: colors.textPrimary, // Màu chữ chính cho nhãn ghi chú
    alignSelf:'flex-start',
    marginLeft: 30,
    marginBottom: 5,
  },
  noteInput: {
    minWidth: "80%",
    height: 60,
    borderColor: colors.border, // Màu viền từ bảng màu
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    color: colors.textPrimary, // Màu chữ chính cho nội dung nhập
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginHorizontal: 25, // Cách lề trái/phải 25dp
  },
  confirmButton: {
    backgroundColor: colors.primary, // Màu chính cho nút xác nhận
    borderRadius: 20,
    justifyContent: 'center',
    width: '48%', // Chiếm khoảng 48% chiều rộng để có khoảng cách giữa hai nút
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: colors.primary, // Màu viền nút hủy từ primary
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '48%', // Chiếm khoảng 48% chiều rộng
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.white, // Màu trắng cho chữ nút xác nhận
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.primary, // Màu primary cho chữ nút hủy
    fontWeight: 'bold',
  },
});

export default ClockOutModal;