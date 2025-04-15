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

interface Props {
  user: User
  onClose?: () => void
}

export const getAddress = (address: AddressResponse | null): string => {
  if (!address) return ''
  const { ward_name, district_name, country_name } = address
  return `${ward_name}, ${district_name}, ${country_name}`
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) // Ví dụ: 10 December 1997
  }

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
    <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={styles.hintText}>
            Format .jpg, .png, .jpeg. Max size: 1MB
          </Text>
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
              setShowPicker(Platform.OS !== 'ios') // Chỉ đóng picker khi không phải iOS
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
  container: {},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    marginTop: 8,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: 'gray',
  },
  input: {
    marginBottom: 12,
    width: '100%',
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

const pickerStyle = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 12,
  },
}
