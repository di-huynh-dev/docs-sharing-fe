import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup'
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import Toast from 'react-native-toast-message'
import tagServices from '../../apis/tagServices'
import { useQueryClient } from '@tanstack/react-query'

const UpdateTag = ({ route }) => {
  const { tagId } = route.params
  const navigation = useNavigation()
  const auth = useSelector(authSelector)
  const queryClient = useQueryClient()
  const handUpdateTag = async (values) => {
    try {
      const resp = await tagServices.updateTag(auth.accessToken, tagId, values.tagName)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        queryClient.invalidateQueries(['TagListAdmin'])
        navigation.navigate('TagScreen')
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }

  const validationSchema = yup.object().shape({
    tagName: yup.string().max(50, 'Tag name should not exceed 50 characters').required('Tag Name is Required'),
  })

  return (
    <SafeAreaView>
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('TagScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Cập nhật thẻ</Text>
      </View>
      <Formik validationSchema={validationSchema} initialValues={{ tagName: '' }} onSubmit={handUpdateTag}>
        {({ handleChange, handleSubmit, values, errors }) => (
          <View className="m-2">
            <Text>Nhập Tên thẻ</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-2">
              <TextInput
                className="flex-grow h-12 ml-4"
                keyboardType="email-address"
                value={values.tagName}
                placeholder="Tên thẻ"
                autoCapitalize="none"
                onChangeText={handleChange('tagName')}
              />
            </View>
            {errors.tagName && <Text className="text-red-500 text-sm">{errors.tagName}</Text>}

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

export default UpdateTag
