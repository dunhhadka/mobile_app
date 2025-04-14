import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from '../../constants/colors'

const { width } = Dimensions.get('window')

export default function OnboardScreen() {
  const navigation = useNavigation<any>()

  return (
    <View style={styles.container}>
      {/* Background gradient color (nếu muốn gradient nhẹ) */}
      <View style={styles.backgroundGradient} />

      {/* Hai ảnh chồng lên nhau */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/card1.png')} // ảnh sau
          style={styles.card1}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/card2.png')} // ảnh trước
          style={styles.card2}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <Text style={styles.title}>
        Navigate Your Work Journey Efficient & Easy
      </Text>
      <Text style={styles.subtitle}>
        Increase your work management & career development radically
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.signInBtn}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpBtn}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
    backgroundColor: '#D3C9FF',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D3C9FF',
  },
  imageWrapper: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    // height: 400,
  },
  card1: {
    position: 'absolute',
    top: 0,
    height: 400,
    zIndex: 1,
  },
  card2: {
    position: 'absolute',
    top: 80,
    height: 500,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 450,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 10,
    marginBottom: 30,
  },
  signInBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginBottom: 10,
    width: '80%',
    display: 'flex',
    alignItems: 'center',
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signUpBtn: {
    borderColor: '#6C47FF',
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    width: '80%',
    display: 'flex',
    alignItems: 'center',
  },
  signUpText: {
    color: '#6C47FF',
    fontWeight: '600',
    fontSize: 16,
  },
})
