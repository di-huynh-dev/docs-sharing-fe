import { View, Text, Image, ScrollView, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { authSelector } from '../../redux/reducers/userSlice'
import { FontAwesome } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { formatDate } from '../../utils/helpers'
import { Fontisto } from '@expo/vector-icons'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Entypo } from '@expo/vector-icons'
import AddDocumentModal from '../../components/AddDocumentModal'

const Profile = () => {
  const navigation = useNavigation()
  const user = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const [isProfileActive, setIsProfileActive] = useState(true)
  const [showAddPostModal, setShowAddPostModal] = useState(false)
  const client = useQueryClient()

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['PostsMine'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/mine?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['Profile'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/users/profile')
      return resp.data.data
    },
  })

  if (profileLoading || postsLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  return (
    <SafeAreaView>
      {showAddPostModal && (
        <AddDocumentModal
          onClose={() => {
            setShowAddPostModal(false)
            client.invalidateQueries(['Profile'])
          }}
        />
      )}

      <ScrollView className="my-2">
        <View className="mx-2 flex-row items-center p-2">
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold leading-snug text-center">Trang cá nhân</Text>
          </View>
        </View>

        <View className="flex items-center justify-center rounded-full">
          {profile.image ? (
            <Image source={{ uri: profile.image }} className="my-2 w-36 h-36 rounded-full " />
          ) : (
            <Image className="w-36 h-36 rounded-full " source={require('../../../assets/images/no-avatar.jpg')} />
          )}
          <TouchableOpacity
            className="absolute bottom-10 right-10 rounded-full bg-blue-200 p-2"
            onPress={() => setShowAddPostModal(true)}
          >
            <Entypo name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-xl font-bold text-center mb-4">
            {user.profile.lastName} {user.profile.firstName}
          </Text>

          <View className="flex-row gap-2 items-center justify-center">
            <TouchableOpacity
              className="border border-[#5669ff] rounded-3xl h-12 justify-center p-2"
              onPress={() => navigation.navigate('UpdateProfileScreen')}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-center text-[#5669ff] font-bold items-center">Chỉnh sửa hồ sơ</Text>
                <AntDesign name="edit" size={24} color="#5669ff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#5669ff] rounded-3xl h-12 justify-center p-2"
              onPress={() => navigation.navigate('UpdatePasswordScreen')}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-center text-[#5669ff] font-bold items-center">Đổi mật khẩu</Text>
                <AntDesign name="edit" size={24} color="#5669ff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile View */}
          {isProfileActive && (
            <View>
              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Thông tin cá nhân</Text>
                <View className="flex-row items-center gap-2  my-1">
                  <AntDesign name="idcard" size={24} color="gray" />
                  <Text className="text-center items-center text-gray-400">
                    Họ và tên: {profile.lastName} {profile.firstName}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 my-1">
                  <AntDesign name="mail" size={24} color="gray" />
                  <Text className="text-center items-center text-gray-400">Email: {profile.email}</Text>
                </View>
                <View className="flex-row items-center gap-2 my-1">
                  <FontAwesome name="transgender" size={24} color="gray" />
                  <Text className="text-center items-center text-gray-400">
                    Giới tính: {profile.gender === 0 ? 'Nam' : 'Nữ'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 my-1">
                  <Fontisto name="date" size={24} color="gray" />
                  <Text className="text-center items-center text-gray-400">
                    Ngày sinh: {formatDate(profile.dateOfBirth)}
                  </Text>
                </View>
              </View>

              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Đóng góp</Text>
                <Text className="text-center text-gray-400">
                  Tổng số bài viết: {profile.totalPosts}. Đã thích: {profile.totalPostLikes}
                </Text>
                <Text className="text-center text-gray-400">Tổng số tài liệu đã chia sẻ: {profile.totalDocuments}</Text>
                <Text className="text-center text-gray-400">
                  Tổng số bình luận: {profile.totalComments}. Đã thích: {profile.totalDocumentLikes}
                </Text>
              </View>

              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Tags đã chia sẻ</Text>
                {posts.length === 0 && <Text className="text-center">Chưa có tag nào được chia sẻ</Text>}
                <View className="flex-wrap flex-row gap-2">
                  {posts.map((post) => (
                    <View key={post.postId} className="flex-row flex-wrap">
                      {post.tags.map((tag) => (
                        <TouchableOpacity
                          key={tag.tagId}
                          className="rounded-xl p-2 m-2 bg-[#5672ff] h-8 justify-center"
                        >
                          <View>
                            <Text className="text-center text-white font-bold items-center">{tag.name}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
