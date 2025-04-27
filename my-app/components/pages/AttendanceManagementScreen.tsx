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
import { useGetAttendanceByUserIdQuery, useGetLogsByDateQuery, useUploadAggregateLogRequestMutation, useUploadLogMutation } from '../../api/magementApi';
import { NavigationProp, useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { AttendanceResponse, Type, User } from '../../types/management';
import * as Location from 'expo-location'
import WorkButton from '../models/WorkButton';
import ClockOutModal from '../models/ClockOutComfirmModal';
import { AttendanceStackParam } from '../../App';
import calculateWorkedHours from '../../utils/workTimeUtils';
import { Route } from 'expo-router/build/Route';

type AttendanceManagementRouteProp = RouteProp<
    {params: {user: User}},
    'params'
>

export default function AttendanceManagementScreen() {
  const navigation = useNavigation<NavigationProp<AttendanceStackParam>>();
  const route = useRoute<AttendanceManagementRouteProp>()
  const user = route.params.user
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [uploadLog] = useUploadLogMutation();
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<AttendanceResponse[]>([])
  const [makeAttendance] = useUploadAggregateLogRequestMutation();
  if (!user) {
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
  const [totalHours, setTotalHours] = useState("00:00")
  const [workTime, setWorkTime] = useState("00:00")
  const [isOpenClockInModel, setOpenClockInModel] = useState(clockIn)
  const [isOpenClockOutModel, setOpenClockOutModel] = useState(false)
  const { data: logs, isLoading, isError, refetch } = useGetLogsByDateQuery({ userId: user.id, date: new Date().toISOString().slice(0, 10) });
  const { error: attendancesError, refetch: attendancesRefetch } = useGetAttendanceByUserIdQuery(user.id);
  useFocusEffect(
    useCallback(
      () => {
        const fetchLogs = async () => {
          const response = await refetch().unwrap()
          try {
            const logs = [...response].sort((a, b) => (new Date(a.check_in).getTime() - new Date(b.check_in).getTime()));
            setWorkTime(calculateWorkedHours(logs))
            if (logs.length == 0) {
              setWorkState('in')
            } else {
              const last_log = logs[logs.length - 1]
              console.log(last_log)
              console.log(last_log.type)
              if (last_log.type == 'out') {
                setWorkState('out')
              } else if (last_log.type == 'in') {
                setWorkState('break_work')
              } else if (last_log.type == 'back_work') {
                setWorkState('break_work')
              } else if (last_log.type == 'break_work') {
                setWorkState('back_work')
              }
            }
            console.log(workState)
          } catch (error: any) {
            Toast.hide(error.message)
          }
        }
        const fetchAttendances = async () => {
          const attendances = await attendancesRefetch().unwrap();
          console.log(attendances)
          setData([...attendances])
          let totalSeconds = attendances.reduce((sum, item) => {
            if(item.total_hours==null) return 0;
            const [h, m, s] = item.total_hours.split(':');
            return sum + (+h * 3600 + +m * 60 + parseFloat(s));
          }, 0);
        
          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
        
          // Format thành chuỗi hh:mm
          const hh = String(totalHours).padStart(2, '0');
          const mm = String(totalMinutes).padStart(2, '0');
          setTotalHours(`${hh}:${mm}`)
        }
        fetchLogs()
        fetchAttendances()
      }, [refetch, refresh]
    )
  )
  const handleClockInButton = () => {
    setOpenClockInModel(true)
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
      if (workState === "break_work") Toast.show('Đã giải lao', { type: 'success' });
      else Toast.show('Tiếp tục làm việc', { type: 'success' });
      setRefresh(prev => !prev);
    } catch (error) {
    }
  }

  const handleClockOutButton = (note: string) => {
    const makeAggregateLogsRequest = async () => {
      const formData = new FormData()
      try {
        formData.append('checkIn', new Date().toISOString());
        formData.append('type', 'out');
        formData.append('userId', user.id.toString());
        try {
          const aggregateLogsRequest = {
            date: (new Date()).toISOString(),
            user_id: user.id,
            note: note,
          }
          const response = await uploadLog(formData).unwrap();
          console.log(response)
          if (response.type === 'out') {
            const attendaceResponse = await makeAttendance(aggregateLogsRequest).unwrap();
            console.log(attendaceResponse)
          }
          setRefresh(prev => !prev);
          setOpenClockOutModel(false);
          setWorkState('out')
        } catch (error: any) {
          Toast.show(error.message)
        }
      } catch (error: any) {
        Toast.show(error.message)
      }

    }
    makeAggregateLogsRequest();
  }



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Theo dõi số giờ làm viêc</Text>
          </View>
          <AlarmClock size={48} color="white" />
        </View>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Hôm nay</Text>
              <Text style={styles.summaryValue}>{workTime}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Tháng này</Text>
              <Text style={styles.summaryValue}>{totalHours}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.scrollContent}>

        {/* History */}
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyCard}
            onPress={() => navigation.navigate('AttendanceDetail', { attendance: item, user_id: user.id })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Calendar size={18} color="#880ED4" />
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <View style={styles.historyDetail}>
              <Text>Số giờ làm việc{'\n'}<Text style={styles.bold}>{item.total_hours}</Text></Text>
              <Text>Giờ vào{'\n'}<Text style={styles.bold}>{item.clock_in}</Text></Text>
              <Text>Giờ về{'\n'}<Text style={styles.bold}>{item.clock_out}</Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    elevation: 2,
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
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});