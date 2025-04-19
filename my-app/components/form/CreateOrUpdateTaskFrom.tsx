import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Calendar,
  ChevronDown,
  FileText,
  Percent,
  Play,
  UserCircle,
} from 'lucide-react-native'
import colors from '../../constants/colors'
import {
  useCreateTaskMutation,
  useFilterUserQuery,
  useFinishTaskByIdMutation,
  useStartTaskByIdMutation,
  useUpdateTaskMutation,
} from '../../api/magementApi'
import {
  ActionType,
  Project,
  Tag,
  tagLabelMap,
  tagWithLabel,
  Task,
  TaskRequest,
  User,
  UserFilterRequest,
} from '../../types/management'
import { useToast } from 'react-native-toast-notifications'
import BaseModel from '../models/BaseModel'
import SelectOption, { Item } from './SelectOption'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import CustomDateTimePicker from './DateTimePicker'
import { formatDate, formatDateTime } from '../models/UpdateProfileModal'
import { TaskActionButton } from '../buttons/TaskActionButton'
import DailyReportCreateForm from './DailyReportCreateForm'

interface Props {
  onClose?: () => void
  project?: Project
  task?: Task
}

export const PRIORITY_OPTIONS: Item[] = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
]

export const DIFFICULTY_OPTIONS: Item[] = [
  { value: 1, label: 'Very Easy' },
  { value: 2, label: 'Easy' },
]

export const getPriorityValue = (
  priority?: 'low' | 'medium' | 'high'
): number | undefined => {
  switch (priority) {
    case 'low':
      return 1
    case 'medium':
      return 2
    case 'high':
      return 3
    default:
      return undefined
  }
}

export const getPriorityFromValue = (
  value: number
): 'low' | 'medium' | 'high' | undefined => {
  switch (value) {
    case 1:
      return 'low'
    case 2:
      return 'medium'
    case 3:
      return 'high'
    default:
      return undefined
  }
}

export const getLabelPriority = (priority?: 'low' | 'medium' | 'high') => {
  if (!priority) return 'Chọn độ ưu tiên'
  switch (priority) {
    case 'low':
      return 'Chậm'
    case 'medium':
      return 'Trung bình'
    case 'high':
      return 'Nhanh'
  }
}

export type DifficultyType = 'very_easy' | 'easy'

export const getDifficultyValue = (
  difficulty?: DifficultyType
): number | undefined => {
  switch (difficulty) {
    case 'very_easy':
      return 1
    case 'easy':
      return 2
    default:
      return undefined
  }
}

export const getDifficultyFromValue = (
  value: number
): DifficultyType | undefined => {
  switch (value) {
    case 1:
      return 'very_easy'
    case 2:
      return 'easy'
    default:
      return undefined
  }
}

export const getLabelDifficulty = (difficulty?: DifficultyType): string => {
  if (!difficulty) return 'Chọn độ khó'
  switch (difficulty) {
    case 'very_easy':
      return 'Rất dễ'
    case 'easy':
      return 'Dễ'
  }
}

export default function CreateOrUpdateTaskFrom({
  onClose,
  project,
  task,
}: Props) {
  const [userFilter, setUserFilter] = useState<UserFilterRequest>({})
  const [selectedUsers, setSelectedUser] = useState<number[]>(
    project?.users?.map((u) => u.id) ?? []
  )

  const [openAssignTo, setOpenAssignTo] = useState(false)
  const [openPriority, setOpenPriority] = useState(false)
  const [openDifficulty, setOpenDifficulty] = useState(false)
  const [openSelectStartDate, setOpenSelectStartDate] = useState(false)
  const [openSelectDueDate, setOpenSelectDueDate] = useState(false)
  const [openSelectTags, setOpenSelectTags] = useState(false)

  const [startDate, setStartDate] = useState<Date | undefined>(task?.start_date)
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.due_date)
  const [tagSelected, setTagSelected] = useState(task?.tags ?? [])

  const isCreate = !task

  const taskId = task?.id
  const currentUser = useSelector((state: RootState) => state.user)

  const [assignToId, setAssignToId] = useState<number | undefined>(
    isCreate ? undefined : task.assign_id
  )
  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high' | undefined
  >(isCreate ? undefined : task.priority)
  const [difficulty, setDifficulty] = useState<DifficultyType | undefined>(
    isCreate ? undefined : task.difficulty
  )

  const toggleSelected = (userId: number) => {
    const included = selectedUsers.includes(userId)
    if (included) {
      setSelectedUser((prev) => prev.filter((p) => p != userId))
      return
    }
    setSelectedUser((pre) => [...pre, userId])
  }

  const [startedOn, setStartedOn] = useState<Date | undefined>(
    project?.started_on
  )

  const {
    data: users,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useFilterUserQuery(userFilter, { refetchOnMountOrArgChange: true })

  const [startTask, { isLoading: isStartTaskLoading }] =
    useStartTaskByIdMutation()
  const [finishTask, { isLoading: isFinishTaskLoading }] =
    useFinishTaskByIdMutation()

  // options

  const getAssignDescription = (user: User | undefined): string => {
    if (!user) return ''
    return (user.user_name ?? '') + ' - ' + (user.position ?? 'Chưa xác định')
  }

  const assignItems = useMemo((): Item[] => {
    if (!users) return []
    return users.map(
      (u) => ({ label: getAssignDescription(u), value: u.id } as Item)
    )
  }, [])

  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const [processValue, setProcessValue] = useState(
    isCreate ? 0 : task.process_value ?? 0
  )
  const [title, setTitle] = useState(isCreate ? '' : task.title)
  const [description, setDescription] = useState(
    isCreate ? '' : task.description
  )
  const [error, setError] = useState<string | null>('')

  const [createTask, { isLoading: isCreateTaskLoading }] =
    useCreateTaskMutation()

  const [updateTask, { isLoading: isUpdateTaskLoading }] =
    useUpdateTaskMutation()

  const [openShowDailyReport, setOpenShowDailyReport] = useState(false)

  const toast = useToast()

  const handleCreateProject = async () => {
    const request = {
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      project_id: project?.id,
      assign_id: currentUser.currentUser?.id,
      process_id: assignToId,
      priority: priority,
      difficulty: difficulty,
      status: 'to_do',
      process_value: processValue ?? 0,
      tags: tagSelected ?? [],
      start_date: startDate,
      due_date: dueDate,
    } as TaskRequest
    try {
      console.log('TaskRequest', request)
      let response: Task
      if (isCreate) response = await createTask(request).unwrap()
      else response = await updateTask(request).unwrap()
      console.log('Task Created: ', response)
      setError(null)
      onClose?.()
    } catch (err: any) {
      console.log('Create project Error', err)
      let message: string | null = null
      if (err?.data?.message) {
        message = err.data.message
      } else {
        message = 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!'
      }
      setError(message)
    }
  }

  const handleStartTask = async () => {
    try {
      if (task?.id && currentUser.currentUser?.id && actionButton === 'start') {
        await startTask({
          taskId: task?.id,
          userId: currentUser.currentUser?.id,
        }).unwrap()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const tagKeys = Object.keys(tagLabelMap) as Tag[]

  const actionButton = useMemo((): ActionType => {
    if (isCreate) return 'create'

    const currentUserId = currentUser.currentUser?.id ?? 0
    if (currentUserId == task?.assign_id) return 'update'

    if (currentUserId == task.process_id) {
      if (!task.actual_start_date) {
        return 'start'
      } else if ((task.process_value ?? 0) <= 100) {
        return 'update_process'
      } else if (!task.completed_at) {
        return 'finish'
      }
    }

    return 'no_action'
  }, [isCreate, currentUser, task])

  console.log('ACTION', actionButton)

  const isLoading =
    isUserLoading ||
    isUserFetching ||
    isCreateTaskLoading ||
    isUpdateTaskLoading ||
    isStartTaskLoading ||
    isFinishTaskLoading

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
            )}

            {/* Title input */}
            <Text style={styles.label}>Task title</Text>
            <View style={[styles.inputContainer]}>
              <View style={styles.iconContainer}>
                <FileText size={20} color={colors.light.primaryPurple} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                placeholderTextColor={colors.light.textLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            {/* Description input */}
            <Text style={styles.label}>Task Description</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter Task Description"
                placeholderTextColor={colors.light.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <Text style={styles.label}>Assign To</Text>
            <Pressable
              style={styles.selectorButton}
              onPress={() => {
                setOpenAssignTo(true)
              }}
            >
              <UserCircle size={20} color={colors.light.primaryPurple} />
              <Text style={styles.selectorText}>
                {assignToId
                  ? (() => {
                      const user = users?.find((user) => user.id === assignToId)
                      return user
                        ? getAssignDescription(user)
                        : 'User not found'
                    })()
                  : 'Chọn Assign To'}
              </Text>

              <ChevronDown size={20} color={colors.light.textLight} />
            </Pressable>

            <Text style={styles.label}>Priority</Text>
            <Pressable
              style={styles.selectorButton}
              onPress={() => setOpenPriority(true)}
            >
              <UserCircle size={20} color={colors.light.primaryPurple} />
              <Text style={styles.selectorText}>
                {getLabelPriority(priority)}
              </Text>
              <ChevronDown size={20} color={colors.light.textLight} />
            </Pressable>

            <Text style={styles.label}>Difficulty</Text>
            <Pressable
              style={styles.selectorButton}
              onPress={() => setOpenDifficulty(true)}
            >
              <UserCircle size={20} color={colors.light.primaryPurple} />
              <Text style={styles.selectorText}>
                {getLabelDifficulty(difficulty)}
              </Text>
              <ChevronDown size={20} color={colors.light.textLight} />
            </Pressable>

            <View style={styles.chooseDate}>
              <Text style={styles.label}>Ngày bắt đầu dự kiến:</Text>
              <Pressable
                style={styles.selectorDateButton}
                onPress={() => setOpenSelectStartDate(true)}
              >
                <Calendar size={20} color={colors.light.primaryPurple} />
                <Text style={styles.selectorDateValue}>
                  {startDate ? formatDateTime(startDate) : 'Chọn ngày'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.chooseDate}>
              <Text style={styles.label}>Ngày kết thúc dự kiến:</Text>
              <Pressable
                style={styles.selectorDateButton}
                onPress={() => setOpenSelectDueDate(true)}
              >
                <Calendar size={20} color={colors.light.primaryPurple} />
                <Text style={styles.selectorDateValue}>
                  {dueDate ? formatDateTime(dueDate) : 'Chọn ngày'}
                </Text>
              </Pressable>
            </View>
            {openSelectStartDate && (
              <CustomDateTimePicker
                value={startDate}
                onClose={() => setOpenSelectStartDate(false)}
                onChange={(date) => setStartDate(date)}
              />
            )}
            {openSelectDueDate && (
              <CustomDateTimePicker
                value={dueDate}
                onClose={() => setOpenSelectDueDate(false)}
                onChange={(date) => setDueDate(date)}
              />
            )}

            <View style={{ marginTop: 30 }}>
              <Text style={styles.label}>Tags</Text>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setOpenSelectTags(true)}
              >
                {tagSelected && tagSelected?.length ? (
                  <View style={styles.tagContainer}>
                    {tagSelected.map((tag, index) => (
                      <View key={index} style={styles.tagChip}>
                        <Text style={styles.tagText}>{tagLabelMap[tag]}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.selectorText}>{'Chọn Tags'}</Text>
                )}
              </Pressable>
            </View>

            {openSelectTags && (
              <BaseModel
                open={openSelectTags}
                onClose={() => setOpenSelectTags(false)}
                height={450}
              >
                <SelectOption
                  title="Chọn thẻ liên quan"
                  subtitle="Bạn có thể chọn nhiều thẻ"
                  data={tagWithLabel}
                  multiple
                  multipleSelected={
                    tagSelected?.map((tag) => tagKeys.indexOf(tag)) ?? []
                  }
                  onMultipleSelected={(selectedIndexes) => {
                    const selectedTags = selectedIndexes.map(
                      (index) => tagKeys[index]
                    )
                    setTagSelected(selectedTags)
                    setOpenSelectTags(false)
                  }}
                  onCancel={() => setOpenSelectTags(false)}
                />
              </BaseModel>
            )}

            {!isCreate && task && (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.label}>Tiến độ công việc</Text>
                  <Percent
                    color="#999"
                    size={15}
                    style={[styles.icon, { marginLeft: 5, marginBottom: 2 }]}
                  />
                </View>
                <TextInput
                  value={processValue + ''}
                  onChangeText={(value) => setProcessValue(Number(value))}
                  placeholder="Nhập số"
                  keyboardType="numeric"
                  style={styles.selectorButton}
                  placeholderTextColor="#aaa"
                />
              </View>
            )}

            {/* Submit Button */}
            {(actionButton === 'create' || actionButton === 'update') && (
              <TouchableOpacity
                style={styles.buttonWrapper}
                disabled={isLoading} // Disable nút khi đang submit
                onPress={handleCreateProject}
              >
                <LinearGradient
                  colors={['#7B5AFF', '#4D66F4']}
                  style={styles.button}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : isCreate ? (
                    <Text style={styles.buttonText}>Tạo công việc</Text>
                  ) : (
                    <Text style={styles.buttonText}>Cập nhật công việc</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
            {actionButton === 'start' && (
              <TaskActionButton
                onClick={handleStartTask}
                action={'Bắt đầu'}
                isLoading={isLoading}
              />
            )}
            {actionButton === 'finish' && (
              <TaskActionButton
                onClick={handleStartTask}
                action={'Hoàn thành'}
                isLoading={isLoading}
              />
            )}
            {actionButton === 'update_process' && (
              <TaskActionButton
                onClick={() => setOpenShowDailyReport(true)}
                action={`Báo cáo ngày ${formatDateTime(new Date())}`}
                isLoading={isLoading}
              />
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Members</Text>
              <Pressable onPress={toggleModal}>
                <Text style={styles.closeButton}>Close</Text>
              </Pressable>
            </View>

            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const fullName =
                  `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() ||
                  item.email
                const role = item.position ?? 'No Role'
                const isSelected = selectedUsers.includes(item.id)

                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.pressedItem,
                      { backgroundColor: isSelected ? '#D3D3D3' : '#FFF' }, // Đổi màu khi được chọn
                    ]}
                    onPress={() => {
                      toggleSelected(item.id)
                    }}
                  >
                    <View style={styles.avatarContainer}>
                      {item.avatar?.src ? (
                        <Image
                          source={{ uri: item.avatar.src }}
                          style={styles.avatar}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarText}>
                            {item.first_name?.[0]?.toUpperCase() ??
                              item.email[0]?.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={styles.name}>{fullName}</Text>
                      <Text style={styles.role}>{role}</Text>
                    </View>
                  </Pressable>
                )
              }}
              style={styles.membersList}
            />
          </View>
        </View>
      </Modal>
      {openAssignTo && (
        <BaseModel
          open={openAssignTo}
          showIcon={false}
          onBlur={() => setOpenAssignTo(false)}
          onClose={() => setOpenAssignTo(false)}
          height={470}
        >
          <SelectOption
            title={'Assign To'}
            subtitle={'Who wil finish this task'}
            data={assignItems}
            selectedId={assignToId}
            onSelect={(id) => {
              setAssignToId(id)
              setOpenAssignTo(false)
            }}
            onCancel={() => setOpenAssignTo(false)}
          />
        </BaseModel>
      )}
      {openPriority && (
        <BaseModel
          open={openPriority}
          showIcon={false}
          onBlur={() => setOpenPriority(false)}
          onClose={() => setOpenPriority(false)}
          height={470}
        >
          <SelectOption
            title={'Priority'}
            subtitle={'Select the priority'}
            data={PRIORITY_OPTIONS}
            selectedId={getPriorityValue(priority)}
            onSelect={(id) => {
              setPriority(getPriorityFromValue(id))
              setOpenPriority(false)
            }}
          />
        </BaseModel>
      )}
      {openDifficulty && (
        <BaseModel
          open={openDifficulty}
          showIcon={false}
          onBlur={() => setOpenDifficulty(false)}
          onClose={() => setOpenDifficulty(false)}
          height={470}
        >
          <SelectOption
            title={'Assign To'}
            subtitle={'Who wil finish this task'}
            data={DIFFICULTY_OPTIONS}
            selectedId={assignToId}
            onSelect={(id) => {
              setDifficulty(getDifficultyFromValue(id))
              setOpenDifficulty(false)
            }}
          />
        </BaseModel>
      )}
      {openShowDailyReport && (
        <BaseModel
          open={openShowDailyReport}
          onClose={() => setOpenShowDailyReport(false)}
        >
          <DailyReportCreateForm
            task={task}
            onClose={() => setOpenShowDailyReport(false)}
          />
        </BaseModel>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    width: 420,
    marginTop: 10,
    position: 'relative',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formContainer: { flex: 1, padding: 24 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: { flexDirection: 'row', paddingHorizontal: 24 },
  textContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: { width: 60, height: 60 },

  // Input
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.borderColor,
    borderRadius: 8,
    backgroundColor: colors.light.backgroundLight,
    marginBottom: 20,
  },
  iconContainer: { paddingLeft: 12 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.light.text,
  },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: -16, marginBottom: 16 },
  textArea: { height: 120, textAlignVertical: 'top', paddingTop: 12 },

  // Members
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.light.backgroundLight,
    marginBottom: 8,
  },
  selected: { backgroundColor: `${colors.light.primaryPurple}20` },
  avatarContainer: { marginRight: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: 'white', fontWeight: 'bold' },
  infoContainer: { flex: 1 },
  name: { fontSize: 14, fontWeight: '500', color: colors.light.text },
  role: { fontSize: 12, color: colors.light.textLight },

  // Button
  submitButton: {
    marginTop: 24,
    backgroundColor: colors.light.primaryPurple,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.light.borderColor,
    borderRadius: 8,
    backgroundColor: colors.light.backgroundLight,
    marginBottom: 12,
  },
  selectorDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.light.borderColor,
    borderRadius: 8,
    backgroundColor: colors.light.backgroundLight,
    width: 200,
  },
  selectorText: {
    flex: 1,
    marginLeft: 8,
    color: colors.light.textLight,
    fontWeight: '500',
  },
  selectorDateValue: {
    marginLeft: 8,
    color: colors.light.textLight,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  closeButton: {
    fontSize: 16,
    color: colors.light.primaryPurple,
  },
  membersList: {
    maxHeight: 400,
  },
  pressedItem: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    paddingLeft: 20,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 2,

    backgroundColor: '#fff', // cần có màu nền để thấy bóng
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {},
  chooseDate: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chooseDateInput: {},
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F4F0FC',
    borderColor: colors.light.primaryPurple,
    borderWidth: 1,
    borderRadius: 16,
  },
  tagText: {
    color: colors.light.primaryPurple,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonStart: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
})
