import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup'
import { Formik } from 'formik'
import { Fontisto } from '@expo/vector-icons'
import Spinner from 'react-native-loading-spinner-overlay'
import userServices from '../../apis/userServices'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Signup = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (values) => {
    setIsLoading(true)
    try {
      const resp = await userServices.signup(
        values.email,
        values.password,
        values.confirmPassword,
        values.firstName,
        values.lastName,
      )
      if (resp.status === 200) {
        const respOTP = await userServices.sendOTP(values.email, 'register')
        await AsyncStorage.setItem('emailRegistered', values.email)

        setIsLoading(false)
        Toast.show({
          type: 'success',
          text1: resp.message,
          text2: respOTP.message,
        })
        navigation.navigate('OTP')
      } else {
        setIsLoading(false)
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }

  const signupValidationSchema = yup.object().shape({
    email: yup.string().email('Please enter valid email').required('Email Address is Required'),
    password: yup
      .string()
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character',
      )
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'), // add this line to validate confirmPassword
    firstName: yup.string().required('First Name is Required'),
    lastName: yup.string().required('Last Name is Required'),
    lastName: yup.string().required('Last Name is Required'),
  })
  return (
    <SafeAreaView className="mx-5 mt-5">
      <StatusBar />
      <TouchableOpacity className="mt-5 mb-5" onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View>
        <Text className="text-xl font-bold leading-snug">Đăng ký tài khoản</Text>

        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ email: '', password: '', confirmPassword: '', lastName: '', firstName: '' }}
          onSubmit={handleSignup}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <AntDesign name="user" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.firstName}
                    placeholder="Họ. Ví dụ: Nguyễn"
                    autoCapitalize="none"
                    onChangeText={handleChange('firstName')}
                  />
                </View>
                {errors.firstName && <Text className="text-red-500 text-sm">{errors.firstName}</Text>}

                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <AntDesign name="user" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.lastName}
                    placeholder="Tên. Ví dụ: Văn Hùng"
                    autoCapitalize="none"
                    onChangeText={handleChange('lastName')}
                  />
                </View>
                {errors.lastName && <Text className="text-red-500 text-sm">{errors.lastName}</Text>}

                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <Fontisto name="email" size={24} color="black" />
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
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.confirmPassword}
                    placeholder="Your confirmPassword"
                    onChangeText={handleChange('confirmPassword')}
                    secureTextEntry={true}
                  />
                  <Ionicons name="eye-off" size={24} color="gray" />
                </View>
                {errors.confirmPassword && <Text className="text-red-500 text-sm">{errors.confirmPassword}</Text>}
                <View className="w-2/3 m-auto mt-8">
                  <TouchableOpacity className="bg-[#5669ff] rounded-xl h-14 justify-center" onPress={handleSubmit}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-center uppercase text-white font-bold items-center">Đăng ký</Text>
                      <AntDesign name="arrowright" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
      <View className="flex flex-row mt-10 justify-center">
        <Text className="font-normal text-sm">Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="font-bold text-sm text-[#5669ff] italic">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <Spinner visible={isLoading} />
    </SafeAreaView>
  )
}

export default Signup
