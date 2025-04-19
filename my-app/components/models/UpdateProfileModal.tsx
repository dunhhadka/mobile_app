// PersonalDataScreen.tsx
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TextInput, Button } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import BaseButton from './BaseButton'
import {
  AddressResponse,
  Position,
  User,
  UserRequest,
} from '../../types/management'
import {
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
} from '../../api/magementApi'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import { setUser } from '../../redux/slices/userSlice'
import { getUserName } from '../../utils/userUtils'
import Avatar from '../layouts/Avatar'
import { launchCamera } from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker'
import typography from '../../constants/typography'
import layout from '../../constants/layout'
import colors from '../../constants/colors'

interface Props {
  user: User
  onClose?: () => void
}

export const getAddress = (address: AddressResponse | null): string => {
  if (!address) return ''
  const { ward_name, district_name, country_name } = address
  return `${ward_name}, ${district_name}, ${country_name}`
}

export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return ''

  const parsedDate = date instanceof Date ? date : new Date(date)
  if (isNaN(parsedDate.getTime())) return '' // kiểm tra nếu date không hợp lệ

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(parsedDate.getTime())) {
    console.warn('Invalid date passed to formatDateTime:', date)
    return ''
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()

  return `${day}/${month}/${year}`
}

export default function UpdateProfileModel({ user, onClose }: Props) {
  const [firstName, setFirstName] = useState<string>(user.first_name ?? '')
  const [lastName, setLastName] = useState(user.last_name ?? '')
  const [dob, setDob] = useState<Date | undefined>(undefined)
  const [position, setPosition] = useState(user.position)
  const [country, setCountry] = useState(user?.address?.country_name ?? '')
  const [districtName, setDistrictName] = useState(
    user?.address?.district_name ?? ''
  )
  const [ward, setWard] = useState(user?.address?.ward_name ?? '')
  const [address, setAddress] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const dispatch = useDispatch()
  const toast = useToast()

  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation()

  const positions = Object.entries(Position).map(([key, value]) => ({
    label: value,
    value: key, // Đặt value là chính giá trị của Position
  }))

  const handleUpdateProfile = async () => {
    const data = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dob?.toISOString(),
      position: position,
      email: user.email,
      phone: user.phone,
      company_id: user.company_id,
      address: {
        ward_name: ward,
        district_name: districtName,
        country_name: country,
      },
    } as UserRequest
    try {
      const res = await updateUser(data).unwrap()
      toast.show('Cập nhật thành công', {
        type: 'success',
        duration: 4000,
      })
      dispatch(setUser(res))
      onClose?.()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const [uploadUserAvatar] = useUploadUserAvatarMutation()

  const handlePickImage = async () => {
    console.log('handlePickImage')

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      if (!permissionResult.granted) {
        console.log('Camera permission denied')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: false,
      })

      console.log('Camera result:', result)

      if (result.canceled) {
        console.log('User cancelled camera')
        return
      }

      const asset = result.assets?.[0]
      if (!asset) {
        console.log('No asset returned')
        return
      }

      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? 'avatar.jpg',
      } as any) // Phải ép kiểu

      try {
        const res = await uploadUserAvatar({
          userId: user.id,
          formData, // truyền đúng field
        }).unwrap()

        dispatch(setUser(res))
      } catch (error) {
        console.error('Upload failed:', error)
        toast.show('Upload failed', {
          type: 'danger',
          duration: 4000,
        })
      }
    } catch (error) {
      console.error('Error in handlePickImage:', error)
    }
  }

  return (
    <ScrollView
      style={styles.boundary}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.header}>My Personal Data</Text>
      <Text style={styles.subHeader}>Details about my personal data</Text>

      <Pressable onPress={handlePickImage}>
        <View style={styles.avatarContainer}>
          {user?.avatar?.src ? (
            <Avatar uri={user.avatar.src} name={getUserName(user)} size={80} />
          ) : (
            <Avatar name={getUserName(user)} size={80} />
          )}
          <Text style={styles.uploadText}>Upload Photo</Text>
        </View>
      </Pressable>

      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        mode="outlined"
        theme={{ roundness: 12 }}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        mode="outlined"
        theme={{ roundness: 12 }}
      />
      <View>
        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            left={<TextInput.Icon icon="calendar" />}
            label="Date of Birth"
            value={formatDate(dob)}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 12 }}
            editable={false}
            pointerEvents="box-none" // Sửa lại pointerEvents để cho phép nhấn vào phần tử bên dưới
          />
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowPicker(false)
              if (selectedDate) setDob(selectedDate)
            }}
          />
        )}
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 12, // Bo góc cho View bao quanh
          padding: 5,
        }}
      >
        <RNPickerSelect
          onValueChange={(value) => setPosition(value)}
          items={positions}
          style={{
            inputIOS: {
              ...styles.input,
              paddingHorizontal: 10,
              borderWidth: 0, // Xóa viền của RNPickerSelect để dùng viền của View bên ngoài
              borderColor: 'transparent', // Đảm bảo không có viền
              borderRadius: 12, // Bo góc cho ô input trong RNPickerSelect
            },
            inputAndroid: {
              ...styles.input,
              paddingHorizontal: 10,
              borderWidth: 0, // Xóa viền của RNPickerSelect để dùng viền của View bên ngoài
              borderColor: 'transparent', // Đảm bảo không có viền
              borderRadius: 12, // Bo góc cho ô input trong RNPickerSelect
            },
            iconContainer: {
              top: 10,
              right: 12,
            },
          }}
          value={position}
          placeholder={{
            label: 'Chọn vị trí',
            value: null,
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Address</Text>
      <RNPickerSelect
        onValueChange={(value) => setCountry(value)}
        value={country}
        items={[
          { label: 'Indonesia', value: 'Indonesia' },
          { label: 'Vietnam', value: 'Vietnam' },
        ]}
        style={pickerStyle}
        placeholder={{}}
      />
      <RNPickerSelect
        onValueChange={(value) => setDistrictName(value)}
        value={districtName}
        items={[{ label: 'DKI Jakarta', value: 'DKI Jakarta' }]}
        style={pickerStyle}
        placeholder={{}}
      />
      <RNPickerSelect
        onValueChange={(value) => setWard(value)}
        value={ward}
        items={[{ label: 'Jakarta Selatan', value: 'Jakarta Selatan' }]}
        style={pickerStyle}
        placeholder={{}}
      />
      <TextInput
        label="Full Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
        theme={{ roundness: 12 }}
      />

      <BaseButton
        title={'Update'}
        isLoading={isUpdateLoading}
        onPress={() => handleUpdateProfile()}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Ensure full width
    backgroundColor: colors.white, // Fallback for gradient
  },
  boundary: {
    width: '100%',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
  },
  header: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.sm,
  },
  subHeader: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  uploadText: {
    marginTop: layout.spacing.sm,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary,
  },
  hintText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
  },
  input: {
    marginBottom: layout.spacing.md,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.md,
  },
  sectionTitle: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.sm,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  button: {
    marginTop: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.primary,
  },
  buttonWrapper: {
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
})

const pickerStyle = {
  inputIOS: {
    fontSize: typography.fontSizes.md,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: layout.borderRadius.md,
    color: colors.textPrimary,
    paddingRight: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    backgroundColor: colors.white,
  },
  inputAndroid: {
    fontSize: typography.fontSizes.md,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: layout.borderRadius.md,
    color: colors.textPrimary,
    paddingRight: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    backgroundColor: colors.white,
  },
}
