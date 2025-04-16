import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'
import { TextInput, Button, Checkbox } from 'react-native-paper'
import colors from '../../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { Controller, useForm } from 'react-hook-form'
import { LoginRequest } from '../../types/management'
import { useSignInMutation } from '../../api/magementApi'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import { useToast } from 'react-native-toast-notifications'

export default function SignInScreen({ navigation }: any) {
  const [rememberMe, setRememberMe] = React.useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation()

  const dispath = useDispatch()

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignIn = async (data: LoginRequest) => {
    console.log('Login Data', data)
    try {
      const response = await signIn(data).unwrap()
      if (response) {
        dispath(setUser(response))
        toast.show('Đăng nhập thành công', { type: 'success', duration: 4000 })
        navigation.navigate('Main')
      }
    } catch (err: any) {
      if (err?.data?.message) {
        toast.show(err.data.message, {
          type: 'danger',
          duration: 4000,
        })
      } else {
        toast.show('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!', {
          type: 'danger',
          duration: 4000,
        })
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Sign in to my account</Text>

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
            value={value}
            mode="outlined"
            onChangeText={onChange}
            style={styles.input}
            left={<TextInput.Icon icon="email-outline" />}
            theme={{ roundness: 12 }}
            error={!!errors.email}
            keyboardType="email-address"
          />
        )}
      />

      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
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
            error={!!errors.password}
          />
        )}
      />

      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <View style={styles.row}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.rememberMe}>Remember Me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={handleSubmit(handleSignIn)}
      >
        <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
          {isSignInLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <Button
        mode="outlined"
        icon="card-account-details"
        style={styles.otherSignInButton}
        textColor={colors.primary}
        onPress={() => {}}
      >
        Sign in With Employee ID
      </Button>

      <Button
        mode="outlined"
        icon="phone"
        style={styles.otherSignInButton}
        textColor={colors.primary}
        onPress={() => {}}
      >
        Sign in With Phone
      </Button>

      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text>
          Don't have an account? <Text style={styles.signup}>Sign Up Here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: '#F4F9FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMe: {
    fontSize: 14,
    color: '#333',
  },
  forgot: {
    fontSize: 14,
    color: '#4D66F4',
  },
  signInButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#999',
  },
  orText: {
    marginHorizontal: 8,
    color: '#999',
  },
  otherSignInButton: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  signupContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signup: {
    color: colors.primary,
    fontWeight: '600',
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
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
})
