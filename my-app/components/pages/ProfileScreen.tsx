import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  User,
  Settings,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native'
import Avatar from '../layouts/Avatar'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'
import Button from '../layouts/Button'
import { useUserStore } from '../../store/user-store'
import { useTaskStore } from '../../store/task-store'

export default function ProfileScreen() {
  const router = useRouter()
  const { currentUser } = useUserStore()
  const { tasks } = useTaskStore()

  if (!currentUser) {
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

  const assignedTasks = tasks.filter((task) =>
    task.assignedTo.some((user) => user.id === currentUser.id)
  )

  const completedTasks = assignedTasks.filter(
    (task) => task.status === 'completed'
  )
  const pendingTasks = assignedTasks.filter((task) => task.status === 'pending')
  const inProgressTasks = assignedTasks.filter(
    (task) => task.status === 'inProgress'
  )

  const completionRate =
    assignedTasks.length > 0
      ? Math.round((completedTasks.length / assignedTasks.length) * 100)
      : 0

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar
              uri={currentUser.avatar}
              name={currentUser.name}
              size={80}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userRole}>{currentUser.role}</Text>
            </View>
          </View>

          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            onPress={() => router.push('/profile/edit')}
            icon={<Settings size={16} color={colors.primary} />}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{assignedTasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {currentUser.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Phone size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Briefcase size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>{currentUser.role}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Building size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>
                  {currentUser.department || 'Not assigned'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Joined</Text>
                <Text style={styles.infoValue}>January 15, 2023</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Summary</Text>

          <Pressable
            style={({ pressed }) => [
              styles.taskSummaryItem,
              pressed && styles.taskSummaryItemPressed,
            ]}
            onPress={() => router.push('/tasks')}
          >
            <View style={styles.taskSummaryIconContainer}>
              <Clock size={20} color={colors.warning} />
            </View>
            <View style={styles.taskSummaryContent}>
              <Text style={styles.taskSummaryTitle}>Pending Tasks</Text>
              <Text style={styles.taskSummaryCount}>
                {pendingTasks.length} tasks
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.taskSummaryItem,
              pressed && styles.taskSummaryItemPressed,
            ]}
            onPress={() => router.push('/tasks')}
          >
            <View
              style={[
                styles.taskSummaryIconContainer,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <AlertCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.taskSummaryContent}>
              <Text style={styles.taskSummaryTitle}>In Progress</Text>
              <Text style={styles.taskSummaryCount}>
                {inProgressTasks.length} tasks
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.taskSummaryItem,
              pressed && styles.taskSummaryItemPressed,
            ]}
            onPress={() => router.push('/tasks')}
          >
            <View
              style={[
                styles.taskSummaryIconContainer,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <CheckCircle size={20} color={colors.success} />
            </View>
            <View style={styles.taskSummaryContent}>
              <Text style={styles.taskSummaryTitle}>Completed</Text>
              <Text style={styles.taskSummaryCount}>
                {completedTasks.length} tasks
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </Pressable>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Settings"
            variant="outline"
            fullWidth
            onPress={() => router.push('/settings')}
            icon={<Settings size={20} color={colors.primary} />}
          />

          <Button
            title="Log Out"
            variant="secondary"
            fullWidth
            onPress={() => {
              /* Handle logout */
            }}
            icon={<User size={20} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
    borderBottomLeftRadius: layout.borderRadius.xl,
    borderBottomRightRadius: layout.borderRadius.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  userInfo: {
    marginLeft: layout.spacing.lg,
  },
  userName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    alignItems: 'center',
    width: '30%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: layout.spacing.md,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  taskSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskSummaryItemPressed: {
    opacity: 0.8,
  },
  taskSummaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.warning}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  taskSummaryContent: {
    flex: 1,
  },
  taskSummaryTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  taskSummaryCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    gap: layout.spacing.md,
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
})
