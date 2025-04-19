import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { Circle, SlidersHorizontal } from 'lucide-react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import colors from '../../constants/colors'
import StatusBadge from '../layouts/StatusBadge'
import ProgressBar from '../layouts/ProgressBar'
import BaseModel from '../models/BaseModel'
import CreateOrUpdateTaskForm from '../form/CreateOrUpdateTaskFrom'
import {
  useFilterTasksQuery,
  useGetProjectByIdQuery,
  useLazyGetTaskByIdQuery,
} from '../../api/magementApi'
import { TaskItem } from '../card/TaskItem'
import {
  Position,
  StatusType,
  Task,
  TaskFilterRequest,
} from '../../types/management'
import Loading from '../loading/Loading'
import CommentPage from '../layouts/Comment'
import DailyReportList from '../layouts/DailyReportList'
import SearchInput from '../card/SearchInput'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useDebounce } from 'use-debounce'
import EmptySearchResult from '../models/EmptySearchResult'

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
  const navigation = useNavigation()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const [status, setStatus] = useState<StatusType | undefined>(undefined)

  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
    project_id,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [query, setQuery] = useState<string>('')
  const [debouncedTitle] = useDebounce(query, 500)

  const [taskFilter, setTaskFilter] = useState<TaskFilterRequest>({
    projectId: project_id,
    processId:
      currentUser?.position && Position[currentUser.position] == 'Quản lý'
        ? 0
        : currentUser?.id ?? 0,
  })

  const fullTaskFilter: TaskFilterRequest = {
    ...taskFilter,
    title: debouncedTitle,
    status: status,
  }

  const {
    data: tasks,
    isLoading: isFilterTaskLoading,
    isFetching: isTaskFetching,
    refetch: refetchTasks,
  } = useFilterTasksQuery(fullTaskFilter, { refetchOnMountOrArgChange: true })

  const [showComment, setShowComment] = useState(false)
  const [showTaskComment, setShowTaskComment] = useState<Task | undefined>(
    undefined
  )

  const [showDailyReport, setShowDailyReport] = useState(false)

  const summary = tasks
    ? getTaskSummary(tasks || [])
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

  const isLoading = isFilterTaskLoading || isTaskFetching

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
            <Pressable style={styles.statItem}>
              <StatusBadge status="todo" />
              <Text style={styles.statValue}>{summary.todo}</Text>
            </Pressable>
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
            <Text style={styles.cardTitle}>Tống số tasks của bạn</Text>
            <Pressable>
              <View
                style={[styles.statusBadge, { backgroundColor: sprintColor }]}
              >
                <Text style={styles.statusText}>{`${
                  tasks && !!tasks.length ? tasks.length : 0
                } tasks`}</Text>
              </View>
            </Pressable>
          </View>
          <Text style={styles.description}>
            {`Tiến độ của bạn trong dự án ${project?.title} là 70% `}
            <Text style={styles.highlight}>
              {sprint.completedTasks} {sprint.comparisonText}
            </Text>
            , {sprint.advice}
          </Text>
          <View style={styles.progressContainer}>
            <ProgressBar progress={70} color={colors.done} height={6} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <Pressable
              style={[
                styles.statusButton,
                !status && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(undefined)}
            >
              <Text
                style={[styles.statusText, !status && styles.statusTextActive]}
              >
                Tất cả
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.statusButton,
                status && status === 'to_do' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('to_do')}
            >
              <Text
                style={[
                  styles.statusText,
                  status && status === 'to_do' && styles.statusTextActive,
                ]}
              >
                Chưa bắt đầu
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.statusButton,
                status && status === 'in_process' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('in_process')}
            >
              <Text
                style={[
                  styles.statusText,
                  status && status === 'in_process' && styles.statusTextActive,
                ]}
              >
                Đang thực hiện
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.statusButton,
                status && status === 'finish' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('finish')}
            >
              <Text
                style={[
                  styles.statusText,
                  status && status === 'finish' && styles.statusTextActive,
                ]}
              >
                Hoàn thành
              </Text>
            </Pressable>
          </View>
        </View>

        <SearchInput value={query} onChange={(value) => setQuery(value)} />

        <View style={{ marginTop: 20 }}></View>

        {/* Task list */}
        {tasks && !!tasks.length ? (
          tasks.map((task) => (
            <View key={task.id}>
              <TaskItem
                task={task}
                onDelete={() => {}}
                onView={(id) => {
                  // @ts-ignore
                  navigation.navigate('CreateOrUpdateTask', {
                    project_id,
                    task_id: id,
                  })
                }}
                showComment={() => {
                  setShowComment(true)
                  setShowTaskComment(task)
                }}
                showDailyReports={() => {
                  setShowDailyReport(true)
                  setShowTaskComment(task)
                }}
              />
            </View>
          ))
        ) : (
          <EmptySearchResult />
        )}
      </ScrollView>

      {/* Create Task Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('CreateOrUpdateTask', {
            project_id,
            task_id: null,
          })
        }}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {showComment && showTaskComment && (
        <BaseModel
          open={showComment}
          onClose={() => {
            setShowComment(false)
            setShowTaskComment(undefined)
          }}
        >
          <CommentPage taskId={showTaskComment.id} />
        </BaseModel>
      )}
      {showDailyReport && showTaskComment && (
        <BaseModel
          open={showDailyReport}
          onClose={() => {
            setShowDailyReport(false)
            setShowTaskComment(undefined)
          }}
        >
          <DailyReportList taskId={showTaskComment.id} />
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

    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Elevation cho Android
    elevation: 4,

    backgroundColor: '#fff', // 👈 Bắt buộc có để thấy bóng
  },
  statusText: {
    color: colors.black,
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
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#F4F0FC',
    borderColor: colors.light.primaryPurple,
    borderWidth: 1,
    borderRadius: 16,
    color: colors.black,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
  },
  statusTextActive: {
    color: colors.white,
  },
})
