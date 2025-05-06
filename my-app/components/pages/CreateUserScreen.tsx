import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { TextInput, Button, Checkbox } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../../constants/colors'
import { useCreateUserMutation } from '../../api/magementApi'
import Toast from 'react-native-toast'
import { useToast } from 'react-native-toast-notifications'
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  set,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form'
import { Position, UserRequest } from '../../types/management'
import { useDispatch } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select'
import { setUser } from '../../redux/slices/userSlice'
import { handleApiError } from '../../utils/errorHandler'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'

type CreateUserRouteProp = RouteProp<
  { params: { manager_id: number } },
  'params'
>

export default function CreateUserScreen() {
  const navigation = useNavigation()
  const route = useRoute<CreateUserRouteProp>()
  const manager_id = route.params.manager_id
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequest>({
    defaultValues: {
      email: '',
      phone: '',
      first_name: '',
      password: '',
      confirm_password: '',
      manager_id: manager_id,
      position: undefined,
    },
  })

  const toast = useToast()

  const [createUser, { isLoading: isCreateLoading, isError: isCreateError }] =
    useCreateUserMutation()

  const handleSignUp = async (data: UserRequest) => {
    data.manager_id = manager_id
    if (data.password !== data.confirm_password) {
      toast.show('Mật khẩu không khớp', { type: 'danger', duration: 4000 })
      return
    }

    try {
      const response = await createUser(data).unwrap()
      if (response) {
        toast.show('Thêm nhân viên thành công', {
          type: 'success',
          duration: 4000,
        })
        navigation.goBack()
      }
    } catch (err: any) {
      if (err?.data?.message) {
        toast.show(err.data.message, {
          type: 'danger',
          duration: 4000,
        })
      } else {
        toast.show('Đã xảy ra lỗi tạo tài khoản. Vui lòng thử lại!', {
          type: 'danger',
          duration: 4000,
        })
      }
    }
  }

  const positions = Object.entries(Position)
    .map(([key, value]) => ({
      label: value,
      value: key, // Đặt value là chính giá trị của Position
    }))
    .filter((item) => item.value !== 'manager') // Lọc bỏ vị trí "Quản lý"

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <View style={styles.logoText} />
        </View>
        <Text style={styles.title}>Tạo tài khoản cho nhân viên</Text>
      </View>

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Băn phải nhập email',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.input}
            theme={{ roundness: 12 }}
            left={<TextInput.Icon icon="email-outline" />}
            error={!!errors.email}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Số điện thoại"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon="phone-outline" />}
            style={styles.input}
            theme={{ roundness: 12 }}
            keyboardType="phone-pad"
          />
        )}
      />

      <Controller
        name="first_name"
        control={control}
        rules={{
          required: 'Bắt buộc nhập tên',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Tên"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon="domain" />}
            style={styles.input}
            theme={{ roundness: 12 }}
          />
        )}
      />

      {errors.first_name && (
        <Text style={styles.errorText}>{errors.first_name.message}</Text>
      )}

      <Controller
        name="position"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              marginBottom: 16,
              backgroundColor: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 1,
            }}
          >
            <RNPickerSelect
              onValueChange={onChange}
              items={positions}
              value={value}
              placeholder={{
                label: 'Chọn vị trí',
                value: null,
              }}
            />
          </View>
        )}
      />

      {/* <Controller render={function ({ field, fieldState, formState, }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState; formState: UseFormStateReturn<FieldValues> }): React.ReactElement {
                throw new Error('Function not implemented.')
            } } name={''}            
            /> */}

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Bắt buộc nhập mật khẩu',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Mật khẩu"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            theme={{ roundness: 12 }}
          />
        )}
      />

      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Controller
        name="confirm_password"
        control={control}
        rules={{
          required: 'Bắt buộc nhập lại mật khẩu',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Mật khẩu xác nhận"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={styles.input}
            theme={{ roundness: 12 }}
          />
        )}
      />
      {errors.confirm_password && (
        <Text style={styles.errorText}>{errors.confirm_password.message}</Text>
      )}
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={handleSubmit(handleSignUp)}
        disabled={isCreateLoading} // Disable nút khi đang submit
      >
        <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
          {isCreateLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Thêm nhân viên</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#E6F3F8',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: '#7B5AFF',
    borderRadius: 16,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#4D66F4',
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoText: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#fff', // màu bên trong hình tròn
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
})
