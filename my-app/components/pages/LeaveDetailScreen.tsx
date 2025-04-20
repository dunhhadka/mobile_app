import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetLeaveByIdQuery, useUpdateLeaveStatusMutation, useFilterUserQuery } from '../../api/magementApi';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import StatusBadge from '../layouts/StatusBadge';
import { ArrowLeft, Calendar, Phone, FileText, Clock, User, CheckCircle, XCircle, Mail } from 'lucide-react-native';

// Định nghĩa kiểu cho route params
type LeaveDetailParams = {
  leave_id: number;
};

export default function LeaveDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, LeaveDetailParams>, string>>();
  const { leave_id } = route.params || {};
  
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Lấy thông tin đơn nghỉ phép
  const { 
    data: leave, 
    isLoading, 
    error, 
    refetch 
  } = useGetLeaveByIdQuery(leave_id);

  // Lấy thông tin người tạo đơn
  const { data: users } = useFilterUserQuery({ ids: leave ? [leave.created_by] : [] });
  
  // Mutation để cập nhật trạng thái
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();

  // Người dùng có phải quản lý không
  const isManager = currentUser?.role === 'manager';
  
  // Debug để kiểm tra vai trò của người dùng
  console.log("Debug role:", currentUser);
  
  // Đơn nghỉ phép đang chờ xử lý và người dùng là quản lý 
  const canApprove = leave?.status === 'review';

  // Debug log để xác định vai trò người dùng và trạng thái đơn
  useEffect(() => {
    console.log("Current user role:", currentUser?.role);
    console.log("Current user ID:", currentUser?.id);
    console.log("Leave status:", leave?.status);
    console.log("Is manager:", isManager);
    console.log("Can approve:", canApprove);
  }, [currentUser, leave, isManager, canApprove]);

  // Tạo hàm để sửa đổi trạng thái đơn nghỉ phép
  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!leave || !currentUser?.id) return;
    
    console.log('Updating status to:', status);
    console.log('Leave ID:', leave.id);
    console.log('Current user ID:', currentUser.id);
    
    try {
      setUpdatingStatus(true);
      
      // Gọi API cập nhật trạng thái với userId
      const result = await updateLeaveStatus({
        leaveId: leave.id,
        userId: currentUser.id,
        status: status // Đảm bảo truyền đúng tham số status
      }).unwrap();
      
      console.log('Update result:', result);
      
      // Hiển thị thông báo thành công
      Alert.alert(
        'Thành công',
        `Đã ${status === 'approved' ? 'phê duyệt' : 'từ chối'} đơn nghỉ phép`,
        [{ 
          text: 'OK',
          onPress: () => {
            // Làm mới dữ liệu sau khi đóng thông báo
            refetch();
          }
        }]
      );
      
    } catch (err) {
      console.error('Error updating leave status:', err);
      Alert.alert(
        'Lỗi',
        'Đã xảy ra lỗi khi cập nhật trạng thái đơn nghỉ phép',
        [{ text: 'OK' }]
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Hàm xử lý xác nhận khi duyệt hoặc từ chối
  const confirmStatusUpdate = (status: 'approved' | 'rejected') => {
    const action = status === 'approved' ? 'phê duyệt' : 'từ chối';
    
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn ${action} đơn nghỉ phép này không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xác nhận', onPress: () => handleUpdateStatus(status) }
      ]
    );
  };

  // Hàm map trạng thái leave sang trạng thái task để hiển thị badge
  const mapLeaveStatusToTaskStatus = (status: string) => {
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

  // Hàm format ngày an toàn
  const safeFormatDate = (dateString?: string) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.log('Date format error:', error);
      return 'Invalid date';
    }
  };

  // Hiển thị người tạo đơn
  const createdByUser = users?.find(user => user.id === leave?.created_by);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn nghỉ phép</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !leave) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn nghỉ phép</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải thông tin đơn nghỉ phép</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn nghỉ phép</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Trạng thái và thông tin cơ bản */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.cardTitle}>{leave.category}</Text>
            <StatusBadge status={mapLeaveStatusToTaskStatus(leave.status)} />
          </View>
          
          <View style={styles.dateRow}>
            <Calendar size={18} color={colors.textSecondary} />
            <Text style={styles.dateText}>
              {safeFormatDate(leave.start_leave)} - {safeFormatDate(leave.end_leave)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tổng số ngày nghỉ:</Text>
            <Text style={styles.infoValue}>{leave.total_leave} ngày</Text>
          </View>
        </View>
        
        {/* Thông tin người gửi đơn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin người gửi đơn</Text>
          
          {createdByUser ? (
            <View style={styles.userInfoContainer}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <User size={18} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Họ và tên:</Text>
                  <Text style={styles.infoValue}>
                    {createdByUser.first_name} {createdByUser.last_name || ''}
                  </Text>
                </View>
              </View>
              
              {createdByUser.position && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <FileText size={18} color={colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Chức vụ:</Text>
                    <Text style={styles.infoValue}>
                      {createdByUser.position || 'Không có thông tin'}
                    </Text>
                  </View>
                </View>
              )}
              
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Mail size={18} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{createdByUser.email}</Text>
                </View>
              </View>
              
              {createdByUser.phone && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Phone size={18} color={colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{createdByUser.phone}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>Không có thông tin người gửi</Text>
          )}
        </View>
        
        {/* Chi tiết đơn nghỉ phép */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết đơn nghỉ phép</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Phone size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Số điện thoại liên hệ:</Text>
              <Text style={styles.infoValue}>{leave.contact_phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <FileText size={18} color={colors.textSecondary} />
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.infoLabel}>Lý do nghỉ phép:</Text>
              <Text style={styles.descriptionText}>{leave.description}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Clock size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Ngày tạo đơn:</Text>
              <Text style={styles.infoValue}>
                {safeFormatDate(leave.created_on)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Phần duyệt đơn - Hiển thị cho tất cả người dùng khi đơn đang ở trạng thái chờ duyệt */}
        {leave.status === 'review' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Duyệt đơn nghỉ phép</Text>
            <Text style={styles.approvalText}>
              Vui lòng xem xét và quyết định duyệt hoặc từ chối đơn nghỉ phép này.
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => confirmStatusUpdate('rejected')}
                disabled={updatingStatus}
              >
                <XCircle size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Từ chối</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => confirmStatusUpdate('approved')}
                disabled={updatingStatus}
              >
                <CheckCircle size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Phê duyệt</Text>
              </TouchableOpacity>
            </View>
            
            {updatingStatus && (
              <ActivityIndicator size="small" color={colors.primary} style={styles.actionLoader} />
            )}
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
    color: colors.textSecondary,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 30,
    marginRight: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  userInfoContainer: {
    padding: 8,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  approvalText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  actionLoader: {
    marginTop: 16,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  }
});