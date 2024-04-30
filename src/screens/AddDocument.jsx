import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/userSlice'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import fieldServices from '../apis/fieldServices'
import categoryServices from '../apis/categoryServices'
import { SelectList } from 'react-native-dropdown-select-list'
import { Feather } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import Toast from 'react-native-toast-message'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const AddDocument = () => {
  const auth = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const [fields, setFields] = useState([])
  const [categories, setCategories] = useState([])
  const [docFile, setDocFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    fetchData()
  }, [])

  const uploadDocument = async () => {
    try {
      const resp = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      })
      setDocFile(resp)
    } catch (error) {}
  }

  const fetchData = async () => {
    const respFields = await fieldServices.getAllFields(auth.accessToken, 0, 10)
    setFields(respFields.data.content)
    const respCategories = await categoryServices.getAllCategories(auth.accessToken, 0, 10)
    setCategories(respCategories.data.content)
  }

  const schema = yup.object({
    docName: yup.string().required('Name is required'),
    docIntroduction: yup.string().required('Introduction is required'),
    categoryId: yup.number().required('Category is required'),
    fieldId: yup.number().required('Field is required'),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const doc = {
      docName: data.docName,
      docIntroduction: data.docIntroduction,
      categoryId: data.categoryId,
      fieldId: data.fieldId,
    }

    const formData = new FormData()
    formData.append('doc', JSON.stringify(doc))

    if (docFile.assets[0].uri) {
      const audioFile = {
        name: docFile.assets[0].name.split('.')[0],
        uri: docFile.assets[0].uri,
        type: docFile.assets[0].mimeType,
        size: docFile.assets[0].size,
      }
      formData.append('file', audioFile)
    }
    try {
      setIsLoading(true)
      const resp = await axiosPrivate.post('/document/create', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        setIsLoading(false)

        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        setDocFile(null)
        reset()
      }
    } catch (error) {
      setIsLoading(false)
      Toast.show({
        type: 'error',
        text1: error,
      })
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <SafeAreaView>
      <View className="mx-2 flex-row items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('PostListScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Thêm tài liệu mới</Text>
      </View>
      <View className="m-4">
        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Tên tài liệu</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-grow h-12 bg-[#eff8ff] "
              placeholder="Tên tài liệu"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="docName"
          className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
        />
        {errors.docName && <Text className="text-red-400">This is required.</Text>}

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Mô tả về tài liệu</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-grow h-20 bg-[#eff8ff] rounded-xl"
              placeholder="Mô tả về tài liệu"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="docIntroduction"
        />
        {errors.docIntroduction && <Text className="text-red-400">This is required.</Text>}

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Chọn Danh mục tài liệu</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectList
              placeholder="Chọn danh mục"
              setSelected={(val) => {
                onChange(val)
              }}
              data={categories.map((val) => ({ value: val.categoryName, key: val.categoryId }))}
              save="key"
              value={value}
            />
          )}
          name="categoryId"
        />
        {errors.categoryId && <Text className="text-red-400">This is required.</Text>}

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Chọn Lĩnh vực</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectList
              placeholder="Chọn lĩnh vực"
              setSelected={(val) => {
                onChange(val)
              }}
              data={fields.map((val) => ({ value: val.fieldName, key: val.fieldId }))}
              save="key"
              value={value}
            />
          )}
          name="fieldId"
        />
        {errors.fieldId && <Text className="text-red-400">This is required.</Text>}

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Tải lên tài liệu</Text>

        <TouchableOpacity onPress={uploadDocument} className="flex-row gap-3">
          <Feather name="upload" size={24} color="black" />
        </TouchableOpacity>

        {docFile && (
          <View>
            <Text className="text-red-400 font-bold mb-4 mt-2">{docFile.assets[0].name}</Text>
          </View>
        )}
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="mt-4 bg-[#3588f4] w-14 h-14 rounded-full flex-row items-center justify-center"
          >
            <Feather name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddDocument
