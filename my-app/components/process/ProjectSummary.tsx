import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Circle } from 'lucide-react-native'
import colors from '../../constants/colors'
import { Project } from '../../types/management'

interface Props {
  projects: Project[]
}

export const ProjectSummary = ({ projects }: Props) => {
  const inProgressCount = projects.filter(
    (p) => p.status === 'in_process'
  ).length
  const doneCount = projects.filter((p) => p.status === 'finish').length

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tóm tắt tắt cả dự án của bạn</Text>
      <Text style={styles.subtitle}>Dự án hiện tại</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={styles.statHeader}>
            <Circle
              size={12}
              fill={colors.inProgress}
              color={colors.inProgress}
            />
            <Text style={styles.statLabel}>Đang thực hiện</Text>
          </View>
          <Text style={styles.statValue}>{inProgressCount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <View style={styles.statHeader}>
            <Circle size={12} fill={colors.success} color={colors.success} />
            <Text style={styles.statLabel}>Đã hoàn thành</Text>
          </View>
          <Text style={styles.statValue}>{doneCount}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
})

export default ProjectSummary
