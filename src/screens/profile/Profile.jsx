import { View, Text, Image, ScrollView, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { authSelector } from '../../redux/reducers/userSlice'
import { FontAwesome } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { formatDate } from '../../utils/helpers'
import { Fontisto } from '@expo/vector-icons'
import postServices from '../../apis/postServices'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Entypo } from '@expo/vector-icons'
import AddDocumentModal from '../../components/AddDocumentModal'

const Profile = () => {
  const navigation = useNavigation()
  const user = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const [isProfileActive, setIsProfileActive] = useState(true)
  const [isPhotoActive, setIsPhotoActive] = useState(false)
  const [isLikeddActive, setIsLikeddActive] = useState(false)
  const [likedList, setLikedList] = useState([])
  const [showAddPostModal, setShowAddPostModal] = useState(false)
  const client = useQueryClient()

  useEffect(() => {
    fetchLiked()
  }, [isProfileActive, isLikeddActive, isPhotoActive])

  const fetchLiked = async () => {
    try {
      const resp = await postServices.getLikedPosts(user.accessToken, 0, 10)

      if (resp.status === 200) {
        setLikedList(resp.data.content)
      }
    } catch (error) {}
  }

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['Profile'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/users/profile')
      return resp.data.data
    },
  })

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ['PostList'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/post/mine?page=0&size=10')
      return resp.data.data.content
    },
  })

  const { data: likedPosts, isLoading: likedPostsLoading } = useQuery({
    queryKey: ['LikedPostList'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/post/liked?page=0&size=10')
      return resp.data.data.content
    },
  })

  if (profileLoading || postLoading || likedPostsLoading)
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
        <View className="flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold leading-snug">Trang cá nhân</Text>
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
          <Text className="text-xl font-bold text-center">
            {user.profile.lastName} {user.profile.firstName}
          </Text>

          <View className="w-2/3 m-auto mt-2">
            <TouchableOpacity
              className="border border-[#5669ff] rounded-3xl h-12 justify-center"
              onPress={() => navigation.navigate('UpdateProfileScreen')}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-center text-[#5669ff] font-bold items-center">Chỉnh sửa hồ sơ</Text>
                <AntDesign name="edit" size={24} color="#5669ff" />
              </View>
            </TouchableOpacity>
          </View>
          {/* Tab */}
          <View className="mt-2 flex-row mx-2">
            <View className="w-1/3 m-auto mt-2">
              <TouchableOpacity
                className={`rounded-full bg-${isProfileActive && '[#5669ff]'}  h-12 justify-center`}
                onPress={() => {
                  setIsProfileActive(!isProfileActive)
                  setIsPhotoActive(false)
                  setIsLikeddActive(false)
                }}
              >
                <View className="flex-row  items-center justify-center">
                  <Text className={`text-center text-${isProfileActive && 'white'} font-bold items-center`}>
                    Cá nhân
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="w-1/3 m-auto mt-2">
              <TouchableOpacity
                className={`rounded-full bg-${isPhotoActive && '[#5669ff]'}  h-12 justify-center`}
                onPress={() => {
                  setIsPhotoActive(!isPhotoActive)
                  setIsProfileActive(false)
                  setIsLikeddActive(false)
                }}
              >
                <View className="flex-row  items-center justify-center">
                  <Text className={`text-center text-${isPhotoActive && 'white'} font-bold items-center`}>Ảnh</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="w-1/3 m-auto mt-2">
              <TouchableOpacity
                className={`rounded-full bg-${isLikeddActive && '[#5669ff]'}  h-12 justify-center`}
                onPress={() => {
                  setIsLikeddActive(!isLikeddActive)
                  setIsProfileActive(false)
                  setIsPhotoActive(false)
                }}
              >
                <View className="flex-row  items-center justify-center ">
                  <Text className={`text-center text-${isLikeddActive && 'white'} font-bold items-center`}>
                    Đã thích
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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

              <View className="mx-4 my-2 ">
                <Text className="text-sm font-bold">Bài viết đã chia sẻ</Text>
                {posts.map((item) => {
                  return (
                    <View className="bg-white  rounded-2xl my-2" key={item.postId}>
                      <View className="flex-row justify-between">
                        <TouchableOpacity
                          onPress={() => navigation.navigate('PostDetailScreen', { postId: item.postId })}
                          className=" flex-row items-center"
                        >
                          <Text>Bạn đã chia sẻ </Text>
                          <Text className="text-base font-bold italic">{item.title}</Text>
                          <Text> vào ngày {formatDate(item.createdAt)}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
                {/* <FlatList
                  className="flex-1"
                  data={posts}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <View className="bg-white  rounded-2xl my-2" key={item.postId}>
                        <View className="flex-row justify-between">
                          <TouchableOpacity
                            onPress={() => navigation.navigate('PostDetailScreen', { postId: item.postId })}
                            className=" flex-row items-center"
                          >
                            <Text>Bạn đã chia sẻ </Text>
                            <Text className="text-base font-bold italic">{item.title}</Text>
                            <Text> vào ngày {formatDate(item.createdAt)}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }}
                /> */}
              </View>

              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Tags đã chia sẻ</Text>
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

          {/* Photo view */}
          {isPhotoActive && (
            <View>
              <Text>Photo view</Text>
            </View>
          )}
          {/* Liked view */}
          {isLikeddActive && (
            <View className="mx-4">
              <ScrollView>
                {likedPosts.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PostDetailScreen', { postId: item.postId })}
                      className="flex-row items-center space-x-3"
                      key={item.postId}
                    >
                      <View className="flex-row my-2 items-center justify-center">
                        <Text>Bạn đã thích bài viết của {item.user.firstName} về </Text>
                        <Text className="font-bold">{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
