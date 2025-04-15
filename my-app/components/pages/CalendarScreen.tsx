import React, { useState } from 'react';
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
import Button from '../layouts/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import BaseModel from '../models/BaseModel';
import users from '../../mocks/users';
import ClockInSelfieModal from '../models/ClockInSelfieModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useUserStore } from '../../store/user-store';
import layout from '../../constants/layout';
import typography from '../../constants/typography';
import colors from '../../constants/colors';

const data = [
  { date: '27 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
  { date: '26 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
  { date: '25 September 2024', hours: '08:00:00 hrs', in: '09:00 AM', out: '05:00 PM' },
];

export default function ClockInScreen() {
  const { currentUser } = useUserStore()
  const user = useSelector((state: RootState) => state.user.currentUser)
  const clockIn = false;
  const [clockState, setClockState] = useState<String>("Điểm danh")
  const [isOpenClockInModel, setOpenClockInModel] = useState(clockIn)

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
  const handleClockInButton = () => {
    if (clockState === "Điểm danh") {
      //TODO: call camera to capture
      setOpenClockInModel(true)
      //TODO: call api clockin

    }
    else {
      //ToDO: call api clockout
    }
  }
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

            <BaseButton title={clockState.toString()} onPress={handleClockInButton} />
          </View>
        </View>



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
    backgroundColor: '#f8f8fb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#880ED4',
    borderRadius: 20,
    padding: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    marginTop: 4,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    marginBottom: 0,
    shadowColor: '#000',
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
    backgroundColor: '#f5f5f9',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  clockInBtn: {
    marginTop: 10,
    backgroundColor: '#880ED4',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  clockInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: 'white',
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
    backgroundColor: '#f5f5f9',
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
    paddingHorizontal: layout.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: layout.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
