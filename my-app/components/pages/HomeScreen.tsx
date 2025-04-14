import { useRoute } from '@react-navigation/native'
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native'
import { useTaskStore } from '../../store/task-store'
import { useUserStore } from '../../store/user-store'
import { Task } from '../../types/task'
import TaskCard from '../layouts/TaskCard'
import { useRouter } from 'expo-router'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'
import Avatar from '../layouts/Avatar'
import SearchBar from '../layouts/SearchBar'
import { Calendar, Clock, ListChecks } from 'lucide-react-native'
import ProgressBar from '../layouts/ProgressBar'
import Button from '../layouts/Button'

export default function HomeScreen() {
  const router = useRouter()
  const { tasks, filteredTasks, fetchTasks, setSearchQuery, activeFilters } =
    useTaskStore()
  const { currentUser } = useUserStore()

  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress')
  const pendingTasks = tasks.filter((task) => task.status === 'pending')
  const completedTasks = tasks.filter((task) => task.status === 'completed')

  const totalTasks = tasks.length
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCardContainer}>
      <TaskCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
    </View>
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <SafeAreaView
      style={styles.container}
      //   edges={['top']}
    >
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
          </View>
          <Avatar
            uri={currentUser?.avatar}
            name={currentUser?.name}
            size={48}
          />
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={activeFilters.search}
            onChangeText={setSearchQuery}
            placeholder="Search tasks..."
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <ListChecks size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Clock size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Task Completion</Text>
              <Text style={styles.progressValue}>{completionRate}%</Text>
            </View>
            <ProgressBar
              progress={completionRate}
              height={8}
              color={colors.primary}
            />
            <Text style={styles.progressSubtext}>
              {completedTasks.length} of {totalTasks} tasks completed
            </Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            <Button
              title="View All"
              variant="ghost"
              size="small"
              onPress={() => router.push('/tasks')}
            />
          </View>

          {inProgressTasks.length > 0 ? (
            <FlatList
              data={inProgressTasks.slice(0, 5)}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No tasks in progress</Text>
            </View>
          )}
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            <Button
              title="View All"
              variant="ghost"
              size="small"
              onPress={() => router.push('/tasks')}
            />
          </View>

          {pendingTasks.length > 0 ? (
            <FlatList
              data={pendingTasks.slice(0, 5)}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No upcoming tasks</Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  greeting: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: typography.fontSizes['2xl'],
    // fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
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
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.xl,
    // fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  progressSection: {
    marginBottom: layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    // fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    marginHorizontal: layout.spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  progressTitle: {
    fontSize: typography.fontSizes.md,
    // fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  progressValue: {
    fontSize: typography.fontSizes.lg,
    // fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  progressSubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: layout.spacing.sm,
  },
  tasksSection: {
    marginBottom: layout.spacing.xl,
  },
  tasksList: {
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.sm,
  },
  taskCardContainer: {
    width: 280,
    marginRight: layout.spacing.md,
  },
  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    marginHorizontal: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
})
