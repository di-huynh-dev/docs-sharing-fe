import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import commentServices from '../../apis/commentService'
import { authSelector } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { useQueryClient } from '@tanstack/react-query'

const CreatePost = ({ route }) => {
  const { postId } = route.params

  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const [content, setContent] = useState('')

  const handleCreateComment = async () => {
    try {
      const resp = await commentServices.createComment(auth.accessToken, postId, content)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        setContent('')
        // navigation.navigate('PostDetailScreen', { postId, shouldRefresh: true })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      })
    }
  }

  return (
    <SafeAreaView>
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('PostDetailScreen', { postId })}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Thêm bình luận</Text>
      </View>
      <View className="m-2">
        <Text>Nhập bình luận</Text>
        <TextInput
          className="flex-grow w-full border border-gray-200 rounded-xl h-20 p-4 mt-2"
          placeholder="Bình luận của bạn"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
      </View>
      <TouchableOpacity className="mt-2 w-2/3 m-auto" onPress={handleCreateComment}>
        <View className="bg-[#5669ff] rounded-xl h-14 justify-center items-center">
          <Text className="text-white">Đăng</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CreatePost
