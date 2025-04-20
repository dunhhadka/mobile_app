import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Plus, Clock, Filter, X } from 'lucide-react-native';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetLeavesByUserIdQuery, useCreateLeaveMutation } from '../../api/magementApi';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import StatusBadge from '../layouts/StatusBadge';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const LeaveInfo = ({ leave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnimation = useSharedValue(0);
  const heightAnimation = useSharedValue(0);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    rotateAnimation.value = withTiming(isExpanded ? 0 : 1, { duration: 200 });
    heightAnimation.value = withTiming(isExpanded ? 0 : 1, { duration: 200 });
  };
  
  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotateAnimation.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });
  
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: heightAnimation.value,
      height: interpolate(
        heightAnimation.value,
        [0, 1],
        [0, 200],
        Extrapolate.CLAMP
      ),
      overflow: 'hidden',
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.danger;
      case 'review':
      default:
        return colors.warning;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'review':
      default:
        return 'Đang xem xét';
    }
  };
  
  const mapLeaveStatusToTaskStatus = (status) => {
    switch (status) {
      case 'approved':
        return 'completed';
      case 'rejected':
        return 'cancelled';
      case 'review':
      default:
        return 'review';
    }
  };

  // Safely format date to prevent "Invalid time value" errors
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.log('Date format error:', error);
      return 'Error';
    }
  };

  // Safely format datetime
  const safeFormatDateTime = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.log('DateTime format error:', error);
      return 'Error';
    }
  };

  return (
    <View style={styles.leaveItem}>
      <TouchableOpacity 
        style={styles.leaveHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.leaveHeaderContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.leaveTitle}>{leave.category}</Text>
            <StatusBadge
              status={mapLeaveStatusToTaskStatus(leave.status)}
            />
          </View>
          <View style={styles.leaveDateContainer}>
            <Calendar size={16} color="#666" />
            <Text style={styles.dateText}>
              {safeFormatDate(leave.start_leave)} - {safeFormatDate(leave.end_leave)}
            </Text>
          </View>
        </View>
        <Animated.View style={iconStyle}>
          {isExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View style={[styles.leaveDetails, contentStyle]}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tổng số ngày nghỉ:</Text>
            <Text style={styles.detailValue}>{leave.total_leave} ngày</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Số điện thoại liên hệ:</Text>
            <Text style={styles.detailValue}>{leave.contact_phone}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Mô tả:</Text>
            <Text style={styles.detailValue}>{leave.description}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Ngày tạo:</Text>
            <Text style={styles.detailValue}>
              {safeFormatDateTime(leave.created_on)}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default function LeaveScreen() {
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [category, setCategory] = useState('Nghỉ phép thường niên');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [formErrors, setFormErrors] = useState({
    category: '',
    contactPhone: '',
    description: '',
    dates: ''
  });

  const navigation = useNavigation();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  
  const [createLeave, { isLoading: isCreating }] = useCreateLeaveMutation();
  
  const { 
    data: leaveRequests, 
    isLoading, 
    error,
    refetch
  } = useGetLeavesByUserIdQuery(currentUser?.id || 0);

  // Sắp xếp lại danh sách nghỉ phép theo ngày tạo (mới nhất lên đầu)
  const sortedLeaveRequests = React.useMemo(() => {
    if (!leaveRequests) return [];
    return [...leaveRequests].sort((a, b) => 
      new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
    );
  }, [leaveRequests]);

  const leaveCategories = [
    'Nghỉ phép thường niên', 
    'Nghỉ ốm', 
    'Nghỉ thai sản', 
    'Nghỉ không lương',
    'Nghỉ việc riêng',
    'Khác'
  ];

  const calculateTotalDays = () => {
    // +1 để tính cả ngày đầu và ngày cuối
    return differenceInDays(endDate, startDate) + 1;
  };

  const resetForm = () => {
    setCategory('Nghỉ phép thường niên');
    setStartDate(new Date());
    setEndDate(new Date());
    setContactPhone('');
    setDescription('');
    setFormErrors({
      category: '',
      contactPhone: '',
      description: '',
      dates: ''
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      category: '',
      contactPhone: '',
      description: '',
      dates: ''
    };

    if (!category) {
      errors.category = 'Vui lòng chọn loại nghỉ phép';
      isValid = false;
    }

    if (!contactPhone) {
      errors.contactPhone = 'Vui lòng nhập số điện thoại liên hệ';
      isValid = false;
    } else if (!/^\d{10,11}$/.test(contactPhone)) {
      errors.contactPhone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!description) {
      errors.description = 'Vui lòng nhập lý do nghỉ phép';
      isValid = false;
    }

    if (endDate < startDate) {
      errors.dates = 'Ngày kết thúc phải sau ngày bắt đầu';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const totalDays = calculateTotalDays();
      // Kiểm tra nếu số ngày nghỉ quá nhiều
      if (totalDays > 30) {
        Alert.alert(
          'Thông báo',
          'Số ngày nghỉ không được vượt quá 30 ngày.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Format dates to ISO string yyyy-MM-dd
      const formatDateToISO = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const leaveRequest = {
        category,
        start_leave: formatDateToISO(startDate),
        end_leave: formatDateToISO(endDate),
        contact_phone: contactPhone,
        description
      };

      if (!currentUser) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hiện tại.');
        return;
      }

      await createLeave({
        userId: currentUser.id,
        request: leaveRequest
      }).unwrap();

      Alert.alert(
        'Thành công',
        'Tạo đơn nghỉ phép thành công.',
        [{ text: 'OK', onPress: () => {
          resetForm();
          setShowLeaveForm(false);
          refetch(); // Làm mới danh sách đơn nghỉ phép
        }}]
      );
    } catch (err) {
      console.error('Error creating leave request:', err);
      Alert.alert(
        'Lỗi',
        'Đã xảy ra lỗi khi tạo đơn nghỉ phép. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Đang tải danh sách nghỉ phép...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Có lỗi xảy ra khi tải danh sách</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (!sortedLeaveRequests || sortedLeaveRequests.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Calendar size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Bạn chưa có đơn nghỉ phép nào</Text>
          <Text style={styles.emptySubText}>Tạo đơn mới để bắt đầu</Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.content}>
        {sortedLeaveRequests.map(leave => (
          <LeaveInfo key={leave.id.toString()} leave={leave} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý nghỉ phép</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowLeaveForm(true)}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.createButtonText}>Tạo đơn</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

      {showLeaveForm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo đơn nghỉ phép</Text>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setShowLeaveForm(false);
                }}
                style={styles.closeButton}
              >
                <X size={20} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formScrollContainer}>
              <View style={styles.formContainer}>
                {/* Loại nghỉ phép */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Loại nghỉ phép</Text>
                  <View style={styles.pickerContainer}>
                    {leaveCategories.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.categoryItem,
                          category === item && styles.categoryItemSelected
                        ]}
                        onPress={() => setCategory(item)}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            category === item && styles.categoryTextSelected
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {formErrors.category ? (
                    <Text style={styles.formErrorText}>{formErrors.category}</Text>
                  ) : null}
                </View>

                {/* Thời gian nghỉ */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Thời gian nghỉ</Text>
                  
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Từ ngày:</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowStartPicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {format(startDate, 'dd/MM/yyyy')}
                      </Text>
                      <Calendar size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Đến ngày:</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {format(endDate, 'dd/MM/yyyy')}
                      </Text>
                      <Calendar size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {formErrors.dates ? (
                    <Text style={styles.formErrorText}>{formErrors.dates}</Text>
                  ) : (
                    <Text style={styles.infoText}>
                      Tổng số ngày nghỉ: {calculateTotalDays()} ngày
                    </Text>
                  )}

                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) {
                          setStartDate(selectedDate);
                          // Nếu ngày bắt đầu sau ngày kết thúc, cập nhật ngày kết thúc
                          if (selectedDate > endDate) {
                            setEndDate(selectedDate);
                          }
                        }
                      }}
                    />
                  )}

                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      minimumDate={startDate}
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) {
                          setEndDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                {/* Số điện thoại liên hệ */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Số điện thoại liên hệ</Text>
                  <TextInput
                    style={styles.input}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    placeholder="Nhập số điện thoại liên hệ"
                    keyboardType="phone-pad"
                  />
                  {formErrors.contactPhone ? (
                    <Text style={styles.formErrorText}>{formErrors.contactPhone}</Text>
                  ) : null}
                </View>

                {/* Lý do nghỉ phép */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Lý do nghỉ phép</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Nhập lý do nghỉ phép"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  {formErrors.description ? (
                    <Text style={styles.formErrorText}>{formErrors.description}</Text>
                  ) : null}
                </View>

                {/* Button Submit */}
                <TouchableOpacity
                  style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Tạo đơn nghỉ phép</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  leaveItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leaveHeaderContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leaveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  leaveDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  leaveDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: '35%',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  formScrollContainer: {
    maxHeight: '80%',
  },
  formContainer: {
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  formErrorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});