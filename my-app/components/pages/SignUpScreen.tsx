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
import { Controller, DefaultValues, set, useForm } from 'react-hook-form'
import { UserRequest } from '../../types/management'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import { handleApiError } from '../../utils/errorHandler'

export default function SignUpScreen({ navigation }: any) {
  const [agree, setAgree] = useState(false)
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
    },
  })

  const toast = useToast()

  const [createUser, { isLoading: isCreateLoading, isError: isCreateError }] =
    useCreateUserMutation()

  const handleSignUp = async (data: UserRequest) => {
    if (data.password !== data.confirm_password) {
      toast.show('Mật khẩu không khớp', { type: 'danger', duration: 4000 })
      return
    }

    try {
      console.log('data:', data) // Log ra response để kiểm tra
      const response = await createUser(data).unwrap()
      if (response) {
        dispatch(setUser(response))
        toast.show('Đăng ký thành công', { type: 'success', duration: 4000 })
        navigation.navigate('Main')
      }
    } catch (err: any) {
      handleApiError(toast)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <View style={styles.logoText} />
        </View>
        <Text style={styles.title}>Work Mate</Text>
        <Text style={styles.subtitle}>Register Using Your Credentials</Text>
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

      <View style={styles.checkboxRow}>
        <Checkbox
          status={agree ? 'checked' : 'unchecked'}
          onPress={() => setAgree(!agree)}
        />
        <Text style={styles.checkboxText}>
          I agree with <Text style={styles.link}>terms & conditions</Text> and{' '}
          <Text style={styles.link}>privacy policy</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={handleSubmit(handleSignUp)}
        disabled={isCreateLoading} // Disable nút khi đang submit
      >
        <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
          {isCreateLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInRow}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text>
          Already have an account? <Text style={styles.link}>Sign in here</Text>
        </Text>
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
