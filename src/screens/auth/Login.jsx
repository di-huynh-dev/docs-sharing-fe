import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import userServices from '../../apis/userServices'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { useDispatch } from 'react-redux'
import { addProfile, loginSuccess } from '../../redux/reducers/userSlice'
import * as yup from 'yup'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (values) => {
    setIsLoading(true)
    try {
      const resp = await userServices.login(values.email, values.password)
      if (resp.status === 200) {
        dispatch(loginSuccess(resp.data))
        dispatch(addProfile(resp.data.user))
        await AsyncStorage.setItem('auth', JSON.stringify(resp.data))

        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        setIsLoading(false)
      } else if (resp.status === 400) {
        const respOTP = await userServices.sendOTP(values.email, 'register')
        await AsyncStorage.setItem('emailRegistered', values.email)
        Toast.show({
          type: 'error',
          text1: resp.message,
          text2: respOTP.message,
        })
        navigation.navigate('OTP')
        setIsLoading(false)
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      Toast.show({
        type: 'error',
        text1: error,
      })
    }
  }

  //Form checking
  const loginValidationSchema = yup.object().shape({
    email: yup.string().email('Please enter valid email').required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  })

  return (
    <SafeAreaView className="mx-5 bg-white">
      <View className="mt-20">
        <Image source={require('../../../assets/logo.png')} className="m-auto" />
      </View>
      <Text className="text-xl font-bold leading-snug">Đăng nhập</Text>

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <View>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                <Ionicons name="mail-outline" size={24} color="gray" />
                <TextInput
                  className="flex-grow h-12 ml-4"
                  keyboardType="email-address"
                  value={values.email}
                  placeholder="abc@email.com"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                />
              </View>
              {errors.email && <Text className="text-red-500 text-sm">{errors.email}</Text>}

              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                <Ionicons name="lock-closed-outline" size={24} color="gray" />
                <TextInput
                  className="flex-grow h-12 ml-4"
                  value={values.password}
                  placeholder="Your password"
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
                />
                <Ionicons name="eye-off" size={24} color="gray" />
              </View>
              {errors.password && <Text className="text-red-500 text-sm">{errors.password}</Text>}
              <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                <Text className="mt-5 text-right font-medium text-sm">Quên mật khẩu?</Text>
              </TouchableOpacity>

              <StatusBar />
            </View>
            <View className="w-2/3 m-auto mt-8">
              <TouchableOpacity className="bg-[#5669ff] rounded-xl h-14 justify-center" onPress={handleSubmit}>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-center uppercase text-white font-bold items-center">Đăng nhập</Text>
                  <AntDesign name="arrowright" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>

      <View className="flex-row mt-10 justify-center">
        <Text className="font-normal text-sm">Bạn không có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text className="font-bold text-sm text-[#5669ff] italic">Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <Spinner visible={isLoading} />
    </SafeAreaView>
  )
}

export default Login
