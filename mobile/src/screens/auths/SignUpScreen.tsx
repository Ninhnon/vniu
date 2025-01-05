import React, { useState } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native'
import { IMAGES } from '@assets/images'
import { appColors } from '@constants/appColors'
import { RootStackScreenProps } from 'src/navigators/RootNavigator'
import { ENV } from '@configs/env'
import { setStorage } from 'src/functions/storageFunctions'
import { useTheme } from '@react-navigation/native'

const SignUpScreen = ({ navigation }: RootStackScreenProps<'SignUpScreen'>) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const { colors } = useTheme()

  const validate = () => {
    Keyboard.dismiss()
    let isValid = true

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      Alert.alert('Invalid email', 'Please input a valid email')
      isValid = false
      return isValid
    }

    if (!password) {
      Alert.alert('Invalid password', 'Please input password')
      isValid = false
      return isValid
    } else if (password.length < 8) {
      Alert.alert('Invalid password', 'Min password length of 8')
      isValid = false
      return isValid
    }

    if (!confirmPassword) {
      Alert.alert('Invalid confirm password', 'Please input confirm password')
      isValid = false
      return isValid
    } else if (confirmPassword.length < 8) {
      Alert.alert('Invalid confirm password', 'Min confirm password length of 8')
      isValid = false
      return isValid
    } else if (confirmPassword !== password) {
      Alert.alert('Passwords do not match', 'Password and confirm password must match')
      isValid = false
      return isValid
    }

    if (!phoneNumber) {
      Alert.alert('Invalid phone number', 'Please input phone number')
      isValid = false
      return isValid
    } else if (phoneNumber.length !== 10) {
      Alert.alert('Invalid phone number', 'Phone number must be 10 digits')
      isValid = false
      return isValid
    }

    return isValid
  }

  const handleSubmitForm = async () => {
    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${ENV.API_URL}/api/v1/auths/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: fullName,
          email: email,
          password: password,
          lastName: fullName,
          firstName:''
        })
      })

      const data = await response.json()
      console.log('🚀 ~ handleSubmitForm ~ data:', data)

      if (data.isSuccess ) {
        Alert.alert('Register Success', 'Please input Login Form to Login')
        navigation.navigate('SignInScreen')
      } else {
        Alert.alert('Register failed')
      }
    } catch (error) {
      console.log('Register failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={IMAGES.IMG_ICON_PREVIOUS} />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Enter your data to continue!</Text>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder='Severus Snape'
        placeholderTextColor={colors.text}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder='snape@example.com'
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder='Password'
        placeholderTextColor={colors.text}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder='Confirm Password'
        placeholderTextColor={colors.text}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder='0123456789'
        placeholderTextColor={colors.text}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType='phone-pad'
      />

      {loading ? (
        <ActivityIndicator size='large' color={appColors.Primary} style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.signUpButton} onPress={handleSubmitForm}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20
  },
  backButton: {
    top: 30,
    width: 30,
    height: 30,
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 4
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A94FF',
    textAlign: 'center',
    marginVertical: 10
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#1A94FF',
    marginBottom: 30
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.Primary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16
  },
  signUpButton: {
    backgroundColor: '#1A94FF',
    paddingVertical: 12,
    borderRadius: 8
  },
  signUpButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loading: {
    marginVertical: 16
  }
})

export default SignUpScreen
