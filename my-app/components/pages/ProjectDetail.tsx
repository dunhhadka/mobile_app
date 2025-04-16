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
import colors from '../../constants/colors'
import StatusBadge from '../layouts/StatusBadge'
import ProgressBar from '../layouts/ProgressBar'
import BaseModel from '../models/BaseModel'
import CreateOrUpdateTaskFrom from '../form/CreateOrUpdateTaskFrom'
import {
  useGetProjectByIdQuery,
  useLazyGetTaskByIdQuery,
} from '../../api/magementApi'
import { TaskItem } from '../card/TaskItem'
import { Task } from '../../types/management'

export type TaskStatus = 'todo' | 'inProgress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Sprint {
  id: string
  number: number
  name: string
  status: 'good' | 'warning' | 'danger'
  completedTasks: number
  comparisonText: string
  advice: string
}

export interface TaskSummary {
  todo: number
  inProgress: number
  done: number
}

export const getTaskSummary = (tasks: Task[]) => {
  return {
    todo: tasks.filter((task) => task.status === 'to_do').length,
    inProgress: tasks.filter((task) => task.status === 'in_process').length,
    done: tasks.filter((task) => task.status === 'finish').length,
  }
}

interface Props {
  project_id: number
}

export default function ProjectDetail({ project_id }: Props) {
  const { data: project } = useGetProjectByIdQuery(project_id)

  const sprint: Sprint = {
    id: '1',
    name: 'Sprint 1',
    number: 1,
    status: 'good',
    completedTasks: 4,
    comparisonText: 'tasks',
    advice: 'Keep going!',
  }

  const [getTask, { data: taskSelected, isLoading: isTaskLoading }] =
    useLazyGetTaskByIdQuery()

  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false)
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)

  const [taskSelectedInFro, setTaskSelectedInFrom] = useState<Task | undefined>(
    undefined
  )

  const summary: TaskSummary = project
    ? getTaskSummary(project.tasks || [])
    : { todo: 0, inProgress: 0, done: 0 }

  const getStatusColor = () => {
    switch (sprint.status) {
      case 'good':
        return colors.done
      case 'warning':
        return colors.inProgress
      case 'danger':
        return colors.highPriority
      default:
        return colors.done
    }
  }

  const getStatusText = () => {
    switch (sprint.status) {
      case 'good':
        return 'Good'
      case 'warning':
        return 'Warning'
      case 'danger':
        return 'Danger'
      default:
        return 'Good'
    }
  }

  useEffect(() => {
    if (taskSelected) {
      setTaskSelectedInFrom(taskSelected)
      setOpenCreateTaskModal(true)
    }
  }, [taskSelected])

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
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText()}</Text>
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
              onDelete={(id) => console.log('Delete Id' + id)}
              onView={(id) => {
                getTask(id)
              }}
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
            setTaskSelectedInFrom(undefined)
          }}
        >
          <CreateOrUpdateTaskFrom
            project={project}
            onClose={() => {
              setOpenCreateTaskModal(false)
              setTaskSelectedInFrom(undefined)
            }}
            task={taskSelectedInFro}
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
