import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Checkbox from 'expo-checkbox'
import * as yup from 'yup'
import { Formik } from 'formik'
import categoryServices from '../../apis/categoryServices'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import Toast from 'react-native-toast-message'
import { useQueryClient } from '@tanstack/react-query'

const UpdateCategory = ({ route }) => {
  const { categoryId } = route.params
  const navigation = useNavigation()
  const [isChecked, setChecked] = useState(false)
  const auth = useSelector(authSelector)
  const queryClient = useQueryClient()

  const handUpdateCategory = async (values) => {
    try {
      const resp = await categoryServices.updateCategory(auth.accessToken, categoryId, values.categoryName, isChecked)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        queryClient.invalidateQueries(['CategoryListAdmin'])
        navigation.navigate('CategoryScreen')
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }

  const validationSchema = yup.object().shape({
    categoryName: yup
      .string()
      .max(50, 'Category name should not exceed 50 characters')
      .required('Category Name is Required'),
  })

  return (
    <SafeAreaView>
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('CategoryScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Cập nhật danh mục</Text>
      </View>
      <Formik validationSchema={validationSchema} initialValues={{ categoryName: '' }} onSubmit={handUpdateCategory}>
        {({ handleChange, handleSubmit, values, errors }) => (
          <View className="m-2">
            <Text>Nhập Tên danh mục</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-2">
              <TextInput
                className="flex-grow h-12 ml-4"
                keyboardType="email-address"
                value={values.categoryName}
                placeholder="Tên danh mục"
                autoCapitalize="none"
                onChangeText={handleChange('categoryName')}
              />
            </View>
            {errors.categoryName && <Text className="text-red-500 text-sm">{errors.categoryName}</Text>}
            <View className="flex-row items-center gap-4 my-2">
              <Text>Trạng thái hoạt động</Text>
              <Checkbox value={isChecked} onValueChange={setChecked} />
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

export default UpdateCategory
