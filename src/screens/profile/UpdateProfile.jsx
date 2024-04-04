import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { addProfile, authSelector } from '../../redux/reducers/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import * as yup from 'yup'
import { Formik } from 'formik'
import { Fontisto } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import RNPickerSelect from 'react-native-picker-select'
import { SelectList } from 'react-native-dropdown-select-list'
import userServices from '../../apis/userServices'
import Toast from 'react-native-toast-message'

const UpdateProfile = () => {
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [gender, setGender] = useState(0) // default male, you can set your desired default value
  const dispatch = useDispatch()

  const genders = [
    { key: 'Nam', value: 1 },
    { key: 'Nữ', value: 0 },
  ]

  const validationSchema = yup.object().shape({
    firstName: yup.string().max(50, 'Tag name should not exceed 50 characters').required('Tag Name is Required'),
    lastName: yup.string().max(50, 'Tag name should not exceed 50 characters').required('Tag Name is Required'),
    email: yup.string().email('Please enter valid email').required('Email Address is Required'),
  })

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth
    setShowDatePicker(Platform.OS === 'ios')
    setDateOfBirth(currentDate)
  }

  const handleUpdateProfile = async (values) => {
    try {
      const formData = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        email: values.email,
      }
      const resp = await userServices.updateProfile(auth.accessToken, formData)
      if (resp.status === 200) {
        dispatch(addProfile(resp.data))

        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        navigation.navigate('ProfileScreen')
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }

  return (
    <SafeAreaView>
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('ProfileScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Cập nhật hồ sơ</Text>
      </View>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ firstName: '', lastName: '', email: '' }}
        onSubmit={handleUpdateProfile}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <View className="m-2">
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
                value={values.email}
                placeholder="abc@email.com"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
              />
            </View>
            {errors.email && <Text className="text-red-500 text-sm">{errors.email}</Text>}

            <View className="flex-row items-center border border-gray-200 rounded-xl my-4 mx-2">
              <AntDesign name="calendar" size={24} color="gray" />
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text className="ml-4">{dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
            <View className="my-4 mx-2">
              <SelectList
                placeholder="Chọn giới tính"
                setSelected={(val) => setGender(val)}
                data={genders.map((val) => ({ value: val.key, key: val.value }))}
                save="key"
              />
            </View>
            <View className="w-2/3 m-auto mt-8">
              <TouchableOpacity className="bg-[#5669ff] rounded-xl h-14 justify-center" onPress={handleSubmit}>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-center uppercase text-white font-bold items-center">Cập nhật</Text>
                  <AntDesign name="arrowright" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  )
}

export default UpdateProfile
