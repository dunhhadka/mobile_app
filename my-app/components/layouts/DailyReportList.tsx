import React from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { CalendarDays, User, StickyNote } from 'lucide-react-native'
import colors, { statusColors } from '../../constants/colors'
import { useGetDailyReportByTaskIdQuery } from '../../api/magementApi'
import Loading from '../loading/Loading'
import { formatDateTime } from '../models/UpdateProfileModal'
import { DailyReport } from '../../types/management'

const getStatusColor = (progress: number): string => {
  if (progress === 100) return statusColors.completed
  if (progress >= 1 && progress < 100) return statusColors.inProgress
  return statusColors.pending
}

interface Props {
  taskId: number
}

const DailyReportList = ({ taskId }: Props) => {
  const {
    data: taskReports,
    isLoading: isReportLoading,
    isFetching: isReportFecthing,
  } = useGetDailyReportByTaskIdQuery(taskId, {
    refetchOnMountOrArgChange: true,
  })

  const isLoading = isReportLoading || isReportFecthing

  const renderItem = ({ item }: { item: DailyReport }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.dateRow}>
            <CalendarDays
              size={18}
              color={colors.textPrimary}
              style={styles.icon}
            />
            <Text style={styles.date}>{formatDateTime(item.date)}</Text>
          </View>
          <View
            style={[
              styles.progressBadge,
              { backgroundColor: getStatusColor(item.progress) },
            ]}
          >
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <User size={16} color={colors.textSecondary} style={styles.icon} />
          <Text style={styles.reporter}>{item.reporter.user_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <StickyNote size={16} color={colors.textLight} style={styles.icon} />
          <Text style={styles.note}>{item.note || 'Không có ghi chú'}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Báo cáo hàng ngày</Text>
        <FlatList
          data={taskReports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </ScrollView>
      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  progressText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  reporter: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  note: {
    fontSize: 14,
    color: colors.textLight,
    flexShrink: 1,
  },
})

export default DailyReportList
