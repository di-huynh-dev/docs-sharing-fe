import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { authSelector } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import fieldServices from '../../apis/fieldServices'
import { useQueryClient } from '@tanstack/react-query'

const AddField = () => {
  const navigation = useNavigation()
  const auth = useSelector(authSelector)
  const queryClient = useQueryClient()

  const handAddField = async (values) => {
    try {
      const resp = await fieldServices.addField(auth.accessToken, values.fieldName, true)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        queryClient.invalidateQueries(['FieldListAdmin'])
        navigation.navigate('FieldScreen')
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }

  const validationSchema = yup.object().shape({
    fieldName: yup.string().max(50, 'Field name should not exceed 50 characters').required('Field Name is Required'),
  })

  return (
    <SafeAreaView>
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('CategoryScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Thêm lĩnh vực</Text>
      </View>
      <Formik validationSchema={validationSchema} initialValues={{ fieldName: '' }} onSubmit={handAddField}>
        {({ handleChange, handleSubmit, values, errors }) => (
          <View className="m-2">
            <Text>Nhập tên lĩnh vực</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-4 mt-2">
              <TextInput
                className="flex-grow h-12 ml-4"
                keyboardType="email-address"
                value={values.fieldName}
                placeholder="Tên lĩnh vực"
                autoCapitalize="none"
                onChangeText={handleChange('fieldName')}
              />
            </View>
            {errors.fieldName && <Text className="text-red-500 text-sm">{errors.fieldName}</Text>}
            <View className="w-2/3 m-auto mt-8">
              <TouchableOpacity className="bg-[#5669ff] rounded-xl h-14 justify-center" onPress={handleSubmit}>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-center uppercase text-white font-bold items-center">Thêm</Text>
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

export default AddField
