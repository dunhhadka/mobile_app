import React, { useEffect, useState } from 'react'
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
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native'
import Avatar from '../layouts/Avatar'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'
import Button from '../layouts/Button'
import { useUserStore } from '../../store/user-store'
import { useTaskStore } from '../../store/task-store'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { getUserName } from '../../utils/userUtils'
import BaseModel from '../models/BaseModel'
import UpdateProfileModal from '../models/UpdateProfileModal'

export default function ProfileScreen() {
  const router = useRouter()
  const { currentUser } = useUserStore()
  const { tasks } = useTaskStore()
  const [isOpenUpdateModel, setIsOpenUpdateModel] = useState(false)
  const user = useSelector((state: RootState) => state.user.currentUser)

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

  const assignedTasks = tasks.filter((task) =>
    task.assignedTo.some((u) => u.id === currentUser.id)
  )

  const completedTasks = assignedTasks.filter(
    (task) => task.status === 'completed'
  )

  const completionRate =
    assignedTasks.length > 0
      ? Math.round((completedTasks.length / assignedTasks.length) * 100)
      : 0

  useEffect(() => {
    console.log('User updated:', user)
  }, [user])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {user && user.avatar && user.avatar.src ? (
              <Avatar
                uri={user.avatar.src}
                name={getUserName(user)}
                size={80}
              />
            ) : (
              <Avatar name={getUserName(user)} size={80} />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{getUserName(user)}</Text>
              <Text style={styles.userRole}>
                {user?.position ?? currentUser.role ?? 'Chưa xác định'}
              </Text>
            </View>
          </View>

          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            onPress={() => setIsOpenUpdateModel(true)}
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
          <Text style={styles.sectionTitle}>Liên lạc</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {user.email || currentUser.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Phone size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>
                  {user.phone || '+1 (555) 123-4567'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>

          <View style={styles.infoCard}>
            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => {}}
            >
              <View style={styles.infoIconContainer}>
                <Briefcase size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Thông tin cá nhân</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => {}}
            >
              <View style={styles.infoIconContainer}>
                <Building size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Tài sản cá nhân</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => {}}
            >
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Bảng Lương</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.infoCard}>
            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => router.push('/settings/change-password')}
            >
              <View style={styles.infoIconContainer}>
                <Lock size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Change Password</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => router.push('/settings/versioning')}
            >
              <View style={styles.infoIconContainer}>
                <Settings size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Versioning</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => router.push('/settings/faq')}
            >
              <View style={styles.infoIconContainer}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>FAQ and Help</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoItem,
                pressed && styles.infoItemPressed,
              ]}
              onPress={() => {
                /* Handle logout */
              }}
            >
              <View style={styles.infoIconContainer}>
                <LogOut size={20} color={colors.danger} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: colors.danger }]}>
                  Logout
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {user && (
        <BaseModel
          open={isOpenUpdateModel}
          onClose={() => setIsOpenUpdateModel(false)}
        >
          <UpdateProfileModal
            user={user}
            onClose={() => setIsOpenUpdateModel(false)}
          />
        </BaseModel>
      )}
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
    padding: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
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
  infoTextContainer: {
    flex: 1,
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
  infoTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  infoItemPressed: {
    backgroundColor: `${colors.primary}05`,
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
