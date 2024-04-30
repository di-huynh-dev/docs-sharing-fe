import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup'
import { Formik } from 'formik'
import Toast from 'react-native-toast-message'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../../redux/reducers/userSlice'

const UpdatePassword = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch()
  const handleUpdatePassword = async (values) => {
    try {
      setIsLoading(true)
      const formData = {
        oldPassword: values.oldPassword,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      }
      const resp = await axiosPrivate.put('/users/password', formData)

      if (resp.data.status === 200) {
        setIsLoading(false)
        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        dispatch(removeAuth())
      } else {
        setIsLoading(false)
        Toast.show({
          type: 'error',
          text1: resp.data.message,
        })
      }
    } catch (error) {
      setIsLoading(false)
      Toast.show({
        type: 'error',
        text1: error.response.data.message,
      })
    }
  }

  const updateValidationSchema = yup.object().shape({
    oldPassword: yup.string().required('Old Password is Required'),
    password: yup
      .string()
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character',
      )
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'), // add this line to validate confirmPassword
  })

  if (isLoading) {
    return <ActivityIndicator />
  }
  return (
    <SafeAreaView className="mx-2">
      <View className="mx-2 flex-row items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('ProfileScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Cập nhật mật khẩu mới</Text>
      </View>
      <View>
        <Formik
          validationSchema={updateValidationSchema}
          initialValues={{ oldPassword: '', password: '', confirmPassword: '' }}
          onSubmit={handleUpdatePassword}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.oldPassword}
                    placeholder="Mật khẩu cũ"
                    onChangeText={handleChange('oldPassword')}
                    secureTextEntry={!showOldPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showOldPassword)}>
                    <Ionicons name={showOldPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.password}
                    placeholder="Mật khẩu mới"
                    onChangeText={handleChange('password')}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text className="text-red-500 text-sm">{errors.password}</Text>}
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-8">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" />
                  <TextInput
                    className="flex-grow h-12 ml-4"
                    value={values.confirmPassword}
                    placeholder="Mật khẩu xác nhận"
                    onChangeText={handleChange('confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setConfirmShowPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                  </TouchableOpacity>
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
    </SafeAreaView>
  )
}

export default UpdatePassword
