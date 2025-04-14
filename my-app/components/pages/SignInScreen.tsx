import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { TextInput, Button, Checkbox } from 'react-native-paper'
import colors from '../../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [passwordVisible, setPasswordVisible] = React.useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Sign in to my account</Text>

      <TextInput
        label="Email"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        style={styles.input}
        left={<TextInput.Icon icon="email-outline" />}
        theme={{ roundness: 12 }}
      />

      <TextInput
        label="Password"
        value={password}
        mode="outlined"
        secureTextEntry={!passwordVisible}
        onChangeText={setPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        theme={{ roundness: 12 }}
      />

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

      <TouchableOpacity style={styles.buttonWrapper}>
        <LinearGradient colors={['#7B5AFF', '#4D66F4']} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
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
})
