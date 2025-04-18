import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  AlarmClock,
  Calendar,
  Clock,
  ClipboardList,
  FileText,
  Home,
} from 'lucide-react-native';
import BaseButton from '../models/BaseButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import BaseModel from '../models/BaseModel';
import ClockInSelfieModal from '../models/ClockInSelfieModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useUserStore } from '../../store/user-store';
import colors from '../../constants/colors';
import { useGetLogsByCurrentDayQuery, useUploadLogMutation } from '../../api/magementApi';
import { useFocusEffect } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { Type } from '../../types/management';
import * as Location from 'expo-location'
import WorkButton from '../models/WorkButton';
const data = [
  { date: '27 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
  { date: '26 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
  { date: '25 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
];


export default function ClockInScreen() {
  const { currentUser } = useUserStore()
  const user = useSelector((state: RootState) => state.user.currentUser)
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [uploadLog] = useUploadLogMutation();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  if (!currentUser || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No user found</Text>
          <Text style={styles.emptyStateDescription}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const [clockIn, setClockIn] = useState(false);
  const [workState, setWorkState] = useState<Type>('in')
  const [activeButton, setActiveButton] = useState(true)
  const [isOpenClockInModel, setOpenClockInModel] = useState(clockIn)
  const { data: logs, isLoading, isError, refetch } = useGetLogsByCurrentDayQuery(user.id);
  useFocusEffect(
    useCallback(
      () => {
        const fetchLogs = async () => {
          const response = await refetch().unwrap()
          try {
            const logs = [...response].sort((a, b) => (new Date(a.check_in).getTime() - new Date(b.check_in).getTime()));
            // console.log(logs)
            const last_log = logs[logs.length - 1]
            console.log(last_log)
            console.log(last_log.type)
            if (logs.length == 0) {
              setWorkState('in')
            } else if (last_log.type == 'out') {
              setWorkState('out')
            } else if (last_log.type == 'in') {
              setWorkState('break_work')
            } else if (last_log.type == 'back_work') {
              setWorkState('break_work')
            } else if (last_log.type == 'break_work') {
              setWorkState('back_work')
            }
            console.log(workState)
          } catch (error: any) {
            Toast.hide(error.message)
          }
        }
          fetchLogs()
      }, [refetch, refresh]
    )
  )
  const handleClockInButton = () => {
    setOpenClockInModel(true)
    setRefresh(prev => !prev);
  }
  const handleWorkButton = async () => {
    const formData = new FormData()
    try {
      formData.append('checkIn', new Date().toISOString());
      formData.append('type', workState);
      formData.append('userId', user.id.toString());
    } catch (error: any) {
      Toast.show(error.message)
    }
    try {
      const response = await uploadLog(formData).unwrap();
      if(workState === "break_work") Toast.show('Đã giải lao', { type: 'success' });
      else Toast.show('Tiếp tục làm việc', { type: 'success' });
      setRefresh(prev => !prev);
    } catch (error) {
    }
  }

  const handleClockOutButton = async () => {
    const formData = new FormData()
    try {
      formData.append('checkIn', new Date().toISOString());
      formData.append('type', 'out');
      formData.append('userId', user.id.toString())
    } catch (error: any) {
      Toast.show(error.message)
    }
    try {
      const response = await uploadLog(formData).unwrap();
      Toast.show('Check out thành công', { type: 'success' });
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Clock In failed:', error);
      Toast.show('Clock In failed', { type: 'danger' });
    }
  }



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Điểm danh</Text>
            <Text style={styles.headerSubtitle}>Đừng quên việc điểm danh hàng ngày</Text>
          </View>
          <AlarmClock size={48} color="white" />
        </View>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Hôm nay</Text>
              <Text style={styles.summaryValue}>00:00 Hrs</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Tháng này</Text>
              <Text style={styles.summaryValue}>32:00 Hrs</Text>
            </View>
          </View>
          {
            (workState == "in") ?
              (<BaseButton title={"Điểm danh"} onPress={handleClockInButton} isActive={activeButton} />)
              : (workState == 'back_work' || workState == 'break_work') ?
                (
                  <View style={{ flexDirection: "row" }}>
                    {
                      (workState == "back_work") ?
                        <WorkButton title={"Quay lại"} onPress={handleWorkButton} />
                        : <WorkButton title={"Giải lao"} onPress={handleWorkButton} />
                    }
                    <WorkButton title={"Check out"} onPress={handleClockOutButton} />
                  </View>
                )
                : (
                  <BaseButton title={"Hết ngày làm việc"} isActive={activeButton} />
                )
          }

        </View>
      </View>

      <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.scrollContent}>

        {/* History */}
        {data.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Calendar size={18} color="#880ED4" />
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <View style={styles.historyDetail}>
              <Text>Total Hours{'\n'}<Text style={styles.bold}>{item.hours}</Text></Text>
              <Text>Clock In & Out{'\n'}<Text style={styles.bold}>{item.in} — {item.out}</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <BaseModel
        title="Cập nhật thông tin"
        open={isOpenClockInModel}
        onClose={() => setOpenClockInModel(false)}
      >
        <ClockInSelfieModal
          user={user}
          onClose={() => setOpenClockInModel(false)}
          clockInState={clockIn}
        />
      </BaseModel>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Thay '#f8f8fb' bằng colors.background (#F8F8F8)
  },
  scrollStyle: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: colors.primary, // Thay '#880ED4' bằng colors.primary (#6C5CE7)
    padding: 20,
  },
  headerTitle: {
    color: colors.white, // Thay 'white' bằng colors.white (#FFFFFF)
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.white, // Thay 'white' bằng colors.white (#FFFFFF)
    marginTop: 4,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground, // Thay 'white' bằng colors.cardBackground (#FFFFFF)
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    marginBottom: 0,
    shadowColor: colors.black, // Thay '#000' bằng colors.black (#000000)
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.greyLight, // Thay '#f5f5f9' bằng colors.greyLight (#F8F8F8)
    borderRadius: 12,
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight, // Thay '#777' bằng colors.textLight (#BABABA)
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  clockInBtn: {
    marginTop: 10,
    backgroundColor: colors.primary, // Thay '#880ED4' bằng colors.primary (#6C5CE7)
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  clockInText: {
    color: colors.white, // Thay 'white' bằng colors.white (#FFFFFF)
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: colors.cardBackground, // Thay 'white' bằng colors.cardBackground (#FFFFFF)
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  historyDate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 4,
  },
  historyDetail: {
    backgroundColor: colors.greyLight, // Thay '#f5f5f9' bằng colors.greyLight (#F8F8F8)
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16, // Giả sử layout.spacing.xl = 16, có thể thay bằng giá trị từ constants nếu có
  },
  emptyStateTitle: {
    fontSize: 20, // Giả sử typography.fontSizes.xl = 20, thay bằng giá trị thực nếu có
    fontWeight: '600', // Giả sử typography.fontWeights.semibold = '600'
    color: colors.textPrimary, // Sử dụng colors.textPrimary (#1E1E2D)
    marginBottom: 8, // Giả sử layout.spacing.sm = 8
  },
  emptyStateDescription: {
    fontSize: 16, // Giả sử typography.fontSizes.md = 16
    color: colors.textSecondary, // Sử dụng colors.textSecondary (#6E6B7B)
    textAlign: 'center',
  },
});