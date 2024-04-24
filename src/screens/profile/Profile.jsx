import { View, Text, Image, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native'
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

  if (profileLoading)
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
            <Image source={{ uri: profile.image }} className="my-10 w-40 h-40 rounded-full " />
          ) : (
            <Image className="w-40 h-40 rounded-full " source={require('../../../assets/images/no-avatar.jpg')} />
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

              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Chủ đề đã chia sẻ</Text>
                <View className="flex-row">
                  <View className="m-auto mt-2">
                    <TouchableOpacity className="rounded-xl p-2 bg-[#5669ff]  h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Lịch sử</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="m-auto mt-2 ">
                    <TouchableOpacity className="rounded-xl p-2 bg-red-500 h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Truyện tranh</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="m-auto mt-2 ">
                    <TouchableOpacity className="rounded-xl p-2 bg-yellow-500 h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Ma mị</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View className="mx-4 my-2">
                <Text className="text-sm font-bold">Chủ đề yêu thích</Text>
                <View className="flex-row">
                  <View className="m-auto mt-2">
                    <TouchableOpacity className="rounded-xl p-2 bg-[#5669ff] h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Lịch sử</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="m-auto mt-2 ">
                    <TouchableOpacity className="rounded-xl p-2 bg-orange-500  h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Truyện tranh</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="m-auto mt-2 ">
                    <TouchableOpacity className="rounded-xl p-2 bg-green-500 h-8 justify-center">
                      <View className="flex-row  items-center justify-center">
                        <Text className="text-center text-white font-bold items-center">Ma mị</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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
              {likedList.map((item) => {
                return (
                  <ScrollView>
                    <View className="flex-row items-center space-x-3" key={item.postId}>
                      <View className="flex-row items-center justify-center my-2">
                        {item.image ? (
                          <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        ) : (
                          <AntDesign name="user" size={24} color="black" />
                        )}
                      </View>
                      <View className="flex-row items-center justify-center">
                        <Text className="text-base font-bold"> </Text>
                        <Text>
                          <Text className="text-base font-bold">{item.user.firstName}</Text> đã đăng{' '}
                          {item.title.substring(0, 25)}
                          {item.title.length > 25 ? '...' : ''}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
