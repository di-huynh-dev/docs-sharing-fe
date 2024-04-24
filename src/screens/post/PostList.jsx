import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'
import { AntDesign } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const PostList = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { data: posts, isLoading } = useQuery({
    queryKey: ['Posts'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/all?page=0&size=100')
        return resp
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  const onRefresh = () => {
    setRefreshing(true)
    client.invalidateQueries(['Posts'])
    setRefreshing(false)
  }
  const handleLikePost = async (postId) => {
    try {
      const resp = await axiosPrivate.post('/post/' + postId + '/like')

      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        client.invalidateQueries(['Posts'])
      }
    } catch (error) {
      console.log(error)
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
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <View
        style={{
          backgroundColor: appColors.primary,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row justify-between items-center p-4">
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="align-left" size={35} color="white" />
          </TouchableOpacity>
          <Text className="italic text-white text-lg font-medium">Sharing Docs</Text>
          <View className="flex items-center justify-center">
            <TouchableOpacity className="bg-[#F1F4F5] w-[35px] h-[35px] rounded-full flex items-center justify-center">
              <Octicons name="bell-fill" size={18} color="#2D3F7B" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-center text-white">Bạn muốn tìm kiếm tài liệu gì?</Text>
        <View className="flex-row justify-between p-5 items-center">
          <View className="flex-row items-center space-x-2">
            <Feather name="search" size={30} color="white" />
            <TextInput placeholder="| Tìm kiếm.." className="text-lg text-white" />
          </View>

          <View>
            <TouchableOpacity className="flex-row bg-[#5D56F3] rounded-full items-center py-1 px-3 space-x-2">
              <Ionicons name="filter-circle" size={26} color="white" />
              <Text className="text-white">Bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Body */}
      <FlatList
        className="flex-1 mb-5"
        data={posts.data.data.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View className="bg-white mx-5 rounded-2xl p-3 my-2" key={item.postId}>
              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-3">
                  {item.user.image ? (
                    <Image source={{ uri: item.user.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                  ) : (
                    <Image
                      source={require('../../../assets/images/no-avatar.jpg')}
                      className="w-14 h-14 rounded-full"
                    />
                  )}
                  <Text className="text-base font-bold">
                    {item.user.firstName} {item.user.lastName}
                  </Text>
                </View>

                <View className="flex items-center justify-center">
                  <TouchableOpacity className="bg-[#F1F4F5] w-[40px] h-[40px] rounded-full flex items-center justify-center">
                    <Entypo name="dots-three-horizontal" size={24} color="#99A1BE" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="mt-5"
                onPress={() => navigation.navigate('PostDetailScreen', { postId: item.postId })}
              >
                <Text className="text-base font-bold mb-3">{item.title}</Text>

                <Text className="text-sm text-gray-500">{item.content}</Text>
              </TouchableOpacity>

              <View className="flex-row justify-between mt-5 mb-2">
                <View className="flex-row space-x-4">
                  <TouchableOpacity onPress={() => handleLikePost(item.postId)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {item.liked === true ? (
                        <AntDesign name="heart" size={24} color="#f75050" style={{ marginRight: 5 }} />
                      ) : (
                        <AntDesign name="hearto" size={24} color="#f75050" style={{ marginRight: 5 }} />
                      )}
                      <Text>{item.totalLikes}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center space-x-2">
                    <Entypo name="chat" size={24} color="#bbb" />
                    <Text> Bình luận</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className="flex-row items-center space-x-2">
                  <Entypo name="share" size={24} color="#bbb" />
                  <Text>11</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
      <TouchableOpacity style={styles.floatingButton}>
        <Text className="text-[#5D56F3] m-5">
          <AntDesign name="upcircleo" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    padding: 10,
    zIndex: 999,
  },
})

export default PostList
