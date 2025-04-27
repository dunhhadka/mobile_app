import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import colors from '../../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { Controller, useForm } from 'react-hook-form'
import { useToast } from 'react-native-toast-notifications'
import { ArrowLeft } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useForgotPasswordMutation, useVerifyOtpMutation } from '../../api/magementApi'

interface ForgotPasswordForm {
  email: string;
}

interface VerifyOtpForm {
  email: string;
  otp: string;
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailValue, setEmailValue] = useState('');
  const toast = useToast();

  // API hooks
  const [forgotPassword, { isLoading: isEmailLoading }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyOtpMutation();

  // Form for email step
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  // Form for OTP step
  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<VerifyOtpForm>({
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // Handle email submission
  const handleRequestReset = async (data: ForgotPasswordForm) => {
    try {
      setEmailValue(data.email);
      await forgotPassword({ email: data.email }).unwrap();
      
      toast.show('Mã OTP đã được gửi đến email của bạn', { 
        type: 'success', 
        duration: 4000 
      });
      
      setStep('otp');
    } catch (err: any) {
      toast.show(err?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại!', {
        type: 'danger',
        duration: 4000,
      });
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (data: VerifyOtpForm) => {
    try {
      const result = await verifyOtp({
        email: emailValue,
        otp: data.otp
      }).unwrap();
      
      if (result.is_valid) {
        toast.show('Xác thực thành công! Mật khẩu mới đã được gửi đến email của bạn', { 
          type: 'success', 
          duration: 4000 
        });
        
        Alert.alert(
          'Xác thực thành công',
          'Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('SignIn' as never) 
            }
          ]
        );
      } else {
        toast.show('Mã OTP không đúng. Vui lòng thử lại!', {
          type: 'danger',
          duration: 4000,
        });
      }
    } catch (err: any) {
      toast.show(err?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn', {
        type: 'danger',
        duration: 4000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quên mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {step === 'email' ? (
          <>
            <Text style={styles.title}>Đặt lại mật khẩu</Text>
            <Text style={styles.subtitle}>
              Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để xác thực.
            </Text>

            <Controller
              name="email"
              control={emailControl}
              rules={{
                required: 'Bạn phải nhập email',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email không hợp lệ',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  mode="outlined"
                  onChangeText={onChange}
                  style={styles.input}
                  left={<TextInput.Icon icon="email-outline" />}
                  theme={{ roundness: 12 }}
                  error={!!emailErrors.email}
                  keyboardType="email-address"
                />
              )}
            />

            {emailErrors.email && (
              <Text style={styles.errorText}>{emailErrors.email.message}</Text>
            )}

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleEmailSubmit(handleRequestReset)}
              disabled={isEmailLoading}
            >
              <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
                {isEmailLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Gửi mã OTP</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Xác thực OTP</Text>
            <Text style={styles.subtitle}>
              Nhập mã OTP đã được gửi đến email của bạn để xác thực và nhận mật khẩu mới.
            </Text>

            <Text style={styles.emailText}>Email: {emailValue}</Text>

            <Controller
              name="otp"
              control={otpControl}
              rules={{
                required: 'Bạn phải nhập mã OTP',
                minLength: {
                  value: 6,
                  message: 'Mã OTP phải có ít nhất 6 ký tự',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Mã OTP"
                  value={value}
                  mode="outlined"
                  onChangeText={onChange}
                  style={styles.input}
                  left={<TextInput.Icon icon="key-outline" />}
                  theme={{ roundness: 12 }}
                  error={!!otpErrors.otp}
                  keyboardType="numeric"
                />
              )}
            />

            {otpErrors.otp && (
              <Text style={styles.errorText}>{otpErrors.otp.message}</Text>
            )}

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleOtpSubmit(handleVerifyOtp)}
              disabled={isOtpLoading}
            >
              <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
                {isOtpLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Xác thực</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendLink}
              onPress={() => handleRequestReset({ email: emailValue })}
              disabled={isEmailLoading}
            >
              <Text style={styles.resendText}>
                {isEmailLoading ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 16,
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
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  resendLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});