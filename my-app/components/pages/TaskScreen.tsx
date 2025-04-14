import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native'
import colors from '../../constants/colors'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  XCircle,
} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useTaskStore } from '../../store/task-store'
import React, { useEffect, useState } from 'react'
import TaskCard from '../layouts/TaskCard'
import typography from '../../constants/typography'
import layout from '../../constants/layout'
import { Task } from '../../types/task'
import FloatingActionButton from '../layouts/FloatingActionButton'
import FilterChip from '../layouts/FilterChip'
import TabBar from '../layouts/TabBar'
import SearchBar from '../layouts/SearchBar'

const statusFilters = [
  {
    key: 'all',
    label: 'All Tasks',
    icon: <Search size={16} color={colors.primary} />,
  },
  {
    key: 'pending',
    label: 'To Do',
    icon: <Clock size={16} color={colors.warning} />,
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: <AlertCircle size={16} color={colors.primary} />,
  },
  {
    key: 'review',
    label: 'In Review',
    icon: <AlertCircle size={16} color={colors.info} />,
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: <CheckCircle size={16} color={colors.success} />,
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    icon: <XCircle size={16} color={colors.danger} />,
  },
]

const priorityFilters = [
  { key: 'all', label: 'All Priorities' },
  { key: 'high', label: 'High Priority' },
  { key: 'medium', label: 'Medium Priority' },
  { key: 'low', label: 'Low Priority' },
]

export default function TaskScreen() {
  const router = useRouter()

  const {
    tasks,
    filteredTasks,
    activeFilters,
    fetchTasks,
    setFilter,
    setSearchQuery,
    clearFilters,
  } = useTaskStore()

  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
  }

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCardContainer}>
      <TaskCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
    </View>
  )

  const tabs = statusFilters.map((filter) => ({
    key: filter.key,
    label: filter.label,
    icon: filter.icon,
  }))

  return (
    <SafeAreaView
      style={styles.container}
      // edges={['top']}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={activeFilters.search}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
        />
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {priorityFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              selected={activeFilters.priority === filter.key}
              onPress={() => setFilter('priority', filter.key)}
              onClear={
                activeFilters.priority === filter.key
                  ? () => setFilter('priority', 'all')
                  : undefined
              }
            />
          ))}
        </ScrollView>
      </View>

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tasksList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No tasks found</Text>
          <Text style={styles.emptyStateDescription}>
            {activeFilters.status !== 'all' ||
            activeFilters.priority !== 'all' ||
            activeFilters.search
              ? 'Try changing your filters or search query'
              : 'Create your first task by tapping the + button'}
          </Text>

          {(activeFilters.status !== 'all' ||
            activeFilters.priority !== 'all' ||
            activeFilters.search) && (
            <Pressable style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </Pressable>
          )}
        </View>
      )}

      <FloatingActionButton
        onPress={() => router.push('/task/new')}
        icon={<Plus size={24} color={colors.white} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['3xl'],
    // fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.md,
  },
  filtersContainer: {
    marginBottom: layout.spacing.md,
  },
  filtersScrollContent: {
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.sm,
  },
  tasksList: {
    padding: layout.spacing.lg,
    gap: layout.spacing.md,
  },
  taskCardContainer: {
    marginBottom: layout.spacing.md,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.fontSizes.xl,
    // fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: layout.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
  },
  clearFiltersButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.md,
  },
  clearFiltersText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    // fontWeight: typography.fontWeights.medium,
  },
})
