import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { formatDate } from '../utils/helpers'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Toast from 'react-native-toast-message'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const PostVerticalItem = ({ postId, title, content, createdAt, totalComments, user, postImages }) => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const { data: postDetail, isLoading } = useQuery({
    queryKey: ['PostDetail', postId],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/' + postId)
        return resp.data.data
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  const likePostMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosPrivate.post('/post/' + postId + '/like')
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries(['PostDetail', postId])
      Toast.show({
        type: 'success',
        text1: resp.data.message,
      })
    },
  })
  if (isLoading) return null
  return (
    <View className="bg-white p-4 rounded-lg">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.navigate('OtherUserProfileScreen', { user: user })}
          className="flex-row items-center space-x-3"
        >
          {user.image ? (
            <Image source={{ uri: user.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
          ) : (
            <Image source={require('../../assets/images/no-avatar.jpg')} className="w-14 h-14 rounded-full" />
          )}
          <View className="flex justify-center">
            <Text className="text-base font-bold">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-sm text-gray-500">{formatDate(createdAt)}</Text>
          </View>
        </TouchableOpacity>

        <View className="flex items-center justify-center">
          <TouchableOpacity
            onPress={toggleModal}
            className="bg-[#F1F4F5] w-[40px] h-[40px] rounded-full flex items-center justify-center"
          >
            <Entypo name="dots-three-horizontal" size={24} color="#99A1BE" />
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(false)
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onPress={toggleModal}
            >
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '40%' }}>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => navigation.navigate('PostDetailScreen', { postId: postId })}>
                    <Entypo name="dots-three-horizontal" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14, marginBottom: 20 }}>Xem chi tiết</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateReportPostScreen', { postId: postId })}
                  className="flex-row gap-2"
                >
                  <MaterialIcons name="report" size={24} color="black" />

                  <Text style={{ fontSize: 14 }}>Báo cáo</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
      <TouchableOpacity
        className="mt-2 mx-4"
        onPress={() => navigation.navigate('PostDetailScreen', { postId: postId })}
      >
        <Text className="text-base font-bold mb-2">{title}</Text>

        <Text className="text-sm text-gray-500">{content}</Text>
        {postImages && postImages.length > 0 && (
          <Image source={{ uri: postImages[0].url }} className="w-full h-80 rounded-lg mt-5" />
        )}
      </TouchableOpacity>
      <View className="flex-row justify-between mt-5 mb-2 mx-2">
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => likePostMutation.mutate()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {postDetail.liked ? (
                <AntDesign name="heart" size={24} color="#f75050" style={{ marginRight: 5 }} />
              ) : (
                <AntDesign name="hearto" size={24} color="#f75050" style={{ marginRight: 5 }} />
              )}
              <Text>{postDetail.totalLikes}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center space-x-2">
            <Entypo name="chat" size={24} color="#bbb" />
            <Text> Bình luận({totalComments})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default PostVerticalItem
