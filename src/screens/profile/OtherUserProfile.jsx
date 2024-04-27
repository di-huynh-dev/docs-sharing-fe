import { View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, AntDesign, FontAwesome, Fontisto } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'

const OtherUserProfile = ({ route }) => {
  const { user } = route.params
  const [isProfileActive, setIsProfileActive] = useState(true)
  const [isPostActive, setIsPostActive] = useState(false)
  const [isDocumentActive, setIsDocumentActive] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const navigation = useNavigation()

  const { data: postList, isLoading: postListLoading } = useQuery({
    queryKey: ['PostListUser'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/user/' + user.userId + '?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
      }
    },
  })

  const { data: docList, isLoading: docListLoading } = useQuery({
    queryKey: ['DocListUser'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/document/user/' + user.userId + '?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
      }
    },
  })

  if (postListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <SafeAreaView className="py-2">
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => navigation.navigate('PostListScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold leading-snug">
          Trang cá nhân của {user?.firstName} {user?.lastName}
        </Text>
      </View>

      <View className="flex items-center justify-center rounded-full mt-10">
        {user?.image ? (
          <Image source={{ uri: user.image }} className="my-2 w-36 h-36 rounded-full " />
        ) : (
          <Image className="w-36 h-36 rounded-full " source={require('../../../assets/images/no-avatar.jpg')} />
        )}
      </View>

      <Text className="text-xl font-bold text-center">
        {user.lastName} {user.firstName}
      </Text>

      {/* Tab */}
      <View className="mt-2 flex-row mx-2">
        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isProfileActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsProfileActive(!isProfileActive)
              setIsPostActive(false)
              setIsDocumentActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center">
              <Text className={`text-center text-${isProfileActive && 'white'} font-bold items-center`}>Cá nhân</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isPostActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsPostActive(!isPostActive)
              setIsProfileActive(false)
              setIsDocumentActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center">
              <Text className={`text-center text-${isPostActive && 'white'} font-bold items-center`}>Bài viết</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isDocumentActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsDocumentActive(!isDocumentActive)
              setIsProfileActive(false)
              setIsPostActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center ">
              <Text className={`text-center text-${isDocumentActive && 'white'} font-bold items-center`}>Tài liệu</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile View */}

      {isProfileActive && (
        <View className="mx-4 my-2">
          <Text className="text-sm font-bold">Thông tin cá nhân</Text>
          <View className="flex-row items-center gap-2  my-1">
            <AntDesign name="idcard" size={24} color="gray" />
            <Text className="text-center items-center text-gray-400">
              Họ và tên: {user.lastName} {user.firstName}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 my-1">
            <AntDesign name="mail" size={24} color="gray" />
            <Text className="text-center items-center text-gray-400">Email: {user.email}</Text>
          </View>
          <View className="flex-row items-center gap-2 my-1">
            <FontAwesome name="transgender" size={24} color="gray" />
            <Text className="text-center items-center text-gray-400">
              Giới tính: {user.gender === 0 ? 'Nam' : 'Nữ'}
            </Text>
          </View>
        </View>
      )}

      {/* Post View */}
      {isPostActive && (
        <SafeAreaView className="mx-4 my-2">
          <ScrollView className="mx-2">
            {postList.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('PostDetailScreen', { postId: item.postId })}
                  className="flex-row items-center space-x-3"
                  key={item.postId}
                >
                  <View className="flex-row my-2 items-center">
                    <Text>
                      {item.user.lastName} {item.user.firstName} đã chia sẻ
                    </Text>
                    <Text className="text-base font-bold italic"> {item.title}</Text>
                    <Text> vào ngày {formatDate(item.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </SafeAreaView>
      )}

      {/* Document View */}
      {isDocumentActive && (
        <View className="mx-4">
          <ScrollView>
            {docList.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DocumentDetailScreen', { itemData: item })}
                  className="flex-row items-center space-x-3"
                  key={item.docId}
                >
                  <View className="flex-row my-2 ">
                    <Text>{item.user.lastName} đã đăng tài liệu về </Text>
                    <Text className="font-bold">{item.docName}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  )
}

export default OtherUserProfile
