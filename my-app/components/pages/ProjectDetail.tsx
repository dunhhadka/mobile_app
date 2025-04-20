import React, { useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { SlidersHorizontal } from 'lucide-react-native'
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native'
import colors from '../../constants/colors'
import StatusBadge from '../layouts/StatusBadge'
import ProgressBar from '../layouts/ProgressBar'
import {
  useChangProjectStatusMutation,
  useFilterTasksQuery,
  useGetProjectByIdQuery,
  useGetProjectMamagementByProjectIdAndUserIdQuery,
} from '../../api/magementApi'
import { TaskItem } from '../card/TaskItem'
import {
  ChangeProjectStatusRequest,
  Position,
  TaskFilterRequest,
} from '../../types/management'
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import EmptySearchResult from '../models/EmptySearchResult'
import SlideInModal from '../models/SlideInModal'
import TaskFilterForm from '../form/TaskFilterForm'
import { TaskActionButton } from '../buttons/TaskActionButton'
import ConfirmModal from '../card/ConfirmModal'

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

type ProjectDetailRouteProp = RouteProp<
  { params: { project_id: number } },
  'params'
>

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
  const [openFilterModal, setOpenFitlerModal] = useState<boolean>(false)
  const [showStartConfirmModal, sethowStartConfirmModal] = useState(false)
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false)

  const isManager =
    currentUser?.position && Position[currentUser.position] === 'Quản lý'

  const {
    data: projectManagement,
    isLoading: isLoadingProjectManagement,
    isFetching: isFetchingProjectManagement,
    refetch: refechProjectManagement,
  } = useGetProjectMamagementByProjectIdAndUserIdQuery(
    {
      projectId: project_id,
      userId: currentUser?.id ?? 0,
    },
    { refetchOnMountOrArgChange: true }
  )

  const {
    data: project,
    isLoading: isProjectLoading,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(project_id, {
    refetchOnMountOrArgChange: true,
  })

  console.log(project)

  const isShowForManager = !currentUser?.position
    ? false
    : Position[currentUser.position] === 'Quản lý'

  const [taskFilter, setTaskFilter] = useState<TaskFilterRequest>({
    projectId: project_id,
    processId:
      currentUser?.position && Position[currentUser.position] == 'Quản lý'
        ? 0
        : currentUser?.id ?? 0,
  })

  const fullTaskFilter = useMemo(
    () => ({
      ...taskFilter,
    }),
    [taskFilter]
  )

  const {
    data: tasks,
    isLoading: isFilterTaskLoading,
    isFetching: isTaskFetching,
  } = useFilterTasksQuery(fullTaskFilter, { refetchOnMountOrArgChange: true })

  const [changeProjectStatus, { isLoading: isProjectStatusLoading }] =
    useChangProjectStatusMutation()

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

  const handleStartProject = async () => {
    try {
      const changeRequest: ChangeProjectStatusRequest = {
        project_id: project_id,
        status: 'in_process',
      }
      await changeProjectStatus(changeRequest).unwrap()
    } catch (err) {}

    sethowStartConfirmModal(false)
  }

  const handleFinishProject = async () => {
    try {
      const changeRequest: ChangeProjectStatusRequest = {
        project_id: project_id,
        status: 'finish',
      }
      await changeProjectStatus(changeRequest).unwrap()
    } catch (err) {}
    setShowFinishConfirmModal(false)
  }

  useFocusEffect(
    useCallback(() => {
      refechProjectManagement()
      refetchProject()
    }, [refechProjectManagement, refetchProject])
  )

  const isLoading =
    isFilterTaskLoading ||
    isTaskFetching ||
    isLoadingProjectManagement ||
    isFetchingProjectManagement ||
    isProjectLoading ||
    isProjectStatusLoading

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.card}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {isShowForManager ? (
              <Text style={styles.cardTitle}>{`Tóm tắt tiến độ trong dự án ${
                project?.title ?? ''
              }`}</Text>
            ) : (
              <Text
                style={styles.cardTitle}
              >{`Tóm tắt tiến độ của bạn trong dự án ${
                project?.title ?? ''
              }`}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Pressable
                style={styles.filterButtonActive}
                onPress={() => setOpenFitlerModal(true)}
              >
                <SlidersHorizontal color={colors.white} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>Tiến độ hiện tại</Text>
          <View style={styles.statsContainer}>
            <Pressable style={styles.statItem}>
              <StatusBadge status="todo" />
              <Text style={styles.statValue}>
                {isShowForManager
                  ? project?.total_to_do ?? 0
                  : projectManagement?.total_to_do ?? 0}
              </Text>
            </Pressable>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <StatusBadge status="inProgress" />
              <Text style={styles.statValue}>
                {isShowForManager
                  ? project?.total_in_progress ?? 0
                  : projectManagement?.total_in_progress ?? 0}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <StatusBadge status="done" />
              <Text style={styles.statValue}>
                {isShowForManager
                  ? project?.total_finish ?? 0
                  : projectManagement?.total_finish ?? 0}
              </Text>
            </View>
          </View>
        </View>
        {/* Sprint Stats */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>
              {isShowForManager
                ? 'Tổng số task hiện tại'
                : 'Tống số tasks của bạn'}
            </Text>
            <Pressable>
              <View
                style={[styles.statusBadge, { backgroundColor: sprintColor }]}
              >
                <Text style={styles.statusText}>{`${
                  isShowForManager
                    ? project?.total_task ?? 0
                    : projectManagement?.total_task ?? 0
                } tasks`}</Text>
              </View>
            </Pressable>
          </View>
          {isShowForManager ? (
            <Text style={styles.description}>
              {`Tiến độ dự án ${project?.title} là `}
              <Text style={styles.highlight}>
                {`${project?.progress ?? 0}%.`}
              </Text>
            </Text>
          ) : (
            <Text style={styles.description}>
              {`Tiến độ của bạn trong dự án ${project?.title} là `}
              <Text style={styles.highlight}>
                {`${projectManagement?.progress ?? 0}%.`}
              </Text>
            </Text>
          )}

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={
                isShowForManager
                  ? project?.progress ?? 0
                  : projectManagement?.progress ?? 0
              }
              color={colors.done}
              height={6}
            />
          </View>
          {isManager && project?.status && (
            <View>
              {project.status === 'to_do' && (
                <TaskActionButton
                  onClick={() => sethowStartConfirmModal(true)}
                  action="Bắt đầu dự án"
                  showIcon={false}
                />
              )}
              {project.status === 'in_process' && (
                <TaskActionButton
                  onClick={() => setShowFinishConfirmModal(true)}
                  action="Kết thúc dự án"
                  showIcon={false}
                />
              )}
            </View>
          )}
          {/* <View
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
          </View> */}
        </View>

        {/* <SearchInput value={query} onChange={(value) => setQuery(value)} /> */}

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
              />
            </View>
          ))
        ) : (
          <EmptySearchResult />
        )}
      </ScrollView>

      {/* Create Task Button */}
      {isManager && project?.status && project.status === 'in_process' && (
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
      )}
      {openFilterModal && (
        <SlideInModal
          open={openFilterModal}
          onClose={() => setOpenFitlerModal(false)}
          title=""
        >
          <TaskFilterForm
            filter={fullTaskFilter}
            onFilter={(filter) => {
              setTaskFilter(filter)
              setOpenFitlerModal(false)
            }}
          />
        </SlideInModal>
      )}
      {showStartConfirmModal && (
        <ConfirmModal
          open={showStartConfirmModal}
          onCancel={() => sethowStartConfirmModal(false)}
          onConfirm={handleStartProject}
          message={`Bạn có chắc chắn bắt đầu dự án ${project?.title}`}
        />
      )}
      {showFinishConfirmModal && (
        <ConfirmModal
          open={showFinishConfirmModal}
          onCancel={() => setShowFinishConfirmModal(false)}
          onConfirm={handleFinishProject}
          message={`Bạn có chắc chắn kết thúc dự án ${project?.title}`}
        />
      )}
      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 35,
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
    maxWidth: 280,
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
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: 5,
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
