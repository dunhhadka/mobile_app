import React, { useState } from 'react'
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
import { ChevronDown, FileText, Users } from 'lucide-react-native'
import colors from '../../constants/colors'
import {
  useCreateProjectMutation,
  useFilterUserQuery,
  useUpdateProjectMutation,
} from '../../api/magementApi'
import {
  Project,
  ProjectRequest,
  UserFilterRequest,
} from '../../types/management'
import { formatDate } from '../models/UpdateProfileModal'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import SelectOption, { Item } from '../form/SelectOption'
import BaseModel from '../models/BaseModel'
import { getUserName, getUserNameWithPosition } from '../../utils/userUtils'

interface Props {
  onClose?: () => void
  project?: Project
}

export default function CreateOrUpdateProject({ onClose, project }: Props) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const [userFilter, setUserFilter] = useState<UserFilterRequest>({})
  const [selectedUsers, setSelectedUser] = useState<number[]>(
    project?.users?.map((u) => u.id) ?? []
  )

  const [openSelecteMember, setOpenSelecteMember] = useState(false)

  const isCreate = !project

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

  const [createProject, { isLoading: isCreateProjectLoading }] =
    useCreateProjectMutation()

  const [updateProject, { isLoading: isUpdateProjectLoading }] =
    useUpdateProjectMutation()

  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const [title, setTitle] = useState(isCreate ? '' : project.title)
  const [description, setDescription] = useState(
    isCreate ? '' : project.description
  )
  const [showPicker, setShowPicker] = useState(false)
  const [error, setError] = useState<string | null>('')

  const handleCreateProject = async () => {
    const request = {
      id: isCreate ? 0 : project.id,
      company_id: 1,
      title: title,
      description: description,
      status: 'to_do',
      user_ids: selectedUsers,
      started_on: startedOn,
      created_id: currentUser?.id ?? 0,
    } as ProjectRequest
    try {
      let response: Project
      console.log('Create Project Reuest', request)
      if (!isCreate) response = await updateProject(request).unwrap()
      else response = await createProject(request).unwrap()
      console.log('Project created: ', response)
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

  const isLoading =
    isUserLoading ||
    isCreateProjectLoading ||
    isUserFetching ||
    isUpdateProjectLoading

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
            <Text style={styles.label}>Tiêu đề</Text>
            <View style={[styles.inputContainer]}>
              <View style={styles.iconContainer}>
                <FileText size={20} color={colors.light.primaryPurple} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nhập tiêu đề"
                placeholderTextColor={colors.light.textLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            {/* Description input */}
            <Text style={styles.label}>Mô tả</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập mô tả"
                placeholderTextColor={colors.light.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <Text style={styles.label}>Ngày bắt đầu dự án</Text>
            <Pressable onPress={() => setShowPicker(true)}>
              <View style={[styles.inputContainer]}>
                <TextInput
                  // left={<TextInput.Icon icon="calendar" />}
                  // label="Date of Birth"
                  value={formatDate(startedOn)}
                  placeholder="Chọn ngày bắt đàu"
                  style={styles.input}
                  // mode="outlined"
                  // theme={{ roundness: 12 }}
                  editable={false}
                  pointerEvents="box-none" // Sửa lại pointerEvents để cho phép nhấn vào phần tử bên dưới
                />
              </View>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={startedOn || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowPicker(false)
                  if (selectedDate) setStartedOn(selectedDate)
                }}
              />
            )}

            <Pressable
              style={styles.selectorButton}
              onPress={() => setOpenSelecteMember(true)}
            >
              <Users size={20} color={colors.light.primaryPurple} />
              <Text style={styles.selectorText}>
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} Member${
                      selectedUsers.length > 1 ? 's' : ''
                    } Selected`
                  : 'Chọn người tham gia'}
              </Text>
              <ChevronDown size={20} color={colors.light.textLight} />
            </Pressable>

            {/* Members */}
            {!!selectedUsers.length && (
              <Text style={[styles.label, { marginTop: 16 }]}>
                Thành viên được chọn
              </Text>
            )}
            {selectedUsers.map((id) => {
              const userSelected = users?.find((user) => user.id === id)
              const isSelected = !!userSelected
              return (
                <Pressable
                  key={id}
                  style={[styles.memberItem, isSelected && styles.selected]}
                >
                  <View style={styles.avatarContainer}>
                    {userSelected?.avatar?.src ? (
                      <Image
                        source={{ uri: userSelected.avatar.src }}
                        style={styles.avatar}
                        // contentFit="cover"
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {(userSelected?.user_name ?? '').charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>
                      {userSelected?.user_name ?? ''}
                    </Text>
                    <Text style={styles.role}>
                      {userSelected?.position ?? 'Không xác dịnh'}
                    </Text>
                  </View>
                </Pressable>
              )
            })}

            {/* Submit Button */}
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
                  <Text style={styles.buttonText}>Tạo dự án</Text>
                ) : (
                  <Text style={styles.buttonText}>Cập nhật dự án</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <BaseModel
        open={openSelecteMember}
        onClose={() => setOpenSelecteMember(false)}
        height={550}
      >
        <SelectOption
          title={'Chọn thành viên tham gia'}
          subtitle="Hãy xem xét danh sách thành viên tham gia dự án của bạn"
          data={
            users
              ?.filter((u) => u.id !== currentUser?.id)
              ?.map(
                (u) =>
                  ({ value: u.id, label: getUserNameWithPosition(u) } as Item)
              ) || []
          }
          onSelect={(id) => {}}
          onCancel={() => setOpenSelecteMember(false)}
          multiple
          onMultipleSelected={(ids) => {
            setSelectedUser(ids)
            setOpenSelecteMember(false)
          }}
          multipleSelected={selectedUsers ?? []}
        />
      </BaseModel>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    width: 420,
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
  selectorText: {
    flex: 1,
    marginLeft: 8,
    color: colors.light.textLight,
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
})
