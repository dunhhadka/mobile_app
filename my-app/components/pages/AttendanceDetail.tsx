import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import BaseModel from '../models/BaseModel';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useGetLogsByDateQuery } from '../../api/magementApi';
import { AttendanceResponse, LogResponse } from '../../types/management';
import { startOfDay } from 'date-fns';

interface AttendanceDetailDisplay {
  date: string
  image: string
  latitude: number
  longitude: number
  clockInNotes: string
  totalHours: string
  clockInTime: string
  clockOutTime: string
  breaks: BreakLog[]
}

interface BreakLog {
  duration: string,
  start: string,
  end: string
}
type AttendanceDetailProp = RouteProp<
  {
    params: {
      attendance: AttendanceResponse,
      user_id: number
    }
  }, 'params'
>


export default function AttendanceDetai() {
  // Dữ liệu giả (fake data)
  const route = useRoute<AttendanceDetailProp>();
  const { attendance, user_id } = route.params;
  const { data: logs, isLoading, isError, refetch } = useGetLogsByDateQuery({ userId: user_id, date: attendance.date })
  const navigation = useNavigation()
  const [attendanceDisplay, setAttendanceDisplay] = useState<AttendanceDetailDisplay | undefined>()
  useEffect(
    () => {

      const fetchData = async () => {
        const logs = await refetch().unwrap()
        if (logs) {
          const sortedLogs = [...logs].sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
          while (sortedLogs[0].type != 'in') sortedLogs.shift();
          while (sortedLogs[sortedLogs.length - 1].type == 'out') sortedLogs.pop()
          const checkInLog = sortedLogs[0];
          sortedLogs.shift();
          const breaksLogs: Array<BreakLog> = []
          var flag = 0;
          var start, end;
          console.log(sortedLogs)
          while (sortedLogs.length) {
            const head = sortedLogs.shift()
            if (flag == 0 && head?.type == 'back_work') continue
            if (flag == 1 && head?.type == 'break_work') continue
            if (flag == 0) {
              start = head?.check_in
              flag = 1
            } else {
              end = head?.check_in
              const startDate = new Date(start);
              const endDate = new Date(end);

              // 1. Format thời gian để hiển thị
              const timeStart = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12:false });
              const timeEnd = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12:false});


              const diffMs = endDate.getTime() - startDate.getTime();
              const totalMinutes = Math.floor(diffMs / (1000 * 60));
              const diffHours = Math.floor(totalMinutes / 60);
              const remainingMinutes = totalMinutes % 60;

              // Format về dạng hh:mm với padStart
              const duration = `${diffHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
              const breakLog: BreakLog = { duration, start: timeStart, end: timeEnd }
              breaksLogs.push(breakLog)
              flag = 0
            }
          }
          const displayData: AttendanceDetailDisplay =
          {
            date: attendance.date,
            image: checkInLog.image?.src? checkInLog.image.src:'https://img.freepik.com/premium-vector/man-empty-avatar-casual-business-style-vector-photo-placeholder-social-networks-resumes_885953-434.jpg?w=740',
            latitude: Number(checkInLog.latitude),
            longitude: Number(checkInLog.longitude),
            clockInNotes: String(checkInLog.note),
            totalHours: String(attendance.total_hours),
            clockInTime: String(attendance.actual_clock_in),
            clockOutTime: String(attendance.actual_clock_out),
            breaks: breaksLogs,
          }
          setAttendanceDisplay(displayData)
        }
      }
      fetchData()
    }, [refetch]
  )



  return (
    attendanceDisplay ? (
      <View style={styles.container}>
        {/* Date */}
        <Text style={styles.date}>{attendanceDisplay.date}</Text>

        {/* Selfie and Location */}
        <Text style={styles.sectionTitle}>Ảnh chụp điểm danh</Text>
        <Image
          source={{ uri: `${attendanceDisplay.image}` }}
          style={styles.selfieImage}
        />
        <Text style={styles.locationText}>
          Lat: {attendanceDisplay.latitude}
        </Text>
        <Text style={styles.locationText}>
          Long: {attendanceDisplay.longitude}
        </Text>

        {/* Clock-In Notes */}
        <Text style={styles.sectionTitle}>Ghi chú Clock-in</Text>
        <Text style={styles.notesText}>
          {attendanceDisplay.clockInNotes}
        </Text>

        {/* Total Hours and Clock-in/Clock-out */}
        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Tổng giờ làm</Text>
            <Text style={styles.timeValue}>{attendanceDisplay.totalHours}</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Clock in & out</Text>
            <Text style={styles.timeValue}>
              {attendanceDisplay.clockInTime} — {attendanceDisplay.clockOutTime}
            </Text>
          </View>
        </View>

        {/* Breaks */}
        {attendanceDisplay.breaks.map((breakItem, index) => (
          <View key={index} style={styles.breakContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Nghỉ giải lao {index + 1}</Text>
              <Text style={styles.timeValue}>{breakItem.duration}</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Bắt đầu & Kết thúc</Text>
              <Text style={styles.timeValue}>
                {breakItem.start} — {breakItem.end}
              </Text>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <View>

      </View>
    ))
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background, // F8F8F8 - Màu nền nhẹ
    // Đổ bóng cho container (nếu cần)
    shadowColor: colors.shadow, // rgba(0, 0, 0, 0.05)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2, // Đổ bóng cho Android
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary, // #6C5CE7 - Màu chính
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary, // #1E1E2D - Màu chữ chính
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  selfieImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    // Đổ bóng cho ảnh
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary, // #6E6B7B - Màu chữ phụ
  },
  timestamp: {
    fontSize: 14,
    color: colors.light.timestamp, // #6B7280 - Màu timestamp
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    color: colors.textSecondary, // #6E6B7B - Màu chữ phụ
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  breakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    // Đổ bóng cho breakContainer
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 1,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.greyLight, // #F8F8F8 - Màu nền nhẹ
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    // Đổ bóng cho timeBox
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textLight, // #BABABA - Màu chữ nhạt
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary, // #1E1E2D - Màu chữ chính
  },
  exportButton: {
    backgroundColor: colors.primary, // #6C5CE7 - Màu chính
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    // Đổ bóng cho nút
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white, // #FFFFFF - Màu chữ trắng
    fontWeight: 'bold',
  },
});