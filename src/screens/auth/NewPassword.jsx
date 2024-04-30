import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import Toast, { ErrorToast } from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import userServices from '../../apis/userServices'
const NewPassword = () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const inputNo1Ref = useRef()
  const inputNo2Ref = useRef()
  const inputNo3Ref = useRef()
  const inputNo4Ref = useRef()
  const inputNo5Ref = useRef()
  const inputNo6Ref = useRef()

  const [no1, setNo1] = useState('')
  const [no2, setNo2] = useState('')
  const [no3, setNo3] = useState('')
  const [no4, setNo4] = useState('')
  const [no5, setNo5] = useState('')
  const [no6, setNo6] = useState('')

  useEffect(() => {
    if (no6.length === 1) {
      handleConfirmOTP()
    }
  }, [no6])

  const initialSeconds = 15 * 60 - 5 // 15 phút
  const [countdown, setCountdown] = useState(initialSeconds)

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (no6.length === 1) {
      handleConfirmOTP()
    }
  }, [no6])

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Confirm password is not matched!',
      })
    } else {
      setLoading(true)
      try {
        const email = await AsyncStorage.getItem('emailForget')
        const resp = await userServices.resetPassword(email, newPassword, confirmPassword)
        if (resp.status === 200) {
          setLoading(false)
          Toast.show({
            type: 'success',
            text1: resp.message,
          })
          navigation.navigate('Login')
        } else {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: resp.message,
          })
        }
      } catch (error) {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: error.message,
        })
      }
    }
  }

  const handleConfirmOTP = async () => {
    const code = no1.toString() + no2.toString() + no3.toString() + no4.toString() + no5.toString() + no6.toString()
    setLoading(true)
    try {
      const email = await AsyncStorage.getItem('emailForget')
      const resp = await userServices.verifyOTP(email, code)

      if (resp.status === 200) {
        setLoading(false)
        setIsConfirmed(true)
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
      } else {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: error.message,
      })
    }
  }
  return (
    <View className="mx-5 mt-5">
      <StatusBar />

      <TouchableOpacity className="mt-5 mb-5" onPress={() => navigation.navigate('ForgetPassword')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {!isConfirmed && (
        <View>
          <View>
            <Text className="text-xl font-bold leading-snug mt-10">Xác thực bằng mã OTP</Text>

            <Text className="font-normal text-sm mt-5">
              Chúng tôi đã gửi mã xác thực qua email của bạn, vui lòng kiểm tra email và nhập đúng mã OTP{' '}
            </Text>

            <View className="flex flex-row justify-around mt-10 space-x-2">
              <TextInput
                ref={inputNo1Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no1}
                onChangeText={(v) => {
                  setNo1(v)
                  if (v.length === 1) {
                    inputNo2Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
              <TextInput
                ref={inputNo2Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no2}
                onChangeText={(v) => {
                  setNo2(v)
                  if (v.length === 1) {
                    inputNo3Ref.current.focus()
                  }
                  if (v.length === 0) {
                    inputNo1Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
              <TextInput
                ref={inputNo3Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no3}
                onChangeText={(v) => {
                  setNo3(v)
                  if (v.length === 1) {
                    inputNo4Ref.current.focus()
                  }
                  if (v.length === 0) {
                    inputNo2Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
              <TextInput
                ref={inputNo4Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no4}
                onChangeText={(v) => {
                  setNo4(v)
                  if (v.length === 1) {
                    inputNo5Ref.current.focus()
                  }
                  if (v.length === 0) {
                    inputNo3Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
              <TextInput
                ref={inputNo5Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no5}
                onChangeText={(v) => {
                  setNo5(v)
                  if (v.length === 1) {
                    inputNo6Ref.current.focus()
                  }
                  if (v.length === 0) {
                    inputNo4Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
              <TextInput
                ref={inputNo6Ref}
                keyboardType="numeric"
                className="flex-1 h-14 border border-gray-200 rounded-xl text-center font-bold text-xl text-black"
                value={no6}
                onChangeText={(v) => {
                  setNo6(v)
                  if (v.length === 1 && no6.length === 1) {
                    handleConfirmOTP()
                  }
                  if (v.length === 0) {
                    inputNo5Ref.current.focus()
                  }
                }}
                placeholder="_"
                maxLength={1}
              />
            </View>
          </View>
          <View className="w-2/3 m-auto mt-8">
            <TouchableOpacity className="bg-[#5669ff] rounded-xl h-14 justify-center" onPress={handleConfirmOTP}>
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-center uppercase text-white font-bold items-center">Xác nhận</Text>
                <AntDesign name="arrowright" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Update password */}
      {isConfirmed && (
        <View>
          <View>
            <Text className="text-xl font-bold leading-snug">Cập nhật mật khẩu mới</Text>

            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-10">
              <Ionicons name="lock-closed-outline" size={24} color="gray" />
              <TextInput
                className="flex-grow h-12 ml-4"
                value={newPassword}
                placeholder="Your password"
                onChangeText={(v) => setNewPassword(v)}
                secureTextEntry={true}
              />
              <Ionicons name="eye-off" size={24} color="gray" />
            </View>

            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-10">
              <Ionicons name="lock-closed-outline" size={24} color="gray" />
              <TextInput
                className="flex-grow h-12 ml-4"
                value={confirmPassword}
                placeholder="Confirm password"
                onChangeText={(v) => setConfirmPassword(v)}
                secureTextEntry={true}
              />
              <Ionicons name="eye-off" size={24} color="gray" />
            </View>
          </View>

          <View className="w-2/3 m-auto mt-16 shadow-gray-600 shadow-lg">
            <TouchableOpacity
              className="bg-[#5669ff] rounded-xl h-14 justify-center shadow-2xl shadow-[#5669ff]"
              onPress={handleResetPassword}
            >
              <Text className="text-center uppercase text-white font-bold items-center shadow-current shadow-lg">
                Cập nhật
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Spinner visible={loading} />
    </View>
  )
}

export default NewPassword
