import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/userSlice'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'

const AddPost = () => {
  const user = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const navigation = useNavigation()
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [img, setImg] = useState('')

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

  const requestImageLibraryPermission = async (mode) => {
    try {
      if (mode === 'camera') {
        await ImagePicker.requestCameraPermissionsAsync()
        let result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspects: [1, 1],
          quality: 1,
        })
        if (!result.canceled) {
          await saveImage(result.assets[0].uri)
        }
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
        if (!result.canceled) {
          await saveImage(result.assets[0].uri)
        }
      }
    } catch (err) {
      console.warn('Error accessing image library:', err)
      // Handle error here
    }
  }
  const removeImage = () => {
    setImg('')
  }

  const saveImage = async (image) => {
    try {
      setImg(image)
    } catch (error) {}
  }

  const onSubmit = async (data) => {
    if (selectedTags.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one tag',
      })
      return
    }
    const formData = new FormData()
    const postRequestModel = {
      title: data.title,
      content: data.content,
      tagIds: selectedTags,
    }
    formData.append('postRequestModel', JSON.stringify(postRequestModel))
    if (img) {
      formData.append('images', {
        uri: img,
        type: 'image/png',
        name: 'image-doc',
      })
    }
    try {
      setIsLoading(true)
      const resp = await axiosPrivate.post('/post/create', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
      if (resp.data.status === 200) {
        setIsLoading(false)

        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        setSelectedTags([])
        navigation.goBack()
      }
      reset()
    } catch (error) {
      setIsLoading(false)
      Toast.show({
        type: 'error',
        text1: error,
      })
    }
  }

  const schema = yup.object({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  if (isLoading || isLoadingTags) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <View>
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
          {user.profile.image ? (
            <Image className="w-12 h-12 rounded-full" source={{ uri: user.profile.image }} />
          ) : (
            <Image source={require('../../assets/images/no-avatar.jpg')} className="w-14 h-14 rounded-full" />
          )}
          <Text className="text-lg font-bold">
            {user.profile.lastName} {user.profile.firstName}
          </Text>
        </View>

        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Chọn Thẻ bài đăng</Text>
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
        <Text className="text-[#3588f4] font-bold mb-4 mt-2">Tải lên hình ảnh</Text>

        <TouchableOpacity className="flex-row gap-4 items-center" onPress={() => setIsModalVisible(true)}>
          <AntDesign name="upload" size={24} color="black" />
        </TouchableOpacity>
        {img && (
          <View>
            <TouchableOpacity onPress={removeImage} className="absolute top-0 right-0">
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
            <Image className="w-80 h-80 rounded-lg" source={{ uri: img }} />
            <View className="flex-row justify-around">
              {/* <Button title={isLoading ? 'Đang xử lý' : 'Xong'} onPress={handleUploadAvatar} /> */}
            </View>
          </View>
        )}
        {isModalVisible && (
          <Modal animationType="fade" transparent={true}>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View className="bg-white p-2 rounded-lg w-80">
                <Text className="text-center font-bold">Chọn hình ảnh</Text>
                <View className="flex-row justify-around items-center">
                  <TouchableOpacity onPress={() => requestImageLibraryPermission('camera')}>
                    <AntDesign name="camera" size={24} color="black" />
                    <Text>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => requestImageLibraryPermission('gallery')}>
                    <AntDesign name="picture" size={24} color="black" />
                    <Text>Thư viện</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                    <Text>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        )}
      </View>
    </View>
  )
}

export default AddPost
