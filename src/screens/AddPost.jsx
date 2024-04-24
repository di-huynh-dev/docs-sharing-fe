import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, Button, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/userSlice'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import Toast from 'react-native-toast-message'

const AddPost = () => {
  const user = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const navigation = useNavigation()
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['Tags'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/tag/all?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const schema = yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
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
    if (selectedTags.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one tag',
      })
      return
    }
    const formData = {
      title: data.title,
      content: data.content,
      tagIds: selectedTags,
    }
    try {
      setIsLoading(true)
      const resp = await axiosPrivate.post('/post/create', formData)
      console.log(resp.status)
      if (resp.status === 200) {
        setIsLoading(false)

        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        setSelectedTags([])
        navigation.navigate('PostListScreen')
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

  if (isLoading || isLoadingTags) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <SafeAreaView>
      <View className="mx-2 flex-row items-center justify-between p-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PostListScreen')
            setSelectedTags([])
            reset()
          }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#3588f4] rounded-3xl p-4" onPress={handleSubmit(onSubmit)}>
          <Text className="text-white font-bold">Đăng bài</Text>
        </TouchableOpacity>
      </View>
      <View className="mx-4">
        <View className="flex-row gap-2 items-center">
          {user.profile.avatar ? (
            <Image className="w-12 h-16 rounded-lg" source={{ uri: user.profile.avatar }} />
          ) : (
            <Image source={require('../../assets/images/no-avatar.jpg')} className="w-14 h-14 rounded-full" />
          )}
          <Text className="text-lg font-bold">
            {user.profile.lastName} {user.profile.firstName}
          </Text>
        </View>

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Chọn Thẻ tài liệu</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <MultipleSelectList
              placeholder="Chọn thẻ bài đăng"
              setSelected={(val) => {
                setSelectedTags(val)
              }}
              data={tags.map((tag) => ({ value: tag.name, key: tag.tagId }))}
              value={value}
              multiple={true}
              save="key"
            />
          )}
          name="tagIds"
        />

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Tiêu đề</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-grow h-12 bg-[#eff8ff] "
              placeholder="Tiêu đề"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="title"
          className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
        />
        {errors.title && <Text className="text-red-400">This is required.</Text>}

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Nội dung bài đăng</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-grow h-20 bg-[#eff8ff] rounded-xl"
              placeholder="Nội dung bài đăng"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="content"
        />
        {errors.content && <Text className="text-red-400">This is required.</Text>}
      </View>
    </SafeAreaView>
  )
}

export default AddPost
