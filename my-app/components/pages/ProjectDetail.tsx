import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Circle } from 'lucide-react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import colors from '../../constants/colors'
import StatusBadge from '../layouts/StatusBadge'
import ProgressBar from '../layouts/ProgressBar'
import BaseModel from '../models/BaseModel'
import CreateOrUpdateTaskForm from '../form/CreateOrUpdateTaskFrom'
import {
  useGetProjectByIdQuery,
  useLazyGetTaskByIdQuery,
} from '../../api/magementApi'
import { TaskItem } from '../card/TaskItem'
import { Task } from '../../types/management'
import Loading from '../loading/Loading'

// Types

interface Sprint {
  id: string
  number: number
  name: string
  status: 'good' | 'warning' | 'danger'
  completedTasks: number
  comparisonText: string
  advice: string
}

interface TaskSummary {
  todo: number
  inProgress: number
  done: number
}

type ProjectDetailRouteProp = RouteProp<
  { params: { project_id: number } },
  'params'
>

// Helper
const getTaskSummary = (tasks: Task[]): TaskSummary => ({
  todo: tasks.filter((t) => t.status === 'to_do').length,
  inProgress: tasks.filter((t) => t.status === 'in_process').length,
  done: tasks.filter((t) => t.status === 'finish').length,
})

const getSprintStatus = (status: Sprint['status']) => {
  switch (status) {
    case 'good':
      return { color: colors.done, label: 'Good' }
    case 'warning':
      return { color: colors.inProgress, label: 'Warning' }
    case 'danger':
      return { color: colors.highPriority, label: 'Danger' }
    default:
      return { color: colors.done, label: 'Good' }
  }
}

export default function ProjectDetail() {
  const route = useRoute<ProjectDetailRouteProp>()
  const { project_id } = route.params

  const { data: project, isLoading } = useGetProjectByIdQuery(project_id)
  const [getTask, { data: taskSelected }] = useLazyGetTaskByIdQuery()

  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false)
  const [taskSelectedInForm, setTaskSelectedInForm] = useState<
    Task | undefined
  >()

  useEffect(() => {
    if (taskSelected) {
      setTaskSelectedInForm(taskSelected)
      setOpenCreateTaskModal(true)
    }
  }, [taskSelected])

  const summary = project
    ? getTaskSummary(project.tasks || [])
    : { todo: 0, inProgress: 0, done: 0 }

  const sprint: Sprint = {
    id: '1',
    name: 'Sprint 1',
    number: 1,
    status: 'good',
    completedTasks: 4,
    comparisonText: 'tasks',
    advice: 'Keep going!',
  }

  const { color: sprintColor, label: sprintLabel } = getSprintStatus(
    sprint.status
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary of Your Work</Text>
          <Text style={styles.cardSubtitle}>Your current task progress</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <StatusBadge status="todo" />
              <Text style={styles.statValue}>{summary.todo}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <StatusBadge status="inProgress" />
              <Text style={styles.statValue}>{summary.inProgress}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <StatusBadge status="done" />
              <Text style={styles.statValue}>{summary.done}</Text>
            </View>
          </View>
        </View>

        {/* Sprint Stats */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>
              Sprint {sprint.number} - Burnout Stats
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: sprintColor }]}
            >
              <Text style={styles.statusText}>{sprintLabel}</Text>
            </View>
          </View>
          <Text style={styles.description}>
            You've completed{' '}
            <Text style={styles.highlight}>
              {sprint.completedTasks} {sprint.comparisonText}
            </Text>
            , {sprint.advice}
          </Text>
          <View style={styles.progressContainer}>
            <Circle fill={colors.done} color={colors.done} size={24} />
            <ProgressBar progress={70} color={colors.done} height={6} />
          </View>
          <View style={styles.filterContainer}>
            <View style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={styles.filterTextActive}>All</Text>
            </View>
            <View
              style={[styles.filterButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.filterTextActive}>In Progress</Text>
            </View>
            <View style={styles.filterButton}>
              <Text style={styles.filterText}>Finish</Text>
            </View>
          </View>
        </View>

        {/* Task list */}
        {project?.tasks?.map((task) => (
          <View key={task.id}>
            <TaskItem
              task={task}
              onDelete={() => {}}
              onView={(id) => getTask(id)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Create Task Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setOpenCreateTaskModal(true)}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal */}
      {openCreateTaskModal && (
        <BaseModel
          open={openCreateTaskModal}
          onClose={() => {
            setOpenCreateTaskModal(false)
            setTaskSelectedInForm(undefined)
          }}
        >
          <CreateOrUpdateTaskForm
            project={project}
            task={taskSelectedInForm}
            onClose={() => {
              setOpenCreateTaskModal(false)
              setTaskSelectedInForm(undefined)
            }}
          />
        </BaseModel>
      )}
      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  highlight: {
    color: colors.done,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: colors.divider,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  floatingButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 30,
    marginTop: 5,
  },
})
