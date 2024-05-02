import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Entypo, AntDesign } from '@expo/vector-icons'
import VerticalItem from '../components/VerticalItem'
import PostVerticalItem from '../components/PostVerticalItem'
export default function ExploreNavigator() {
  const [isDocActive, setIsDocActive] = useState(true)
  const [isPostActive, setIsPostActive] = useState(false)
  const [isLikeddActive, setIsLikeddActive] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { data: docList, isLoading: docListLoading } = useQuery({
    queryKey: ['DocListMine'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/document/user/documents?page=0&size=100')
      return resp.data.data.content
    },
    enabled: !isDocActive,
  })

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
    enabled: !isPostActive,
  })

  const { data: likedPostList, isLoading: likedPostListLoading } = useQuery({
    queryKey: ['LikedPostList'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/post/liked?page=0&size=100')
      return resp.data.data.content
    },
    enabled: !isLikeddActive,
  })

  const { data: likedDocList, isLoading: likedDocListLoading } = useQuery({
    queryKey: ['LikedDocList'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/document/user/likes?page=0&size=100')
      return resp.data.data.content
    },
    enabled: !isLikeddActive,
  })

  const onRefresh = () => {
    setRefreshing(false)
    client.invalidateQueries(['Posts'])
  }
  if (docListLoading || postsLoading || likedPostListLoading || likedDocListLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  return (
    <SafeAreaView className="bg-slate-100">
      <View className=" bg-white py-3">
        <Text className="text-lg font-bold text-center">Kho lưu trữ của tôi</Text>
      </View>

      <View className="mt-2 flex-row p-2 bg-white">
        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isDocActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsDocActive(!isDocActive)
              setIsPostActive(false)
              setIsLikeddActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center">
              <Text className={`text-center text-${isDocActive && 'white'} font-bold items-center`}>Tài liệu</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isPostActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsPostActive(!isPostActive)
              setIsDocActive(false)
              setIsLikeddActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center">
              <Text className={`text-center text-${isPostActive && 'white'} font-bold items-center`}>Bài đăng</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-1/3 m-auto mt-2">
          <TouchableOpacity
            className={`rounded-full bg-${isLikeddActive && '[#5669ff]'}  h-12 justify-center`}
            onPress={() => {
              setIsLikeddActive(!isLikeddActive)
              setIsDocActive(false)
              setIsPostActive(false)
            }}
          >
            <View className="flex-row  items-center justify-center ">
              <Text className={`text-center text-${isLikeddActive && 'white'} font-bold items-center`}>Yêu thích</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {isDocActive && (
        <View>
          <View className="flex-row gap-2 my-2 items-center">
            <Entypo name="text-document" size={24} color="blue" />
            <Text className="text-sm font-bold text-blue-700">Tài liệu của tôi</Text>
          </View>
          {!docList && <Text className="text-center bg-white">Chưa có tài liệu nào được chia sẻ</Text>}
          <FlatList
            className="mx-2 bg-white"
            showsHorizontalScrollIndicator={false}
            data={docList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => <VerticalItem {...item} key={item.docId} />}
            keyExtractor={(item) => item.docId}
          />
        </View>
      )}

      {isPostActive && (
        <View>
          <View className="flex-row  gap-2  my-2 items-center">
            <AntDesign name="book" size={24} color="blue" />
            <Text className="text-sm font-bold text-blue-700">Bài viết của tôi</Text>
          </View>
          {!posts.length > 0 && <Text className="text-center bg-white">Bạn chưa chia sẻ bài đăng nào</Text>}
          <FlatList
            className="mx-2 bg-white"
            showsHorizontalScrollIndicator={false}
            data={posts}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => <PostVerticalItem {...item} key={item.postId} />}
            keyExtractor={(item) => item.docId}
          />
        </View>
      )}

      {isLikeddActive && (
        <View>
          <View className="flex-row  gap-2  my-2 items-center">
            <AntDesign name="hearto" size={24} color="blue" />
            <Text className="text-sm font-bold text-blue-700">Bài viết yêu thích của tôi</Text>
          </View>
          {!likedPostList.length > 0 && <Text className="text-center bg-white">Bạn chưa yêu thích bài đăng nào</Text>}
          <FlatList
            className="mx-2 bg-white"
            showsHorizontalScrollIndicator={false}
            data={likedPostList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => <PostVerticalItem {...item} key={item.postId} />}
            keyExtractor={(item) => item.docId}
          />

          <View className="flex-row  gap-2  my-2 items-center">
            <AntDesign name="hearto" size={24} color="blue" />
            <Text className="text-sm font-bold text-blue-700">Tài liệu yêu thích của tôi</Text>
          </View>
          {!likedDocList.length > 0 && <Text className="text-center bg-white">Bạn chưa yêu thích tài liệu nào</Text>}
          <FlatList
            className="mx-2 bg-white"
            showsHorizontalScrollIndicator={false}
            data={likedDocList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => <VerticalItem {...item} key={item.docId} />}
            keyExtractor={(item) => item.docId}
          />
        </View>
      )}
    </SafeAreaView>
  )
}
